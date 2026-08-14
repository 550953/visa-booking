import {
  Activity, Bell, CalendarClock, Check, CheckCircle2,
  ChevronDown, Clock3, FileBarChart2, FileClock, Filter, Gauge, HeartPulse, Home,
  LifeBuoy, Menu, Monitor, MoreHorizontal, Network, RefreshCw, Search, Settings,
  ShieldCheck, SlidersHorizontal, Sparkles, Users,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

type PageKey = 'dashboard' | 'queue' | 'customers' | 'monitoring' | 'notifications' | 'events' | 'system' | 'settings' | 'reports' | 'shifts' | 'quality' | 'integrations';
type IconType = typeof Home;

const pageMap: Record<string, PageKey> = {
  'index.html': 'dashboard', '': 'dashboard', 'queue.html': 'queue', 'customers.html': 'customers',
  'monitoring.html': 'monitoring', 'notifications.html': 'notifications', 'events.html': 'events',
  'system.html': 'system', 'settings.html': 'settings', 'reports.html': 'reports',
  'shifts.html': 'shifts', 'quality.html': 'quality', 'integrations.html': 'integrations',
};

const pageTitles: Record<PageKey, string> = {
  dashboard: 'Рабочий стол — Booking Ops', queue: 'Очередь записей — Booking Ops',
  customers: 'Клиенты — Booking Ops', monitoring: 'Мониторинг — Booking Ops',
  notifications: 'Уведомления — Booking Ops', events: 'Журнал событий — Booking Ops',
  system: 'Статус системы — Booking Ops', settings: 'Настройки — Booking Ops',
  reports: 'Отчёты — Booking Ops', shifts: 'Смены — Booking Ops',
  quality: 'Контроль качества — Booking Ops', integrations: 'Интеграции — Booking Ops',
};

const navigation: { label: string; items: { label: string; href: string; key: PageKey; icon: IconType; badge?: string }[] }[] = [
  { label: 'Операционная зона', items: [
    { label: 'Рабочий стол', href: 'index.html', key: 'dashboard', icon: Home },
    { label: 'Клиенты', href: 'customers.html', key: 'customers', icon: Users },
    { label: 'Очередь записей', href: 'queue.html', key: 'queue', icon: Clock3 },
    { label: 'Мониторинг', href: 'monitoring.html', key: 'monitoring', icon: Monitor },
    { label: 'Уведомления', href: 'notifications.html', key: 'notifications', icon: Bell, badge: '2' },
    { label: 'Журнал событий', href: 'events.html', key: 'events', icon: FileClock },
  ] },
  { label: 'Контроль', items: [
    { label: 'Статус системы', href: 'system.html', key: 'system', icon: HeartPulse },
    { label: 'Отчёты', href: 'reports.html', key: 'reports', icon: FileBarChart2 },
    { label: 'Смены', href: 'shifts.html', key: 'shifts', icon: CalendarClock },
    { label: 'Контроль качества', href: 'quality.html', key: 'quality', icon: ShieldCheck },
    { label: 'Интеграции', href: 'integrations.html', key: 'integrations', icon: Network },
    { label: 'Настройки', href: 'settings.html', key: 'settings', icon: Settings },
  ] },
];

const queueRows = [
  { id: 'q-1', initials: 'ТО', name: 'Ткаченко Ольга Игоревна', country: 'Италия', priority: 'Высокий', status: 'Оплата', wait: '6 мин', next: 'Подтвердить оплату', age: '8 мин назад', tone: 'amber' },
  { id: 'q-2', initials: 'ИП', name: 'Иванов Пётр Сергеевич', country: 'Испания', priority: 'Высокий', status: 'Мониторинг', wait: '—', next: 'Проверка через 4 мин', age: '2 мин назад', tone: 'teal' },
  { id: 'q-3', initials: 'СА', name: 'Смирнова Анна Викторовна', country: 'Франция', priority: 'Высокий', status: 'САРТЧА', wait: '—', next: 'Открыть САРТЧА', age: '5 мин назад', tone: 'amber' },
  { id: 'q-4', initials: 'В', name: 'Волкова Мария', country: 'Турция', priority: 'Средний', status: 'Ожидание', wait: '14 мин', next: 'Назначить оператора', age: '16 мин назад', tone: 'blue' },
  { id: 'q-5', initials: 'КН', name: 'Ким Николай Андреевич', country: 'ОАЭ', priority: 'Низкий', status: 'Новая', wait: '—', next: 'Начать обработку', age: '21 мин назад', tone: 'teal' },
  { id: 'q-6', initials: 'ПЕ', name: 'Петрова Елена', country: 'Греция', priority: 'Средний', status: 'Документы', wait: '9 мин', next: 'Проверить документы', age: '25 мин назад', tone: 'blue' },
];

const customers = [
  { id: 'c-1', initials: 'ТО', name: 'Ткаченко Ольга Игоревна', contact: 'olga.t@inbox.ru', country: 'Италия', bookings: '4', last: 'Сегодня, 11:42', status: 'В работе' },
  { id: 'c-2', initials: 'ИП', name: 'Иванов Пётр Сергеевич', contact: 'p.ivanov@mail.ru', country: 'Испания', bookings: '2', last: 'Сегодня, 11:37', status: 'Мониторинг' },
  { id: 'c-3', initials: 'СА', name: 'Смирнова Анна Викторовна', contact: 'anna.smirnova@ya.ru', country: 'Франция', bookings: '7', last: 'Сегодня, 11:21', status: 'В работе' },
  { id: 'c-4', initials: 'ВМ', name: 'Волкова Мария', contact: 'm.volkova@mail.ru', country: 'Турция', bookings: '1', last: 'Вчера, 18:05', status: 'Завершён' },
  { id: 'c-5', initials: 'КН', name: 'Ким Николай Андреевич', contact: 'n.kim@inbox.ru', country: 'ОАЭ', bookings: '3', last: 'Вчера, 16:48', status: 'Завершён' },
];

const events = [
  ['11:57:24', 'Новая запись добавлена в очередь', 'Ткаченко Ольга Игоревна · Италия', 'Новая запись', 'teal'],
  ['11:54:08', 'Платёж подтверждён', 'Иванов Пётр Сергеевич · EUR 320', 'Платёж', 'amber'],
  ['11:49:32', 'Изменён приоритет заявки', 'САРТЧА · заявка #BK-2841', 'Изменение', 'blue'],
  ['11:46:10', 'Завершена проверка мониторинга', 'booking-gateway · 182 мс', 'Система', 'teal'],
  ['11:42:54', 'Оператор передал заявку', 'Михаил Орлов → Дарья Мельник', 'Смена', 'blue'],
  ['11:38:17', 'Документ загружен клиентом', 'Петрова Елена · паспорт', 'Документы', 'amber'],
  ['11:34:03', 'Создано уведомление', 'Высокое время ожидания · очередь #03', 'Алерт', 'red'],
];

const notifications = [
  { id: 'n-1', title: 'Превышено время ожидания', body: 'Заявка Волковой Марии ожидает назначения оператора 14 минут.', time: '2 мин назад', unread: true, tone: 'red' },
  { id: 'n-2', title: 'Смена заканчивается через 30 минут', body: 'Передайте заявки следующему оператору до 12:30.', time: '18 мин назад', unread: true, tone: 'amber' },
  { id: 'n-3', title: 'Синхронизация завершена', body: '12 записей из внешних каналов добавлены в очередь.', time: '42 мин назад', unread: false, tone: 'teal' },
  { id: 'n-4', title: 'Обновлена политика приоритета', body: 'Правило «сначала срочные» применяется к очереди по умолчанию.', time: 'Сегодня, 09:12', unread: false, tone: 'blue' },
];

const toastText = (setToast: (value: string) => void, text: string) => {
  setToast(text);
  window.setTimeout(() => setToast(''), 2400);
};

function usePageState() {
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('21:57');
  const refresh = () => {
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setLastRefresh(time);
    window.dispatchEvent(new CustomEvent('bookingops-refresh', { detail: time }));
    toastText(setToast, 'Данные обновлены');
  };
  return { toast, setToast, menuOpen, setMenuOpen, lastRefresh, setLastRefresh, refresh };
}

function Sidebar({ page, open, onClose }: { page: PageKey; open: boolean; onClose: () => void }) {
  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="brand"><div className="brand-mark">BO</div><div className="brand-name">Booking Ops</div></div>
    {navigation.map((group) => <div className="nav-group" key={group.label}>
      <p className="nav-heading">{group.label}</p>
      {group.items.map(({ label, href, key, icon: Icon, badge }) => <a className={`nav-link ${page === key ? 'active' : ''}`} href={href} key={key} onClick={onClose} data-testid={`link-nav-${key}`}>
        <Icon /><span>{label}</span>{badge && <b className="nav-badge">{badge}</b>}
      </a>)}
    </div>)}
    <div className="sidebar-foot"><div>Текущий доступ</div><span className="operator-pill">Оператор</span><div>Локальный демо-контур</div></div>
  </aside>;
}

function Shell({ page, children }: { page: PageKey; children: ReactNode }) {
  const { toast, setToast, menuOpen, setMenuOpen, lastRefresh, setLastRefresh } = usePageState();
  const [bellOpen, setBellOpen] = useState(false);
  useEffect(() => { document.title = pageTitles[page]; }, [page]);
  useEffect(() => {
    const onRefresh = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setToast('Данные обновлены');
      window.setTimeout(() => setToast(''), 2400);
      if (detail) setLastRefresh(detail);
    };
    window.addEventListener('bookingops-refresh', onRefresh);
    return () => {
      window.removeEventListener('bookingops-refresh', onRefresh);
    };
  }, [setLastRefresh, setToast]);
  return <div className="app-shell">
    <Sidebar page={page} open={menuOpen} onClose={() => setMenuOpen(false)} />
    <main className="main">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Открыть меню" data-testid="button-open-menu"><Menu /></button>
          <div className="crumb">Операционный центр <span>/</span> <strong>{pageTitles[page].replace(' — Booking Ops', '')}</strong></div>
        </div>
        <div className="top-actions">
          <div className="sync"><span className="sync-dot"></span> Синхронизировано {lastRefresh}</div>
          <div className="notification-wrap">
            <button className="icon-button" onClick={() => setBellOpen(!bellOpen)} aria-label="Уведомления" data-testid="button-header-notifications"><Bell /> <span className="count-dot">2</span></button>
            {bellOpen && <div className="notification-pop"><p><strong>2 новых уведомления</strong><br />Превышено время ожидания и смена скоро заканчивается.</p><a className="button" style={{ width: '100%' }} href="notifications.html">Открыть центр уведомлений</a></div>}
          </div>
          <div className="avatar" title="Анна Кузнецова">АК</div>
        </div>
      </header>
      {children}
      {toast && <div className="toaster" role="status">{toast}</div>}
    </main>
  </div>;
}

