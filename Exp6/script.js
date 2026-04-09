/* ---- Satisfaction slider ? number sync ---- */
const slider = document.getElementById('range');
const satNum  = document.getElementById('satNumber');

slider.addEventListener('input', () => { satNum.value = slider.value; });
satNum.addEventListener('input', () => {
  satNum.value = Math.min(10, Math.max(0, Number(satNum.value)));
  slider.value  = satNum.value;
});

/* ---- Password validation ---- */
const form          = document.getElementById('sampleForm');
const passwordInput = document.getElementById('password');
const confirmInput  = document.getElementById('confirm');
const fieldPassword = document.getElementById('field-password');
const fieldConfirm  = document.getElementById('field-confirm');
const msgPassword   = document.getElementById('msg-password');
const msgConfirm    = document.getElementById('msg-confirm');

function setFieldState(fieldEl, msgEl, isOk, message) {
  fieldEl.classList.toggle('is-ok',    isOk  && message !== '');
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

/* ---- Column definitions ---- */
const COLUMNS = [
  { key: 'fullname',     label: 'Full Name'    },
  { key: 'email',        label: 'Email'        },
  { key: 'age',          label: 'Age'          },
  { key: 'birthday',     label: 'Birthday'     },
  { key: 'bio',          label: 'Bio'          },
  { key: 'satisfaction', label: 'Satisfaction' },
  { key: 'gender',       label: 'Gender'       },
  { key: 'interests',    label: 'Interests'    },
  { key: 'country',      label: 'Country'      },
];

let currentRecord = null;
const output    = document.getElementById('output');
const tableBody = document.getElementById('tableBody');

/* ---- Form submission ---- */
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validatePassword() || !validateConfirm()) return;

  const fd  = new FormData(form);
  const map = {};
  for (const [key, value] of fd.entries()) {
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }

  currentRecord = {};
  COLUMNS.forEach(col => {
    const vals = map[col.key];
    currentRecord[col.key] = vals ? vals.join(', ') : '';
  });

  const tr = document.createElement('tr');
  COLUMNS.forEach(col => {
    const td = document.createElement('td');
    td.textContent = currentRecord[col.key];
    tr.appendChild(td);
  });

  tableBody.innerHTML = '';
  tableBody.appendChild(tr);
  output.style.display = 'block';
});

