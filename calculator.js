(() => {
  const services = {
    'Naprawy': [['Naprawa silnika',15000],['Pełna naprawa',20000],['Mycie',15000],['Otwarcie zamka',80000]],
    'Lakierowanie': [['Kolor główny',25000],['Kolor dodatkowy',25000],['Perłowy',25000],['Kolor Wnętrza',30000],['Kolor Deski',30000]],
    'Światła': [['Xenon',20000]],
    'Neony': [['Z lewej stronny',25000],['Z prawej strony',25000],['Z przodu',25000],['Z tyłu',25000],['Kolor neonów',25000]],
    'Opony': [['Wymiana felgi',30000],['Kolor Felgi',30000],['Naklejka na opony',30000],['Dym spod opon',30000]],
    'Szyby': [['Przyciemnianie szyb',30000]],
    'Karoseria': [['Klapa',40000],['Progi',40000],['Wydech',40000],['Maska',40000],['Błotniki',40000],['Dach',40000],['Nadwozie',40000],['Wnętrze',40000],['Zderzaki',40000],['Front',40000],['Extrasy',60000]],
    'Inne': [['Klakson',30000],['Tablica rejestracyjna',30000],['Naklejki',40000],['Pneumatyka',40000]],
    'Zgłoszenia': [['Naprawka silnika z dojazdem',50000],['Pełna naprawka z dojazdem',70000]]
  };
  const state = { qty: {}, category: 'Wszystkie', discount: 0, collapsed: new Set() };
  const tabs = document.querySelector('#service-tabs');
  const catalog = document.querySelector('#service-catalog');
  const selected = document.querySelector('#selected-services');
  const totalEl = document.querySelector('#calc-total');
  const search = document.querySelector('#visual-search');
  const fmt = (value, currency = '$') => `${Math.round(value).toLocaleString('pl-PL')} ${currency}`;
  const keyFor = (category, name) => `${category}::${name}`;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const items = () => Object.entries(services).flatMap(([category, list]) => list.map(([name, price]) => ({ category, name, price, key: keyFor(category, name) })));
  const countIn = category => items().filter(item => (!category || category === 'Wszystkie' || item.category === category)).reduce((sum, item) => sum + (state.qty[item.key] || 0), 0);

  function renderTabs() {
    tabs.innerHTML = '';
    ['Wszystkie', ...Object.keys(services)].forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `service-tab${state.category === category ? ' active' : ''}`;
      button.innerHTML = `${esc(category)} <b>${countIn(category)}</b>`;
      button.addEventListener('click', () => { state.category = category; render(); });
      tabs.appendChild(button);
    });
  }

  function change(key, delta) {
    state.qty[key] = Math.max(0, (state.qty[key] || 0) + delta);
    if (!state.qty[key]) delete state.qty[key];
    render();
  }

  function renderCatalog() {
    const query = search.value.trim().toLocaleLowerCase('pl');
    const groups = Object.entries(services).filter(([category]) => state.category === 'Wszystkie' || state.category === category);
    catalog.innerHTML = '';
    groups.forEach(([category, list]) => {
      const filtered = list.filter(([name]) => name.toLocaleLowerCase('pl').includes(query));
      if (!filtered.length) return;
      const section = document.createElement('section');
      section.className = 'service-category';
      const heading = document.createElement('button');
      heading.type = 'button';
      heading.className = 'category-heading';
      heading.innerHTML = `<span>${esc(category)} <small>${countIn(category)}</small></span><span class="collapse-label">${state.collapsed.has(category) ? 'Rozwiń' : 'Zwiń'}⌄</span>`;
      heading.addEventListener('click', () => { state.collapsed.has(category) ? state.collapsed.delete(category) : state.collapsed.add(category); renderCatalog(); });
      section.appendChild(heading);
      if (!state.collapsed.has(category)) {
        const listNode = document.createElement('div');
        listNode.className = 'service-list';
        filtered.forEach(([name, price]) => {
          const key = keyFor(category, name);
          const quantity = state.qty[key] || 0;
          const row = document.createElement('article');
          row.className = 'service-item';
          row.innerHTML = `<div class="service-info"><strong>${esc(name)}</strong><small>${price.toLocaleString('pl-PL')} $ · ${esc(category)}</small></div><div class="quantity-controls"><button type="button" class="qty-button minus" aria-label="Odejmij ${esc(name)}">−</button><span class="quantity">${quantity}</span><button type="button" class="qty-button plus" aria-label="Dodaj ${esc(name)}">+</button></div>`;
          row.querySelector('.minus').addEventListener('click', () => change(key, -1));
          row.querySelector('.plus').addEventListener('click', () => change(key, 1));
          listNode.appendChild(row);
        });
        section.appendChild(listNode);
      }
      catalog.appendChild(section);
    });
    if (!catalog.children.length) catalog.innerHTML = '<div class="calc-no-results">Brak wyników wyszukiwania.</div>';
  }

  function rawTotal() {
    return items().reduce((sum, item) => sum + (state.qty[item.key] || 0) * item.price, 0);
  }

  function renderSummary() {
    const chosen = items().filter(item => state.qty[item.key]);
    selected.innerHTML = chosen.length
      ? chosen.map(item => `<div class="calc-summary-row"><span>${esc(item.name)} × ${state.qty[item.key]}</span><b>${fmt(item.price * state.qty[item.key])}</b></div>`).join('')
      : '<div class="calc-empty">Nic nie wybrano jeszcze.</div>';
    const discounted = Math.round(rawTotal() * (1 - state.discount));
    totalEl.classList.remove('update');
    void totalEl.offsetWidth;
    totalEl.classList.add('update');
    totalEl.textContent = fmt(discounted);
    document.querySelectorAll('.discount-option').forEach(button => {
      const discount = Number(button.dataset.discount);
      const active = state.discount === discount;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.querySelector('b').textContent = active ? 'ON' : 'OFF';
      button.nextElementSibling.textContent = active ? 'Zniżka aktywna.' : 'Zniżka nieaktywna.';
    });
  }

  function renderDiscounts() {
    const host = document.querySelector('#discount-options');
    host.innerHTML = [0.2, 0.25, 0.3].map(discount => `<div class="discount-group"><button type="button" class="discount-option" data-discount="${discount}" aria-pressed="false"><span>${Math.round(discount * 100)}% zniżki</span><b>OFF</b></button><small>Zniżka nieaktywna.</small></div>`).join('');
    host.querySelectorAll('.discount-option').forEach(button => button.addEventListener('click', () => {
      const discount = Number(button.dataset.discount);
      state.discount = state.discount === discount ? 0 : discount;
      renderSummary();
    }));
  }

  function toast(message) {
    const element = document.querySelector('#calc-toast');
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove('show'), 1800);
  }

  async function copySummary() {
    const chosen = items().filter(item => state.qty[item.key]);
    if (!chosen.length) { toast('Najpierw wybierz usługi.'); return; }
    const lines = chosen.map(item => `${item.name} × ${state.qty[item.key]} = ${fmt(item.price * state.qty[item.key])}`);
    lines.push(`Razem: ${totalEl.textContent}`);
    if (state.discount) lines.push(`Zniżka: ${Math.round(state.discount * 100)}%`);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast('Skopiowano podsumowanie!');
    } catch {
      toast('Nie udało się skopiować.');
    }
  }

  search.addEventListener('input', renderCatalog);
  window.addEventListener('pageshow', () => {
    search.value = '';
    renderCatalog();
  });
  document.querySelector('#clear-services').addEventListener('click', () => {
    if (!Object.keys(state.qty).length) { toast('Nic nie ma zaznaczone.'); return; }
    state.qty = {};
    render();
    toast('Wyczyszczono wszystkie zaznaczone elementy.');
  });
  document.querySelector('#copy-summary').addEventListener('click', copySummary);
  search.value = '';

  renderDiscounts();
  render();
})();
