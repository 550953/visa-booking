(function () {
  "use strict";

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
      window.setTimeout(function () { node.remove(); }, 180);
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
    try { return JSON.parse(window.localStorage.getItem("booking-ops-" + key)) || fallback; } catch (error) { return fallback; }
  }

  function write(key, value) {
    try { window.localStorage.setItem("booking-ops-" + key, JSON.stringify(value)); } catch (error) {}
  }

  function clients() {
    return read("clients", window.BOP_MOCK ? window.BOP_MOCK.CLIENTS : []);
  }

  function saveClients(value) {
    write("clients", value);
    if (window.BOP_MOCK) window.BOP_MOCK.CLIENTS = value;
  }

  function addEvent(event) {
    var events = read("events", window.BOP_MOCK ? window.BOP_MOCK.EVENTS : []);
    events.unshift(event);
    write("events", events);
    if (window.BOP_MOCK) window.BOP_MOCK.EVENTS = events;
  }

  function updateClient(id, patch) {
    var next = clients().map(function (client) {
      return client.id === id ? Object.assign({}, client, patch) : client;
    });
    saveClients(next);
    return next.find(function (client) { return client.id === id; });
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

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-toast]").forEach(function (element) {
      element.addEventListener("click", function (event) {
        if (element.tagName === "A" && element.getAttribute("href") === "#") event.preventDefault();
        toast(element.dataset.toast);
      });
    });
  });

  window.BOP_APP = {
    toast: toast,
    escapeHtml: escapeHtml,
    pluralize: pluralize,
    read: read,
    write: write,
    clients: clients,
    saveClients: saveClients,
    addEvent: addEvent,
    updateClient: updateClient,
    actionLabel: actionLabel,
    actionHint: actionHint,
    nextActionStatus: nextActionStatus,
  };
})();