"""Tests for the HTTPS front proxy: probing, Caddyfile rendering, lifecycle."""

import email.message
import os
import shutil
import socket
import threading
import time
import urllib.error
import urllib.request
from collections.abc import Iterator
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from free_claude_code.cli import tls_proxy
from free_claude_code.cli.tls_proxy import CaddyTlsProxy, resolve_gateway_base_url
from free_claude_code.config.settings import Settings

TEST_IDENTITY_SECRET = "fcc-test-identity-secret"


@pytest.fixture
def settings() -> Settings:
    return Settings(host="127.0.0.1", port=8082, tls_proxy_port=18443)


@pytest.fixture
def http_server() -> Iterator[HTTPServer]:
    """Local plain-HTTP server used to exercise the HTTPS probe negatively."""

    server = HTTPServer(("127.0.0.1", 0), BaseHTTPRequestHandler)
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    yield server
    server.shutdown()
    server.server_close()


def test_probe_https_false_against_plain_http_listener(
    http_server: HTTPServer,
) -> None:
    # An HTTPS handshake against a plain-HTTP listener must fail the probe.
    assert (
        tls_proxy.probe_https(f"https://127.0.0.1:{http_server.server_port}") is False
    )


def test_probe_https_false_when_nothing_listens(settings: Settings) -> None:
    assert tls_proxy.probe_https(tls_proxy.tls_root_url(settings)) is False


def test_render_caddyfile_fronts_local_server(settings: Settings) -> None:
    proxy = CaddyTlsProxy(settings, home_dir=Path("/tmp/fcc-test-caddy"))

    text = proxy.render_caddyfile(TEST_IDENTITY_SECRET)

    assert "localhost:18443 {" in text
    assert "tls internal" in text
    assert "reverse_proxy 127.0.0.1:8082 {" in text
    assert "flush_interval -1" in text


def test_render_caddyfile_serves_identity_secret_at_private_path(
    settings: Settings,
) -> None:
    # The managed front must answer the identity probe itself so later
    # launches can prove ownership before adopting it.
    proxy = CaddyTlsProxy(settings, home_dir=Path("/tmp/fcc-test-caddy"))

    text = proxy.render_caddyfile(TEST_IDENTITY_SECRET)

    assert f'respond /.fcc-front-identity "{TEST_IDENTITY_SECRET}" 200' in text


def _health_response(payload: bytes | str) -> MagicMock:
    response = MagicMock()
    response.__enter__.return_value = response
    response.read.return_value = (
        payload.encode() if isinstance(payload, str) else payload
    )
    return response


def test_probe_fcc_front_true_when_listener_serves_identity_secret() -> None:
    with patch.object(
        tls_proxy.urllib.request,
        "urlopen",
        MagicMock(return_value=_health_response(TEST_IDENTITY_SECRET)),
    ) as urlopen:
        assert (
            tls_proxy.probe_fcc_front("https://localhost:18443", TEST_IDENTITY_SECRET)
            is True
        )

    request = urlopen.call_args.args[0]
    assert isinstance(request, urllib.request.Request)
    assert request.full_url == "https://localhost:18443/.fcc-front-identity"


def test_probe_fcc_front_rejects_forged_health_marker() -> None:
    # Regression guard for the Greptile "unauthenticated health marker
    # permits local TLS-front impersonation" finding: the publicly forgeable
    # /health payload must never count as front identity, even though it is
    # exactly what FCC's own /health endpoint serves.
    with patch.object(
        tls_proxy.urllib.request,
        "urlopen",
        MagicMock(return_value=_health_response('{"status": "healthy"}')),
    ):
        assert (
            tls_proxy.probe_fcc_front("https://localhost:18443", TEST_IDENTITY_SECRET)
            is False
        )


