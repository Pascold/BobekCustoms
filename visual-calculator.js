(() => {
  const serviceData = {
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

  const services = Object.entries(serviceData).flatMap(([category, entries]) =>
    entries.map(([name, price]) => ({ id: `${category}::${name}`, category, name, price }))
  );
  const serviceById = new Map(services.map(service => [service.id, service]));
  const state = { quantities: new Map(), category: 'Wszystkie', discount: 0, collapsed: new Set() };
  const $ = selector => document.querySelector(selector);
  const tabs = $('#service-tabs');
  const catalog = $('#service-catalog');
  const selected = $('#selected-services');
  const total = $('#calc-total');
  const oldTotal = $('#calc-old-total');
  const search = $('#visual-search');
  const fmt = amount => `${Math.round(amount).toLocaleString('pl-PL')} $`;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const quantity = id => state.quantities.get(id) || 0;
  const countIn = category => services.reduce((sum, service) =>
    sum + ((category === 'Wszystkie' || service.category === category) ? quantity(service.id) : 0), 0);

  function renderTabs() {
    tabs.innerHTML = ['Wszystkie', ...Object.keys(serviceData)].map(category =>
      `<button type="button" class="service-tab${state.category === category ? ' active' : ''}" data-category="${escapeHtml(category)}">${escapeHtml(category)} <b>${countIn(category)}</b></button>`
    ).join('');
  }

  function renderCatalog() {
    const query = search.value.trim().toLocaleLowerCase('pl');
    const groups = Object.keys(serviceData).filter(category => state.category === 'Wszystkie' || category === state.category);
    const sections = groups.map(category => {
      const entries = services.filter(service => service.category === category && service.name.toLocaleLowerCase('pl').includes(query));
      if (!entries.length) return '';
      const isCollapsed = state.collapsed.has(category);
      const rows = entries.map(service => `<article class="service-item" data-service-id="${encodeURIComponent(service.id)}">
        <div class="service-info"><strong>${escapeHtml(service.name)}</strong><small>${fmt(service.price)} · ${escapeHtml(service.category)}</small></div>
        <div class="quantity-controls"><button type="button" class="qty-button minus" data-quantity-action="minus" aria-label="Odejmij ${escapeHtml(service.name)}">−</button><span class="quantity">${quantity(service.id)}</span><button type="button" class="qty-button plus" data-quantity-action="plus" aria-label="Dodaj ${escapeHtml(service.name)}">+</button></div>
      </article>`).join('');
      return `<section class="service-category"><button type="button" class="category-heading" data-collapse="${escapeHtml(category)}"><span>${escapeHtml(category)} <small>${countIn(category)}</small></span><span class="collapse-label">${isCollapsed ? 'Rozwiń' : 'Zwiń'}⌄</span></button>${isCollapsed ? '' : `<div class="service-list">${rows}</div>`}</section>`;
    }).join('');
    catalog.innerHTML = sections || '<div class="calc-no-results">Brak wyników wyszukiwania.</div>';
  }

  function renderDiscounts() {
    $('#discount-options').innerHTML = [0.2, 0.25, 0.3].map(discount =>
      `<div class="discount-group"><button type="button" class="discount-option" data-discount="${discount}" aria-pressed="false"><span>${discount * 100}% zniżki</span><b>OFF</b></button></div>`
    ).join('');
  }

  function renderSummary() {
    const chosen = services.filter(service => quantity(service.id) > 0);
    selected.innerHTML = chosen.length ? chosen.map(service =>
      `<div class="calc-summary-row"><span>${escapeHtml(service.name)} × ${quantity(service.id)}</span><b>${fmt(service.price * quantity(service.id))}</b></div>`
    ).join('') : '<div class="calc-empty">Nic nie wybrano jeszcze.</div>';

    const subtotal = chosen.reduce((sum, service) => sum + service.price * quantity(service.id), 0);
    oldTotal.textContent = state.discount ? fmt(subtotal) : '';
    oldTotal.hidden = !state.discount;
    total.textContent = fmt(subtotal * (1 - state.discount));
    document.querySelectorAll('.discount-option').forEach(button => {
      const active = Number(button.dataset.discount) === state.discount;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.querySelector('b').textContent = active ? 'ON' : 'OFF';
    });
  }

  function renderAll() {
    renderTabs();
    renderCatalog();
    renderSummary();
  }

  function showToast(message) {
    const toast = $('#calc-toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    renderAll();
  });

  catalog.addEventListener('click', event => {
    const collapseButton = event.target.closest('[data-collapse]');
    if (collapseButton) {
      const category = collapseButton.dataset.collapse;
      state.collapsed.has(category) ? state.collapsed.delete(category) : state.collapsed.add(category);
      renderCatalog();
      return;
    }

    const actionButton = event.target.closest('[data-quantity-action]');
    if (!actionButton) return;
    const row = actionButton.closest('[data-service-id]');
    if (!row) return;
    const id = decodeURIComponent(row.dataset.serviceId);
    if (!serviceById.has(id)) return;
    const next = Math.max(0, quantity(id) + (actionButton.dataset.quantityAction === 'plus' ? 1 : -1));
    if (next) state.quantities.set(id, next);
    else state.quantities.delete(id);

    // Update only the clicked quantity; preserve list position and the button under the pointer.
    row.querySelector('.quantity').textContent = String(next);
    renderTabs();
    renderSummary();
  });

  search.addEventListener('input', renderCatalog);
  window.addEventListener('pageshow', () => {
    search.value = '';
    renderAll();
  });
  $('#discount-options').addEventListener('click', event => {
    const button = event.target.closest('[data-discount]');
    if (!button) return;
    const discount = Number(button.dataset.discount);
    state.discount = state.discount === discount ? 0 : discount;
    renderSummary();
  });
  $('#clear-services').addEventListener('click', () => {
    if (!state.quantities.size) { showToast('Nic nie ma zaznaczone.'); return; }
    state.quantities.clear();
    renderAll();
    showToast('Wyczyszczono wszystkie zaznaczone elementy.');
  });
  $('#copy-summary').addEventListener('click', async () => {
    const chosen = services.filter(service => quantity(service.id) > 0);
    if (!chosen.length) { showToast('Najpierw wybierz usługi.'); return; }
    const subtotal = chosen.reduce((sum, service) => sum + service.price * quantity(service.id), 0);
    const lines = chosen.map(service => `${service.name} × ${quantity(service.id)} = ${fmt(service.price * quantity(service.id))}`);
    lines.push(`Razem: ${fmt(subtotal * (1 - state.discount))}`);
    if (state.discount) lines.push(`Zniżka: ${Math.round(state.discount * 100)}%`);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      showToast('Skopiowano podsumowanie!');
    } catch {
      showToast('Nie udało się skopiować.');
    }
  });

  search.value = '';
  renderDiscounts();
  renderAll();
})();
