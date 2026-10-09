const stage = document.querySelector('.stage');
const previewStatus = document.querySelector('#preview-status');

function chooseOption(button, option) {
  stage.dataset[option] = button.dataset[option];
  button.closest('.control-group').querySelectorAll('button').forEach((item) => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  previewStatus.textContent = `Preview ${option}: ${button.dataset[option]}.`;
}

document.querySelectorAll('button[data-frame]').forEach((button) => {
  button.addEventListener('click', () => chooseOption(button, 'frame'));
});
document.querySelectorAll('button[data-backdrop]').forEach((button) => {
  button.addEventListener('click', () => chooseOption(button, 'backdrop'));
});
document.querySelector('.screen-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const screenOnly = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(screenOnly));
  stage.dataset.presentation = screenOnly ? 'screen' : 'framed';
  previewStatus.textContent = screenOnly ? 'Preview displays the screen without its decorative frame.' : 'Preview displays the screen with a decorative frame.';
});

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
  document.querySelectorAll('.section-heading, .feature-row, .recording, .setup-steps, .privacy, .faq, .launch').forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
