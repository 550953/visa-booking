// mock-data.js — единый источник демо-данных для кабинета заявителя.
// В проде это заменяется на запросы к бэкенду; здесь всё живёт в localStorage браузера.

const STORAGE_KEY = 'cabinet_applications_v1';

const DEFAULT_APPLICATIONS = [
  {
    id: 'FB-240318',
    createdLabel: '18 марта 2026, 10:42',
    country: 'Италия',
    visaType: 'Туристическая',
    applicants: ['Алексей Смирнов', 'Елена Смирнова'],
    status: 'awaiting_payment', // awaiting_payment | in_progress | slot_found | draft
    paymentMethod: 'Банковская карта',
    cost: 4800,
  },
  {
    id: 'FB-240297',
    createdLabel: 'сегодня, 09:16',
    country: 'Испания',
    visaType: 'Туристическая',
    applicants: ['Мария Воронцова'],
    status: 'in_progress',
    paymentMethod: 'СБП',
    cost: 2400,
  },
  {
    id: 'FB-240251',
    createdLabel: '15 марта 2026, 16:04',
    country: 'Франция',
    visaType: 'Деловая',
    applicants: ['Дмитрий Крылов'],
    status: 'slot_found',
    paymentMethod: 'Счёт для юрлица',
    cost: 2400,
  },
  {
    id: 'FB-240236',
    createdLabel: '10 марта 2026, 19:23',
    country: 'Италия',
    visaType: 'Студенческая',
    applicants: ['Софья Нечаева'],
    status: 'draft',
    paymentMethod: 'Банковская карта',
    cost: 2400,
  },
];

const STATUS_META = {
  awaiting_payment: { label: 'Ожидает оплаты', badge: 'bg-orange-lt text-orange' },
  in_progress: { label: 'В работе', badge: 'bg-blue-lt text-blue' },
  slot_found: { label: 'Запись найдена', badge: 'bg-green-lt text-green' },
  draft: { label: 'Черновик', badge: 'bg-secondary-lt text-secondary' },
};

function loadApplications() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
      return DEFAULT_APPLICATIONS.slice();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_APPLICATIONS.slice();
  } catch (e) {
    console.error('Не удалось прочитать localStorage, используем демо-данные', e);
    return DEFAULT_APPLICATIONS.slice();
  }
}

function saveApplications(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Не удалось сохранить в localStorage', e);
    return false;
  }
}

function addApplication(app) {
  const list = loadApplications();
  list.unshift(app);
  saveApplications(list);
  return list;
}

function getApplicationById(id) {
  return loadApplications().find((a) => a.id === id) || null;
}

function updateApplication(id, patch) {
  const list = loadApplications();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  list[idx] = Object.assign({}, list[idx], patch);
  saveApplications(list);
  return true;
}

function nextApplicationId() {
  const list = loadApplications();
  const nums = list
    .map((a) => parseInt(String(a.id).replace('FB-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 240300;
  return 'FB-' + (max + 1);
}

window.CabinetData = {
  STATUS_META,
  loadApplications,
  saveApplications,
  addApplication,
  getApplicationById,
  updateApplication,
  nextApplicationId,
};
