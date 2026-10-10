const playground = document.querySelector('#playground');
const dockLabel = document.querySelector('#dock-label');
const toast = document.querySelector('#toast');
const toastText = document.querySelector('#toast-text');
const flash = document.querySelector('.flash');
const hexInput = document.querySelector('#mp-hex');
const recordButton = document.querySelector('#btn-rec');

const SCREEN = { width: 236, height: 511 };
const RADII = { automatic: 30, phone: 30, tablet: 13, rectangular: 2 };
const EXPORT_NOTES = {
  framed: 'Include the export frame, backdrop color and spacing. The live screen shape and desktop transparency are presentation-only.',
  screen: 'Save the captured screen without a decorative frame or backdrop. Screenshots keep the source resolution.'
};

const state = {
  framed: true, shape: 'automatic', frameHex: '272B32', bgHex: '101318', padding: 12,
  transparent: true, pinned: true, hideName: false, monitoring: false, panel: true, full: false,
  screenOnly: false, turns: 0, recording: false, seconds: 0
};
let recordTimer;
let toastTimer;

function formatDuration(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function render() {
  const rim = state.framed ? 6 : 0;
  const width = SCREEN.width + 2 * rim;
  const height = SCREEN.height + 2 * rim;
  const landscape = state.turns % 2 === 1;
  const solid = !state.transparent && !state.full;
  const spacing = Math.round(state.padding * 0.8);
  const name = state.hideName ? 'Device' : 'iPhone';

  const vars = {
    '--w': `${width}px`, '--h': `${height}px`,
    '--bw': `${landscape ? height : width}px`, '--bh': `${landscape ? width : height}px`,
    '--rim': `${rim}px`, '--r': `${RADII[state.shape]}px`, '--rot': `${state.turns * 90}deg`,
    '--frame': `#${state.frameHex}`, '--bg': `#${state.bgHex}`,
    '--winpad': `${solid ? spacing + 10 : state.full ? spacing : 0}px`
  };
  Object.entries(vars).forEach(([key, value]) => playground.style.setProperty(key, value));
  Object.assign(playground.dataset, {
    framed: state.framed, solid, full: state.full, panel: state.panel, rec: state.recording
  });

  dockLabel.textContent = state.recording ? formatDuration(state.seconds) : name;
  document.querySelectorAll('[data-device-name]').forEach((element) => { element.textContent = name; });
  recordButton.setAttribute('aria-pressed', String(state.recording));
  recordButton.setAttribute('aria-label', state.recording ? 'Stop Recording' : 'Record');
  recordButton.title = state.recording ? 'Stop Recording' : 'Record';

  document.querySelectorAll('[data-toggle]').forEach((button) => {
    const attribute = button.getAttribute('role') === 'switch' ? 'aria-checked' : 'aria-pressed';
    if (button.hasAttribute(attribute)) button.setAttribute(attribute, String(state[button.dataset.toggle]));
  });
  document.querySelectorAll('[data-set]').forEach((button) => {
    button.setAttribute('aria-pressed', String(state[button.dataset.set] === button.dataset.value));
  });
  document.querySelectorAll('[data-export]').forEach((button) => {
    button.setAttribute('aria-pressed', String((button.dataset.export === 'screen') === state.screenOnly));
  });
  document.querySelector('#export-note').textContent = EXPORT_NOTES[state.screenOnly ? 'screen' : 'framed'];
}

function announce(message) {
  clearTimeout(toastTimer);
  toastText.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

document.querySelectorAll('[data-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    state[button.dataset.toggle] = !state[button.dataset.toggle];
    render();
  });
});

document.querySelectorAll('[data-set]').forEach((button) => {
  button.addEventListener('click', () => {
    state[button.dataset.set] = button.dataset.value;
    if (button.dataset.set === 'frameHex') {
      state.framed = true;
      hexInput.value = button.dataset.value;
    }
    render();
  });
});

document.querySelectorAll('[data-export]').forEach((button) => {
  button.addEventListener('click', () => {
    state.screenOnly = button.dataset.export === 'screen';
    render();
  });
});

hexInput.addEventListener('input', () => {
  const value = hexInput.value.replace(/[^0-9a-f]/gi, '').slice(0, 6).toUpperCase();
  hexInput.value = value;
  if (value.length === 6) { state.frameHex = value; render(); }
});

document.querySelector('#mp-shape').addEventListener('change', (event) => {
  state.shape = event.target.value;
  render();
});

document.querySelector('#mp-pad').addEventListener('input', (event) => {
  state.padding = Number(event.target.value);
  document.querySelector('#mp-pad-out').textContent = `${state.padding}%`;
  render();
});

document.querySelector('#mp-vol').addEventListener('input', (event) => {
  document.querySelector('#mp-vol-out').textContent = `${event.target.value}%`;
});

document.querySelector('#btn-rotate').addEventListener('click', () => {
  state.turns += 1;
  render();
});

document.querySelector('#btn-shot').addEventListener('click', () => {
  flash.classList.remove('is-on');
  void flash.offsetWidth;
  flash.classList.add('is-on');
  announce(state.screenOnly ? 'Screenshot saved · screen only, 1126 × 2436' : 'Screenshot saved · with frame and backdrop');
});

recordButton.addEventListener('click', () => {
  clearInterval(recordTimer);
  state.recording = !state.recording;
  if (state.recording) {
    state.seconds = 0;
    recordTimer = setInterval(() => { state.seconds += 1; render(); }, 1000);
  } else {
    announce(`Recording kept on this Mac · ${formatDuration(state.seconds)}`);
  }
  render();
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = tabs[(index + step + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

render();
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-title, .section-intro, .tile, .privacy, .faq-list, .launch .wrap').forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
