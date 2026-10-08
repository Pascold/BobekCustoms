(() => {
  const cars = window.cars || [];
  const fmt = window.fmt || (n => new Intl.NumberFormat('pl-PL').format(n) + ' $');
  const grid = document.querySelector('#grid');
  const query = document.querySelector('#q');
  const modalRoot = document.querySelector('#modal-root');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render() {
    const shown = cars.filter(car => car.name.toLowerCase().includes(query.value.toLowerCase().trim()));
    if (!shown.length) {
      grid.innerHTML = `<div class="empty">${cars.length ? 'Nie znaleziono auta o takiej nazwie.' : 'Dodaj modele i ceny salonowe do pliku data.js.'}</div>`;
      return;
    }
    grid.innerHTML = shown.map(car => `<button class="car-card" type="button" data-name="${encodeURIComponent(car.name)}">
      <span class="car-top"><span class="car-name">${esc(car.name)}</span><span class="arrow">↗</span></span>
      <span class="full-pricetitle">FULL TUNE <span class="full-price">${fmt(car.full)}</span></span>
      <span class="salon-price">Cena salonowa: <b>${fmt(car.salon)}</b></span>
    </button>`).join('');
  }

  function openCar(name) {
    const car = cars.find(item => item.name === name);
    if (!car) return;
    const parts = [['Silnik',car.engine],['Skrzynia biegów',car.gear],['Turbo',car.turbo],['Zawieszenie',car.susp],['Hamulce',car.brakes],['Pancerz',car.armor]];
    modalRoot.innerHTML = `<div class="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-head"><div><div class="eyebrow">Twój konfigurator</div><h2 id="modal-title">${esc(car.name)}</h2></div><button class="close" type="button" aria-label="Zamknij">×</button></div>
      <div class="summary"><div class="summarybox">Cena salonowa<strong>${fmt(car.salon)}</strong></div><div class="summarybox accent">Cena full tuning<strong>${fmt(car.full)}</strong></div></div>
      <label class="full-row"><input type="checkbox" id="full-toggle"><strong>Full Tune</strong><span>${fmt(car.full)}</span></label>
      <div class="parts-head"><h3>Pojedyncze części</h3></div>
      <div class="parts">${parts.map(([part,price],i)=>`<label class="checkrow"><input type="checkbox" class="part-toggle" data-price="${price}" id="part-${i}"><span class="part-info"><span class="part-name">${part}</span></span><span class="part-price">${fmt(price)}</span></label>`).join('')}</div>
      <div class="discount-row"><button type="button" class="discount-btn" aria-pressed="false">−20% ZNIŻKI</button><div class="total"><small>Suma do zapłaty</small><span class="old-price"></span><strong class="total-price">0 $</strong></div></div>
    </section></div>`;

    const modal = modalRoot.querySelector('.modal');
    const full = modal.querySelector('#full-toggle');
    const partChecks = [...modal.querySelectorAll('.part-toggle')];
    const discount = modal.querySelector('.discount-btn');
    let discounted = false;
    const update = () => {
      const amount = full.checked ? car.full : partChecks.reduce((sum, input) => sum + (input.checked ? Number(input.dataset.price) : 0), 0);
      modal.querySelector('.total-price').textContent = fmt(discounted ? Math.round(amount * .8) : amount);
      modal.querySelector('.old-price').textContent = discounted ? fmt(amount) : '';
      partChecks.forEach(input => input.disabled = full.checked);
    };
    full.addEventListener('change', () => { if (full.checked) partChecks.forEach(input => input.checked = false); update(); });
    partChecks.forEach(input => input.addEventListener('change', () => { if (input.checked) full.checked = false; update(); }));
    discount.addEventListener('click', () => { discounted = !discounted; discount.setAttribute('aria-pressed', String(discounted)); update(); });
    const close = () => { modalRoot.innerHTML = ''; };
    modalRoot.querySelector('.close').addEventListener('click', close);
    modalRoot.querySelector('.backdrop').addEventListener('click', event => { if (event.target.classList.contains('backdrop')) close(); });
    update();
  }

  grid.addEventListener('click', event => {
    const card = event.target.closest('.car-card');
    if (card) openCar(decodeURIComponent(card.dataset.name));
  });
  query.addEventListener('input', render);
  document.querySelector('#tab-tune').addEventListener('click', () => {
    document.querySelector('#tab-tune').classList.add('active');
    document.querySelector('#tab-visual').classList.remove('active');
    document.querySelector('#tune-view').classList.remove('hidden');
    document.querySelector('#visual-view').classList.add('hidden');
  });
  document.querySelector('#tab-visual').addEventListener('click', () => {
    document.querySelector('#tab-visual').classList.add('active');
    document.querySelector('#tab-tune').classList.remove('active');
    document.querySelector('#visual-view').classList.remove('hidden');
    document.querySelector('#tune-view').classList.add('hidden');
  });
  render();
})();