function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{subtitle && <p className="subtitle">{subtitle}</p>}</div>{action}</div>;
}
function RefreshButton({ onClick }: { onClick: () => void }) {
  return <button className="button" onClick={onClick} data-testid="button-refresh"><RefreshCw /> Обновить</button>;
}
function Metric({ label, value, detail, tone = '', className = '' }: { label: string; value: string; detail?: string; tone?: string; className?: string }) {
  return <div className={`card metric ${tone} ${className}`}><div className="metric-label">{label}</div><div className="metric-value">{value}</div>{detail && <div className={`metric-detail ${tone === 'red' ? 'warn' : 'good'}`}>{detail}</div>}</div>;
}
function StatusTag({ children, tone = 'teal' }: { children: React.ReactNode; tone?: string }) { return <span className={`tag ${tone}`}>{children}</span>; }
function Person({ initials, name, sub }: { initials: string; name: string; sub?: string }) {
  return <div className="person"><span className="person-avatar">{initials}</span><div><div className="person-name">{name}</div>{sub && <div className="subtext">{sub}</div>}</div></div>;
}

function DashboardPage() {
  const { refresh } = usePageState();
  return <div className="page">
    <PageHeader eyebrow="Операционная зона · сегодня, 28 июня" title="Рабочий стол" subtitle="Доброе утро, Анна. Система работает стабильно, 3 заявки требуют внимания." action={<RefreshButton onClick={refresh} />} />
    <div className="dashboard-banner"><div><strong>Смена в активном режиме</strong><p>Вы на линии до 12:30 · 4 оператора онлайн · последняя передача 11:42</p></div><a className="button" href="shifts.html">Открыть смену <ChevronDown /></a></div>
    <section className="section metrics">
      <Metric label="Активные заявки" value="8" detail="+2 за последний час" tone="teal" />
      <Metric label="Высокий приоритет" value="3" detail="требуют внимания первым" tone="red" />
      <Metric label="Среднее ожидание" value="7,4 мин" detail="на 1,2 мин меньше плана" tone="blue" />
      <Metric label="Завершено сегодня" value="47" detail="92% в пределах SLA" tone="amber" />
    </section>
    <section className="section split">
      <div className="card table-card"><div className="table-top"><div><h2>Очередь записей</h2><small>Следующие заявки для обработки</small></div><StatusTag>FIFO с приоритетом</StatusTag></div>
        <div className="wide-list">{queueRows.slice(0, 4).map((row, i) => <div className="queue-row" key={row.id}><span className="queue-num">{i + 1}</span><Person initials={row.initials} name={row.name} sub={row.age} /><span className={`priority-${row.priority === 'Высокий' ? 'high' : row.priority === 'Средний' ? 'medium' : 'low'}`}>{row.priority}</span><StatusTag tone={row.tone}>{row.status}</StatusTag><a className="table-link" href="queue.html">Открыть</a></div>)}</div>
        <div style={{ padding: '14px 18px' }}><a className="button" href="queue.html">Открыть всю очередь <ChevronDown /></a></div>
      </div>
      <div className="card card-pad"><div className="section-head"><div><h2>Активность</h2><small>Последние события</small></div><a className="table-link" href="events.html">Все</a></div><div className="activity-list">{events.slice(0, 4).map(([time, title, detail, , tone], i) => <div className="activity-item" key={time}><div className={`activity-icon ${tone}`}><Activity /></div><div className="activity-copy"><strong>{title}</strong><div className="subtext">{detail}</div><div className="activity-time">{time}</div></div></div>)}</div></div>
    </section>
    <section className="section split">
      <div className="card card-pad"><div className="section-head"><div><h2>Пропускная способность</h2><small>Заявки за последние 8 часов</small></div><span className="kicker">47 всего</span></div><div className="trend">{[28,36,45,30,53,64,72,58,76,68,85,77,93,80,71,86].map((h, i) => <i className="bar" style={{ height: `${h}%` }} key={i} />)}</div><div className="stat-row"><span>Входящие</span><span>54</span></div><div className="progress"><i style={{ width: '76%' }} /></div><div className="stat-row"><span>Завершённые</span><span>47</span></div><div className="progress amber"><i style={{ width: '63%' }} /></div></div>
      <div className="card health-card"><div className="health-title"><div><h2>Здоровье системы</h2><div className="subtext">Обновлено минуту назад</div></div><span className="health-dot" /></div><div className="check"><div><div className="check-name">Booking gateway</div><div className="check-meta">Средний ответ 182 мс</div></div><div className="check-status"><CheckCircle2 /> Работает</div></div><div className="check"><div><div className="check-name">Платёжный шлюз</div><div className="check-meta">Средний ответ 241 мс</div></div><div className="check-status"><CheckCircle2 /> Работает</div></div><a className="button" style={{ width: '100%', marginTop: 14 }} href="system.html">Все проверки</a></div>
    </section>
  </div>;
}

