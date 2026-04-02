const FORM_STORAGE_KEY = 'exercise10-form-entries';

const form = document.getElementById('storageForm');
const clearAllBtn = document.getElementById('clearAll');
const tableBody = document.getElementById('entryTableBody');

const fields = {
  fullName: document.getElementById('fullName'),
  email: document.getElementById('email'),
  age: document.getElementById('age'),
  country: document.getElementById('country')
};

const errors = {
  fullName: document.getElementById('err-fullName'),
  email: document.getElementById('err-email'),
  age: document.getElementById('err-age'),
  country: document.getElementById('err-country')
};

function getEntries() {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(entries));
}

function clearErrors() {
  Object.values(errors).forEach(node => {
    node.textContent = '';
  });
}

function validate() {
  clearErrors();
  let valid = true;

  const fullName = fields.fullName.value.trim();
  const email = fields.email.value.trim();
  const age = Number(fields.age.value);
  const country = fields.country.value.trim();

  if (fullName.length < 2) {
    errors.fullName.textContent = 'Name must be at least 2 characters.';
    valid = false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email.textContent = 'Enter a valid email address.';
    valid = false;
  }

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    errors.age.textContent = 'Age must be between 1 and 120.';
    valid = false;
  }

  if (country.length < 2) {
    errors.country.textContent = 'Country must be at least 2 characters.';
    valid = false;
  }

  return valid;
}

function renderEntries() {
  const entries = getEntries();
  tableBody.innerHTML = '';

  if (entries.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="6">No entries saved yet.</td>';
    tableBody.appendChild(row);
    return;
  }

  entries.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.fullName}</td>
      <td>${entry.email}</td>
      <td>${entry.age}</td>
      <td>${entry.country}</td>
      <td>${entry.createdAt}</td>
      <td><button type="button" class="delete-btn" data-id="${entry.id}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validate()) return;

  const entries = getEntries();
  entries.push({
    id: Date.now(),
    fullName: fields.fullName.value.trim(),
    email: fields.email.value.trim(),
    age: Number(fields.age.value),
    country: fields.country.value.trim(),
    createdAt: new Date().toLocaleString()
  });

  saveEntries(entries);
  form.reset();
  renderEntries();
});

tableBody.addEventListener('click', event => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const entryId = Number(target.dataset.id);

  if (!entryId) return;

  const entries = getEntries().filter(entry => entry.id !== entryId);
  saveEntries(entries);
  renderEntries();
});

clearAllBtn.addEventListener('click', () => {
  localStorage.removeItem(FORM_STORAGE_KEY);
  renderEntries();
});

renderEntries();