def test_probe_fcc_front_false_for_foreign_or_broken_listener() -> None:
    # An unrelated local listener that answers anything other than this
    # install's identity secret must never be adopted as the gateway.
    error = urllib.error.HTTPError(
        "https://localhost:18443/.fcc-front-identity",
        404,
        "Not Found",
        email.message.Message(),
        None,
    )
    responses = [
        _health_response(b"a-different-secret"),  # wrong secret
        _health_response(b'{"status": "healthy"}'),  # forged health marker
        _health_response(b""),  # empty body
        _health_response(b"\xff\xfe"),  # non-UTF-8 body
    ]
    errors = [
        error,  # non-200 status through the TLS layer
        urllib.error.URLError("connection refused"),  # nothing listening
    ]
    for response in responses:
        with patch.object(
            tls_proxy.urllib.request,
            "urlopen",
            MagicMock(return_value=response),
        ):
            assert (
                tls_proxy.probe_fcc_front(
                    "https://localhost:18443/", TEST_IDENTITY_SECRET
                )
                is False
            )
    for error_side_effect in errors:
        with patch.object(
            tls_proxy.urllib.request,
            "urlopen",
            MagicMock(side_effect=error_side_effect),
        ):
            assert (
                tls_proxy.probe_fcc_front(
                    "https://localhost:18443/", TEST_IDENTITY_SECRET
                )
                is False
            )


def test_probe_fcc_front_false_without_identity_secret() -> None:
    # No secret means nothing to compare against; never adopt.
    assert tls_proxy.probe_fcc_front("https://localhost:18443", "") is False


def test_load_or_create_front_identity_is_owner_only_and_stable(
    tmp_path: Path,
) -> None:
    home = tmp_path / "caddy"

    first = tls_proxy.load_or_create_front_identity(home)
    second = tls_proxy.load_or_create_front_identity(home)

    assert first == second
    assert len(first) == tls_proxy.FRONT_IDENTITY_BYTES * 2  # hex-encoded
    secret_file = tls_proxy.front_identity_path(home)
    assert secret_file.stat().st_mode & 0o777 == 0o600
    assert secret_file.parent.stat().st_mode & 0o777 == 0o700


def test_load_or_create_front_identity_survives_permissive_umask(
    tmp_path: Path,
) -> None:
    # Under umask 000 the secret must still end up owner-only.
    previous = os.umask(0)
    try:
        tls_proxy.load_or_create_front_identity(tmp_path / "caddy")
    finally:
        os.umask(previous)

    secret_file = tls_proxy.front_identity_path(tmp_path / "caddy")
    assert secret_file.stat().st_mode & 0o777 == 0o600


def test_resolve_gateway_base_url_https_when_probe_succeeds(
    settings: Settings,
) -> None:
    with (
        patch.object(tls_proxy, "load_or_create_front_identity", return_value="secret"),
        patch.object(tls_proxy, "probe_fcc_front", return_value=True) as probe,
    ):
        url = resolve_gateway_base_url(settings)

    assert url == "https://localhost:18443"
    probe.assert_called_once_with("https://localhost:18443", "secret")


def test_resolve_gateway_base_url_https_requires_fcc_identity(
    settings: Settings,
) -> None:
    # A TLS listener that is alive but cannot prove it belongs to this FCC
    # install must not be adopted; routing falls back to plain HTTP.
    with (
        patch.object(tls_proxy, "probe_https", return_value=True),
        patch.object(tls_proxy, "load_or_create_front_identity", return_value="s"),
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
    ):
        url = resolve_gateway_base_url(settings)

    assert url == "http://127.0.0.1:8082"


def test_resolve_gateway_base_url_http_when_disabled_or_unreachable(
    settings: Settings,
) -> None:
    disabled = Settings(host="127.0.0.1", port=8082, tls_proxy_enabled=False)

    assert resolve_gateway_base_url(disabled) == "http://127.0.0.1:8082"
    # The enabled-but-unverified case must not touch the real home dir or
    # network: pin identity and force the probe to fail.
    with (
        patch.object(tls_proxy, "load_or_create_front_identity", return_value="s"),
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
    ):
        assert resolve_gateway_base_url(settings) == "http://127.0.0.1:8082"


def test_start_reuses_external_front_without_spawning(
    settings: Settings,
    tmp_path: Path,
) -> None:
    proxy = CaddyTlsProxy(settings, home_dir=tmp_path / "caddy")

    with (
        patch.object(tls_proxy, "probe_fcc_front", side_effect=[True]),
        patch.object(tls_proxy.shutil, "which") as which,
        patch.object(tls_proxy.subprocess, "Popen") as popen,
    ):
        started = proxy.start()

    assert started is True
    which.assert_not_called()
    popen.assert_not_called()