function QueuePage() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('Все страны');
  const [priority, setPriority] = useState('Все приоритеты');
  const { refresh } = usePageState();
  const rows = useMemo(() => queueRows.filter((r) => (!search || `${r.name} ${r.country}`.toLowerCase().includes(search.toLowerCase())) && (country === 'Все страны' || r.country === country) && (priority === 'Все приоритеты' || r.priority === priority)), [search, country, priority]);
  return <div className="page"><PageHeader eyebrow="Распределение нагрузки" title="Очередь записей" subtitle="Три независимых потока: каждый монитор продолжает работу отдельно." action={<RefreshButton onClick={refresh} />} />
    <div className="metrics"><Metric label="Всего в очередях" value="8" detail="активных заявок" /><Metric label="Высокий приоритет" value="3" detail="требуют внимания первым" tone="red" /><Metric label="Среднее ожидание" value="7,4 мин" detail="цель — менее 10 минут" tone="blue" /><Metric label="Следующее действие" value="Волкова" detail="открыть карточку" tone="amber" /></div>
    <section className="section card table-card"><div className="table-top"><div><h2>Независимые очереди стран</h2><small>{rows.length} заявок отображается</small></div><StatusTag>FIFO с учётом приоритета</StatusTag></div>
      <div className="filters"><select className="select" value={country} onChange={(e) => setCountry(e.target.value)} data-testid="select-queue-country"><option>Все страны</option><option>Италия</option><option>Испания</option><option>Франция</option><option>Турция</option><option>ОАЭ</option><option>Греция</option></select><select className="select" value={priority} onChange={(e) => setPriority(e.target.value)} data-testid="select-queue-priority"><option>Все приоритеты</option><option>Высокий</option><option>Средний</option><option>Низкий</option></select><div className="search-wrap"><Search /><input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по клиенту или стране" data-testid="input-queue-search" /></div></div>
      <div className="table-scroll"><table><thead><tr><th>Позиция</th><th>Клиент</th><th>Страна</th><th>Приоритет</th><th>Статус</th><th>Ожидание</th><th>Следующий шаг</th><th></th></tr></thead><tbody>{rows.map((r, i) => <tr key={r.id}><td><span className="queue-num">{i + 1}</span></td><td><Person initials={r.initials} name={r.name} sub={r.age} /></td><td>{r.country}</td><td className={`priority-${r.priority === 'Высокий' ? 'high' : r.priority === 'Средний' ? 'medium' : 'low'}`}>{r.priority}</td><td><StatusTag tone={r.tone}>{r.status}</StatusTag></td><td>{r.wait}</td><td><span className="subtext">{r.next}</span></td><td><a className="button" href="customers.html">Открыть</a></td></tr>)}</tbody></table>{rows.length === 0 && <div className="empty"><Search /><p>По этому фильтру заявок нет</p></div>}</div>
    </section>
  </div>;
}

function CustomersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(customers[0]);
  const filtered = useMemo(() => customers.filter((c) => `${c.name} ${c.contact} ${c.country}`.toLowerCase().includes(search.toLowerCase())), [search]);
  return <div className="page"><PageHeader eyebrow="Клиентский контур" title="Клиенты" subtitle="История обращений и текущий контекст без переходов между системами." action={<button className="button primary" onClick={() => alert('Создание клиента доступно в демо-режиме')} data-testid="button-add-customer"><Users /> Новый клиент</button>} />
    <section className="section split"><div className="card table-card"><div className="table-top"><div><h2>Клиентская база</h2><small>{filtered.length} из {customers.length} записей</small></div><button className="icon-button" aria-label="Фильтры клиентов"><SlidersHorizontal /></button></div><div className="filters"><div className="search-wrap"><Search /><input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Имя, email или страна" data-testid="input-customer-search" /></div><select className="select"><option>Все статусы</option><option>В работе</option><option>Завершён</option></select></div><div className="table-scroll"><table><thead><tr><th>Клиент</th><th>Страна</th><th>Записей</th><th>Последняя активность</th><th>Статус</th></tr></thead><tbody>{filtered.map((c) => <tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}><td><Person initials={c.initials} name={c.name} sub={c.contact} /></td><td>{c.country}</td><td>{c.bookings}</td><td className="subtext">{c.last}</td><td><StatusTag tone={c.status === 'В работе' ? 'teal' : 'blue'}>{c.status}</StatusTag></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty"><Users /><p>Клиенты не найдены</p></div>}</div></div>
      <div className="card card-pad"><div className="section-head"><div><p className="eyebrow">Карточка клиента</p><h2>{selected.name}</h2></div><button className="icon-button" aria-label="Дополнительные действия"><MoreHorizontal /></button></div><Person initials={selected.initials} name={selected.contact} sub={`${selected.country} · ${selected.bookings} записей`} /><div className="section"><div className="stat-row"><span>Текущий статус</span><StatusTag>{selected.status}</StatusTag></div><div className="stat-row"><span>Последняя активность</span><span>{selected.last}</span></div><div className="stat-row"><span>Средняя оценка</span><span>4,8 / 5</span></div></div><div className="section"><h3>Последние записи</h3><div className="check"><div><div className="check-name">Заявка #BK-2841</div><div className="check-meta">Рим · сегодня, 11:42</div></div><StatusTag tone="amber">Оплата</StatusTag></div><div className="check"><div><div className="check-name">Заявка #BK-2710</div><div className="check-meta">Милан · 12 июня</div></div><StatusTag>Завершена</StatusTag></div></div><a className="button" style={{ width: '100%', marginTop: 19 }} href="queue.html">Открыть в очереди</a></div></section>
  </div>;
}

function MonitoringPage() {
  const monitors = [{ name: 'Booking gateway', meta: 'Основной API записи · 182 мс', status: 'Все проверки пройдены', tone: 'good', value: '99,98%' }, { name: 'Платёжный шлюз', meta: 'CloudPayments · 241 мс', status: 'Все проверки пройдены', tone: 'good', value: '99,95%' }, { name: 'Почтовый канал', meta: 'SMTP relay · 408 мс', status: 'Есть задержка ответа', tone: 'warn', value: '99,71%' }, { name: 'Календарь операторов', meta: 'Внутренний сервис · 86 мс', status: 'Все проверки пройдены', tone: 'good', value: '100%' }];
  return <div className="page"><PageHeader eyebrow="Наблюдаемость" title="Мониторинг" subtitle="Ключевые сервисы и каналы в одном потоке. Красное — действие, жёлтое — наблюдение." action={<RefreshButton onClick={() => window.location.reload()} />} /><div className="metrics"><Metric label="Сервисы онлайн" value="4 / 4" detail="без критических сбоев" tone="teal" /><Metric label="Средний ответ" value="229 мс" detail="за последние 15 минут" tone="blue" /><Metric label="Ошибки за час" value="3" detail="на 0,4% меньше нормы" tone="amber" /><Metric label="SLA сегодня" value="99,7%" detail="цель — 99,5%" tone="teal" /></div><section className="section split"><div className="card table-card"><div className="table-top"><div><h2>Проверки сервисов</h2><small>Автопроверка каждые 60 секунд</small></div><StatusTag><span className="health-dot" /> Работает</StatusTag></div>{monitors.map((m) => <div className="check" style={{ padding: '18px 19px' }} key={m.name}><div><div className="check-name">{m.name}</div><div className="check-meta">{m.meta}</div></div><div style={{ textAlign: 'right' }}><div className={`check-status ${m.tone === 'warn' ? 'warn' : ''}`}><span className={`health-dot ${m.tone === 'warn' ? 'warn' : ''}`} />{m.status}</div><div className="subtext" style={{ marginTop: 5 }}>{m.value} доступность</div></div></div>)}</div><div className="card card-pad"><div className="section-head"><div><h2>Задержка ответа</h2><small>booking-gateway · мс</small></div><span className="kicker">15 мин</span></div><div className="trend">{[35,38,42,39,44,48,51,46,58,49,52,61,56,64,58,68,71,65].map((h, i) => <i className="bar" style={{ height: `${h}%` }} key={i} />)}</div><div className="stat-row"><span>Текущее</span><strong>182 мс</strong></div><div className="stat-row"><span>Пик</span><strong>408 мс</strong></div><div className="section"><h3>Последний инцидент</h3><p className="panel-note">В 10:32 почтовый канал отвечал с задержкой 1,8 сек. Сервис восстановился автоматически.</p></div></div></section></div>;
}

