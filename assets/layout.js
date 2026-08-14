/* ===== Layout injector =============================================
   Рисует сайдбар и топбар одним скриптом на каждой странице.
   Активная страница берётся из document.body.dataset.page.
   Правки навигации — только здесь, а не в 10 html-файлах.
   ==================================================================== */

(function () {

  const NAV = [
    {
      section: "Обзор",
      items: [
        { page: "dashboard", href: "index.html", icon: "layout-dashboard", label: "Дашборд" },
      ],
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

  const ICONS = {
    "layout-dashboard": '<path d="M4 4h6v8h-6z"></path><path d="M4 16h6v4h-6z"></path><path d="M14 12h6v8h-6z"></path><path d="M14 4h6v4h-6z"></path>',
    "users": '<path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>',
    "list-details": '<path d="M13 5h8"></path><path d="M13 9h5"></path><path d="M13 15h8"></path><path d="M13 19h5"></path><path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>',
    "activity": '<path d="M3 12h4l3 8l4 -16l3 8h4"></path>',
    "bell": '<path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path><path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>',
    "file-text": '<path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M9 9h1"></path><path d="M9 13h6"></path><path d="M9 17h6"></path>',
    "settings": '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>',
    "server-2": '<path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path><path d="M3 13m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path><path d="M7 8l0 .01"></path><path d="M7 17l0 .01"></path>',
    "logout": '<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path><path d="M9 12h12l-3 -3"></path><path d="M18 15l3 -3"></path>',
  };

  function icon(name, cls) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls || 'icon'}" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
  }

  function buildSidebar(activePage) {
    let html = `
      <div class="navbar-brand navbar-brand-autodark">
        <a href="index.html" class="d-flex align-items-center gap-2 text-decoration-none px-3 py-3">
          <span class="bg-blue text-white rounded d-flex align-items-center justify-content-center" style="width:32px;height:32px;font-weight:700;font-size:14px;">BE</span>
          <span class="text-white fw-bold">Booking Ops</span>
        </a>
      </div>
      <div class="navbar-nav flex-column px-2">`;

    NAV.forEach((group) => {
      html += `<div class="text-uppercase text-secondary small fw-bold px-3 pt-3 pb-1" style="font-size:11px; letter-spacing:.04em;">${group.section}</div>`;
      group.items.forEach((item) => {
        const active = item.page === activePage ? "active" : "";
        const badge = item.badge
          ? `<span class="badge ${item.badgeColor ? "bg-" + item.badgeColor : "bg-blue"} ms-auto">${item.badge}</span>`
          : "";
        html += `
          <a class="nav-link d-flex align-items-center gap-2 rounded ${active}" href="${item.href}">
            ${icon(item.icon)}
            <span>${item.label}</span>
            ${badge}
          </a>`;
      });
    });

    html += `</div>`;
    return html;
  }

  function buildTopbar(pageTitle) {
    return `
      <div class="navbar-nav flex-row order-md-last">
        <div class="nav-item d-none d-md-flex me-3">
          <span class="bop-demo-badge">
            ${icon("server-2", "icon")}
            демо-режим · без бэкенда
          </span>
        </div>
        <div class="nav-item dropdown">
          <a href="notifications.html" class="nav-link px-2" aria-label="Уведомления">
            ${icon("bell")}
            <span class="badge bg-red position-absolute top-0 end-0 badge-notification"></span>
          </a>
        </div>
        <div class="nav-item dropdown ms-2">
          <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
            <span class="avatar avatar-sm bg-blue-lt">ОП</span>
            <div class="d-none d-xl-block ps-2">
              <div>Оператор Смирнов</div>
              <div class="mt-1 small text-secondary">Роль: Оператор</div>
            </div>
          </a>
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <a href="settings.html" class="dropdown-item">Настройки</a>
            <a href="login.html" class="dropdown-item">${icon("logout", "icon dropdown-item-icon")} Выйти</a>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <h2 class="mb-0 h3">${pageTitle || ""}</h2>
      </div>`;
  }

  function mount() {
    const page = document.body.dataset.page || "";
    const title = document.body.dataset.title || "";

    const sidebarEl = document.getElementById("bop-sidebar");
    if (sidebarEl) sidebarEl.innerHTML = buildSidebar(page);

    const topbarEl = document.getElementById("bop-topbar");
    if (topbarEl) topbarEl.innerHTML = buildTopbar(title);

    // мобильный сайдбар toggler уже обрабатывается Tabler/Bootstrap автоматически
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.BOP_LAYOUT = { icon };
})();
