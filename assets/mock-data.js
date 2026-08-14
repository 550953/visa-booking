/* ===== Mock Data Source ==========================================
   Единый источник фейковых данных для прототипа.
   В проде это всё будет приходить с Booking Engine API (REST + WS).
   ================================================================= */

window.BOP_MOCK = (function () {

  const COUNTRIES = [
    { code: "ES", name: "Испания", flag: "🇪🇸" },
    { code: "FR", name: "Франция", flag: "🇫🇷" },
    { code: "IT", name: "Италия", flag: "🇮🇹" },
  ];

  const STATUSES = {
    new:        { label: "Новый",           color: "secondary" },
    monitoring: { label: "Мониторинг",      color: "azure" },
    slot_found: { label: "Найден слот",     color: "green" },
    captcha:    { label: "Нужна captcha",   color: "orange" },
    payment:    { label: "Нужна оплата",    color: "orange" },
    booked:     { label: "Записан",         color: "green" },
    error:      { label: "Ошибка",          color: "red" },
    paused:     { label: "На паузе",        color: "yellow" },
    stopped:    { label: "Остановлен",      color: "secondary" },
  };

  const CLIENTS = [
    { id: "CL-1042", name: "Иванов Пётр Сергеевич", country: "ES", status: "slot_found", priority: "high",   lastCheck: "2 мин назад", proxy: "ES-proxy-04", createdAt: "12.08.2026" },
    { id: "CL-1041", name: "Смирнова Анна Викторовна", country: "FR", status: "captcha",  priority: "high",   lastCheck: "5 мин назад", proxy: "FR-proxy-11", createdAt: "12.08.2026" },
    { id: "CL-1040", name: "Ковалёв Дмитрий Олегович", country: "ES", status: "monitoring", priority: "normal", lastCheck: "1 мин назад", proxy: "ES-proxy-02", createdAt: "11.08.2026" },
    { id: "CL-1039", name: "Ткаченко Ольга Игоревна", country: "IT", status: "payment",  priority: "high",   lastCheck: "8 мин назад", proxy: "IT-proxy-07", createdAt: "11.08.2026" },
    { id: "CL-1038", name: "Григорьев Максим Андреевич", country: "ES", status: "monitoring", priority: "normal", lastCheck: "3 мин назад", proxy: "ES-proxy-09", createdAt: "10.08.2026" },
    { id: "CL-1037", name: "Белова Екатерина Дмитриевна", country: "FR", status: "booked",  priority: "normal", lastCheck: "вчера",      proxy: "FR-proxy-03", createdAt: "09.08.2026" },
    { id: "CL-1036", name: "Никитин Артём Владимирович", country: "ES", status: "error",   priority: "normal", lastCheck: "12 мин назад", proxy: "ES-proxy-15", createdAt: "09.08.2026" },
    { id: "CL-1035", name: "Морозова Виктория Павловна", country: "IT", status: "monitoring", priority: "low", lastCheck: "4 мин назад", proxy: "IT-proxy-02", createdAt: "08.08.2026" },
    { id: "CL-1034", name: "Соколов Егор Русланович", country: "FR", status: "paused",  priority: "low",     lastCheck: "2 ч назад",   proxy: "—",           createdAt: "07.08.2026" },
    { id: "CL-1033", name: "Волкова Марина Сергеевна", country: "ES", status: "new",     priority: "normal", lastCheck: "—",           proxy: "—",           createdAt: "07.08.2026" },
    { id: "CL-1032", name: "Лебедев Игорь Николаевич", country: "IT", status: "monitoring", priority: "normal", lastCheck: "6 мин назад", proxy: "IT-proxy-04", createdAt: "06.08.2026" },
    { id: "CL-1031", name: "Павлова Юлия Андреевна", country: "ES", status: "booked",   priority: "normal", lastCheck: "2 дня назад", proxy: "ES-proxy-06", createdAt: "05.08.2026" },
  ];

  const EVENTS = [
    { id: "EV-8891", time: "16:24:03", clientId: "CL-1042", client: "Иванов Пётр", country: "ES", type: "slot_found", message: "Найден слот на 18.08 в консульстве Мадрид", level: "action" },
    { id: "EV-8890", time: "16:19:47", clientId: "CL-1041", client: "Смирнова Анна", country: "FR", type: "captcha", message: "Требуется решить captcha на шаге оплаты", level: "action" },
    { id: "EV-8889", time: "16:18:12", clientId: "CL-1039", client: "Ткаченко Ольга", country: "IT", type: "payment", message: "Ожидает подтверждения оплаты, таймаут через 9 мин", level: "action" },
    { id: "EV-8888", time: "16:14:55", clientId: "CL-1036", client: "Никитин Артём", country: "ES", type: "error", message: "Ошибка авторизации: сессия истекла", level: "action" },
    { id: "EV-8887", time: "16:10:30", clientId: "CL-1040", client: "Ковалёв Дмитрий", country: "ES", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info" },
    { id: "EV-8886", time: "16:05:02", clientId: "CL-1038", client: "Григорьев Максим", country: "ES", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info" },
    { id: "EV-8885", time: "15:58:41", clientId: "CL-1032", client: "Лебедев Игорь", country: "IT", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info" },
    { id: "EV-8884", time: "15:47:19", clientId: "CL-1037", client: "Белова Екатерина", country: "FR", type: "booked", message: "Запись успешно подтверждена на 02.09", level: "success" },
    { id: "EV-8883", time: "15:31:08", clientId: "CL-1034", client: "Соколов Егор", country: "FR", type: "paused", message: "Клиент поставлен на паузу оператором", level: "info" },
    { id: "EV-8882", time: "15:20:44", clientId: "CL-1035", client: "Морозова Виктория", country: "IT", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info" },
  ];

  const QUEUE = [
    { pos: 1, clientId: "CL-1042", client: "Иванов Пётр", country: "ES", priority: "high", status: "slot_found", waiting: "0 мин", note: "Слот удерживается 10 минут" },
    { pos: 2, clientId: "CL-1041", client: "Смирнова Анна", country: "FR", priority: "high", status: "captcha", waiting: "3 мин", note: "Нужно действие оператора" },
    { pos: 3, clientId: "CL-1039", client: "Ткаченко Ольга", country: "IT", priority: "high", status: "payment", waiting: "6 мин", note: "Таймаут оплаты через 9 мин" },
    { pos: 4, clientId: "CL-1040", client: "Ковалёв Дмитрий", country: "ES", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 4 мин" },
    { pos: 5, clientId: "CL-1038", client: "Григорьев Максим", country: "ES", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 7 мин" },
    { pos: 6, clientId: "CL-1032", client: "Лебедев Игорь", country: "IT", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 2 мин" },
    { pos: 7, clientId: "CL-1035", client: "Морозова Виктория", country: "IT", priority: "low", status: "monitoring", waiting: "—", note: "Следующая проверка через 11 мин" },
  ];

  const MONITORING = [
    { country: "ES", name: "Испания", healthy: true,  lastCheck: "30 сек назад", interval: "каждые 60 сек", activeClients: 5, slotsToday: 1,  proxyPool: "12/12 живы" },
    { country: "FR", name: "Франция", healthy: true,  lastCheck: "45 сек назад", interval: "каждые 90 сек", activeClients: 3, slotsToday: 0,  proxyPool: "8/9 живы" },
    { country: "IT", name: "Италия",  healthy: false, lastCheck: "6 мин назад", interval: "каждые 60 сек", activeClients: 4, slotsToday: 0,  proxyPool: "5/8 живы" },
  ];

  const NOTIFICATIONS = [
    { id: "N-231", time: "16:24", type: "action", title: "Найден слот — Иванов Пётр", body: "Испания, Мадрид. Слот удерживается 10 минут — нужно подтверждение оператора.", read: false },
    { id: "N-230", time: "16:19", type: "action", title: "Требуется captcha — Смирнова Анна", body: "Автозаполнение остановлено на шаге оплаты, форма ждёт ввода.", read: false },
    { id: "N-229", time: "16:18", type: "action", title: "Ожидает оплату — Ткаченко Ольга", body: "До истечения таймаута брони осталось 9 минут.", read: false },
    { id: "N-228", time: "16:14", type: "action", title: "Ошибка авторизации — Никитин Артём", body: "Сессия аккаунта истекла, нужна повторная авторизация вручную.", read: false },
    { id: "N-227", time: "15:47", type: "info", title: "Запись подтверждена — Белова Екатерина", body: "Франция, 02.09. Подтверждение сохранено в карточке клиента.", read: true },
    { id: "N-226", time: "14:52", type: "info", title: "Прокси-пул Италии деградирует", body: "5 из 8 прокси отвечают, health monitor снизил частоту проверок.", read: true },
    { id: "N-225", time: "13:10", type: "info", title: "Плановый бэкап завершён", body: "База данных клиентов и журнал событий сохранены.", read: true },
  ];

  function statusBadge(statusKey) {
    const s = STATUSES[statusKey] || STATUSES.new;
    return `<span class="badge bg-${s.color}-lt text-${s.color}">${s.label}</span>`;
  }

  function countryFlag(code) {
    const c = COUNTRIES.find(c => c.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  }

  function priorityBadge(p) {
    if (p === "high") return `<span class="badge bg-red-lt text-red">Высокий</span>`;
    if (p === "low") return `<span class="badge bg-secondary-lt text-secondary">Низкий</span>`;
    return `<span class="badge bg-blue-lt text-blue">Обычный</span>`;
  }

  return { COUNTRIES, STATUSES, CLIENTS, EVENTS, QUEUE, MONITORING, NOTIFICATIONS, statusBadge, countryFlag, priorityBadge };
})();
