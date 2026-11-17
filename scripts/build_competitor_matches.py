import csv,re,sys,collections
sys.path.insert(0,'.cache/report-libs')
from openpyxl import load_workbook,Workbook
from openpyxl.styles import Font,PatternFill,Alignment
from unidecode import unidecode
src=list(csv.DictReader(open(sys.argv[1] if len(sys.argv)>1 else '/tmp/arena-coding-uploads/data (1).csv',encoding='utf-8-sig'),delimiter=';')); by={r['Артикул']:r for r in src}
old=load_workbook('competitors.xlsx',data_only=True); cat=[list(r) for r in list(old['Все ссылки'].values)[1:]]
M={}
def match(art,c,kind,why):
 M[(art,c[2])]=[art,by[art]['Наименование'],by[art]['Бренд'],c[0],c[1],c[2],kind,why,c[5],c[6],c[7],'Не выполнена','Наличие и цена требуют повторной проверки перед заказом']
def new(art,shop,n,url,p,u,kind,why,source):
 c=[shop,n,url,source,'Каталог прочитан в текущем поиске',p,u,'2026-11-10'];cat.append(c);match(art,c,kind,why)
# Curated matches in existing catalog.
for c in cat:
 u=c[2]; a=None
 for fragment,art in [('litoflex-k-80-25kg','10274435'),('sm-14-25kg','82040394'),('sm-16-25kg','82040396'),('sm-17-25kg','82040398'),('sm-11-pro-25kg','89340445'),('st-17-1l','18856958'),('cl-51-5kg','17358447')]:
  if fragment in u:a=art
 if 'ELEMENT_ID=18902' in u:a='10274435'
 if 'ELEMENT_ID=18684' in u:a='11169661'
 if a:match(a,c,'Совпадение модели и фасовки, EAN не сверён','Сверены обозначение модели и фасовка. Для K80 проверить версию EVO/старую рецептуру; EAN конкурента не получен.')
 if 'apexdv.ru/product/' in u:
  codes={'482837-':'86360037','426422-':'86360038','490893-':'86360069','492269-':'86360072','491109-':'83024208','482847-':'86360067','482853-':'83024081'}
  for code,art in codes.items():
   if code in u:match(art,c,'Совпадение коллекции, цвета и размера; EAN не сверён','Kerama Marazzi, коллекция и цвет по названию, 8,5×28,5 см. Толщина и артикул производителя исходной позиции не указаны; для дымчатого тёмного проверить соответствие серому тёмному.')
b='https://999111.ru/product/'
for art,n,slug,p in [
 ('12778303','Церезит CE40 багама 2 кг','zatirka-vodoottalkivaiushchaia-tserezit-se40-bagama-2-kg-00-00012499',715),
 ('12778258','Церезит CE40 белая 2 кг','zatirka-vodoottalkivaiushchaia-tserezit-se40-belaia-2-kg-00-00012500',662),
 ('12778266','Церезит CE40 серая 2 кг','zatirka-vodoottalkivaiushchaia-tserezit-se40-seraia-2-kg-00-00012514',662),
 ('18503351','Церезит CE40 серебристо-серая 2 кг','zatirka-vodoottalkivaiushchaia-tserezit-se40-serebristo-seraia-2-kg-00-00012515',715),
 ('12778311','Церезит CE40 антрацит 2 кг','zatirka-vodoottalkivaiushchaia-tserezit-se40-antratsit-2-kg-00-00012498',715),
 ('82040445','Церезит CE40 латте 2 кг','zatirka-vodoottalk-tserezit-se40-latte-2-kg-00-00009163',715),
 ('82040425','Церезит CE33 антрацит 2 кг','zatirka-tserezit-se33-antratsit-2-kg-00-00012477',410)]:
 new(art,'Помощник',n,b+slug,p,'руб/2 кг','Совпадение модели, цвета и фасовки; EAN не сверён','Одна линейка, название цвета и фасовка 2 кг; номер цвета и EAN проверить.','https://999111.ru/catalog/zatirka — фрагмент 1')
a='https://apexdv.ru/product/'
for art,n,slug,p,why in [
 ('86360068','9014 Аккорд серый грань глянцевый 8,5×28,5','482851-9014-akkord-seryj-gran-glyanczevyj-kerama-marazzi-85x285',2639.18,'Совпадают коллекция, цвет, грань, поверхность и размер.'),
 ('86360070','9018 Монпарнас беж глянцевый 8,5×28,5','492261-9018-monparnas-bezh-glyanczevyj-kerama-marazzi-85x285',2604.85,'Совпадают коллекция, цвет, поверхность и размер.'),
 ('86360071','9020 Монпарнас сиреневый глянцевый 8,5×28,5','492265-9020-monparnas-sirenevyj-glyanczevyj-kerama-marazzi-85x285',2604.85,'Совпадают коллекция, цвет, поверхность и размер.')]:new(art,'АПЕКС (местный)',n,a+slug,p,'руб/м²','Совпадение коллекции, цвета и размера; EAN не сверён',why+' EAN и толщина исходной позиции неизвестны.','https://apexdv.ru/collections/'+('534-akkord' if 'Аккорд' in n else '25219624-monparnas'))
