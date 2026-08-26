"""Tests for the ``fcc-claude-desktop`` console-script shim.

The shim delegates to :mod:`free_claude_code.cli.claude_desktop`; these
tests pin its CLI surface and verify it forwards to the shared routing
implementation (patched there for determinism).
"""

import json
import os
import stat
from pathlib import Path

import pytest

from free_claude_code.cli import claude_desktop as routing
from free_claude_code.cli.launchers import claude_desktop
from free_claude_code.config.settings import Settings

_DETERMINISTIC_URL = "https://localhost:8443/claude-desktop"


@pytest.fixture(autouse=True)
def deterministic_gateway_url(monkeypatch: pytest.MonkeyPatch):
    """Keep gateway URL resolution off the network in every test."""

    monkeypatch.setattr(
        routing,
        "desktop_gateway_base_url",
        lambda settings: _DETERMINISTIC_URL,
    )


class FakeFront:
    """Stand-in for the managed TLS proxy the launcher brings up."""

    def __init__(self) -> None:
        self.stop_count = 0

    def stop(self) -> None:
        self.stop_count += 1


@pytest.fixture
def verified_front(monkeypatch: pytest.MonkeyPatch) -> FakeFront:
    """Default-branch tests run against an already-verified HTTPS front."""

    front = FakeFront()
    monkeypatch.setattr(claude_desktop, "ensure_https_front", lambda settings: front)
    monkeypatch.setattr(
        claude_desktop,
        "verified_https_gateway_url",
        lambda settings: _DETERMINISTIC_URL,
    )
    return front


@pytest.fixture
def fake_config(tmp_path: Path) -> Path:
    return tmp_path / "claude_desktop_config.json"


def _managed_block() -> dict[str, object]:
    return routing.fcc_managed_block(
        Settings(host="127.0.0.1", port=8082),
        gateway_base_url=_DETERMINISTIC_URL,
    )


def test_configure_applies_block_when_file_is_missing(fake_config: Path) -> None:
    assert not fake_config.exists()

    changed = claude_desktop.configure_claude_desktop_config(fake_config)

    assert changed is True
    data = json.loads(fake_config.read_text(encoding="utf-8"))
    assert data["modelDiscoveryEnabled"] is True
    assert data["inference"]["provider"] == "gateway"
    assert data["inference"]["inferenceGatewayBaseUrl"] == _DETERMINISTIC_URL


def test_configure_is_idempotent(fake_config: Path) -> None:
    assert claude_desktop.configure_claude_desktop_config(fake_config) is True

    # second call observes no diff.
    second = claude_desktop.configure_claude_desktop_config(fake_config)
    assert second is False


def test_configure_preserves_unrelated_keys(fake_config: Path) -> None:
    fake_config.parent.mkdir(parents=True, exist_ok=True)
    fake_config.write_text(
        json.dumps(
            {
                "preferences": {"theme": "dark"},
                "mcpServers": {"fs": {"command": "node"}},
                "coworkUserFilesPath": "/home/user/cowork",
                "env": {"ANTHROPIC_BASE_URL": "https://localhost:8443"},
            }
        ),
        encoding="utf-8",
    )

    claude_desktop.configure_claude_desktop_config(fake_config)

    data = json.loads(fake_config.read_text(encoding="utf-8"))
    assert data["preferences"] == {"theme": "dark"}
    assert data["mcpServers"] == {"fs": {"command": "node"}}
    assert data["coworkUserFilesPath"] == "/home/user/cowork"
    assert data["env"] == {"ANTHROPIC_BASE_URL": "https://localhost:8443"}
    assert data["modelDiscoveryEnabled"] is True


def test_configure_overwrites_partial_inference_block(fake_config: Path) -> None:
    fake_config.write_text(
        json.dumps(
            {"inference": {"provider": "anthropic", "credentialKind": "static"}}
        ),
        encoding="utf-8",
    )

    claude_desktop.configure_claude_desktop_config(fake_config)

    data = json.loads(fake_config.read_text(encoding="utf-8"))
    assert data["inference"]["provider"] == "gateway"
    assert data["inference"]["credentialKind"] == "static"
    assert data["inference"]["inferenceGatewayBaseUrl"] == _DETERMINISTIC_URL


