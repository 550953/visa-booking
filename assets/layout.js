// layout.js — рисует сайдбар и топбар на каждой странице.
// Правки навигации (пункты меню, ссылки) — тут, в одном месте.
//
// Использование в конце <body> каждой страницы:
//   <script src="assets/layout.js"></script>          (для файлов в корне)
//   <script src="../assets/layout.js"></script>        (для файлов в подпапках)
//   <script>renderLayout({ active: 'overview', base: './' });</script>
//
// base — префикс до корня кабинета: './' для index.html/application.html,
//        '../' для new/index.html и settings/index.html.

function renderLayout(opts) {
  const active = opts.active || 'overview';
  const base = opts.base || './';

  const nav = [
    { key: 'overview', icon: '▦', label: 'Обзор', href: base + 'index.html' },
    { key: 'new', icon: '＋', label: 'Новая заявка', href: base + 'new/index.html' },
    { key: 'settings', icon: '⚙', label: 'Настройки', href: base + 'settings/index.html' },
  ];

  const navHtml = nav
    .map(
      (item) => `
      <li class="nav-item ${item.key === active ? 'active' : ''}">
        <a class="nav-link" href="${item.href}">
          <span class="nav-link-icon">${item.icon}</span>
          <span class="nav-link-title">${item.label}</span>
        </a>
      </li>`
    )
    .join('');

  const shell = document.createElement('div');
  shell.innerHTML = `
    <header class="navbar navbar-expand-md navbar-light d-print-none">
      <div class="container-xl">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a href="${base}index.html" class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          ▣ <strong>Личный кабинет</strong>
        </a>
        <div class="navbar-nav flex-row order-md-last">
          <div class="nav-item d-flex align-items-center">
            <span class="badge bg-yellow-lt text-yellow me-2">Демо-режим</span>
          </div>
        </div>
      </div>
    </header>
    <div class="navbar-expand-md">
      <div class="collapse navbar-collapse" id="navbar-menu">
        <div class="navbar navbar-light">
          <div class="container-xl">
            <ul class="navbar-nav">
              ${navHtml}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  const mount = document.getElementById('layout-mount');
  if (mount) {
    mount.replaceWith(shell);
  } else {
    document.body.prepend(shell);
  }
}
