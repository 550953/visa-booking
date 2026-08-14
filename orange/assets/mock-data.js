(function () {
  "use strict";

  var COUNTRIES = [
    { code: "ES", name: "Испания" },
    { code: "FR", name: "Франция" },
    { code: "IT", name: "Италия" },
  ];

  var STATUSES = {
    new: { label: "Новый", color: "secondary" },
    auth_required: { label: "Требуется авторизация", color: "orange" },
    authorized: { label: "Авторизован", color: "cyan" },
    monitoring: { label: "Мониторинг", color: "azure" },
    slot_found: { label: "Слот найден", color: "green" },
    booking: { label: "Запись", color: "orange" },
    captcha: { label: "CAPTCHA", color: "orange" },
    payment: { label: "Оплата", color: "orange" },
    payment_error: { label: "Ошибка оплаты", color: "red" },
    video: { label: "Видео", color: "purple" },
    confirmation: { label: "Подтверждение", color: "indigo" },
    booked: { label: "Успешно записан", color: "green" },
    success: { label: "Успешно записан", color: "green" },
    retry: { label: "Повтор", color: "yellow" },
    error: { label: "Ошибка", color: "red" },
    paused: { label: "На паузе", color: "yellow" },
    stopped: { label: "Остановлен", color: "secondary" },
  };

  var CLIENTS = [
    { id: "CL-1042", name: "Иванов Пётр Сергеевич", country: "ES", visaType: "Туристическая", status: "slot_found", priority: "high", lastCheck: "2 мин назад", proxy: "ES-proxy-04", createdAt: "12.08.2026", birthDate: "14.03.1989", phone: "+7 911 555-14-42", email: "p.ivanov@example.com", passport: "7512 438921", passportExpires: "21.04.2032", authState: "Авторизован", video: "video-ivanov.mp4", videoState: "Готово", paymentState: "Заполнены", confirmation: "Ожидает подтверждения", slotDate: "18.08.2026", slotTime: "09:00", slotCenter: "Мадрид" },
    { id: "CL-1041", name: "Смирнова Анна Викторовна", country: "FR", visaType: "Туристическая", status: "captcha", priority: "high", lastCheck: "5 мин назад", proxy: "FR-proxy-11", createdAt: "12.08.2026", birthDate: "22.11.1992", phone: "+7 916 204-72-18", email: "a.smirnova@example.com", passport: "7215 884120", passportExpires: "18.09.2031", authState: "Авторизован", video: "Не требуется", videoState: "Не требуется", paymentState: "Заполнены", confirmation: "—", authError: "CAPTCHA ожидает решения на шаге оплаты", authRecommendation: "Откройте профиль клиента, решите CAPTCHA и нажмите «Продолжить»." },
    { id: "CL-1040", name: "Ковалёв Дмитрий Олегович", country: "ES", visaType: "Деловая", status: "monitoring", priority: "normal", lastCheck: "1 мин назад", proxy: "ES-proxy-02", createdAt: "11.08.2026", birthDate: "07.07.1985", phone: "+7 903 118-33-67", email: "d.kovalev@example.com", passport: "7011 122300", passportExpires: "10.02.2030", authState: "Авторизован", video: "video-kovalev.mp4", videoState: "Готово", paymentState: "Заполнены", confirmation: "—" },
    { id: "CL-1039", name: "Ткаченко Ольга Игоревна", country: "IT", visaType: "Туристическая", status: "payment", priority: "high", lastCheck: "8 мин назад", proxy: "IT-proxy-07", createdAt: "11.08.2026", birthDate: "02.02.1990", phone: "+7 905 443-19-80", email: "o.tkachenko@example.com", passport: "7410 991280", passportExpires: "13.01.2032", authState: "Авторизован", video: "Не требуется", videoState: "Не требуется", paymentState: "Ожидает подтверждения", confirmation: "—", paymentTimeout: "9 минут" },
    { id: "CL-1038", name: "Григорьев Максим Андреевич", country: "ES", visaType: "Туристическая", status: "monitoring", priority: "normal", lastCheck: "3 мин назад", proxy: "ES-proxy-09", createdAt: "10.08.2026", birthDate: "11.10.1988", phone: "+7 926 550-12-01", email: "m.grigoriev@example.com", passport: "7111 294120", passportExpires: "09.06.2033", authState: "Авторизован", video: "video-grigoriev.mp4", videoState: "Готово", paymentState: "Заполнены", confirmation: "—" },
    { id: "CL-1037", name: "Белова Екатерина Дмитриевна", country: "FR", visaType: "Туристическая", status: "booked", priority: "normal", lastCheck: "вчера", proxy: "FR-proxy-03", createdAt: "09.08.2026", birthDate: "19.05.1994", phone: "+7 999 120-45-61", email: "e.belova@example.com", passport: "7515 330921", passportExpires: "17.03.2034", authState: "Авторизован", video: "Не требуется", videoState: "Не требуется", paymentState: "Заполнены", confirmation: "booking-belova.pdf" },
    { id: "CL-1036", name: "Никитин Артём Владимирович", country: "ES", visaType: "Туристическая", status: "error", priority: "normal", lastCheck: "12 мин назад", proxy: "ES-proxy-15", createdAt: "09.08.2026", birthDate: "28.08.1987", phone: "+7 912 088-44-37", email: "a.nikitin@example.com", passport: "7008 440102", passportExpires: "02.11.2029", authState: "Сессия истекла", video: "video-nikitin.mp4", videoState: "Готово", paymentState: "Заполнены", confirmation: "—", authError: "Сессия аккаунта истекла", authRecommendation: "Повторно авторизуйте аккаунт. После успеха клиент вернётся в очередь автоматически." },
    { id: "CL-1035", name: "Морозова Виктория Павловна", country: "IT", visaType: "Студенческая", status: "monitoring", priority: "low", lastCheck: "4 мин назад", proxy: "IT-proxy-02", createdAt: "08.08.2026", birthDate: "30.01.1998", phone: "+7 901 662-20-03", email: "v.morozova@example.com", passport: "7119 552014", passportExpires: "26.10.2032", authState: "Авторизован", video: "Не требуется", videoState: "Не требуется", paymentState: "Заполнены", confirmation: "—" },
    { id: "CL-1034", name: "Соколов Егор Русланович", country: "FR", visaType: "Туристическая", status: "paused", priority: "low", lastCheck: "2 ч назад", proxy: "—", createdAt: "07.08.2026", birthDate: "03.12.1991", phone: "+7 915 701-23-44", email: "e.sokolov@example.com", passport: "7212 660010", passportExpires: "30.08.2030", authState: "Требуется авторизация", video: "Не требуется", videoState: "Не требуется", paymentState: "Не заполнены", confirmation: "—" },
    { id: "CL-1033", name: "Волкова Марина Сергеевна", country: "ES", visaType: "Туристическая", status: "new", priority: "normal", lastCheck: "—", proxy: "—", createdAt: "07.08.2026", birthDate: "16.06.1993", phone: "+7 908 882-18-12", email: "m.volkova@example.com", passport: "7313 128901", passportExpires: "08.12.2031", authState: "Не авторизован", video: "video-volkova.mp4", videoState: "Готово", paymentState: "Не заполнены", confirmation: "—" },
    { id: "CL-1032", name: "Лебедев Игорь Николаевич", country: "IT", visaType: "Деловая", status: "monitoring", priority: "normal", lastCheck: "6 мин назад", proxy: "IT-proxy-04", createdAt: "06.08.2026", birthDate: "24.04.1983", phone: "+7 913 044-77-05", email: "i.lebedev@example.com", passport: "6904 992145", passportExpires: "14.07.2028", authState: "Авторизован", video: "Не требуется", videoState: "Не требуется", paymentState: "Заполнены", confirmation: "—" },
    { id: "CL-1031", name: "Павлова Юлия Андреевна", country: "ES", visaType: "Туристическая", status: "booked", priority: "normal", lastCheck: "2 дня назад", proxy: "ES-proxy-06", createdAt: "05.08.2026", birthDate: "09.09.1990", phone: "+7 925 611-40-09", email: "y.pavlova@example.com", passport: "7419 310044", passportExpires: "01.05.2033", authState: "Авторизован", video: "video-pavlova.mp4", videoState: "Готово", paymentState: "Заполнены", confirmation: "booking-pavlova.pdf" },
  ];

  var EVENTS = [
    { id: "EV-8891", time: "16:24:03", clientId: "CL-1042", client: "Иванов Пётр", country: "ES", type: "slot_found", message: "Найден слот на 18.08 в консульстве Мадрид", level: "action", source: "Spain Monitor", result: "Ожидание", criticality: "Высокая", errorId: "—", ageDays: 0 },
    { id: "EV-8890", time: "16:19:47", clientId: "CL-1041", client: "Смирнова Анна", country: "FR", type: "captcha", message: "Требуется решить CAPTCHA на шаге оплаты", level: "action", source: "Booking Engine", result: "Ожидание", criticality: "Высокая", errorId: "—", ageDays: 0 },
    { id: "EV-8889", time: "16:18:12", clientId: "CL-1039", client: "Ткаченко Ольга", country: "IT", type: "payment", message: "Ожидает подтверждения оплаты, таймаут через 9 мин", level: "action", source: "Booking Engine", result: "Ожидание", criticality: "Высокая", errorId: "—", ageDays: 0 },
    { id: "EV-8888", time: "16:14:55", clientId: "CL-1036", client: "Никитин Артём", country: "ES", type: "error", message: "Ошибка авторизации: сессия истекла", level: "action", source: "Browser Manager", result: "Ошибка", criticality: "Высокая", errorId: "AUTH-401", ageDays: 0 },
    { id: "EV-8888A", time: "16:13:40", clientId: "CL-1036", client: "Никитин Артём", country: "ES", type: "retry", message: "Запущен повтор авторизации после временной ошибки", level: "info", source: "Retry Policy", result: "Ожидание", criticality: "Средняя", errorId: "AUTH-401", ageDays: 0 },
    { id: "EV-8888B", time: "16:12:05", clientId: "CL-1040", client: "Ковалёв Дмитрий", country: "ES", type: "booking_started", message: "Начато заполнение формы записи", level: "info", source: "Booking Engine", result: "Успех", criticality: "Средняя", errorId: "—", ageDays: 0 },
    { id: "EV-8887", time: "16:10:30", clientId: "CL-1040", client: "Ковалёв Дмитрий", country: "ES", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info", source: "Spain Monitor", result: "Успех", criticality: "Низкая", errorId: "—", ageDays: 0 },
    { id: "EV-8886", time: "16:05:02", clientId: "CL-1038", client: "Григорьев Максим", country: "ES", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info", source: "Spain Monitor", result: "Успех", criticality: "Низкая", errorId: "—", ageDays: 1 },
    { id: "EV-8885", time: "15:58:41", clientId: "CL-1032", client: "Лебедев Игорь", country: "IT", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info", source: "Italy Monitor", result: "Успех", criticality: "Низкая", errorId: "—", ageDays: 2 },
    { id: "EV-8884", time: "15:47:19", clientId: "CL-1037", client: "Белова Екатерина", country: "FR", type: "booked", message: "Запись успешно подтверждена на 02.09", level: "success", source: "Booking Engine", result: "Успех", criticality: "Средняя", errorId: "—", ageDays: 1 },
    { id: "EV-8883", time: "15:31:08", clientId: "CL-1034", client: "Соколов Егор", country: "FR", type: "paused", message: "Клиент поставлен на паузу оператором", level: "info", source: "Operator", result: "Успех", criticality: "Средняя", errorId: "—", ageDays: 8 },
    { id: "EV-8882", time: "15:20:44", clientId: "CL-1035", client: "Морозова Виктория", country: "IT", type: "check", message: "Плановая проверка слотов выполнена, свободных нет", level: "info", source: "Italy Monitor", result: "Успех", criticality: "Низкая", errorId: "—", ageDays: 8 },
  ];

  var QUEUE = [
    { pos: 1, clientId: "CL-1042", client: "Иванов Пётр", country: "ES", priority: "high", status: "slot_found", waiting: "0 мин", note: "Слот удерживается 10 минут" },
    { pos: 2, clientId: "CL-1041", client: "Смирнова Анна", country: "FR", priority: "high", status: "captcha", waiting: "3 мин", note: "Нужно действие оператора" },
    { pos: 3, clientId: "CL-1039", client: "Ткаченко Ольга", country: "IT", priority: "high", status: "payment", waiting: "6 мин", note: "Таймаут оплаты через 9 мин" },
    { pos: 4, clientId: "CL-1040", client: "Ковалёв Дмитрий", country: "ES", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 4 мин" },
    { pos: 5, clientId: "CL-1038", client: "Григорьев Максим", country: "ES", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 7 мин" },
    { pos: 6, clientId: "CL-1032", client: "Лебедев Игорь", country: "IT", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 2 мин" },
    { pos: 7, clientId: "CL-1035", client: "Морозова Виктория", country: "IT", priority: "low", status: "monitoring", waiting: "—", note: "Следующая проверка через 11 мин" },
  ];

  var MONITORING = [
    { country: "ES", name: "Испания", healthy: true, lastCheck: "30 сек назад", interval: "каждые 60 сек", activeClients: 5, slotsToday: 1, proxyPool: "12/12 живы" },
    { country: "FR", name: "Франция", healthy: true, lastCheck: "45 сек назад", interval: "каждые 90 сек", activeClients: 3, slotsToday: 0, proxyPool: "8/9 живы" },
    { country: "IT", name: "Италия", healthy: false, lastCheck: "6 мин назад", interval: "каждые 60 сек", activeClients: 4, slotsToday: 0, proxyPool: "5/8 живы" },
  ];

  var NOTIFICATIONS = [
    { id: "N-231", time: "16:24", type: "action", title: "Найден слот — Иванов Пётр", body: "Испания, Мадрид. Слот удерживается 10 минут — нужно подтверждение оператора.", action: "Выбрать слот", read: false },
    { id: "N-230", time: "16:19", type: "action", title: "Требуется CAPTCHA — Смирнова Анна", body: "Автозаполнение остановлено на шаге оплаты, форма ждёт ввода.", action: "Открыть CAPTCHA", read: false },
    { id: "N-229", time: "16:18", type: "action", title: "Ожидает оплату — Ткаченко Ольга", body: "До истечения таймаута брони осталось 9 минут.", action: "Подтвердить оплату", read: false },
    { id: "N-228", time: "16:14", type: "action", title: "Ошибка авторизации — Никитин Артём", body: "Сессия аккаунта истекла, нужна повторная авторизация вручную.", action: "Повторить авторизацию", read: false },
    { id: "N-227", time: "15:47", type: "info", title: "Запись подтверждена — Белова Екатерина", body: "Франция, 02.09. Подтверждение сохранено в карточке клиента.", read: true },
    { id: "N-226", time: "14:52", type: "info", title: "Прокси-пул Италии деградирует", body: "5 из 8 прокси отвечают, health monitor снизил частоту проверок.", read: true },
    { id: "N-225", time: "13:10", type: "info", title: "Плановый бэкап завершён", body: "База данных клиентов и журнал событий сохранены.", read: true },
  ];

  var SERVICES = [
    { name: "Internet", detail: "Доступ к внешним сайтам", status: "ok", heartbeat: "5 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Database", detail: "Клиенты, очереди и журнал", status: "ok", heartbeat: "3 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Telegram", detail: "Канал уведомлений оператора", status: "ok", heartbeat: "20 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Browser Manager", detail: "Управление браузерами", status: "ok", heartbeat: "8 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Proxy Manager", detail: "Пул прокси Италии", status: "warning", heartbeat: "2 мин назад", uptime: "1 дн. 16 ч." },
    { name: "Spain Monitor", detail: "Независимый монитор Испании", status: "ok", heartbeat: "30 сек назад", uptime: "4 дн. 08 ч." },
    { name: "France Monitor", detail: "Независимый монитор Франции", status: "ok", heartbeat: "45 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Italy Monitor", detail: "Независимый монитор Италии", status: "warning", heartbeat: "6 мин назад", uptime: "1 дн. 16 ч." },
    { name: "Task Queue", detail: "Очередь задач записи", status: "ok", heartbeat: "2 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Monitoring Engine", detail: "Проверка визовых центров", status: "ok", heartbeat: "12 сек назад", uptime: "4 дн. 08 ч." },
    { name: "Dashboard Service", detail: "Интерфейс оператора", status: "ok", heartbeat: "4 сек назад", uptime: "4 дн. 08 ч." },
  ];

  function countryName(code) {
    var item = COUNTRIES.find(function (country) { return country.code === code; });
    return item ? item.name : code;
  }

  function statusBadge(statusKey) {
    var status = STATUSES[statusKey] || STATUSES.new;
    return '<span class="badge bg-' + status.color + '-lt text-' + status.color + '">' + status.label + "</span>";
  }

  function priorityBadge(priority) {
    var labels = { high: ["Высокий", "red"], normal: ["Обычный", "orange"], low: ["Низкий", "secondary"] };
    var value = labels[priority] || labels.normal;
    return '<span class="badge bg-' + value[1] + '-lt text-' + value[1] + '">' + value[0] + "</span>";
  }

  function eventBadge(level) {
    var labels = { action: ["Действие", "red"], success: ["Успех", "green"], info: ["Инфо", "secondary"] };
    var value = labels[level] || labels.info;
    return '<span class="badge bg-' + value[1] + '-lt text-' + value[1] + '">' + value[0] + "</span>";
  }

  window.BOP_MOCK = {
    COUNTRIES: COUNTRIES,
    STATUSES: STATUSES,
    CLIENTS: CLIENTS,
    EVENTS: EVENTS,
    QUEUE: QUEUE,
    MONITORING: MONITORING,
    NOTIFICATIONS: NOTIFICATIONS,
    SERVICES: SERVICES,
    countryName: countryName,
    statusBadge: statusBadge,
    priorityBadge: priorityBadge,
    eventBadge: eventBadge,
  };
})();