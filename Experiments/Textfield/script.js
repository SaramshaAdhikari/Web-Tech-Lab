const form = document.getElementById('sampleForm');
const output = document.getElementById('output');
const clearBtn = document.getElementById('clearOutput');

/* ---- Link satisfaction slider ↔ number field ---- */
const slider = document.getElementById('range');
const satNum = document.getElementById('satNumber');

slider.addEventListener('input', () => { satNum.value = slider.value; });
satNum.addEventListener('input', () => {
  let v = Math.min(10, Math.max(0, Number(satNum.value)));
  slider.value = v;
});

/* ---- Password validation ---- */
const passwordInput  = document.getElementById('password');
const confirmInput   = document.getElementById('confirm');
const fieldPassword  = document.getElementById('field-password');
const fieldConfirm   = document.getElementById('field-confirm');
const msgPassword    = document.getElementById('msg-password');
const msgConfirm     = document.getElementById('msg-confirm');

function setFieldState(fieldEl, msgEl, isOk, message) {
  fieldEl.classList.toggle('is-ok',    isOk  && message !== '');
  fieldEl.classList.toggle('is-error', !isOk && message !== '');
  msgEl.textContent = message;
}

function validatePassword() {
  const val = passwordInput.value;
  if (val === '') {
    setFieldState(fieldPassword, msgPassword, false, '');
    return false;
  }
  if (val.length < 8) {
    setFieldState(fieldPassword, msgPassword, false, 'Password must be at least 8 characters.');
    return false;
  }
  setFieldState(fieldPassword, msgPassword, true, 'Looks good!');
  return true;
}

function validateConfirm() {
  const val = confirmInput.value;
  if (val === '') {
    setFieldState(fieldConfirm, msgConfirm, false, '');
    return false;
  }
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

/* ---- Form submission ---- */
function formatValue(val){
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

form.addEventListener('submit', function(e){
  e.preventDefault();

  const pwOk  = validatePassword();
  const cfOk  = validateConfirm();

  if (!pwOk || !cfOk) {
    output.textContent = '⚠ Please fix the errors above before submitting.';
    return;
  }

  const fd = new FormData(form);
  const map = {};
  for (const [key, value] of fd.entries()){
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }

  const skipFields = new Set(['confirm']);
  const allNames = Array.from(new Set(
    Array.from(form.elements).map(el => el.name).filter(Boolean)
  )).filter(n => !skipFields.has(n));

  const lines = [];
  for (const name of allNames){
    const val = (name in map) ? map[name] : '(no value)';
    lines.push(name + ': ' + formatValue(val));
  }

  output.textContent = lines.join('\n');
});

clearBtn.addEventListener('click', () => { output.textContent = ''; });

/* Reset also re-syncs the satisfaction number and clears validation states */
form.addEventListener('reset', () => {
  setTimeout(() => {
    satNum.value = slider.value;
    [fieldPassword, fieldConfirm].forEach(f => f.classList.remove('is-ok', 'is-error'));
    [msgPassword, msgConfirm].forEach(m => m.textContent = '');
  }, 0);
});
