(function () {
  "use strict";

  var ACTIVE_QUEUE_STATUSES = ["slot_found", "booking", "captcha", "payment", "payment_error", "video", "confirmation", "monitoring", "retry"];

  function toast(message) {
    var old = document.querySelector(".bop-toast");
    if (old) old.remove();
    var node = document.createElement("div");
    node.className = "bop-toast";
    node.setAttribute("role", "status");
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(function () {
      node.style.opacity = "0";
      node.style.transform = "translateY(8px)";
      node.style.transition = "opacity 160ms ease, transform 160ms ease";
      window.setTimeout(function () { if (node.parentNode) node.remove(); }, 180);
    }, 2600);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  function pluralize(number, one, few, many) {
    var mod10 = number % 10, mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem("booking-ops-" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try { window.localStorage.setItem("booking-ops-" + key, JSON.stringify(value)); } catch (error) {}
  }

  function source(key, fallback) {
    var mockKey = { clients: "CLIENTS", events: "EVENTS", notifications: "NOTIFICATIONS", monitoring: "MONITORING", services: "SERVICES" }[key] || key;
    return read(key, window.BOP_MOCK ? window.BOP_MOCK[mockKey] : fallback);
  }

  function clients() {
    return source("clients", []);
  }

  function saveClients(value) {
    write("clients", value);
    if (window.BOP_MOCK) window.BOP_MOCK.CLIENTS = value;
    refreshBadges();
  }

  function events() {
    return source("events", []);
  }

  function saveEvents(value) {
    write("events", value);
    if (window.BOP_MOCK) window.BOP_MOCK.EVENTS = value;
  }

  function addEvent(event) {
    var next = events();
    next.unshift(event);
    saveEvents(next);
  }

  function notifications() {
    return source("notifications", []);
  }

  function saveNotifications(value) {
    write("notifications", value);
    if (window.BOP_MOCK) window.BOP_MOCK.NOTIFICATIONS = value;
    refreshBadges();
  }

  function monitoring() {
    return source("monitoring", []);
  }

  function saveMonitoring(value) {
    write("monitoring", value);
    if (window.BOP_MOCK) window.BOP_MOCK.MONITORING = value;
  }

  function services() {
    return source("services", []);
  }

  function saveServices(value) {
    write("services", value);
    if (window.BOP_MOCK) window.BOP_MOCK.SERVICES = value;
  }

  function updateClient(id, patch) {
    var next = clients().map(function (client) {
      return client.id === id ? Object.assign({}, client, patch) : client;
    });
    saveClients(next);
    return next.find(function (client) { return client.id === id; });
  }

  function nextClientId(records, prefix) {
    var base = prefix || "CL";
    var used = {};
    records.forEach(function (record) { used[record.id] = true; });
    var number = 1001;
    while (used[base + "-" + number]) number += 1;
    return base + "-" + number;
  }

  function queue() {
    var records = clients(), byId = {};
    records.forEach(function (client) { byId[client.id] = client; });
    var original = window.BOP_MOCK ? window.BOP_MOCK.QUEUE : [];
    var seen = {};
    var result = original.map(function (item) {
      var client = byId[item.clientId];
      if (!client || client.archived || ACTIVE_QUEUE_STATUSES.indexOf(client.status) === -1) return null;
      seen[client.id] = true;
      return Object.assign({}, item, {
        client: client.name,
        country: client.country,
        priority: client.priority || item.priority,
        status: client.status,
        note: queueNote(client.status, item.note),
      });
    }).filter(Boolean);
    records.forEach(function (client) {
      if (client.archived || seen[client.id] || ACTIVE_QUEUE_STATUSES.indexOf(client.status) === -1) return;
      result.push({
        pos: result.length + 1,
        clientId: client.id,
        client: client.name,
        country: client.country,
        priority: client.priority || "normal",
        status: client.status,
        waiting: "—",
        note: queueNote(client.status, "Добавлен в очередь"),
      });
    });
    return result.map(function (item, index) { return Object.assign({}, item, { pos: index + 1 }); });
  }

  function queueNote(status, fallback) {
    var notes = {
      slot_found: "Слот удерживается 10 минут",
      booking: "Заполнение формы записи",
      captcha: "Нужно действие оператора",
      payment: "Ожидается подтверждение оплаты",
      payment_error: "Нужно повторить оплату",
      video: "Нужно загрузить видео",
      confirmation: "Проверьте подтверждение",
      monitoring: fallback || "Следующая проверка по расписанию",
      retry: "Готов к повторному запуску",
    };
    return notes[status] || fallback || "Ожидает обработки";
  }

  function refreshBadges() {
    var unread = notifications().filter(function (item) { return !item.read; }).length;
    var pending = queue().length;
    document.querySelectorAll("[data-nav-badge='notifications']").forEach(function (badge) {
      badge.textContent = unread;
      badge.classList.toggle("d-none", unread === 0);
    });
    document.querySelectorAll("[data-nav-badge='queue']").forEach(function (badge) {
      badge.textContent = pending;
      badge.classList.toggle("d-none", pending === 0);
    });
  }

  var ACTION_LABELS = {
    slot_found: "Выбрать слот",
    booking: "Открыть процесс записи",
    captcha: "Открыть CAPTCHA",
    payment: "Подтвердить оплату",
    payment_error: "Повторить оплату",
    video: "Загрузить видео",
    confirmation: "Проверить подтверждение",
    error: "Повторить авторизацию",
    retry: "Запустить повтор",
  };

  var ACTION_HINTS = {
    slot_found: "Слот удерживается ограниченное время. Проверьте дату и подтвердите выбор.",
    booking: "Форма записи заполняется в демо-режиме. Следующий шаг требует контроля оператора.",
    captcha: "Автозаполнение остановлено. Откройте профиль клиента, решите CAPTCHA и продолжите процесс.",
    payment: "Платёжная страница ожидает подтверждения. CVV вводится только оператором и не сохраняется.",
    payment_error: "Платёж не завершён. Проверьте причину отказа и повторите операцию после исправления.",
    video: "Для этой страны требуется видеоидентификация. Проверьте файл и запустите загрузку.",
    confirmation: "Проверьте сохранённое подтверждение и завершите операцию.",
    error: "Сессия или операция завершилась ошибкой. Повторите авторизацию и верните клиента в очередь.",
    retry: "Операция готова к повторному запуску.",
  };

  function actionLabel(status) {
    return ACTION_LABELS[status] || "Открыть карточку";
  }

  function actionHint(status) {
    return ACTION_HINTS[status] || "Оператор может открыть карточку и проверить состояние клиента.";
  }

  function nextActionStatus(status) {
    return status === "slot_found" ? "booking"
      : status === "booking" ? "captcha"
      : status === "captcha" ? "payment"
      : status === "payment" ? "confirmation"
      : status === "payment_error" ? "payment"
      : status === "video" ? "confirmation"
      : status === "error" ? "retry"
      : status === "retry" ? "monitoring"
      : status === "confirmation" ? "success"
      : status === "paused" ? "monitoring"
      : "paused";
  }

  window.BOP_APP = {
    toast: toast,
    escapeHtml: escapeHtml,
    pluralize: pluralize,
    read: read,
    write: write,
    clients: clients,
    saveClients: saveClients,
    events: events,
    saveEvents: saveEvents,
    addEvent: addEvent,
    notifications: notifications,
    saveNotifications: saveNotifications,
    monitoring: monitoring,
    saveMonitoring: saveMonitoring,
    services: services,
    saveServices: saveServices,
    updateClient: updateClient,
    nextClientId: nextClientId,
    queue: queue,
    queueNote: queueNote,
    actionLabel: actionLabel,
    actionHint: actionHint,
    nextActionStatus: nextActionStatus,
    refreshBadges: refreshBadges,
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-toast]").forEach(function (element) {
      element.addEventListener("click", function (event) {
        if (element.tagName === "A" && element.getAttribute("href") === "#") event.preventDefault();
        toast(element.dataset.toast);
      });
    });
    refreshBadges();
  });
})();