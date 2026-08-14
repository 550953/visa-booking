/* ===== Booking Ops — единый источник фейковых данных ===== */
window.BOP_MOCK = (function() {

    // -------- Клиенты (8 штук, как во втором варианте) --------
    const CLIENTS = [
        { 
            id: 1, 
            fullName: "Иванов Пётр Сергеевич", 
            country: "Испания", 
            status: "success", 
            createdAt: "2026-07-28",
            birthDate: "1990-04-12", 
            phone: "+7 916 123-45-67", 
            email: "p.ivanov@example.com", 
            visaType: "Туристическая (C)",
            passport: { series: "45 12", number: "334455", issued: "2021-03-10", expires: "2031-03-10" },
            photo: true, 
            video: "video_1.mp4",
            login: "p.ivanov", 
            password: "••••••••", 
            authDate: "2026-08-02 14:12", 
            sessionStatus: "Активна",
            payment: { holder: "PETR IVANOV", card: "•••• •••• •••• 4471", expires: "09/28", status: "Оплачено" },
            history: [
                { time: "2026-08-10 09:14", action: "Запись подтверждена", details: "Консульство Испании" },
                { time: "2026-08-05 11:02", action: "Мониторинг запущен", details: "Поиск слотов" },
                { time: "2026-08-02 14:12", action: "Авторизация", details: "Аккаунт авторизован" },
                { time: "2026-07-28 10:40", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 2, 
            fullName: "Смирнова Анна Викторовна", 
            country: "Франция", 
            status: "monitoring", 
            createdAt: "2026-08-01",
            birthDate: "1988-11-02", 
            phone: "+7 903 555-21-09", 
            email: "a.smirnova@example.com", 
            visaType: "Деловая (C)",
            passport: { series: "46 08", number: "778812", issued: "2020-06-01", expires: "2030-06-01" },
            photo: true, 
            video: "video_2.mp4",
            login: "a.smirnova", 
            password: "••••••••", 
            authDate: "2026-08-03 09:30", 
            sessionStatus: "Активна",
            payment: { holder: "ANNA SMIRNOVA", card: "•••• •••• •••• 9012", expires: "02/27", status: "Оплачено" },
            history: [
                { time: "2026-08-09 16:40", action: "Прокси переключён", details: "Прокси Франции заменён" },
                { time: "2026-08-03 09:30", action: "Авторизация", details: "Аккаунт авторизован" },
                { time: "2026-08-01 12:00", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 3, 
            fullName: "Кузнецов Дмитрий Олегович", 
            country: "Италия", 
            status: "new", 
            createdAt: "2026-08-11",
            birthDate: "1995-02-19", 
            phone: "+7 926 777-10-33", 
            email: "d.kuznetsov@example.com", 
            visaType: "Туристическая (C)",
            passport: { series: "47 01", number: "220156", issued: "2022-01-15", expires: "2032-01-15" },
            photo: false, 
            video: "",
            login: "", 
            password: "", 
            authDate: "", 
            sessionStatus: "Нет сессии",
            payment: { holder: "", card: "", expires: "", status: "Не оплачено" },
            history: [
                { time: "2026-08-11 08:05", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 4, 
            fullName: "Петрова Ольга Игоревна", 
            country: "Испания", 
            status: "authorized", 
            createdAt: "2026-08-06",
            birthDate: "1992-07-30", 
            phone: "+7 977 444-88-21", 
            email: "o.petrova@example.com", 
            visaType: "Учебная (D)",
            passport: { series: "45 99", number: "556677", issued: "2019-09-20", expires: "2029-09-20" },
            photo: true, 
            video: "video_4.mp4",
            login: "o.petrova", 
            password: "••••••••", 
            authDate: "2026-08-07 18:22", 
            sessionStatus: "Активна",
            payment: { holder: "OLGA PETROVA", card: "•••• •••• •••• 3345", expires: "11/26", status: "Оплачено" },
            history: [
                { time: "2026-08-07 18:22", action: "Авторизация", details: "Аккаунт авторизован" },
                { time: "2026-08-06 10:15", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 5, 
            fullName: "Соколов Артём Николаевич", 
            country: "Греция", 
            status: "monitoring", 
            createdAt: "2026-07-20",
            birthDate: "1985-12-05", 
            phone: "+7 915 222-33-44", 
            email: "a.sokolov@example.com", 
            visaType: "Туристическая (C)",
            passport: { series: "44 21", number: "990011", issued: "2018-05-18", expires: "2028-05-18" },
            photo: true, 
            video: "video_5.mp4",
            login: "a.sokolov", 
            password: "••••••••", 
            authDate: "2026-07-22 13:00", 
            sessionStatus: "Активна",
            payment: { holder: "ARTEM SOKOLOV", card: "•••• •••• •••• 6620", expires: "05/27", status: "Оплачено" },
            history: [
                { time: "2026-08-12 07:50", action: "Поиск", details: "Свободный слот не найден" },
                { time: "2026-07-22 13:00", action: "Авторизация", details: "Аккаунт авторизован" },
                { time: "2026-07-20 09:00", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 6, 
            fullName: "Морозова Екатерина Павловна", 
            country: "Португалия", 
            status: "new", 
            createdAt: "2026-08-12",
            birthDate: "1998-03-27", 
            phone: "+7 999 111-22-55", 
            email: "e.morozova@example.com", 
            visaType: "Туристическая (C)",
            passport: { series: "47 55", number: "112233", issued: "2023-02-11", expires: "2033-02-11" },
            photo: false, 
            video: "",
            login: "", 
            password: "", 
            authDate: "", 
            sessionStatus: "Нет сессии",
            payment: { holder: "", card: "", expires: "", status: "Не оплачено" },
            history: [
                { time: "2026-08-12 15:30", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 7, 
            fullName: "Волков Игорь Русланович", 
            country: "Нидерланды", 
            status: "success", 
            createdAt: "2026-07-15",
            birthDate: "1991-06-09", 
            phone: "+7 906 333-99-11", 
            email: "i.volkov@example.com", 
            visaType: "Деловая (C)",
            passport: { series: "45 30", number: "445566", issued: "2020-10-01", expires: "2030-10-01" },
            photo: true, 
            video: "video_7.mp4",
            login: "i.volkov", 
            password: "••••••••", 
            authDate: "2026-07-18 10:10", 
            sessionStatus: "Активна",
            payment: { holder: "IGOR VOLKOV", card: "•••• •••• •••• 7789", expires: "07/28", status: "Оплачено" },
            history: [
                { time: "2026-07-25 12:00", action: "Запись подтверждена", details: "Консульство Нидерландов" },
                { time: "2026-07-18 10:10", action: "Авторизация", details: "Аккаунт авторизован" },
                { time: "2026-07-15 09:40", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        },
        { 
            id: 8, 
            fullName: "Новикова Мария Дмитриевна", 
            country: "Австрия", 
            status: "authorized", 
            createdAt: "2026-08-09",
            birthDate: "1993-09-14", 
            phone: "+7 925 666-77-88", 
            email: "m.novikova@example.com", 
            visaType: "Туристическая (C)",
            passport: { series: "46 77", number: "667788", issued: "2021-11-05", expires: "2031-11-05" },
            photo: true, 
            video: "video_8.mp4",
            login: "m.novikova", 
            password: "••••••••", 
            authDate: "2026-08-10 08:45", 
            sessionStatus: "Активна",
            payment: { holder: "MARIA NOVIKOVA", card: "•••• •••• •••• 5521", expires: "03/27", status: "Оплачено" },
            history: [
                { time: "2026-08-10 08:45", action: "Авторизация", details: "Аккаунт авторизован" },
                { time: "2026-08-09 11:20", action: "Создание", details: "Клиент добавлен в систему" }
            ]
        }
    ];

    // -------- Дополнительные данные для других страниц --------
    const QUEUE = [
        { pos: 1, clientId: 1, client: "Иванов Пётр", country: "Испания", priority: "high", status: "slot_found", waiting: "0 мин", note: "Слот удерживается 10 минут" },
        { pos: 2, clientId: 2, client: "Смирнова Анна", country: "Франция", priority: "high", status: "captcha", waiting: "3 мин", note: "Нужно действие оператора" },
        { pos: 3, clientId: 4, client: "Петрова Ольга", country: "Испания", priority: "normal", status: "monitoring", waiting: "—", note: "Следующая проверка через 4 мин" },
    ];

    const MONITORING = [
        { country: "Испания", healthy: true, lastCheck: "30 сек назад", interval: "каждые 60 сек", activeClients: 3, slotsToday: 1, proxyPool: "12/12 живы" },
        { country: "Франция", healthy: true, lastCheck: "45 сек назад", interval: "каждые 90 сек", activeClients: 1, slotsToday: 0, proxyPool: "8/9 живы" },
        { country: "Италия", healthy: false, lastCheck: "6 мин назад", interval: "каждые 60 сек", activeClients: 1, slotsToday: 0, proxyPool: "5/8 живы" },
    ];

    const EVENTS = [
        { id: "EV-001", time: "16:24:03", client: "Иванов Пётр", country: "Испания", type: "slot_found", message: "Найден слот на 18.08 в консульстве Мадрид", level: "action" },
        { id: "EV-002", time: "16:19:47", client: "Смирнова Анна", country: "Франция", type: "captcha", message: "Требуется решить captcha на шаге оплаты", level: "action" },
        { id: "EV-003", time: "16:14:55", client: "Соколов Артём", country: "Греция", type: "check", message: "Плановая проверка выполнена, свободных нет", level: "info" },
    ];

    const NOTIFICATIONS = [
        { id: "N-001", time: "16:24", type: "action", title: "Найден слот — Иванов Пётр", body: "Испания, Мадрид. Слот удерживается 10 минут — нужно подтверждение оператора.", read: false },
        { id: "N-002", time: "16:19", type: "action", title: "Требуется captcha — Смирнова Анна", body: "Автозаполнение остановлено на шаге оплаты, форма ждёт ввода.", read: false },
        { id: "N-003", time: "15:47", type: "info", title: "Запись подтверждена — Волков Игорь", body: "Нидерланды, 02.09. Подтверждение сохранено.", read: true },
    ];

    // -------- Вспомогательные функции --------
    function statusBadge(status) {
        const map = {
            'new': 'bop-status-new',
            'authorized': 'bop-status-auth', 
            'monitoring': 'bop-status-mon',
            'success': 'bop-status-done'
        };
        const labels = {
            'new': 'Новый',
            'authorized': 'Авторизован',
            'monitoring': 'Мониторинг',
            'success': 'Успешно'
        };
        const cls = map[status] || 'bg-secondary-lt';
        const label = labels[status] || status;
        return `<span class="badge ${cls}">${label}</span>`;
    }

    function countryFlag(country) {
        const flags = {
            "Испания": "🇪🇸", "Франция": "🇫🇷", "Италия": "🇮🇹",
            "Германия": "🇩🇪", "Греция": "🇬🇷", "Португалия": "🇵🇹",
            "Нидерланды": "🇳🇱", "Австрия": "🇦🇹"
        };
        return (flags[country] || "🏳️") + " " + country;
    }

    function priorityBadge(p) {
        if (p === "high") return `<span class="badge bg-red-lt text-red">Высокий</span>`;
        if (p === "low") return `<span class="badge bg-secondary-lt text-secondary">Низкий</span>`;
        return `<span class="badge bg-blue-lt text-blue">Обычный</span>`;
    }

    // -------- Экспорт --------
    return {
        CLIENTS,
        QUEUE,
        MONITORING,
        EVENTS,
        NOTIFICATIONS,
        statusBadge,
        countryFlag,
        priorityBadge
    };

})();