# Same Starlike EVO color code, explicitly different packaging, never an exact SKU.
for art,code,id in [('82860205','100','58701'),('82860206','102','58704'),('82860200','105','59245'),('82860189','110','58383'),('82860191','115','57970'),('82860190','120','58444')]:
 new(art,'Красный Мамонт','Litokol Starlike EVO S.'+code+' 2,5 кг','https://www.redmamont.ru/catalog/?SECTION_ID=975&ELEMENT_ID='+id,5900,'руб/2,5 кг','Та же линейка и код цвета, ДРУГАЯ фасовка','В исходнике 2 кг, у конкурента 2,5 кг. Код цвета совпадает; рецептуру, перевод цвета и EAN сверить. Для цены за кг разделить цену на 2,5.','https://www.redmamont.ru/catalog/?SECTION_ID=975 — фрагмент 1')
# Additional cards independently collected from competitor catalog pages.
import json
for item in json.load(open('reports/additional_matches.json', encoding='utf-8')):
 new(item['art'],item['shop'],item['name'],item['url'],item['price'],item['unit'],item['status'],item['reason'],item['source'])
# Reject previous wrong shade: dark grey 9015 is not dark smoky 9028.
for key in list(M):
 if key[0]=='83024081' and '482853-' in key[1]:del M[key]
# Conservative feature screen over every source row against the collected catalog.
def norm(t):
 t=unidecode(t.lower()).replace(',','.').replace('kh','x');return t

def dims(t):
 t=norm(t)
 m=re.search(r'(\d+(?:\.\d+)?)\s*[x*]\s*(\d+(?:\.\d+)?)',t)
 if not m:return None
 a,b=map(float,m.groups());a,b=(a*10,b*10) if max(a,b)<=160 else (a,b)
 return sorted((a,b))
def feature(t,groups):
 t=norm(t)
 return {k for k,terms in groups.items() if any(re.search(v,t) for v in terms)}
colors={'white':['bely','belyi','bel[ .]','b\\.','white','blanco','bianco'],'gray':['sery','seryi','ser[ .]','sv-ser','ser\\.','grey','gray'],'beige':['bezh','bezhev','krem','crema','ivory'],'black':['chern','black','nero'],'brown':['korich','brown','braun'],'blue':['sini','blue']}
textures={'onyx':['oniks','onyx'],'marble':['mramor','calacatta','kalakatta','statuario','marbella'],'concrete':['tsemento','cemento','beton','cementato'],'terrazzo':['terratstso','terrazzo']}
finishes={'matte':['matov','mat[ .]','mat\\.','matt','nepol'],'polished':['polirov','pol[ .]','pol\\.','gliant','glyan','gl[ .]','gl\\.','pgvt']}
def porcelain(r,is_src):
 t=norm(r['Наименование'] if is_src else r[1]+' '+r[2])
 return (bool(re.search(r'^(kg|kt)\b|keramogranit|ker\.gr',t)) or (not is_src and '/keramicheskaya_plitka/' in t)) and not re.search('dekor|decor|bord|mozai|mozaik|stupen|panno',t)
for r in src:
 if not porcelain(r,True):continue
 name=r['Наименование'];d=dims(name);co=feature(name,colors);te=feature(name,textures);fi=feature(name,finishes)
 if not d or not co or not te or not fi:continue
 for c in cat:
  if not porcelain(c,False):continue
  text=c[1]+' '+c[2];dd=dims(c[1])
  if not dd:
   # Explicit URL sizes, not arbitrary digits from model codes.
   m=re.search(r'(?:_|-)(\d{3,4})(?:_|kh)(\d{3,4})(?:_|kh|-)',c[2])
   if m:dd=sorted(map(float,m.groups()))
  if not dd or any(abs(x-y)/x>0.015 for x,y in zip(d,dd)):continue
  if co.isdisjoint(feature(text,colors)) or te.isdisjoint(feature(text,textures)) or fi.isdisjoint(feature(text,finishes)):continue
  if (r['Артикул'],c[2]) not in M:match(r['Артикул'],c,'Кандидат по характеристикам — НЕ подтверждённый аналог','Совпали формат (допуск 1,5%), группа цвета, рисунок и группа поверхности по тексту. Фото НЕ сравнивались. Толщина, тон, ректификация, R/PEI неизвестны. Полировка и глазурованный глянец объединены только для отбора кандидатов.')