def test_unconfigure_drops_only_fcc_keys(fake_config: Path) -> None:
    fake_config.write_text(
        json.dumps(
            {
                "preferences": {"theme": "dark"},
                "modelDiscoveryEnabled": True,
                "inference": _managed_block() | {"extra_user_key": "stay"},
            }
        ),
        encoding="utf-8",
    )

    changed = claude_desktop.unconfigure_claude_desktop_config(fake_config)

    assert changed is True
    data = json.loads(fake_config.read_text(encoding="utf-8"))
    assert "modelDiscoveryEnabled" not in data
    assert data["inference"] == {"extra_user_key": "stay"}
    assert data["preferences"] == {"theme": "dark"}


def test_unconfigure_removes_entire_inference_block_when_only_fcc_keys(
    fake_config,
) -> None:
    claude_desktop.configure_claude_desktop_config(fake_config)
    assert claude_desktop.unconfigure_claude_desktop_config(fake_config) is True

    # Second pass is a no-op.
    assert claude_desktop.unconfigure_claude_desktop_config(fake_config) is False


def test_unconfigure_silent_on_missing_file(tmp_path: Path) -> None:
    assert (
        claude_desktop.unconfigure_claude_desktop_config(tmp_path / "absent.json")
        is False
    )


def test_config_path_resolver_returns_default_paths(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("APPDATA", raising=False)
    for plat, expected_substring in (
        ("linux", "claude_desktop_config.json"),
        ("darwin", "claude_desktop_config.json"),
        ("win32", "claude_desktop_config.json"),
    ):
        monkeypatch.setattr(routing.sys, "platform", plat, raising=False)
        path = claude_desktop._config_path()
        assert path.name == expected_substring
        assert path.is_absolute()


def test_launch_spawns_binary_without_certificate_bypass(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    verified_front: FakeFront,
    capsys: pytest.CaptureFixture[str],
) -> None:
    calls: list[list[str]] = []

    class FakeProcess:
        def __init__(self, cmd):
            calls.append(cmd)

        def wait(self) -> int:
            return 0

        def terminate(self) -> None:  # pragma: no cover - unused in suite
            return None

    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", FakeProcess)
    fake_config = tmp_path / "claude_desktop_config.json"

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(
            ["--config-path", str(fake_config), "/tmp/some extra path/"]
        )
    assert exc.value.code == 0
    assert calls == [["/usr/bin/claude-desktop", "/tmp/some extra path/"]]
    data = json.loads(fake_config.read_text(encoding="utf-8"))
    assert data["modelDiscoveryEnabled"] is True
    # The routing block must point at the verified HTTPS front, and the
    # front the launcher brought up is stopped on the way out.
    assert data["inference"]["inferenceGatewayBaseUrl"] == _DETERMINISTIC_URL
    assert verified_front.stop_count == 1


def test_launch_merges_config_before_spawning_binary(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    verified_front: FakeFront,
) -> None:
    events: list[str] = []

    class FakeProcess:
        def __init__(self, _cmd):
            events.append("spawn")

        def wait(self) -> int:
            return 0

    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", FakeProcess)
    fake_config = tmp_path / "claude_desktop_config.json"
    real_save = routing._save_config

    def tracking_save(path: Path, data: dict[str, object]) -> None:
        events.append("merge")
        real_save(path, data)

    monkeypatch.setattr(routing, "_save_config", tracking_save)

    with pytest.raises(SystemExit):
        claude_desktop.launch(["--config-path", str(fake_config)])

    assert events == ["merge", "spawn"]


def test_launch_aborts_when_merge_fails(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    verified_front: FakeFront,
    capsys: pytest.CaptureFixture[str],
) -> None:
    spawned: list[list[str]] = []

    class FakeProcess:
        def __init__(self, cmd):
            spawned.append(cmd)

        def wait(self) -> int:
            return 0

    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", FakeProcess)

    def failing_configure(_path: Path, gateway_base_url: str | None = None) -> bool:
        raise OSError("disk full")

    monkeypatch.setattr(
        claude_desktop, "configure_claude_desktop_config", failing_configure
    )

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(["--config-path", str(tmp_path / "absent.json")])

    # Launching without routing leaves Claude Desktop pointing at Anthropic's
    # own gateway, so a failed merge must abort instead of degrading silently.
    assert exc.value.code == 1
    assert spawned == []
    assert verified_front.stop_count == 1  # front cleaned up on the abort path
    captured = capsys.readouterr()
    assert "could not merge the FCC routing block" in captured.err


def test_launch_exits_127_when_binary_missing(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    verified_front: FakeFront,
    capsys: pytest.CaptureFixture[str],
) -> None:
    monkeypatch.setattr(routing.shutil, "which", lambda _: None)

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(["--config-path", str(tmp_path / "absent.json")])
    assert exc.value.code == 127
    assert verified_front.stop_count == 1
    captured = capsys.readouterr()
    assert "claude-desktop" in captured.err


def test_launch_configure_does_not_invoke_subprocess(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    capsys: pytest.CaptureFixture[str],
) -> None:
    fake = tmp_path / "claude_desktop_config.json"
    invoked: list[bool] = []

    def fail_call(cmd):
        invoked.append(True)
        return 0

    monkeypatch.setattr(routing.subprocess, "Popen", fail_call)

    claude_desktop.launch(["--configure", "--config-path", str(fake)])

    assert invoked == []
    captured = capsys.readouterr()
    assert "Updated" in captured.out

    data = json.loads(fake.read_text(encoding="utf-8"))
    assert data["modelDiscoveryEnabled"] is True


def test_launch_refuses_malformed_config(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    verified_front: FakeFront,
    capsys: pytest.CaptureFixture[str],
) -> None:
    fake = tmp_path / "claude_desktop_config.json"
    fake.write_text("{not json", encoding="utf-8")

    def fail_popen(*_args: object, **_kwargs: object) -> None:
        raise AssertionError("malformed config must not reach the binary")

    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", fail_popen)

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(["--config-path", str(fake)])

    assert exc.value.code == 1
    captured = capsys.readouterr()
    assert "Refusing to launch Claude Desktop" in captured.err


def test_launch_refuses_without_https_front(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    capsys: pytest.CaptureFixture[str],
) -> None:
    # Regression guard for the Greptile "standalone launch lacks HTTPS"
    # finding: without a verified front the gateway URL would fall back to
    # plain HTTP, which Claude Desktop cannot use — so the launcher must
    # refuse instead of writing an unusable routing block and spawning.
    fake = tmp_path / "claude_desktop_config.json"

    def fail_popen(*_args: object, **_kwargs: object) -> None:
        raise AssertionError("no HTTPS front must never reach the binary")

    monkeypatch.setattr(claude_desktop, "ensure_https_front", lambda settings: None)
    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", fail_popen)

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(["--config-path", str(fake)])

    assert exc.value.code == 1
    assert not fake.exists()  # no routing block written without HTTPS
    captured = capsys.readouterr()
    assert "no verified FCC HTTPS front" in captured.err


def test_launch_refuses_when_front_stops_verifying(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    capsys: pytest.CaptureFixture[str],
) -> None:
    # The front can stop verifying between bring-up and the config write;
    # the launcher must re-check and refuse rather than fall back to HTTP.
    fake = tmp_path / "claude_desktop_config.json"
    front = FakeFront()

    def fail_popen(*_args: object, **_kwargs: object) -> None:
        raise AssertionError("an unverified front must never reach the binary")

    monkeypatch.setattr(claude_desktop, "ensure_https_front", lambda settings: front)
    monkeypatch.setattr(
        claude_desktop, "verified_https_gateway_url", lambda settings: None
    )
    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", fail_popen)

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(["--config-path", str(fake)])

    assert exc.value.code == 1
    assert not fake.exists()
    assert front.stop_count == 1
    captured = capsys.readouterr()
    assert "stopped verifying" in captured.err


def test_launch_stops_front_after_binary_exits(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
    verified_front: FakeFront,
) -> None:
    # The launcher owns the front it brought up for the whole Desktop
    # session and must stop it when the binary exits.
    class FakeProcess:
        def __init__(self, _cmd: list[str]) -> None: ...

        def wait(self) -> int:
            return 0

    monkeypatch.setattr(routing.shutil, "which", lambda _: "/usr/bin/claude-desktop")
    monkeypatch.setattr(routing.subprocess, "Popen", FakeProcess)

    with pytest.raises(SystemExit) as exc:
        claude_desktop.launch(["--config-path", str(tmp_path / "cfg.json")])

    assert exc.value.code == 0
    assert verified_front.stop_count == 1


def test_save_config_permissions_survive_permissive_umask(
    tmp_path: Path,
) -> None:
    target = tmp_path / "Claude" / "claude_desktop_config.json"
    previous_umask = os.umask(0o000)
    try:
        routing._save_config(target, {"modelDiscoveryEnabled": True})
    finally:
        os.umask(previous_umask)

    # The merged block embeds the gateway auth token, so neither the config
    # nor the directory holding it may be group/world readable.
    assert stat.S_IMODE(target.stat().st_mode) == 0o600
    assert stat.S_IMODE(target.parent.stat().st_mode) == 0o700
