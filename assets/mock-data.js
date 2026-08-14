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


// Единый источник фейковых данных для Booking Ops (демо, без бэкенда)

const FLAGS = {
  "Италия": "🇮🇹", "Франция": "🇫🇷", "Германия": "🇩🇪", "Испания": "🇪🇸",
  "Греция": "🇬🇷", "Португалия": "🇵🇹", "Нидерланды": "🇳🇱", "Австрия": "🇦🇹"
};

const CLIENTS = [
  { id: 1, fullName: "Иванов Пётр Сергеевич", country: "Италия", status: "success", createdAt: "2026-07-28",
    birthDate: "1990-04-12", phone: "+7 916 123-45-67", email: "p.ivanov@example.com", visaType: "Туристическая (C)",
    passport: { series: "45 12", number: "334455", issued: "2021-03-10", expires: "2031-03-10" },
    photo: true, video: "video_1.mp4",
    login: "p.ivanov", password: "Xk9!mQ2v", authDate: "2026-08-02 14:12", sessionStatus: "Активна",
    payment: { holder: "PETR IVANOV", card: "•••• •••• •••• 4471", expires: "09/28", status: "Оплачено" },
    history: [
      { time: "2026-08-10 09:14", text: "Запись подтверждена консульством" },
      { time: "2026-08-05 11:02", text: "Запущен мониторинг слотов" },
      { time: "2026-08-02 14:12", text: "Аккаунт авторизован" },
      { time: "2026-07-28 10:40", text: "Клиент добавлен в систему" }
    ] },
  { id: 2, fullName: "Смирнова Анна Викторовна", country: "Франция", status: "monitoring", createdAt: "2026-08-01",
    birthDate: "1988-11-02", phone: "+7 903 555-21-09", email: "a.smirnova@example.com", visaType: "Деловая (C)",
    passport: { series: "46 08", number: "778812", issued: "2020-06-01", expires: "2030-06-01" },
    photo: true, video: "video_2.mp4",
    login: "a.smirnova", password: "Ptr!7hZq", authDate: "2026-08-03 09:30", sessionStatus: "Активна",
    payment: { holder: "ANNA SMIRNOVA", card: "•••• •••• •••• 9012", expires: "02/27", status: "Оплачено" },
    history: [
      { time: "2026-08-09 16:40", text: "Прокси Франции переключён (деградация)" },
      { time: "2026-08-03 09:30", text: "Аккаунт авторизован" },
      { time: "2026-08-01 12:00", text: "Клиент добавлен в систему" }
    ] },
  { id: 3, fullName: "Кузнецов Дмитрий Олегович", country: "Германия", status: "new", createdAt: "2026-08-11",
    birthDate: "1995-02-19", phone: "+7 926 777-10-33", email: "d.kuznetsov@example.com", visaType: "Туристическая (C)",
    passport: { series: "47 01", number: "220156", issued: "2022-01-15", expires: "2032-01-15" },
    photo: false, video: "",
    login: "", password: "", authDate: "", sessionStatus: "Нет сессии",
    payment: { holder: "", card: "", expires: "", status: "Не оплачено" },
    history: [
      { time: "2026-08-11 08:05", text: "Клиент добавлен в систему" }
    ] },
  { id: 4, fullName: "Петрова Ольга Игоревна", country: "Испания", status: "authorized", createdAt: "2026-08-06",
    birthDate: "1992-07-30", phone: "+7 977 444-88-21", email: "o.petrova@example.com", visaType: "Учебная (D)",
    passport: { series: "45 99", number: "556677", issued: "2019-09-20", expires: "2029-09-20" },
    photo: true, video: "video_4.mp4",
    login: "o.petrova", password: "Lz4@nRw1", authDate: "2026-08-07 18:22", sessionStatus: "Активна",
    payment: { holder: "OLGA PETROVA", card: "•••• •••• •••• 3345", expires: "11/26", status: "Оплачено" },
    history: [
      { time: "2026-08-07 18:22", text: "Аккаунт авторизован" },
      { time: "2026-08-06 10:15", text: "Клиент добавлен в систему" }
    ] },
  { id: 5, fullName: "Соколов Артём Николаевич", country: "Греция", status: "monitoring", createdAt: "2026-07-20",
    birthDate: "1985-12-05", phone: "+7 915 222-33-44", email: "a.sokolov@example.com", visaType: "Туристическая (C)",
    passport: { series: "44 21", number: "990011", issued: "2018-05-18", expires: "2028-05-18" },
    photo: true, video: "video_5.mp4",
    login: "a.sokolov", password: "Qw3#pLx9", authDate: "2026-07-22 13:00", sessionStatus: "Активна",
    payment: { holder: "ARTEM SOKOLOV", card: "•••• •••• •••• 6620", expires: "05/27", status: "Оплачено" },
    history: [
      { time: "2026-08-12 07:50", text: "Свободный слот не найден, поиск продолжается" },
      { time: "2026-07-22 13:00", text: "Аккаунт авторизован" },
      { time: "2026-07-20 09:00", text: "Клиент добавлен в систему" }
    ] },
  { id: 6, fullName: "Морозова Екатерина Павловна", country: "Португалия", status: "new", createdAt: "2026-08-12",
    birthDate: "1998-03-27", phone: "+7 999 111-22-55", email: "e.morozova@example.com", visaType: "Туристическая (C)",
    passport: { series: "47 55", number: "112233", issued: "2023-02-11", expires: "2033-02-11" },
    photo: false, video: "",
    login: "", password: "", authDate: "", sessionStatus: "Нет сессии",
    payment: { holder: "", card: "", expires: "", status: "Не оплачено" },
    history: [
      { time: "2026-08-12 15:30", text: "Клиент добавлен в систему" }
    ] },
  { id: 7, fullName: "Волков Игорь Русланович", country: "Нидерланды", status: "success", createdAt: "2026-07-15",
    birthDate: "1991-06-09", phone: "+7 906 333-99-11", email: "i.volkov@example.com", visaType: "Деловая (C)",
    passport: { series: "45 30", number: "445566", issued: "2020-10-01", expires: "2030-10-01" },
    photo: true, video: "video_7.mp4",
    login: "i.volkov", password: "Vb8$tYm2", authDate: "2026-07-18 10:10", sessionStatus: "Активна",
    payment: { holder: "IGOR VOLKOV", card: "•••• •••• •••• 7789", expires: "07/28", status: "Оплачено" },
    history: [
      { time: "2026-07-25 12:00", text: "Запись подтверждена консульством" },
      { time: "2026-07-18 10:10", text: "Аккаунт авторизован" },
      { time: "2026-07-15 09:40", text: "Клиент добавлен в систему" }
    ] },
  { id: 8, fullName: "Новикова Мария Дмитриевна", country: "Австрия", status: "authorized", createdAt: "2026-08-09",
    birthDate: "1993-09-14", phone: "+7 925 666-77-88", email: "m.novikova@example.com", visaType: "Туристическая (C)",
    passport: { series: "46 77", number: "667788", issued: "2021-11-05", expires: "2031-11-05" },
    photo: true, video: "video_8.mp4",
    login: "m.novikova", password: "Fr5&kNp0", authDate: "2026-08-10 08:45", sessionStatus: "Активна",
    payment: { holder: "MARIA NOVIKOVA", card: "•••• •••• •••• 5521", expires: "03/27", status: "Оплачено" },
    history: [
      { time: "2026-08-10 08:45", text: "Аккаунт авторизован" },
      { time: "2026-08-09 11:20", text: "Клиент добавлен в систему" }
    ] }
];

const STATUS_META = {
  new:         { label: "Новый",        cls: "bop-status-new" },
  authorized:  { label: "Авторизован",  cls: "bop-status-auth" },
  monitoring:  { label: "Мониторинг",   cls: "bop-status-mon" },
  success:     { label: "Успешно",      cls: "bop-status-done" }
};

function countryFlag(country) {
  return (FLAGS[country] || "🏳️") + " " + country;
}

function statusBadge(status) {
  const m = STATUS_META[status] || { label: status, cls: "bg-secondary-lt text-secondary" };
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}

window.BOP_MOCK = { CLIENTS, STATUS_META, countryFlag, statusBadge, FLAGS };
