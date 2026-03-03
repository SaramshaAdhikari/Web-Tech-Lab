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

/* ---- Form submission ---- */
function formatValue(val){
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

form.addEventListener('submit', function(e){
  e.preventDefault();
  const fd = new FormData(form);
  const map = {};
  for (const [key, value] of fd.entries()){
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }

  const allNames = Array.from(new Set(
    Array.from(form.elements).map(el => el.name).filter(Boolean)
  ));
  const lines = [];
  for (const name of allNames){
    const val = (name in map) ? map[name] : '(no value)';
    lines.push(name + ': ' + formatValue(val));
  }

  output.textContent = lines.join('\n');
});

clearBtn.addEventListener('click', () => { output.textContent = ''; });

/* Reset also re-syncs the satisfaction number */
form.addEventListener('reset', () => {
  setTimeout(() => { satNum.value = slider.value; }, 0);
});