def test_start_does_not_adopt_foreign_tls_listener(
    settings: Settings,
    tmp_path: Path,
) -> None:
    # A TLS endpoint that is alive on the port but does not front this FCC
    # server must not be adopted; the managed Caddy path runs instead.

    class FakeProcess:
        def __init__(self, *_args: object, **_kwargs: object) -> None:
            self.returncode = 0

        def poll(self) -> int | None:
            return None

        def terminate(self) -> None: ...

        def wait(self, timeout: float | None = None) -> int:
            return 0

    probe_calls = 0

    def counting_probe(url: str, timeout_seconds: float = 1.0) -> bool:
        nonlocal probe_calls
        probe_calls += 1
        return False  # identity fails; readiness probes also fail

    with (
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
        patch.object(tls_proxy, "probe_https", counting_probe),
        patch.object(tls_proxy.shutil, "which", return_value="/usr/bin/caddy"),
        patch.object(tls_proxy.subprocess, "Popen", FakeProcess),
    ):
        proxy = CaddyTlsProxy(settings, home_dir=tmp_path / "caddy")
        started = proxy.start()

    assert started is False
    assert probe_calls > 0  # readiness probes ran against our own child


def test_start_spawns_managed_caddy_and_waits_for_readiness(
    settings: Settings,
    tmp_path: Path,
) -> None:
    caddyfile_dir = tmp_path / "caddy"

    class FakeProcess:
        def __init__(self, cmd: list[str], **_kwargs: object) -> None:
            self.cmd = cmd
            self.returncode = 0

        def poll(self) -> int | None:
            return None  # stays alive while readiness probes run

        def terminate(self) -> None: ...

        def wait(self, timeout: float | None = None) -> int:
            return 0

    probe_calls = 0

    def counting_probe(url: str, timeout_seconds: float = 1.0) -> bool:
        nonlocal probe_calls
        probe_calls += 1
        # First call (external-front check) fails; readiness checks succeed.
        return probe_calls > 1

    with (
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
        patch.object(tls_proxy, "probe_https", counting_probe),
        patch.object(tls_proxy.shutil, "which", return_value="/usr/bin/caddy"),
        patch.object(tls_proxy.subprocess, "Popen", FakeProcess),
    ):
        proxy = CaddyTlsProxy(settings, home_dir=caddyfile_dir)
        started = proxy.start()

    assert started is True
    caddyfile = (caddyfile_dir / "Caddyfile").read_text(encoding="utf-8")
    assert "tls internal" in caddyfile


def test_start_falls_back_to_http_without_caddy_binary(
    settings: Settings,
    tmp_path: Path,
) -> None:
    proxy = CaddyTlsProxy(settings, home_dir=tmp_path / "caddy")

    with (
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
        patch.object(tls_proxy.shutil, "which", return_value=None),
        patch.object(tls_proxy.subprocess, "Popen") as popen,
    ):
        started = proxy.start()

    assert started is False
    popen.assert_not_called()


def test_start_reports_child_that_exits_immediately(
    settings: Settings,
    tmp_path: Path,
) -> None:
    class DyingProcess:
        def __init__(self, *_args: object, **_kwargs: object) -> None:
            self.returncode = 1

        def poll(self) -> int:
            return self.returncode

    with (
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
        patch.object(tls_proxy.shutil, "which", return_value="/usr/bin/caddy"),
        patch.object(tls_proxy.subprocess, "Popen", DyingProcess),
    ):
        proxy = CaddyTlsProxy(settings, home_dir=tmp_path / "caddy")
        started = proxy.start()

    assert started is False


def test_stop_terminates_owned_running_process(settings: Settings) -> None:
    proxy = CaddyTlsProxy(settings, home_dir=Path("/tmp/fcc-unused"))

    process = MagicMock()
    process.poll.return_value = None
    proxy._process = process

    proxy.stop()

    process.terminate.assert_called_once()
    process.wait.assert_called_once()


def test_stop_is_noop_after_child_already_exited(settings: Settings) -> None:
    proxy = CaddyTlsProxy(settings, home_dir=Path("/tmp/fcc-unused"))

    process = MagicMock()
    process.poll.return_value = 0
    proxy._process = process

    proxy.stop()

    process.terminate.assert_not_called()


