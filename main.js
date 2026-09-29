// reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('is-in'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// safety net: never leave content invisible
setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 1.2) el.classList.add('is-in');
  });
}, 2500);

// toast
const toast = document.getElementById('toast');
let toastTimer;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2600);
}

// builder
const tee = document.getElementById('tee');
const teeImg = document.getElementById('teeImg');
const print = document.getElementById('teePrint');
const input = document.getElementById('phrase');
const count = document.getElementById('count');
const imgs = { noir: 'assets/blank-noir.png', creme: 'assets/blank-creme.png', orange: 'assets/blank-orange.png' };
const teeLogo = document.getElementById('teeLogo');
const logos = { noir: 'assets/logo-white.png', creme: 'assets/logo-ink.png', orange: 'assets/logo-white.png' };
const labels = { noir: 'Noir', creme: 'Crème', orange: 'Orange brûlé' };
let color = 'noir';
let size = 'M';

function render() {
  const v = input.value.trim();
  print.textContent = v ? v.toUpperCase() : 'TA PHRASE ICI';
  count.textContent = input.value.length;
}
input.addEventListener('input', render);
render();

document.querySelectorAll('.sw').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.sw').forEach(s => s.classList.remove('is-on'));
    sw.classList.add('is-on');
    color = sw.dataset.color;
    tee.dataset.color = color;
    teeImg.src = imgs[color];
    if (teeLogo) teeLogo.src = logos[color];
  });
});

document.querySelectorAll('.size').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.size').forEach(s => s.classList.remove('is-on'));
    b.classList.add('is-on');
    size = b.textContent.trim();
  });
});

const ideas = [
  'Rien ne presse, tout avance',
  'Je pense donc je dérange',
  'Le doute est un muscle',
  'Debout avant le soleil',
  'Moins de bruit, plus de sens',
  'On verra bien, mais on y va',
  'Le calme est une stratégie'
];
document.getElementById('surprise').addEventListener('click', () => {
  const next = ideas[Math.floor(Math.random() * ideas.length)];
  input.value = next;
  render();
  say('Nouvelle phrase : « ' + next + ' »');
});

// commande -> WhatsApp
const WA = '237658386355';
const RATE = 568;
const PRICES = { 1: 10, 2: 18, 3: 25, 4: 34 };
const fcfa = usd => (Math.round(usd * RATE / 100) * 100).toLocaleString('fr-FR').replace(/\u202f|,/g, ' ');
const modal = document.getElementById('checkout');
const ckSum = document.getElementById('ckSum');
const ckQty = document.getElementById('ckQty');
const ckPay = document.getElementById('ckPay');
const ckName = document.getElementById('ckName');
const ckCity = document.getElementById('ckCity');
const ckTotal = document.getElementById('ckTotal');
const ckSend = document.getElementById('ckSend');
let order = { model: '', phrase: '', color: '', size: '' };

function ckRender() {
  const q = parseInt(ckQty.value, 10);
  const usd = PRICES[q] || q * 10;
  ckTotal.textContent = 'Total : ' + usd + ' $ ';
  const i = document.createElement('i');
  i.textContent = '≈ ' + fcfa(usd) + ' FCFA';
  ckTotal.appendChild(i);
  const lines = [
    'Bonjour NAKASH by OJL, je veux passer une commande.',
    '',
    'Modèle : ' + order.model,
    order.phrase ? 'Phrase : « ' + order.phrase + ' »' : null,
    'Couleur : ' + order.color + ' · Taille : ' + order.size,
    'Quantité : ' + q,
    'Total : ' + usd + ' $ (≈ ' + fcfa(usd) + ' FCFA)',
    'Paiement : ' + ckPay.value,
    ckName.value.trim() ? 'Nom : ' + ckName.value.trim() : null,
    ckCity.value.trim() ? 'Livraison : ' + ckCity.value.trim() : null
  ].filter(Boolean);
  ckSend.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
}
[ckQty, ckPay, ckName, ckCity].forEach(el => el.addEventListener('input', ckRender));

function openCheckout(o) {
  order = o;
  ckSum.textContent = o.model + (o.phrase ? ' — « ' + o.phrase + ' »' : '') + ' · ' + o.color + ' · taille ' + o.size;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  ckRender();
}
function closeCheckout() { modal.hidden = true; document.body.style.overflow = ''; }
document.getElementById('ckClose').addEventListener('click', closeCheckout);
modal.addEventListener('click', e => { if (e.target === modal) closeCheckout(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeCheckout(); });

const catalogue = {
  'Pense plus fort': 'noir',
  "Je suis en retard, mais j'arrive": 'orange',
  'Encore debout': 'creme'
};
document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.add === 'custom') {
      openCheckout({
        model: 'T-shirt personnalisé',
        phrase: input.value.trim() || 'à définir',
        color: labels[color],
        size: size
      });
    } else {
      openCheckout({
        model: btn.dataset.add,
        phrase: btn.dataset.add,
        color: labels[catalogue[btn.dataset.add] || 'noir'],
        size: 'à confirmer'
      });
    }
    say('Choisis ton paiement mobile, puis envoie la commande sur WhatsApp.');
  });
});

// email capture (demo)
document.querySelector('.offer__form').addEventListener('submit', e => {
  e.preventDefault();
  const field = e.target.querySelector('input');
  if (!field.value.includes('@')) { say('Ajoute une adresse e-mail valide.'); return; }
  field.value = '';
  say('Inscrit. Ton code −10 % arrive par e-mail (démo).');
});
