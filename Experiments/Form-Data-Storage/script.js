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

const DISPLAY_COLUMNS = [
  { key: 'fullname', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'age', label: 'Age' },
  { key: 'country', label: 'Country' },
  { key: 'created_at', label: 'Created At' }
];

let records = [];
const output = document.getElementById('output');
const tableBody = document.querySelector('#dataTable tbody');
const exportButton = document.getElementById('exportCSV');

function formDataToPayload(formData) {
  const map = {};
  for (const [key, value] of formData.entries()) {
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }

  return {
    fullname: (map.fullname || [''])[0],
    email: (map.email || [''])[0],
    age: (map.age || [''])[0],
    birthday: (map.birthday || [''])[0],
    bio: (map.bio || [''])[0],
    satisfaction: (map.satisfaction || [''])[0],
    gender: (map.gender || [''])[0],
    interests: (map.interests || []).join(', '),
    country: (map.country || [''])[0]
  };
}

function renderTable() {
  tableBody.innerHTML = '';

  if (!records.length) {
    output.style.display = 'none';
    return;
  }

  records.forEach(record => {
    const tr = document.createElement('tr');
    DISPLAY_COLUMNS.forEach(col => {
      const td = document.createElement('td');
      td.textContent = record[col.key] ?? '';
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  output.style.display = 'block';
}

async function loadData() {
  try {
    const response = await fetch('fetch.php', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    console.log('fetch.php status:', response.status);
    const data = await response.json();
    console.log('fetch.php response:', data);

    if (!response.ok) {
      throw new Error('Unable to fetch records.');
    }

    records = Array.isArray(data)
      ? data
      : (Array.isArray(data.records) ? data.records : []);
    renderTable();
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validatePassword() || !validateConfirm()) return;

  const formData = new FormData(form);
  const payload = formDataToPayload(formData);

  try {
    const response = await fetch('save.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to save record.');
    }

    await loadData();
  } catch (error) {
    console.error(error);
  }
});

function escapeCSV(value) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n') || text.includes('\r')) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function toCSV() {
  if (!records.length) return '';
  const header = DISPLAY_COLUMNS.map(c => escapeCSV(c.label)).join(',');
  const rows = records.map(record => DISPLAY_COLUMNS.map(c => escapeCSV(record[c.key] ?? '')).join(','));
  return header + '\r\n' + rows.join('\r\n');
}

exportButton.addEventListener('click', function () {
  if (!records.length) return;
  const blob = new Blob([toCSV()], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'exercise10-db-export.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

window.addEventListener('DOMContentLoaded', loadData);