function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const [tab, setTab] = useState('Все');
  const visible = items.filter((n) => tab === 'Все' || (tab === 'Непрочитанные' && n.unread));
  return <div className="page"><PageHeader eyebrow="Центр внимания" title="Уведомления" subtitle="Сигналы, которые помогают не держать всё в голове." action={<button className="button" onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))} data-testid="button-read-all"><Check /> Отметить все прочитанными</button>} /><div className="tabs"><button className={`tab ${tab === 'Все' ? 'active' : ''}`} onClick={() => setTab('Все')}>Все <span>4</span></button><button className={`tab ${tab === 'Непрочитанные' ? 'active' : ''}`} onClick={() => setTab('Непрочитанные')}>Непрочитанные <span>2</span></button></div><section className="section card table-card"><div className="table-top"><div><h2>Лента уведомлений</h2><small>Последнее обновление — сегодня в 11:57</small></div><StatusTag tone="red">2 требуют реакции</StatusTag></div>{visible.map((n) => <div className={`notice-row ${n.unread ? 'unread' : 'read'}`} key={n.id}><span className="notice-mark" /><div className="notice-copy"><strong>{n.title}</strong>{n.body}<div className="notice-time">{n.time}</div></div>{n.unread && <button className="notice-action" onClick={() => setItems(items.map((item) => item.id === n.id ? { ...item, unread: false } : item))} data-testid={`button-read-${n.id}`}>Прочитано</button>}<span className={`tag ${n.tone}`}>{n.tone === 'red' ? 'Алерт' : n.tone === 'amber' ? 'Смена' : 'Система'}</span></div>)}{visible.length === 0 && <div className="empty"><CheckCircle2 /><p>Непрочитанных уведомлений нет</p></div>}</section></div>;
}

function EventsPage() {
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('Все события');
  const filtered = events.filter((e) => (!search || e.join(' ').toLowerCase().includes(search.toLowerCase())) && (kind === 'Все события' || e[3] === kind));
  return <div className="page"><PageHeader eyebrow="Наблюдаемость · аудит" title="Журнал событий" subtitle="Единая хронология действий операторов, клиентов и системных процессов." action={<button className="button" onClick={() => alert('Журнал экспортирован в демо-режиме')} data-testid="button-export-events"><FileBarChart2 /> Экспорт журнала</button>} /><section className="card table-card"><div className="filters"><div className="search-wrap"><Search /><input className="input" placeholder="Поиск по журналу" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-events-search" /></div><select className="select" value={kind} onChange={(e) => setKind(e.target.value)} data-testid="select-events-kind"><option>Все события</option><option>Новая запись</option><option>Платёж</option><option>Система</option><option>Смена</option><option>Алерт</option></select><button className="button"><Filter /> Фильтры</button></div><div className="table-scroll"><table><thead><tr><th>Время</th><th>Событие</th><th>Контекст</th><th>Тип</th><th>Источник</th></tr></thead><tbody>{filtered.map(([time, title, detail, type, tone]) => <tr key={time}><td className="subtext">{time}</td><td><Person initials={type.slice(0, 2).toUpperCase()} name={title} /></td><td>{detail}</td><td><StatusTag tone={tone}>{type}</StatusTag></td><td className="subtext">{type === 'Система' ? 'Автоматика' : 'Анна Кузнецова'}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty"><FileClock /><p>События не найдены</p></div>}</div></section></div>;
}

