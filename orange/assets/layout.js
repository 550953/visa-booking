(function () {
  "use strict";

  var NAV = [
    {
      section: "Обзор",
      items: [{ page: "dashboard", href: "index.html", icon: "layout-dashboard", label: "Дашборд" }],
    },
    {
      section: "Работа с клиентами",
      items: [
        { page: "clients", href: "clients.html", icon: "users", label: "Клиенты" },
        { page: "queue", href: "queue.html", icon: "list-details", label: "Очередь", badge: "7" },
      ],
    },
    {
      section: "Система",
      items: [
        { page: "monitoring", href: "monitoring.html", icon: "activity", label: "Мониторинг" },
        { page: "notifications", href: "notifications.html", icon: "bell", label: "Уведомления", badge: "4", badgeColor: "red" },
        { page: "logs", href: "logs.html", icon: "file-text", label: "Журнал событий" },
      ],
    },
    {
      section: "Администрирование",
      items: [
        { page: "settings", href: "settings.html", icon: "settings", label: "Настройки" },
        { page: "system-status", href: "system-status.html", icon: "server-2", label: "Статус системы" },
      ],
    },
  ];

  function icon(name, extraClass) {
    return '<i class="ti ti-' + name + " " + (extraClass || "") + '"></i>';
  }

  function buildSidebar(activePage) {
    var html =
      '<a href="index.html" class="bop-brand">' +
      '<span class="bop-brand-mark">' + icon("stamp") + "</span>" +
      "<span><span class=\"bop-brand-name\">Booking Ops</span>" +
      '<span class="bop-brand-subtitle">operator console</span></span></a>' +
      '<div class="bop-sidebar-nav">';

    NAV.forEach(function (group) {
      html += '<div class="bop-nav-section">' + group.section + "</div>";
      group.items.forEach(function (item) {
        var active = item.page === activePage ? " active" : "";
        var badge = item.badge
          ? '<span class="badge bg-' + (item.badgeColor || "orange") + ' ms-auto" data-nav-badge="' + item.page + '">' + item.badge + "</span>"
          : "";
        html +=
          '<a class="nav-link d-flex align-items-center gap-2' + active + '" href="' + item.href + '"' +
          (active ? ' aria-current="page"' : "") + ">" +
          icon(item.icon, "icon") + "<span>" + item.label + "</span>" + badge + "</a>";
      });
    });

    return (
      html +
      '</div><div class="bop-sidebar-meta"><div class="d-flex align-items-center gap-2 mb-1">' +
      '<span class="bop-dot bop-dot-green"></span><span class="small fw-semibold">Демо-режим</span>' +
      '</div><small>Статические данные · v0.2</small></div>'
    );
  }

  function buildTopbar(title) {
    return (
      '<div class="d-flex align-items-center">' +
      '<div><div class="bop-page-kicker">Центр управления</div><h1 class="bop-page-title">' +
      title +
      "</h1>" +
      '<div class="bop-page-note">UI-прототип · демо-данные · без бэкенда</div></div></div>' +
      '<div class="navbar-nav flex-row order-md-last align-items-center">' +
      '<span class="bop-demo-badge d-none d-lg-inline-flex me-3">' + icon("database") + " демо-режим</span>" +
      '<a href="notifications.html" class="nav-link position-relative px-2" aria-label="Уведомления">' +
      icon("bell") + '<span class="badge bg-red position-absolute top-0 end-0 badge-notification">4</span></a>' +
      '<div class="nav-item dropdown ms-2">' +
      '<a href="#" class="nav-link d-flex align-items-center lh-1 text-reset p-0" data-bs-toggle="dropdown">' +
      '<span class="avatar avatar-sm bg-orange-lt text-orange">ОП</span>' +
      '<span class="d-none d-xl-block ps-2"><span class="d-block">Оператор Смирнов</span><span class="d-block mt-1 small text-secondary">Роль: оператор</span></span>' +
      "</a><div class=\"dropdown-menu dropdown-menu-end dropdown-menu-arrow\">" +
      '<a href="settings.html" class="dropdown-item">' + icon("settings", "dropdown-item-icon") + "Настройки</a>" +
      '<a href="login.html" class="dropdown-item">' + icon("logout", "dropdown-item-icon") + "Выйти</a>" +
      "</div></div></div>"
    );
  }

  function mount() {
    var page = document.body.dataset.page || "";
    var title = document.body.dataset.title || "";
    var sidebar = document.getElementById("bop-sidebar");
    var topbar = document.getElementById("bop-topbar");
    if (sidebar) sidebar.innerHTML = buildSidebar(page);
    if (topbar) topbar.innerHTML = buildTopbar(title);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.BOP_LAYOUT = { icon: icon };
})();