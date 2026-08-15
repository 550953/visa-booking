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

  setupDashboard();
  setupConstructor();
  setupSettings();
  renderApplication();
  setupModals();
})();