function SystemPage() {
  const checks = [{ name: 'Основной контур бронирования', meta: 'booking-gateway / v2.8.4', value: '182 мс', status: 'Работает', tone: 'good' }, { name: 'Слой данных клиентов', meta: 'customer-store / primary', value: '86 мс', status: 'Работает', tone: 'good' }, { name: 'Почтовые уведомления', meta: 'smtp-relay / eu-central-1', value: '408 мс', status: 'Наблюдение', tone: 'warn' }, { name: 'Очередь фоновых задач', meta: 'worker-pool / 4 workers', value: '12 задач', status: 'Работает', tone: 'good' }, { name: 'Резервное копирование', meta: 'backup-vault / 04:00 UTC', value: 'сегодня', status: 'Работает', tone: 'good' }];
  return <div className="page"><PageHeader eyebrow="Контроль инфраструктуры" title="Статус системы" subtitle="Состояние сервисов, фоновых задач и последнего резервного копирования." action={<button className="button" onClick={() => window.location.reload()} data-testid="button-system-refresh"><RefreshCw /> Запустить проверку</button>} /><div className="metrics"><Metric label="Общий статус" value="Стабильно" detail="5 из 5 контуров доступны" tone="teal" /><Metric label="Доступность за 30 дней" value="99,96%" detail="выше целевого SLA" tone="blue" /><Metric label="Активных задач" value="12" detail="очередь обрабатывается" tone="amber" /><Metric label="Последний backup" value="04:00" detail="сегодня · без ошибок" tone="teal" /></div><section className="section split"><div className="card table-card"><div className="table-top"><div><h2>Контуры системы</h2><small>Проверено сегодня в 11:57:24</small></div><StatusTag>Все системы</StatusTag></div>{checks.map((c) => <div className="check" style={{ padding: '16px 19px' }} key={c.name}><div><div className="check-name">{c.name}</div><div className="check-meta">{c.meta}</div></div><div style={{ textAlign: 'right' }}><div className={`check-status ${c.tone === 'warn' ? 'warn' : ''}`}><span className={`health-dot ${c.tone === 'warn' ? 'warn' : ''}`} />{c.status}</div><div className="subtext" style={{ marginTop: 4 }}>{c.value}</div></div></div>)}</div><div className="card card-pad"><div className="section-head"><div><h2>Ресурсы контура</h2><small>Текущее использование</small></div><Gauge /></div><div className="stat-row"><span>CPU</span><span>38%</span></div><div className="progress"><i style={{ width: '38%' }} /></div><div className="stat-row"><span>Память</span><span>61%</span></div><div className="progress amber"><i style={{ width: '61%' }} /></div><div className="stat-row"><span>Хранилище</span><span>47%</span></div><div className="progress"><i style={{ width: '47%' }} /></div><div className="section"><h3>Дежурный инженер</h3><div className="activity-item"><div className="activity-icon"><LifeBuoy /></div><div className="activity-copy"><strong>Илья Воронцов</strong><div className="subtext">На линии до 14:00 · #infra-duty</div></div></div></div></div></section></div>;
}

function SettingsPage() {
  const [settings, setSettings] = useState(() => { try { return JSON.parse(localStorage.getItem('booking-ops-settings') || '{}') as Record<string, boolean>; } catch { return {}; } });
  const [saved, setSaved] = useState(false);
  const toggle = (key: string) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next); localStorage.setItem('booking-ops-settings', JSON.stringify(next)); setSaved(true); window.setTimeout(() => setSaved(false), 1600);
  };
  const rows: [string, string, string, boolean][] = [['autoRefresh', 'Автообновление очереди', 'Обновлять данные каждые 60 секунд во время активной смены.', true], ['soundAlerts', 'Звуковые сигналы', 'Воспроизводить короткий сигнал для алертов высокого приоритета.', false], ['showCompleted', 'Показывать завершённые', 'Оставлять завершённые заявки в журнале очереди на 24 часа.', false], ['handoffReminder', 'Напоминание о передаче', 'Показать напоминание за 30 минут до окончания смены.', true]];
  return <div className="page"><PageHeader eyebrow="Рабочее пространство" title="Настройки" subtitle="Локальные параметры операционного центра сохраняются на этом устройстве." action={saved ? <span className="tag"><Check /> Сохранено</span> : <button className="button" onClick={() => toggle('manual')} data-testid="button-settings-save">Сохранить изменения</button>} /><section className="settings-grid section"><div className="card card-pad"><div className="section-head"><div><h2>Поведение интерфейса</h2><small>Параметры текущего оператора</small></div><SlidersHorizontal /></div>{rows.map(([key, title, desc, defaultValue]) => <div className="settings-row" key={key}><div><div className="settings-label">{title}</div><div className="settings-desc">{desc}</div></div><button className={`toggle ${(settings[key] ?? defaultValue) ? 'on' : ''}`} onClick={() => toggle(key)} aria-label={title} data-testid={`toggle-${key}`}><i /></button></div>)}</div><div className="card card-pad"><div className="section-head"><div><h2>Профиль оператора</h2><small>Как вас видит команда</small></div><div className="avatar">АК</div></div><div className="form-group"><label className="form-label">Имя и фамилия</label><input className="input full-input" defaultValue="Анна Кузнецова" /></div><div className="form-group"><label className="form-label">Рабочий email</label><input className="input full-input" defaultValue="anna.kuznetsova@bookingops.ru" /></div><div className="form-group"><label className="form-label">Часовой пояс</label><select className="select full-input"><option>Москва (UTC+3)</option><option>Екатеринбург (UTC+5)</option></select></div><button className="button primary" style={{ width: '100%', marginTop: 19 }} onClick={() => toggle('profileSaved')} data-testid="button-save-profile"><Check /> Обновить профиль</button></div></section><section className="section card card-pad"><div className="section-head"><div><h2>Правила очереди</h2><small>Общие настройки распределения</small></div><a className="button" href="queue.html">Открыть очередь</a></div><div className="settings-row"><div><div className="settings-label">Сначала срочные</div><div className="settings-desc">Высокий приоритет всегда поднимается выше времени создания.</div></div><StatusTag>Активно</StatusTag></div><div className="settings-row"><div><div className="settings-label">Лимит ожидания</div><div className="settings-desc">Заявка отмечается жёлтым после 10 минут ожидания.</div></div><span className="tag amber">10 минут</span></div></section></div>;
}