def test_managed_caddyfile_disables_admin_api(settings: Settings) -> None:
    proxy = CaddyTlsProxy(settings, home_dir=Path("/tmp/fcc-test-caddy"))

    # A system caddy may already own the default admin endpoint (port 2019);
    # the managed instance must never claim it.
    assert "admin off" in proxy.render_caddyfile(TEST_IDENTITY_SECRET)


def test_start_writes_caddyfile_owner_only(
    settings: Settings,
    tmp_path: Path,
) -> None:
    # The Caddyfile embeds the identity secret; it must not be world-readable.
    class FakeProcess:
        def __init__(self, *_args: object, **_kwargs: object) -> None:
            self.returncode = 0

        def poll(self) -> int | None:
            return None

        def terminate(self) -> None: ...

        def wait(self, timeout: float | None = None) -> int:
            return 0

    home = tmp_path / "caddy"
    with (
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
        patch.object(tls_proxy, "probe_https", return_value=True),
        patch.object(tls_proxy.shutil, "which", return_value="/usr/bin/caddy"),
        patch.object(tls_proxy.subprocess, "Popen", FakeProcess),
    ):
        proxy = CaddyTlsProxy(settings, home_dir=home)
        assert proxy.start() is True

    assert proxy.caddyfile_path.stat().st_mode & 0o777 == 0o600


def _free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def test_managed_front_serves_identity_and_rejects_impersonation(
    tmp_path: Path,
) -> None:
    """End-to-end: the managed front proves ownership; impostors cannot.

    Spawns the real managed caddy (skipped when absent) and verifies the
    adoption probe accepts the front only with this install's secret —
    the exact path Greptile's T-Rex exploited with a forged health marker.
    """

    if shutil.which(tls_proxy.CADDY_BINARY) is None:
        pytest.skip("caddy binary not installed")

    port = _free_port()
    front_settings = Settings(host="127.0.0.1", port=1, tls_proxy_port=port)
    home = tmp_path / "caddy"
    proxy = CaddyTlsProxy(front_settings, home_dir=home)
    base_url = f"https://localhost:{port}"
    try:
        assert proxy.start() is True
        secret = tls_proxy.load_or_create_front_identity(home)

        assert tls_proxy.probe_fcc_front(base_url, secret) is True
        # A process that merely occupies the port cannot guess the secret.
        assert tls_proxy.probe_fcc_front(base_url, "attacker-guess") is False
    finally:
        proxy.stop()
        deadline = time.monotonic() + 5
        while time.monotonic() < deadline:
            with socket.socket() as probe_sock:
                try:
                    probe_sock.connect(("127.0.0.1", port))
                except OSError:
                    break
            time.sleep(0.1)


@pytest.mark.parametrize("flag", ["--config", "--adapter"])
def test_spawn_command_includes_config_adapter(flag: str, settings: Settings) -> None:
    captured: dict[str, object] = {}

    class FakeProcess:
        def __init__(self, cmd: list[str], **kwargs: object) -> None:
            captured["cmd"] = cmd
            captured["kwargs"] = kwargs
            self.returncode = 0

        def poll(self) -> int | None:
            return None

        def wait(self, timeout: float | None = None) -> int:
            return 0

    with (
        patch.object(tls_proxy, "probe_fcc_front", return_value=False),
        # First readiness probe fails; the next one succeeds.
        patch.object(tls_proxy, "probe_https", side_effect=[False, True]),
        patch.object(tls_proxy.shutil, "which", return_value="/usr/bin/caddy"),
        patch.object(tls_proxy.subprocess, "Popen", FakeProcess),
    ):
        proxy = CaddyTlsProxy(settings, home_dir=Path("/tmp/fcc-cmd-check"))
        proxy.start()

    cmd = captured["cmd"]
    assert isinstance(cmd, list)
    assert "/usr/bin/caddy" in cmd
    assert flag in cmd


def test_probe_https_true_when_endpoint_returns_error_status() -> None:
    # Any HTTP status (404 root path, 401 auth gate, 502 dead upstream)
    # proves the TLS front is alive and answering.
    error = urllib.error.HTTPError(
        "https://localhost:18443/",
        404,
        "Not Found",
        email.message.Message(),
        None,
    )

    with patch.object(
        tls_proxy.urllib.request, "urlopen", MagicMock(side_effect=error)
    ):
        assert tls_proxy.probe_https("https://localhost:18443/") is True
