const FORM_STORAGE_KEY = 'form-data-storage-entries';

const slider = document.getElementById('range');
const satNum = document.getElementById('satNumber');

slider.addEventListener('input', () => { satNum.value = slider.value; });
satNum.addEventListener('input', () => {
  satNum.value = Math.min(10, Math.max(0, Number(satNum.value)));
  slider.value = satNum.value;
});

const form = document.getElementById('sampleForm');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const fieldPassword = document.getElementById('field-password');
const fieldConfirm = document.getElementById('field-confirm');
const msgPassword = document.getElementById('msg-password');
const msgConfirm = document.getElementById('msg-confirm');
const clearAllButton = document.getElementById('clearAll');
const output = document.getElementById('output');
const tableBody = document.getElementById('tableBody');

const COLUMNS = [
  { key: 'fullname', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'age', label: 'Age' },
  { key: 'birthday', label: 'Birthday' },
  { key: 'bio', label: 'Bio' },
  { key: 'satisfaction', label: 'Satisfaction' },
  { key: 'gender', label: 'Gender' },
  { key: 'interests', label: 'Interests' },
  { key: 'country', label: 'Country' }
];

function setFieldState(fieldEl, msgEl, isOk, message) {
  fieldEl.classList.toggle('is-ok', isOk && message !== '');
  fieldEl.classList.toggle('is-error', !isOk && message !== '');
  msgEl.textContent = message;
}

function validatePassword() {
  const val = passwordInput.value;
  if (val === '') { setFieldState(fieldPassword, msgPassword, false, ''); return false; }
  if (val.length < 8) {
    setFieldState(fieldPassword, msgPassword, false, 'Password must be at least 8 characters.');
    return false;
  }
  setFieldState(fieldPassword, msgPassword, true, 'Looks good!');
  return true;
}

function validateConfirm() {
  const val = confirmInput.value;
  if (val === '') { setFieldState(fieldConfirm, msgConfirm, false, ''); return false; }
  if (val !== passwordInput.value) {
    setFieldState(fieldConfirm, msgConfirm, false, 'Passwords do not match.');
    return false;
  }
  setFieldState(fieldConfirm, msgConfirm, true, 'Passwords match!');
  return true;
}

passwordInput.addEventListener('input', () => {
  validatePassword();
  if (confirmInput.value !== '') validateConfirm();
});

confirmInput.addEventListener('input', validateConfirm);

function getEntries() {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(entries));
}

function renderTable() {
  const entries = getEntries();
  tableBody.innerHTML = '';

  if (entries.length === 0) {
    output.style.display = 'none';
    return;
  }

  entries.forEach((entry, index) => {
    const tr = document.createElement('tr');

    COLUMNS.forEach(col => {
      const td = document.createElement('td');
      td.textContent = entry[col.key] ?? '';
      tr.appendChild(td);
    });

    const createdAtTd = document.createElement('td');
    createdAtTd.textContent = entry.createdAt;
    tr.appendChild(createdAtTd);

    const actionTd = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-danger btn-sm';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.index = String(index);
    actionTd.appendChild(deleteButton);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
  });

  output.style.display = 'block';
}

form.addEventListener('submit', event => {
  event.preventDefault();

  if (!validatePassword() || !validateConfirm()) return;

  const fd = new FormData(form);
  const map = {};
  for (const [key, value] of fd.entries()) {
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }

  const entry = {
    createdAt: new Date().toLocaleString()
  };

  COLUMNS.forEach(col => {
    const vals = map[col.key];
    entry[col.key] = vals ? vals.join(', ') : '';
  });

  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);
  renderTable();
});

tableBody.addEventListener('click', event => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const idx = Number(target.dataset.index);
  if (Number.isNaN(idx)) return;

  const entries = getEntries();
  entries.splice(idx, 1);
  saveEntries(entries);
  renderTable();
});

clearAllButton.addEventListener('click', () => {
  localStorage.removeItem(FORM_STORAGE_KEY);
  renderTable();
});

renderTable();
