(function () {
  "use strict";

  var STORAGE_KEY = "fast-bot-created-applications";
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  function readCreated() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeCreated(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      /* file:// storage can be disabled in some browsers; URL data still works */
    }
  }

  function showToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  function setText(selector, value) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (element) {
      element.textContent = value || "—";
    });
  }

  function getValue(selector) {
    var element = document.querySelector(selector);
    return element ? element.value.trim() : "";
  }

  function formatDate(value) {
    if (!value) return "не выбран";
    var date = new Date(value + "T12:00:00");
    if (Number.isNaN(date.getTime())) return value;
    return date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
  }

  function formatRange(from, to) {
    if (!from || !to) return "не выбран";
    var start = new Date(from + "T12:00:00");
    var end = new Date(to + "T12:00:00");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return from + " – " + to;
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return start.getDate() + "–" + end.getDate() + " " + MONTHS[start.getMonth()] + " " + start.getFullYear();
    }
    return formatDate(from) + " – " + formatDate(to);
  }

  function nextId() {
    var existing = readCreated();
    var max = existing.reduce(function (result, item) {
      var number = Number(String(item.id || "").replace(/\D/g, ""));
      return number > result ? number : result;
    }, 240479);
    return "FB-" + String(max + 1).padStart(6, "0");
  }

  function getQueryData() {
    var query = new URLSearchParams(window.location.search);
    var id = query.get("id");
    var stored = readCreated().find(function (item) { return item.id === id; });
    var seeded = {
      "FB-240318": { id: "FB-240318", country: "Италия", visaType: "Туристическая", name: "Алексей Смирнов", email: "alexey.smirnov@example.com", phone: "+7 999 245-18-62", from: "2026-08-12", to: "2026-08-28", method: "card", amount: 4800, createdAt: "18 марта 2026, 10:42" },
      "FB-240297": { id: "FB-240297", country: "Испания", visaType: "Туристическая", name: "Мария Воронцова", email: "maria@example.com", phone: "+7 999 111-22-33", from: "2026-07-05", to: "2026-07-19", method: "sbp", amount: 2400, createdAt: "сегодня, 09:16" },
      "FB-240251": { id: "FB-240251", country: "Франция", visaType: "Деловая", name: "Дмитрий Крылов", email: "dmitry@example.com", phone: "+7 999 333-44-55", from: "2026-06-01", to: "2026-06-15", method: "invoice", amount: 2400, createdAt: "15 марта 2026, 16:04" },
      "FB-240236": { id: "FB-240236", country: "Италия", visaType: "Студенческая", name: "Софья Нечаева", email: "sofia@example.com", phone: "+7 999 666-77-88", from: "2026-08-20", to: "2026-09-03", method: "card", amount: 2400, createdAt: "10 марта 2026, 19:23" }
    }[id];
    return stored || seeded || {
      id: id || "FB-240480",
      country: query.get("country") || "Италия",
      visaType: query.get("visa") || "Туристическая",
      name: query.get("name") || "1",
      email: query.get("email") || "1@gmail.com",
      phone: query.get("phone") || "1",
      from: query.get("from") || "2026-08-12",
      to: query.get("to") || "2026-08-28",
      method: query.get("method") || "card"
    };
  }

  function methodName(method) {
    return { card: "Банковская карта", sbp: "СБП", invoice: "Счёт для юрлица" }[method] || method || "Банковская карта";
  }

  function openModal(name) {
    var modal = document.querySelector("[data-modal='" + name + "']");
    if (modal) modal.hidden = false;
  }

  function closeModals() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-modal]"), function (modal) {
      modal.hidden = true;
    });
  }

  function setupModals() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-open-modal]"), function (button) {
      button.addEventListener("click", function () {
        openModal(button.getAttribute("data-open-modal"));
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-close-modal]"), function (button) {
      button.addEventListener("click", closeModals);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-modal]"), function (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModals();
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModals();
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-payment-option]"), function (option) {
      option.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("[data-payment-option]"), function (item) {
          item.classList.remove("selected");
        });
        option.classList.add("selected");
        var input = option.querySelector("input");
        if (input) input.checked = true;
      });
    });
    var paymentConfirm = document.querySelector("[data-payment-confirm]");
    if (paymentConfirm) {
      paymentConfirm.addEventListener("click", function () {
        closeModals();
        showToast("Способ оплаты выбран. Деньги пока не списаны.");
      });
    }
    var cancelConfirm = document.querySelector("[data-cancel-confirm]");
    if (cancelConfirm) {
      cancelConfirm.addEventListener("click", function () {
        var app = getQueryData();
        app.status = "cancelled";
        writeCreated(readCreated().map(function (item) { return item.id === app.id ? app : item; }));
        closeModals();
        setText("[data-status-label]", "Отменена");
        showToast("Заявка отменена без оплаты");
      });
    }
  }

  function setupDashboard() {
    var search = document.querySelector("[data-search]");
    var status = document.querySelector("[data-status-filter]");
    var rows = Array.prototype.slice.call(document.querySelectorAll("[data-application-row]"));
    function filterRows() {
      var query = search ? search.value.toLowerCase().trim() : "";
      var selected = status ? status.value : "all";
      rows.forEach(function (row) {
        var haystack = (row.getAttribute("data-search-text") || "").toLowerCase();
        var rowStatus = row.getAttribute("data-row-status") || "";
        row.classList.toggle("hidden-row", !((!query || haystack.indexOf(query) !== -1) && (selected === "all" || selected === rowStatus)));
      });
    }
    if (search) search.addEventListener("input", filterRows);
    if (status) status.addEventListener("change", filterRows);
  }

  function setupConstructor() {
    var step = 1;
    var steps = Array.prototype.slice.call(document.querySelectorAll("[data-step]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-form-step]"));
    var nextButtons = Array.prototype.slice.call(document.querySelectorAll("[data-next-step]"));
    var previousButtons = Array.prototype.slice.call(document.querySelectorAll("[data-prev-step]"));
    if (!steps.length) return;

    function renderStep() {
      steps.forEach(function (item) {
        item.classList.toggle("active", Number(item.getAttribute("data-step")) === step);
      });
      panels.forEach(function (panel) {
        panel.hidden = Number(panel.getAttribute("data-form-step")) !== step;
      });
    }

    function validateStep() {
      var panel = document.querySelector("[data-form-step='" + step + "']");
      if (!panel) return true;
      var required = Array.prototype.slice.call(panel.querySelectorAll("[required]"));
      var invalid = required.find(function (field) { return !field.value.trim(); });
      if (invalid) {
        invalid.focus();
        showToast("Заполните обязательные поля");
        return false;
      }
      return true;
    }

    function createApplication() {
      var country = getValue("[data-field='country']") || "Италия";
      var visaType = getValue("[data-field='visa']") || "Туристическая";
      var name = getValue("[data-field='name']") || "1";
      var email = getValue("[data-field='email']") || "1@gmail.com";
      var phone = getValue("[data-field='phone']") || "1";
      var from = getValue("[data-field='from']") || "2026-08-12";
      var to = getValue("[data-field='to']") || "2026-08-28";
      var method = getValue("[data-field='method']") || "card";
      var application = {
        id: nextId(),
        country: country,
        visaType: visaType,
        name: name,
        email: email,
        phone: phone,
        from: from,
        to: to,
        method: method,
        amount: 2400,
        status: "awaiting_payment",
        createdAt: "только что"
      };
      writeCreated(readCreated().concat(application));
      var query = new URLSearchParams({
        id: application.id,
        country: application.country,
        visa: application.visaType,
        name: application.name,
        email: application.email,
        phone: application.phone,
        from: application.from,
        to: application.to,
        method: application.method
      });
      window.location.href = "../application.html?" + query.toString();
    }

    nextButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!validateStep()) return;
        if (step < 4) {
          step += 1;
          renderStep();
          window.scrollTo(0, 0);
        } else {
          createApplication();
        }
      });
    });
    previousButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (step > 1) {
          step -= 1;
          renderStep();
          window.scrollTo(0, 0);
        } else {
          window.location.href = "../index.html";
        }
      });
    });
    renderStep();
  }

  function setupSettings() {
    var form = document.querySelector("[data-settings-form]");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        showToast("Изменения сохранены в этом браузере");
      });
    }
  }

  function renderApplication() {
    if (!document.querySelector("[data-application-page]")) return;
    var app = getQueryData();
    setText("[data-application-id]", app.id);
    setText("[data-status-label]", app.status === "cancelled" ? "Отменена" : "Ожидает оплаты");
    setText("[data-application-meta]", app.country + " · " + app.visaType + " · создана " + (app.createdAt || "только что"));
    setText("[data-application-country]", app.country);
    setText("[data-application-visa]", app.visaType);
    setText("[data-method-label]", methodName(app.method));
    setText("[data-applicant-name]", app.name);
    setText("[data-applicant-email]", app.email);
    setText("[data-applicant-phone]", app.phone);
    setText("[data-date-range]", formatRange(app.from, app.to));
    setText("[data-payment-amount]", (app.amount || 2400).toLocaleString("ru-RU") + " ₽");
    setText("[data-timeline-date]", app.createdAt || "только что");
  }

  /* =====================================================================
     Анкета заявителя (визовая форма, 61 поле)
  ===================================================================== */
  function setupAnketa() {
    var root = document.querySelector("[data-anketa-page]");
    if (!root) return;

    var COUNTRIES = [
    ["СССР","USSR"],["Австралия","Australia"],["Австрия","Austria"],["Азербайджан","Azerbaijan"],
    ["Албания","Albania"],["Алжир","Algeria"],["Ангола","Angola"],["Андорра","Andorra"],
    ["Антигуа и Барбуда","Antigua and Barbuda"],["Аргентина","Argentina"],["Армения","Armenia"],
    ["Афганистан","Afghanistan"],["Багамы","Bahamas"],["Бангладеш","Bangladesh"],["Барбадос","Barbados"],
    ["Бахрейн","Bahrain"],["Беларусь","Belarus"],["Белиз","Belize"],["Бельгия","Belgium"],["Бенин","Benin"],
    ["Болгария","Bulgaria"],["Боливия","Bolivia"],["Босния и Герцеговина","Bosnia and Herzegovina"],
    ["Ботсвана","Botswana"],["Бразилия","Brazil"],["Бруней","Brunei"],["Буркина-Фасо","Burkina Faso"],
    ["Бурунди","Burundi"],["Бутан","Bhutan"],["Вануату","Vanuatu"],["Ватикан","Vatican City"],
    ["Великобритания","United Kingdom"],["Венгрия","Hungary"],["Венесуэла","Venezuela"],["Вьетнам","Vietnam"],
    ["Габон","Gabon"],["Гаити","Haiti"],["Гайана","Guyana"],["Гамбия","Gambia"],["Гана","Ghana"],
    ["Гватемала","Guatemala"],["Гвинея","Guinea"],["Гвинея-Бисау","Guinea-Bissau"],["Германия","Germany"],
    ["Гондурас","Honduras"],["Гренада","Grenada"],["Греция","Greece"],["Грузия","Georgia"],["Дания","Denmark"],
    ["Джибути","Djibouti"],["Доминика","Dominica"],["Доминиканская Республика","Dominican Republic"],
    ["Египет","Egypt"],["Замбия","Zambia"],["Зимбабве","Zimbabwe"],["Израиль","Israel"],["Индия","India"],
    ["Индонезия","Indonesia"],["Иордания","Jordan"],["Ирак","Iraq"],["Иран","Iran"],["Ирландия","Ireland"],
    ["Исландия","Iceland"],["Испания","Spain"],["Италия","Italy"],["Йемен","Yemen"],["Кабо-Верде","Cabo Verde"],
    ["Казахстан","Kazakhstan"],["Камбоджа","Cambodia"],["Камерун","Cameroon"],["Канада","Canada"],
    ["Катар","Qatar"],["Кения","Kenya"],["Кипр","Cyprus"],["Киргизия","Kyrgyzstan"],["Кирибати","Kiribati"],
    ["Китай","China"],["Колумбия","Colombia"],["Коморы","Comoros"],["Демократическая Республика Конго","Democratic Republic of the Congo"],
    ["Республика Конго","Republic of the Congo"],["Северная Корея","North Korea"],["Южная Корея","South Korea"],
    ["Косово","Kosovo"],["Коста-Рика","Costa Rica"],["Кот-д'Ивуар","Cote d'Ivoire"],["Куба","Cuba"],
    ["Кувейт","Kuwait"],["Лаос","Laos"],["Латвия","Latvia"],["Лесото","Lesotho"],["Либерия","Liberia"],
    ["Ливан","Lebanon"],["Ливия","Libya"],["Литва","Lithuania"],["Лихтенштейн","Liechtenstein"],
    ["Люксембург","Luxembourg"],["Маврикий","Mauritius"],["Мавритания","Mauritania"],["Мадагаскар","Madagascar"],
    ["Малави","Malawi"],["Малайзия","Malaysia"],["Мали","Mali"],["Мальдивы","Maldives"],["Мальта","Malta"],
    ["Марокко","Morocco"],["Маршалловы острова","Marshall Islands"],["Мексика","Mexico"],
    ["Мозамбик","Mozambique"],["Молдова","Moldova"],["Монако","Monaco"],["Монголия","Mongolia"],
    ["Мьянма","Myanmar"],["Намибия","Namibia"],["Науру","Nauru"],["Непал","Nepal"],["Нигер","Niger"],
    ["Нигерия","Nigeria"],["Нидерланды","Netherlands"],["Никарагуа","Nicaragua"],["Новая Зеландия","New Zealand"],
    ["Норвегия","Norway"],["ОАЭ","United Arab Emirates"],["Оман","Oman"],["Пакистан","Pakistan"],
    ["Палау","Palau"],["Палестина","Palestine"],["Панама","Panama"],["Папуа — Новая Гвинея","Papua New Guinea"],
    ["Парагвай","Paraguay"],["Перу","Peru"],["Польша","Poland"],["Португалия","Portugal"],
    ["Россия / Российская Федерация","Russian Federation"],["Руанда","Rwanda"],["Румыния","Romania"],
    ["Сальвадор","El Salvador"],["Самоа","Samoa"],["Сан-Марино","San Marino"],
    ["Сан-Томе и Принсипи","Sao Tome and Principe"],["Саудовская Аравия","Saudi Arabia"],
    ["Свазиленд (Эсватини)","Eswatini"],["Северная Македония","North Macedonia"],["Сенегал","Senegal"],
    ["Сент-Винсент и Гренадины","Saint Vincent and the Grenadines"],["Сент-Китс и Невис","Saint Kitts and Nevis"],
    ["Сент-Люсия","Saint Lucia"],["Сербия","Serbia"],["Сейшелы","Seychelles"],["Сингапур","Singapore"],
    ["Сирия","Syria"],["Словакия","Slovakia"],["Словения","Slovenia"],["Соломоновы острова","Solomon Islands"],
    ["Сомали","Somalia"],["Судан","Sudan"],["Южный Судан","South Sudan"],["США","United States"],
    ["Сьерра-Леоне","Sierra Leone"],["Таджикистан","Tajikistan"],["Таиланд","Thailand"],["Тайвань","Taiwan"],
    ["Танзания","Tanzania"],["Того","Togo"],["Тонга","Tonga"],["Тринидад и Тобаго","Trinidad and Tobago"],
    ["Тувалу","Tuvalu"],["Тунис","Tunisia"],["Туркменистан","Turkmenistan"],["Турция","Turkey"],
    ["Уганда","Uganda"],["Узбекистан","Uzbekistan"],["Украина","Ukraine"],["Уругвай","Uruguay"],["Фиджи","Fiji"],
    ["Филиппины","Philippines"],["Финляндия","Finland"],["Франция","France"],["Хорватия","Croatia"],
    ["ЦАР","Central African Republic"],["Чад","Chad"],["Черногория","Montenegro"],["Чехия","Czechia"],
    ["Чили","Chile"],["Швейцария","Switzerland"],["Швеция","Sweden"],["Шри-Ланка","Sri Lanka"],
    ["Эквадор","Ecuador"],["Экваториальная Гвинея","Equatorial Guinea"],["Эритрея","Eritrea"],
    ["Эстония","Estonia"],["Эфиопия","Ethiopia"],["ЮАР","South Africa"],["Ямайка","Jamaica"],["Япония","Japan"]
    ].sort(function (a, b) { return a[0].localeCompare(b[0], "ru"); });

    var SCHENGEN = [
    ["Австрия","Austria"],["Бельгия","Belgium"],["Болгария","Bulgaria"],["Венгрия","Hungary"],
    ["Германия","Germany"],["Греция","Greece"],["Дания","Denmark"],["Исландия","Iceland"],
    ["Испания","Spain"],["Италия","Italy"],["Латвия","Latvia"],["Литва","Lithuania"],
    ["Лихтенштейн","Liechtenstein"],["Люксембург","Luxembourg"],["Мальта","Malta"],["Нидерланды","Netherlands"],
    ["Норвегия","Norway"],["Польша","Poland"],["Португалия","Portugal"],["Румыния","Romania"],
    ["Словакия","Slovakia"],["Словения","Slovenia"],["Финляндия","Finland"],["Франция","France"],
    ["Хорватия","Croatia"],["Чехия","Czechia"],["Швейцария","Switzerland"],["Швеция","Sweden"],["Эстония","Estonia"]
    ].sort(function (a, b) { return a[0].localeCompare(b[0], "ru"); });

    var ENUMS = {
      gender: [["Мужской","Male"],["Женский","Female"]],
      marital: [["Не в браке","Single"],["Женат / замужем","Married"],["Раздельное проживание","Separated"],
                ["Разведён(а)","Divorced"],["Вдовец / вдова","Widowed"],["Зарегистрированное партнёрство","Registered Partnership"]],
      passportType: [["Обычный паспорт","Ordinary Passport"],["Дипломатический паспорт","Diplomatic Passport"],
                ["Служебный паспорт","Service Passport"],["Официальный паспорт","Official Passport"],
                ["Специальный паспорт","Special Passport"],["Иной проездной документ","Other Travel Document"]],
      entries: [["Однократный въезд","Single Entry"],["Двукратный въезд","Two Entries"],["Многократный въезд","Multiple Entry"]],
      purpose: [["Туризм","Tourism"],["Бизнес","Business"],["Визит к родственникам/друзьям","Visiting family or friends"],
                ["Культурная поездка","Cultural"],["Спорт","Sports"],["Официальный визит","Official visit"],
                ["Лечение","Medical reasons"],["Учёба","Study"],["Транзит в аэропорту","Airport transit"]],
      cost: [["Оплачивает сам заявитель","By Applicant"],["Оплачивает спонсор (принимающая сторона)","By a Sponsor"],
                ["Оплачивает приглашающее лицо","By an Inviting Person"]],
      support: [["Наличные","Cash"],["Банковская карта","Credit Card"],["Оплаченное проживание","Prepaid Accommodation"],
                ["Оплаченный проезд","Prepaid Transport"],["Все расходы покрыты","All expenses covered"]],
      relation: [["Супруг(а)","Spouse"],["Ребёнок","Child"],["Внук / внучка","Grandchild"],["Родитель","Parent"],["Дед / бабушка","Grandparent"]]
    };

    function T(key, label, opts) {
      opts = opts || {};
      return {
        key: key, label: label, type: opts.type || "text", required: !!opts.required,
        latin: !!opts.latin, tel: !!opts.tel, email: !!opts.email, hint: opts.hint || "",
        options: opts.options || null, group: opts.group, placeholder: opts.placeholder || ""
      };
    }

    var FIELDS = [
      T("FirstName","Имя (как в загранпаспорте)",{required:true,latin:true,group:"g1",placeholder:"IVAN"}),
      T("SurName","Фамилия (текущая)",{required:true,latin:true,group:"g1",placeholder:"IVANOV"}),
      T("SurnameAtBirth","Фамилия при рождении",{required:true,latin:true,group:"g1",hint:"Если не менялась — продублируйте текущую фамилию",placeholder:"IVANOV"}),
      T("LastName","Второе поле фамилии (если анкета его требует)",{required:false,latin:true,group:"g1",hint:"Необязательно; обычно совпадает с фамилией"}),
      T("DateOfBirth","Дата рождения",{required:true,type:"date",group:"g1"}),
      T("PlaceOfBirth","Место рождения (город)",{required:true,latin:true,group:"g1",placeholder:"MOSCOW"}),
      T("CountryOfBirthId","Страна рождения",{required:true,type:"select-country",group:"g1"}),
      T("NationalityId","Гражданство (текущее)",{required:true,type:"select-country",group:"g1"}),
      T("NationalityAtBirthId","Гражданство при рождении",{required:true,type:"select-country",group:"g1"}),
      T("GenderId","Пол",{required:true,type:"select-enum",options:ENUMS.gender,group:"g1"}),
      T("MaritalStatusId","Семейное положение",{required:true,type:"select-enum",options:ENUMS.marital,group:"g1"}),

      T("NationalIdentityNumber","Номер национального ID (если есть)",{required:false,group:"g2",hint:"Оставьте пустым, если не применимо"}),
      T("PassportType","Тип паспорта",{required:true,type:"select-enum",options:ENUMS.passportType,group:"g2"}),
      T("PassportNo","Номер загранпаспорта",{required:true,latin:true,group:"g2",placeholder:"766250892"}),
      T("IssueDate","Дата выдачи паспорта",{required:true,type:"date",group:"g2"}),
      T("ExpiryDate","Дата окончания срока действия",{required:true,type:"date",group:"g2"}),
      T("IssuePlace","Кем/где выдан (место выдачи)",{required:true,latin:true,group:"g2",placeholder:"RUSSIAN FEDERATION"}),
      T("IssueCountryId","Страна выдачи паспорта",{required:true,type:"select-country",group:"g2"}),
      T("TravelDate","Дата поездки",{required:true,type:"date",group:"g2",hint:"Обычно совпадает с датой прибытия"}),

      T("HomeAddressLine1","Адрес проживания, строка 1",{required:true,latin:true,group:"g3",placeholder:"ARBAT STREET 12"}),
      T("HomeAddressLine2","Адрес проживания, строка 2",{required:false,latin:true,group:"g3",hint:"Квартира/офис — необязательно"}),
      T("HomeAddressCountryId","Страна проживания",{required:true,type:"select-country",group:"g3"}),
      T("HomeAddressCity","Город проживания",{required:true,latin:true,group:"g3",placeholder:"MOSCOW"}),
      T("HomeAddressPostalCode","Почтовый индекс",{required:true,group:"g3",placeholder:"101000"}),
      T("HomeAddressContactNumber","Контактный телефон",{required:true,tel:true,group:"g3",hint:"Код страны без «+», только цифры",placeholder:"79991234567"}),

      T("EmployerName","Название работодателя",{required:true,latin:true,group:"g4"}),
      T("EmployerPhone","Телефон работодателя",{required:true,tel:true,group:"g4",hint:"Код страны без «+», только цифры"}),
      T("EmployerAddress","Адрес работодателя",{required:true,latin:true,group:"g4"}),
      T("CurrentOccupationId","Должность / род занятий",{required:true,latin:true,group:"g4",placeholder:"MANAGER"}),

      T("PurposeOfJourneyId","Цель поездки",{required:true,type:"select-enum",options:ENUMS.purpose,group:"g5"}),
      T("MemberStateDestinationId","Страна назначения",{required:true,type:"select-schengen",group:"g5"}),
      T("MemberStateSecondDestinationId","Вторая страна назначения",{required:false,type:"select-schengen",group:"g5"}),
      T("MemberStateFirstEntryId","Страна первого въезда",{required:true,type:"select-schengen",group:"g5"}),
      T("NumberOfEntriesRequested","Количество запрашиваемых въездов",{required:true,type:"select-enum",options:ENUMS.entries,group:"g5"}),
      T("IntendedStayDuration","Продолжительность пребывания, дней",{required:true,type:"number",group:"g5"}),
      T("IntendedDateOfArrival","Предполагаемая дата прибытия",{required:true,type:"date",group:"g5"}),
      T("IntendedDateOfDeparture","Предполагаемая дата выезда",{required:true,type:"date",group:"g5"}),
      T("FinalDestinationIssuedByCountryId","Страна выдачи разрешения на въезд в конечную страну (транзит)",{required:false,type:"select-country",group:"g5",hint:"Заполняется только при транзите в третью страну"}),

      T("InvitingAuthorityName","Название отеля / организации",{required:true,latin:true,group:"g6"}),
      T("InvitingCountryId","Страна",{required:true,type:"select-country",group:"g6"}),
      T("InvitingCity","Город",{required:true,latin:true,group:"g6"}),
      T("InvitingZipCode","Почтовый индекс",{required:true,group:"g6"}),
      T("InvitingAddress","Адрес",{required:true,latin:true,group:"g6"}),
      T("InvitingEmail","Email",{required:true,email:true,group:"g6"}),
      T("InvitingContactNo","Телефон",{required:true,tel:true,group:"g6",hint:"Код страны без «+», только цифры"}),

      T("InvitingContactName","Имя контактного лица",{required:true,latin:true,group:"g7"}),
      T("InvitingContactSurname","Фамилия контактного лица",{required:true,latin:true,group:"g7"}),
      T("InvitingContactCountryId","Страна",{required:true,type:"select-country",group:"g7"}),
      T("InvitingContactCity","Город",{required:true,latin:true,group:"g7"}),
      T("InvitingContactZipCode","Почтовый индекс",{required:true,group:"g7"}),
      T("InvitingContactAddress","Адрес",{required:true,latin:true,group:"g7"}),
      T("InvitingContactEmail","Email",{required:true,email:true,group:"g7"}),
      T("InvitingContactContactNo","Телефон",{required:true,tel:true,group:"g7",hint:"Код страны без «+», только цифры"}),

      T("CostCoveredById","Кто оплачивает расходы",{required:true,type:"select-enum",options:ENUMS.cost,group:"g8"}),
      T("MeansOfSupportId","Средства к существованию",{required:true,type:"select-enum",options:ENUMS.support,group:"g8"}),

      T("OtherCitizenSurname","Фамилия родственника",{required:false,latin:true,group:"g9"}),
      T("OtherCitizenFirstName","Имя родственника",{required:false,latin:true,group:"g9"}),
      T("OtherCitizenDateOfBirth","Дата рождения родственника",{required:false,type:"date",group:"g9"}),
      T("OtherCitizenDocumentNumber","Номер документа родственника",{required:false,latin:true,group:"g9"}),
      T("OtherCitizenNationalityId","Гражданство родственника",{required:false,type:"select-country",group:"g9"}),
      T("OtherCitizenFamilyRelationshipId","Степень родства",{required:false,type:"select-enum",options:ENUMS.relation,group:"g9"})
    ];

    var KEY_ORDER = FIELDS.map(function (f) { return f.key; });

    var GROUPS = [
      {id:"g1", num:"01", title:"Личные данные заявителя", sub:"Как в загранпаспорте — латиницей."},
      {id:"g2", num:"02", title:"Паспорт", sub:""},
      {id:"g3", num:"03", title:"Адрес и контакты", sub:""},
      {id:"g4", num:"04", title:"Работодатель", sub:"Для студентов — учебное заведение."},
      {id:"g5", num:"05", title:"Поездка", sub:""},
      {id:"g6", num:"06", title:"Принимающая сторона", sub:"Отель или приглашающая организация."},
      {id:"g7", num:"07", title:"Контактное лицо принимающей стороны", sub:""},
      {id:"g8", num:"08", title:"Финансирование поездки", sub:""},
      {id:"g9", num:"09", title:"Сопровождающий родственник — гражданин ЕС/ЕЭЗ/Швейцарии", sub:"Заполняйте, только если это применимо к вашей поездке.", optional:true}
    ];

    var groupsRoot = document.getElementById("anketaGroups");
    var LATIN_RE = /^[A-Za-z0-9 .,'\-\/№()]*$/;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function buildSelectOptions(sel, pairs) {
      var d = document.createElement("option");
      d.value = ""; d.textContent = "— выбрать —";
      sel.appendChild(d);
      pairs.forEach(function (p) {
        var o = document.createElement("option");
        o.value = p[1]; o.textContent = p[0] + " — " + p[1];
        sel.appendChild(o);
      });
      var oo = document.createElement("option");
      oo.value = "__OTHER__"; oo.textContent = "Другое (указать вручную)";
      sel.appendChild(oo);
    }

    function renderField(f) {
      var wrap = document.createElement("div");
      wrap.className = "field";
      wrap.id = "field-" + f.key;

      var label = document.createElement("label");
      label.setAttribute("for", f.key);
      label.textContent = f.label;
      if (f.required) {
        var star = document.createElement("span");
        star.className = "req"; star.textContent = "*";
        label.appendChild(star);
      }
      wrap.appendChild(label);

      var input;
      if (f.type === "select-country" || f.type === "select-schengen" || f.type === "select-enum") {
        input = document.createElement("select");
        input.className = "form-control"; input.id = f.key; input.name = f.key;
        var pairs = f.type === "select-country" ? COUNTRIES : (f.type === "select-schengen" ? SCHENGEN : f.options);
        buildSelectOptions(input, pairs);
        wrap.appendChild(input);

        var other = document.createElement("input");
        other.type = "text"; other.className = "form-control other-input"; other.id = f.key + "_other";
        other.placeholder = "Введите точное значение (на английском)";
        wrap.appendChild(other);

        input.addEventListener("change", function () {
          other.classList.toggle("show", input.value === "__OTHER__");
          clearFieldError(f.key); updateProgress(); scheduleSave();
        });
        other.addEventListener("input", function () { clearFieldError(f.key); updateProgress(); scheduleSave(); });
      } else if (f.type === "date") {
        input = document.createElement("input");
        input.type = "date"; input.className = "form-control"; input.id = f.key; input.name = f.key;
        wrap.appendChild(input);
        input.addEventListener("input", function () { clearFieldError(f.key); updateProgress(); scheduleSave(); });
      } else if (f.type === "number") {
        input = document.createElement("input");
        input.type = "number"; input.min = "1"; input.className = "form-control"; input.id = f.key; input.name = f.key;
        wrap.appendChild(input);
        input.addEventListener("input", function () { clearFieldError(f.key); updateProgress(); scheduleSave(); });
      } else {
        input = document.createElement("input");
        input.type = f.email ? "email" : (f.tel ? "tel" : "text");
        input.className = "form-control"; input.id = f.key; input.name = f.key;
        if (f.placeholder) input.placeholder = f.placeholder;
        if (f.tel) {
          input.addEventListener("blur", function () { input.value = input.value.replace(/[^0-9]/g, ""); });
        }
        if (f.latin) {
          input.addEventListener("blur", function () { if (input.value) input.value = input.value.toUpperCase(); });
        }
        input.addEventListener("input", function () { clearFieldError(f.key); updateProgress(); scheduleSave(); });
        wrap.appendChild(input);
      }

      if (f.hint) {
        var h = document.createElement("div");
        h.className = "field-hint"; h.textContent = f.hint;
        wrap.appendChild(h);
      }
      var em = document.createElement("div");
      em.className = "field-error"; em.id = "err-" + f.key;
      wrap.appendChild(em);

      return wrap;
    }

    GROUPS.forEach(function (g) {
      var sec = document.createElement("section");
      sec.className = "card group-card" + (g.optional ? " optional" : "");
      sec.id = "sec-" + g.id;

      var head = document.createElement("div");
      head.className = "section-head";
      head.innerHTML = "<span class=\"group-num\">" + g.num + "</span><div><h2>" + g.title + "</h2>" + (g.sub ? "<p>" + g.sub + "</p>" : "") + "</div>";
      sec.appendChild(head);

      var body = document.createElement("div");
      body.className = "card-body";
      var grid = document.createElement("div");
      grid.className = "form-grid"; grid.id = "grid-" + g.id;

      if (g.optional) {
        var toggleWrap = document.createElement("label");
        toggleWrap.className = "group-toggle";
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.id = "toggle-" + g.id;
        toggleWrap.appendChild(cb);
        toggleWrap.appendChild(document.createTextNode("Добавить данные о сопровождающем родственнике"));
        body.appendChild(toggleWrap);
        grid.style.display = "none";
        cb.addEventListener("change", function () { grid.style.display = cb.checked ? "" : "none"; updateProgress(); scheduleSave(); });
      }

      FIELDS.filter(function (f) { return f.group === g.id; }).forEach(function (f) { grid.appendChild(renderField(f)); });
      body.appendChild(grid);
      sec.appendChild(body);
      groupsRoot.appendChild(sec);
    });

    function clearFieldError(key) {
      var f = document.getElementById("field-" + key);
      if (f) f.classList.remove("has-error");
    }

    function fieldGroupVisible(f) {
      var g = GROUPS.filter(function (x) { return x.id === f.group; })[0];
      if (!g || !g.optional) return true;
      var cb = document.getElementById("toggle-" + g.id);
      return cb && cb.checked;
    }

    function getRawValue(f) {
      var el = document.getElementById(f.key);
      if (!el) return "";
      if (el.tagName === "SELECT") {
        if (el.value === "__OTHER__") {
          var o = document.getElementById(f.key + "_other");
          return o ? o.value.trim() : "";
        }
        return el.value;
      }
      return el.value.trim();
    }

    function validateAll() {
      var errors = []; var values = {};
      FIELDS.forEach(function (f) {
        var visible = fieldGroupVisible(f);
        var v = visible ? getRawValue(f) : "";
        values[f.key] = v;
        if (!visible) return;
        if (f.required && !v) { errors.push({ key: f.key, msg: f.label + " — обязательное поле" }); return; }
        if (!v) return;
        if (f.latin && !LATIN_RE.test(v)) errors.push({ key: f.key, msg: f.label + " — нужна латиница" });
        if (f.email && !EMAIL_RE.test(v)) errors.push({ key: f.key, msg: f.label + " — некорректный email" });
        if (f.tel && !/^[0-9]{5,15}$/.test(v)) errors.push({ key: f.key, msg: f.label + " — только цифры, код страны без «+» (5–15 цифр)" });
        if (f.type === "number") {
          var n = parseInt(v, 10);
          if (isNaN(n) || n < 1) errors.push({ key: f.key, msg: f.label + " — укажите число дней (больше 0)" });
        }
      });

      function d(key) { var v = values[key]; return v ? new Date(v + "T00:00:00") : null; }
      var dob = d("DateOfBirth");
      if (dob && dob.getTime() > Date.now()) errors.push({ key: "DateOfBirth", msg: "Дата рождения не может быть в будущем" });
      var iss = d("IssueDate"), exp = d("ExpiryDate");
      if (iss && exp && exp.getTime() <= iss.getTime()) errors.push({ key: "ExpiryDate", msg: "Дата окончания срока действия должна быть позже даты выдачи" });
      var arr = d("IntendedDateOfArrival"), dep = d("IntendedDateOfDeparture");
      if (arr && dep && dep.getTime() <= arr.getTime()) errors.push({ key: "IntendedDateOfDeparture", msg: "Дата выезда должна быть позже даты прибытия" });

      return { errors: errors, values: values };
    }

    function updateProgress() {
      var total = 0, done = 0;
      FIELDS.forEach(function (f) { if (!f.required) return; total++; if (getRawValue(f)) done++; });
      var pct = total ? Math.round((done / total) * 100) : 0;
      document.getElementById("progressFill").style.width = pct + "%";
      document.getElementById("progressLabel").textContent = done + " / " + total + " обязательных полей";
    }

    function buildOutput() {
      var res = validateAll();
      var panel = document.getElementById("errorPanel");
      var list = document.getElementById("errorList");
      document.getElementById("resultPanel").style.display = "none";
      Array.prototype.forEach.call(document.querySelectorAll(".field.has-error"), function (el) { el.classList.remove("has-error"); });

      if (res.errors.length) {
        panel.style.display = "block";
        document.getElementById("errorTitle").textContent = "Не заполнено или некорректно: " + res.errors.length;
        list.innerHTML = "";
        res.errors.forEach(function (e) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "#field-" + e.key; a.textContent = e.msg;
          a.addEventListener("click", function (ev) {
            ev.preventDefault();
            var el = document.getElementById("field-" + e.key);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          });
          li.appendChild(a); list.appendChild(li);
          var fieldEl = document.getElementById("field-" + e.key);
          if (fieldEl) fieldEl.classList.add("has-error");
        });
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      panel.style.display = "none";
      var out = {};
      KEY_ORDER.forEach(function (k) { out[k] = res.values[k] || ""; });
      var jsonStr = JSON.stringify(out, null, 2);
      document.getElementById("jsonOut").textContent = jsonStr;
      document.getElementById("resultPanel").style.display = "block";
      document.getElementById("resultPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      window.__lastAnketaJson = jsonStr;
      showToast("JSON сформирован");
    }

    document.getElementById("buildBtn").addEventListener("click", buildOutput);

    document.getElementById("copyJsonBtn").addEventListener("click", function () {
      var txt = window.__lastAnketaJson || document.getElementById("jsonOut").textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { showToast("Скопировано"); }).catch(function () { showToast("Не удалось скопировать"); });
      } else {
        try {
          var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta);
          ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
          showToast("Скопировано");
        } catch (e) { showToast("Не удалось скопировать"); }
      }
    });

    document.getElementById("downloadJsonBtn").addEventListener("click", function () {
      var txt = window.__lastAnketaJson || document.getElementById("jsonOut").textContent;
      var blob = new Blob([txt], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a"); a.href = url; a.download = "applicant.json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    /* --- автосохранение в localStorage + черновик файлом --- */
    var STORAGE_KEY = "anketa_autosave_v1";
    var saveTimer = null;

    function collectAllForSave() {
      var data = {};
      FIELDS.forEach(function (f) {
        var el = document.getElementById(f.key);
        if (el) data[f.key] = el.value;
        var other = document.getElementById(f.key + "_other");
        if (other) data[f.key + "_other"] = other.value;
      });
      GROUPS.forEach(function (g) {
        if (g.optional) {
          var cb = document.getElementById("toggle-" + g.id);
          if (cb) data["__toggle_" + g.id] = cb.checked;
        }
      });
      return data;
    }

    function applyDataToForm(data) {
      if (!data) return false;
      var any = false;
      FIELDS.forEach(function (f) {
        var el = document.getElementById(f.key);
        if (el && data[f.key]) { el.value = data[f.key]; any = true; }
        var other = document.getElementById(f.key + "_other");
        if (other && data[f.key + "_other"]) { other.value = data[f.key + "_other"]; if (el && el.value === "__OTHER__") other.classList.add("show"); }
      });
      GROUPS.forEach(function (g) {
        if (g.optional && data["__toggle_" + g.id]) {
          var cb = document.getElementById("toggle-" + g.id);
          if (cb) { cb.checked = true; cb.dispatchEvent(new Event("change")); }
        }
      });
      updateProgress();
      return any;
    }

    function scheduleSave() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collectAllForSave())); } catch (e) {}
      }, 400);
    }

    function restoreSaved() {
      var raw;
      try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
      if (!raw) return;
      var data;
      try { data = JSON.parse(raw); } catch (e) { return; }
      if (applyDataToForm(data)) document.getElementById("restoreBanner").style.display = "flex";
    }

    document.getElementById("clearSaved").addEventListener("click", function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      location.reload();
    });

    /* --- меню «Черновик»: файл, независимо от localStorage браузера --- */
    var draftMenuBtn = document.getElementById("draftMenuBtn");
    var draftMenu = document.getElementById("draftMenu");
    function closeDraftMenu() { draftMenu.classList.remove("open"); draftMenuBtn.setAttribute("aria-expanded", "false"); }
    draftMenuBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var open = draftMenu.classList.toggle("open");
      draftMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (ev) {
      if (!draftMenu.contains(ev.target) && ev.target !== draftMenuBtn) closeDraftMenu();
    });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeDraftMenu(); });

    document.getElementById("exportDraftBtn").addEventListener("click", function () {
      closeDraftMenu();
      var payload = { __kind: "anketa_draft", __savedAt: new Date().toISOString(), data: collectAllForSave() };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var stamp = new Date().toISOString().slice(0, 10);
      a.href = url; a.download = "anketa-chernovik-" + stamp + ".json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Черновик скачан — сохраните файл в надёжном месте");
    });

    var importDraftInput = document.getElementById("importDraftInput");
    document.getElementById("importDraftBtn").addEventListener("click", function () {
      closeDraftMenu(); importDraftInput.value = ""; importDraftInput.click();
    });
    importDraftInput.addEventListener("change", function () {
      var file = importDraftInput.files && importDraftInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var parsed;
        try { parsed = JSON.parse(reader.result); } catch (e) { showToast("Файл повреждён или это не JSON черновика"); return; }
        var data = parsed && parsed.__kind === "anketa_draft" ? parsed.data : parsed;
        if (!data || typeof data !== "object") { showToast("В файле нет данных анкеты"); return; }
        if (applyDataToForm(data)) { scheduleSave(); showToast("Черновик загружен из файла"); }
        else showToast("В файле не найдено ни одного поля анкеты");
      };
      reader.onerror = function () { showToast("Не удалось прочитать файл"); };
      reader.readAsText(file, "utf-8");
    });

    document.getElementById("clearDraftMenuBtn").addEventListener("click", function () {
      closeDraftMenu();
      if (confirm("Очистить сохранённые в этом браузере данные?")) {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        showToast("Сохранённые данные очищены");
      }
    });

    groupsRoot.addEventListener("input", scheduleSave);
    groupsRoot.addEventListener("change", scheduleSave);

    restoreSaved();
    updateProgress();
  }

  setupDashboard();
  setupConstructor();
  setupSettings();
  renderApplication();
  setupModals();
  setupAnketa();
})();
