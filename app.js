/* ===== Helpers ===== */
const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => [...o.querySelectorAll(s)];

/* ===== Navbar: hamburguesa ===== */
const navToggle = $('#navToggle');
const navMenu   = $('#navMenu');

if (navToggle && navMenu){
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar al hacer click en un enlace
  navMenu.addEventListener('click', e => {
    if (e.target.matches('a')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar si clic fuera
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ===== Hora y estado abierto/cerrado ===== */
const timeNow = $('#timeNow');
const openBadge = $('#openBadge');

function updateTimeAndOpen(){
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  if (timeNow) timeNow.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const day = now.getDay(); // 0 dom, 6 sab
  const mins = now.getHours()*60 + now.getMinutes();
  const open = (day >= 1 && day <= 6) && (mins >= (6*60+45)) && (mins <= (20*60+30));

  if (openBadge){
    openBadge.textContent = open ? 'Open now' : 'Closed';
    openBadge.style.background = open ? 'rgba(149,176,143,.25)' : '#fff';
    openBadge.style.borderColor = open ? 'var(--ring)' : '#e6e8e3';
  }
}
updateTimeAndOpen();
setInterval(updateTimeAndOpen, 30 * 1000);

/* ===== Map button (demo) ===== */
const mapBtn = $('#mapBtn');
if (mapBtn){
  mapBtn.addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/', '_blank', 'noopener');
  });
}

/* ===== Slider simple ===== */
(function initSlider(){
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const track = slider.querySelector('[data-track]');
  const prev = slider.querySelector('[data-prev]');
  const next = slider.querySelector('[data-next]');

  const snapTo = (dir = 1) => {
    const card = track.querySelector('.slide');
    if (!card) return;
    const step = card.getBoundingClientRect().width + 16; // 16 = gap
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => snapTo(-1));
  next?.addEventListener('click', () => snapTo(1));
})();

/* ===== Año dinámico ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== Scroll suave para anclas ===== */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if (id.length > 1 && $(id)) {
      e.preventDefault();
      $(id).scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
});

/* ===== EmailJS: envío del formulario =====
  1) Crea tu cuenta en https://www.emailjs.com/
  2) Crea un Service (service_xxx) y un Template (template_xxx)
  3) Copia tu Public Key (e.g. "YOUR_PUBLIC_KEY")
  4) Sustituye las constantes abajo
*/
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "service_xxx";
const EMAILJS_TEMPLATE_ID = "template_xxx";

const form = $('#contactForm');
const formMsg = $('#formMsg');

function initEmailJS(){
  if (!window.emailjs) return;
  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch {}
}

function serializeForm(formEl){
  const data = new FormData(formEl);
  return Object.fromEntries(data.entries());
}

function showMsg(text, ok = true){
  if (!formMsg) return;
  formMsg.textContent = text;
  formMsg.style.color = ok ? '#2e4a2f' : '#b00020';
}

initEmailJS();

if (form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const values = serializeForm(form);
    // Validación mínima
    if (!values.name || !values.email){
      showMsg('Completa tu nombre y correo.', false);
      return;
    }

    showMsg('Enviando...');
    try{
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: values.name,
        reply_to: values.email,
        message: 'Quiero agendar una llamada desde la landing Yogahv.'
      });
      showMsg('¡Enviado! Te contactamos pronto.');
      form.reset();
    }catch(err){
      console.error(err);
      showMsg('Hubo un problema al enviar. Intenta nuevamente.', false);
    }
  });
}