# Flag weak dark/smoky identification separately.
for row in M.values():
 if row[0]=='83024081' and '491116-' not in row[5]:row[6]='Кандидат той же коллекции — оттенок не подтверждён'
def lp_link(art):
 return 'https://vladivostok.lemanapro.ru/search/?q='+art
def lp_status(art):
 return 'Владивосток: поиск по артикулу — НЕ карточка; выдача не проверена (HTTP 403 при контрольном запросе)'
wb=Workbook();w=wb.active;w.title='Сводка'
count=collections.Counter(x[6] for x in M.values()); covered={x[0] for x in M.values()}
for row in [['Показатель','Значение'],['Исходных позиций',len(src)],['Позиций со связками',len(covered)],['Всего связок',len(M)],['Без отобранных кандидатов в этой базе',len(src)-len(covered)],['Охват','Все 1518 строк проверены алгоритмом против частичной базы. Это НЕ полный поиск по интернету и НЕ доказательство отсутствия аналогов для оставшихся строк.'],['Точные совпадения EAN',0],['Визуальная проверка','Не выполнена. Ни один новый визуальный аналог не подтверждён.'],['Цены','В основном унаследованы из предыдущего сбора 10.11.2026. Новые источники и дата доступа указаны; актуальность и наличие перепроверить. Цен ЛП в исходнике нет.'],['Ограничения','Нет полных выгрузок конкурентов; 40 карточек Santehnica без названий не годятся для сопоставления. Не все размеры и поверхности удалось извлечь.'],['Публикация','Исходные данные поставщиков и штрихкоды в эту книгу не включены.']]:w.append(row)
w.append(['Ссылки Лемана ПРО','Только https://vladivostok.lemanapro.ru/search/?q=АРТИКУЛ — поиск по исходному артикулу, не карточка товара. Контрольный запрос 12778258 вернул HTTP 403; выдача, наличие и региональные цены не проверены. Карточки других регионов не используются.'])
for k,v in count.items():w.append([k,v])
w=wb.create_sheet('Соответствия');headers=['Артикул ЛП','Товар ЛП','Бренд ЛП','Конкурент','Товар конкурента','Ссылка конкурента','Ссылка Лемана ПРО','Тип ссылки ЛП','Статус','Основание и отличия','Цена конкурента','Единица','Дата цены или сбора','Проверка фото','Наличие'];w.append(headers)
for row in sorted(M.values(),key=lambda x:(x[0],x[3],x[4])):w.append(row[:6]+[lp_link(row[0]),lp_status(row[0])]+row[6:])
w=wb.create_sheet('Все 1518 артикулов');w.append(['Артикул','Наименование','Бренд','Результат проверки в частичной базе','Связок','Ссылка Лемана ПРО','Тип ссылки ЛП','Ссылки конкурентов'])
for r in src:
 mm=[v for v in M.values() if v[0]==r['Артикул']]
 w.append([r['Артикул'],r['Наименование'],r['Бренд'],'Есть предварительные соответствия' if mm else 'Не отобрано в частичной базе; нужен дальнейший поиск',len(mm),lp_link(r['Артикул']),lp_status(r['Артикул']),'\n'.join(v[5] for v in mm)])
w=wb.create_sheet('Каталог источников');w.append(['Продавец','Наименование','Ссылка','Источник','Статус источника','Цена','Единица','Дата'])
unique={c[2]:c for c in cat}
for c in unique.values():w.append(c)
for ws in wb:
 ws.freeze_panes='A2';ws.auto_filter.ref=ws.dimensions
 for c in ws[1]:c.font=Font(bold=True,color='FFFFFF');c.fill=PatternFill('solid',fgColor='24465C')
 for col in ws.columns:ws.column_dimensions[col[0].column_letter].width=22 if col[0].column==1 else 48
 for row in ws.iter_rows(min_row=2):
  for c in row:
   c.alignment=Alignment(wrap_text=True,vertical='top')
   if str(c.value or '').startswith('https://') and '\n' not in str(c.value) and ' ' not in str(c.value):c.hyperlink=c.value;c.font=Font(color='0563C1',underline='single')
p='reports/competitor_matches.xlsx';wb.save(p)
assert load_workbook(p)['Все 1518 артикулов'].max_row==1519
print('COVERED',len(covered),'LINKS',len(M),'CATEGORIES',dict(count),'CATALOG',len(unique))
for r in M.values():print(r[0],r[6],r[4])