function ReportsPage() {
  const [range, setRange] = useState('Последние 7 дней');
  return <div className="page"><PageHeader eyebrow="Данные для решений" title="Отчёты" subtitle="Операционная картина без ручной сборки таблиц: нагрузка, скорость и результат." action={<button className="button primary" onClick={() => alert('Отчёт сформирован в демо-режиме')} data-testid="button-generate-report"><FileBarChart2 /> Сформировать отчёт</button>} /><div className="filters" style={{ padding: 0, border: 0, marginBottom: 21 }}><select className="select" value={range} onChange={(e) => setRange(e.target.value)} data-testid="select-report-range"><option>Последние 7 дней</option><option>Последние 30 дней</option><option>Текущий месяц</option></select><button className="button"><CalendarClock /> {range}</button></div><div className="metrics"><Metric label="Всего заявок" value="318" detail="+12,6% к прошлой неделе" tone="teal" /><Metric label="Среднее время обработки" value="18,4 мин" detail="на 2,1 мин быстрее" tone="blue" /><Metric label="В пределах SLA" value="92,4%" detail="цель команды — 90%" tone="amber" /><Metric label="CSAT" value="4,8" detail="из 5,0 · 84 ответа" tone="teal" /></div><section className="section report-grid"><div className="card card-pad"><div className="section-head"><div><h2>Поток заявок</h2><small>Создано и завершено по дням</small></div><StatusTag>Последние 7 дней</StatusTag></div><div className="chart">{[58,68,44,76,84,63,91].map((h, i) => <div className="chart-col" key={i}><i style={{ height: `${h}%` }} /><small>{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</small></div>)}</div><div className="mini-grid" style={{ marginTop: 18 }}><div className="mini-stat"><label>Создано</label><strong>318</strong></div><div className="mini-stat"><label>Завершено</label><strong>294</strong></div><div className="mini-stat"><label>В очереди</label><strong>24</strong></div></div></div><div className="card card-pad"><div className="section-head"><div><h2>По странам</h2><small>Доля активных заявок</small></div><MoreHorizontal /></div>{[['Италия','36%','teal'],['Испания','24%','amber'],['Франция','18%','blue'],['Турция','13%','teal'],['Другие','9%','blue']].map(([name, value, tone]) => <div key={name}><div className="stat-row"><span>{name}</span><span>{value}</span></div><div className={`progress ${tone === 'amber' ? 'amber' : ''}`}><i style={{ width: value }} /></div></div>)}</div></section></div>;
}

function ShiftsPage() {
  const [handoff, setHandoff] = useState(false);
  return <div className="page"><PageHeader eyebrow="Команда на линии" title="Смены" subtitle="Кто сейчас отвечает за поток, когда передавать заявки и где оставить контекст." action={<button className="button primary" onClick={() => setHandoff(!handoff)} data-testid="button-handoff">{handoff ? <Check /> : <CalendarClock />} {handoff ? 'Передача отмечена' : 'Подготовить передачу'}</button>} /><div className="metrics"><Metric label="Операторов онлайн" value="4" detail="из 5 в расписании" tone="teal" /><Metric label="Текущая смена" value="08:30—12:30" detail="до передачи 33 минуты" tone="amber" /><Metric label="Заявок на оператора" value="2,0" detail="равномерная нагрузка" tone="blue" /><Metric label="Передач сегодня" value="7" detail="без пропущенных контекстов" tone="teal" /></div><section className="section split"><div className="card card-pad"><div className="section-head"><div><h2>Текущая смена</h2><small>Пятница, 28 июня</small></div><StatusTag>В эфире</StatusTag></div><div className="shift-current"><div><span>Смена 08:30—12:30</span><strong>Утренняя операционная</strong></div><div className="shift-avatar">АК</div></div>{[['Анна Кузнецова','Основной оператор','АК'],['Михаил Орлов','Резервный оператор','МО'],['Дарья Мельник','Контроль качества','ДМ']].map(([name, role, initials]) => <div className="check" key={name}><Person initials={initials} name={name} sub={role} /><StatusTag>{name === 'Анна Кузнецова' ? 'На линии' : 'Онлайн'}</StatusTag></div>)}</div><div className="card card-pad"><div className="section-head"><div><h2>Расписание</h2><small>Ближайшие смены</small></div><a className="table-link" href="settings.html">Настроить</a></div>{[['Сегодня','Анна Кузнецова','08:30—12:30'],['Сегодня','Павел Соколов','12:30—16:30'],['Сегодня','Михаил Орлов','16:30—20:30'],['Завтра','Дарья Мельник','08:30—12:30']].map(([day, name, time]) => <div className="schedule-row" key={`${day}${name}`}><span className="schedule-day">{day}</span><span className="schedule-name">{name}</span><span className="schedule-time">{time}</span></div>)}</div></section><section className="section card card-pad"><div className="section-head"><div><h2>Передача контекста</h2><small>Чек-лист перед завершением смены</small></div>{handoff && <StatusTag><Check /> Готово</StatusTag>}</div>{[['Очередь очищена от просроченных заявок', true],['Комментарий добавлен к заявке #BK-2841', true],['Следующий оператор ознакомлен с алертами', false]].map(([label, done]) => <div className="settings-row" key={String(label)}><div className="settings-label">{label}</div><span className={`tag ${done ? '' : 'amber'}`}>{done ? 'Готово' : 'Проверить'}</span></div>)}</section></div>;
}

function QualityPage() {
  const [tab, setTab] = useState('Обзор');
  const rows = [['Ткаченко Ольга Игоревна','Анна Кузнецова','98%','Чёткая коммуникация'],['Иванов Пётр Сергеевич','Михаил Орлов','94%','Документ проверен позже SLA'],['Смирнова Анна Викторовна','Анна Кузнецова','100%','Без замечаний'],['Петрова Елена','Дарья Мельник','91%','Нужен комментарий к оплате']];
  return <div className="page"><PageHeader eyebrow="Стандарт обслуживания" title="Контроль качества" subtitle="Выборочная проверка завершённых записей и обратная связь операторам." action={<button className="button primary" onClick={() => alert('Новая проверка добавлена в демо-режиме')} data-testid="button-new-review"><ShieldCheck /> Новая проверка</button>} /><div className="tabs"><button className={`tab ${tab === 'Обзор' ? 'active' : ''}`} onClick={() => setTab('Обзор')}>Обзор</button><button className={`tab ${tab === 'Проверки' ? 'active' : ''}`} onClick={() => setTab('Проверки')}>Проверки <span>24</span></button><button className={`tab ${tab === 'Отклонения' ? 'active' : ''}`} onClick={() => setTab('Отклонения')}>Отклонения <span>3</span></button></div><section className="section metrics"><Metric label="Средняя оценка" value="95,7%" detail="+1,8% к прошлой неделе" tone="teal" /><Metric label="Проверено записей" value="24" detail="из 47 завершённых" tone="blue" /><Metric label="Отклонения" value="3" detail="требуют обратной связи" tone="red" /><Metric label="CSAT клиентов" value="4,8 / 5" detail="84 ответа" tone="amber" /></section><section className="section split"><div className="card table-card"><div className="table-top"><div><h2>{tab === 'Обзор' ? 'Последние проверки' : tab}</h2><small>Оценка по стандарту Booking Ops</small></div><StatusTag>Период: 7 дней</StatusTag></div><div className="table-scroll"><table><thead><tr><th>Клиент</th><th>Оператор</th><th>Оценка</th><th>Комментарий</th></tr></thead><tbody>{rows.map(([client, operator, score, comment]) => <tr key={client}><td className="person-name">{client}</td><td>{operator}</td><td className={score === '91%' ? 'priority-medium' : 'priority-low'}>{score}</td><td className="subtext">{comment}</td></tr>)}</tbody></table></div></div><div className="card card-pad"><div className="section-head"><div><h2>Распределение оценки</h2><small>По критериям проверки</small></div><Sparkles /></div><div className="quality-bars">{[['Точность данных','98%','98%'],['Скорость реакции','93%','93%'],['Тон общения','97%','97%'],['Работа с рисками','91%','91%']].map(([label, value, display]) => <div className="quality-line" key={label}><span>{label}</span><div className="progress"><i style={{ width: value }} /></div><span>{display}</span></div>)}</div><div className="section"><div className="quality-score"><div className="score-ring">95,7</div><div><h3>Стабильный результат</h3><p className="panel-note">Команда выше целевого показателя третью неделю подряд.</p></div></div></div></div></section></div>;
}

function IntegrationsPage() {
  const [states, setStates] = useState<Record<string, boolean>>({ calendar: true, payments: true, mail: true, crm: false });
  const toggle = (key: string) => setStates({ ...states, [key]: !states[key] });
  const integrations = [{ key: 'calendar', code: 'CAL', name: 'Календарь бронирований', desc: 'Синхронизация доступности и подтверждений записей.', last: 'Синхронизировано 2 мин назад' }, { key: 'payments', code: 'PAY', name: 'CloudPayments', desc: 'Проверка статуса оплаты и возвратов в реальном времени.', last: 'Синхронизировано 4 мин назад' }, { key: 'mail', code: 'SMTP', name: 'Почтовый канал', desc: 'Системные письма, подтверждения и уведомления клиентов.', last: 'Синхронизировано 8 мин назад' }, { key: 'crm', code: 'CRM', name: 'CRM компании', desc: 'Передача карточек клиентов в коммерческий контур.', last: 'Подключение не завершено' }];
  return <div className="page"><PageHeader eyebrow="Внешние контуры" title="Интеграции" subtitle="Сервисы, на которые опирается операционная команда. Статус виден до того, как он станет проблемой." action={<button className="button" onClick={() => alert('Все подключения проверены')} data-testid="button-check-integrations"><RefreshCw /> Проверить подключения</button>} /><div className="metrics"><Metric label="Подключений активно" value="3" detail="из 4 настроенных" tone="teal" /><Metric label="Событий сегодня" value="1 284" detail="входящие и исходящие" tone="blue" /><Metric label="Ошибок синхронизации" value="2" detail="повтор отправки запланирован" tone="amber" /><Metric label="Последняя проверка" value="11:57" detail="все каналы проверены" tone="teal" /></div><section className="section integration-grid">{integrations.map((item) => <div className="card integration" key={item.key}><div className="integration-head"><div className="integration-logo">{item.code}</div><button className={`toggle ${states[item.key] ? 'on' : ''}`} onClick={() => toggle(item.key)} aria-label={`Переключить ${item.name}`} data-testid={`toggle-integration-${item.key}`}><i /></button></div><h3>{item.name}</h3><p>{item.desc}</p><div className="integration-footer"><span>{item.last}</span><span className={`health-dot ${states[item.key] ? '' : 'down'}`} /></div></div>)}</section><section className="section card card-pad"><div className="section-head"><div><h2>Последние события интеграций</h2><small>Входящие и исходящие операции</small></div><a className="table-link" href="events.html">Открыть журнал</a></div>{[['11:54','CloudPayments','Платёж подтверждён для #BK-2841','teal'],['11:46','Календарь бронирований','Создан слот для Италии · 14:30','blue'],['11:34','Почтовый канал','Повтор отправки уведомления #NT-392','amber']].map(([time, source, detail, tone]) => <div className="check" key={time}><div><div className="check-name">{source}</div><div className="check-meta">{detail}</div></div><StatusTag tone={tone}>{time}</StatusTag></div>)}</section></div>;
}

function App() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  const page = pageMap[file] || 'dashboard';
  const pages: Record<PageKey, ReactNode> = {
    dashboard: <DashboardPage />, queue: <QueuePage />, customers: <CustomersPage />, monitoring: <MonitoringPage />,
    notifications: <NotificationsPage />, events: <EventsPage />, system: <SystemPage />, settings: <SettingsPage />,
    reports: <ReportsPage />, shifts: <ShiftsPage />, quality: <QualityPage />, integrations: <IntegrationsPage />,
  };
  return <Shell page={page}>{pages[page]}</Shell>;
}

export default App;