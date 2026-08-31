/* Top Marketing — cart */

(() => {
  'use strict';

  const STORAGE_KEY = 'topmarketing.cart.v1';
  const CODES = { LAUNCH20: 0.20, STUDENT10: 0.10 };

  // Everything is integer cents — money() is the only place that divides.
  const money = cents =>
    (cents / 100).toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });

  const $ = sel => document.querySelector(sel);

  let items = [];
  let code = null;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Array.isArray(saved.items)) items = saved.items;
    if (saved.code in CODES) code = saved.code;
  } catch {
    // Ignore a corrupted entry and start from an empty cart.
  }

  const el = {
    cart: $('#cart'),
    scrim: $('#scrim'),
    list: $('#cartList'),
    empty: $('#cartEmpty'),
    count: $('#cartCount'),
    topTotal: $('#topTotal'),
    subtotal: $('#subtotal'),
    discountRow: $('#discountRow'),
    discount: $('#discount'),
    total: $('#total'),
    checkout: $('#checkout'),
    codeInput: $('#codeInput'),
    codeMsg: $('#codeMsg'),
  };

  /* Drawer */

  function open() {
    el.cart.classList.add('open');
    el.scrim.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    el.cart.classList.remove('open');
    el.scrim.classList.remove('open');
    document.body.style.overflow = '';
  }

  $('#cartBtn').addEventListener('click', open);
  $('#cartClose').addEventListener('click', close);
  el.scrim.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  /* Status message */

  let statusTimer;

  function status(text) {
    let node = $('.status');
    if (!node) {
      node = document.createElement('div');
      node.className = 'status';
      node.setAttribute('role', 'status');
      document.body.appendChild(node);
    }
    node.textContent = text;
    requestAnimationFrame(() => node.classList.add('show'));
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => node.classList.remove('show'), 2400);
  }

  /* Cart operations */

  function add(id, name, price) {
    const existing = items.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else items.push({ id, name, price, qty: 1 });
    render();
    status(`${name} added`);
  }

  function setQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) items = items.filter(i => i.id !== id);
    render();
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    render();
  }

  /* Render */

  function render() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, code }));

    el.count.textContent = items.reduce((sum, i) => sum + i.qty, 0);
    el.empty.hidden = items.length > 0;

    el.list.innerHTML = items
      .map(
        i => `
      <li>
        <div class="item-main">
          <h4>${i.name}</h4>
          <p class="item-unit">${money(i.price)} each</p>
          <div class="qty">
            <button type="button" data-act="dec" data-id="${i.id}" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button type="button" data-act="inc" data-id="${i.id}" aria-label="Increase">+</button>
            <button type="button" class="remove" data-act="rm" data-id="${i.id}">Remove</button>
          </div>
        </div>
        <p class="item-sum">${money(i.price * i.qty)}</p>
      </li>`
      )
      .join('');

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const rate = code ? CODES[code] : 0;
    const discount = subtotal * rate;

    el.subtotal.textContent = money(subtotal);
    el.discountRow.hidden = discount === 0;
    el.discount.textContent = '−' + money(discount);
    el.total.textContent = money(subtotal - discount);
    if (el.topTotal) el.topTotal.textContent = money(subtotal - discount);
    el.checkout.disabled = items.length === 0;
  }

  /* Events */

  document.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => {
      add(btn.dataset.id, btn.dataset.name, Number(btn.dataset.price));
      open();
    });
  });

  // Variant pills: pick one and the price and the Add button follow it.
  document.querySelectorAll('.variants').forEach(group => {
    const card = group.closest('.card');
    const priceBox = card.querySelector('.card-price');
    const addBtn = card.querySelector('.add');

    group.addEventListener('click', e => {
      const opt = e.target.closest('.vopt');
      if (!opt) return;

      group.querySelectorAll('.vopt').forEach(o => o.classList.toggle('on', o === opt));

      const cents = Number(opt.dataset.price);
      const was = opt.dataset.was ? Number(opt.dataset.was) : 0;

      priceBox.innerHTML =
        (was ? `<span class="was">${money(was)}</span> ` : '') +
        (cents ? `<span class="now">${money(cents)}</span>`
               : '<span class="now free">Free</span>');

      addBtn.dataset.id = opt.dataset.sku;
      addBtn.dataset.name = opt.dataset.name;
      addBtn.dataset.price = cents;
      addBtn.disabled = cents === 0;
      addBtn.textContent = cents ? 'Add' : 'Free';
    });
  });

  el.list.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === 'inc') setQty(id, 1);
    else if (act === 'dec') setQty(id, -1);
    else if (act === 'rm') remove(id);
  });

  function applyCode() {
    const entered = el.codeInput.value.trim().toUpperCase();
    if (entered in CODES) {
      code = entered;
      el.codeMsg.className = 'code-msg ok';
      el.codeMsg.textContent = `${entered} applied — ${CODES[entered] * 100}% off.`;
    } else {
      code = null;
      el.codeMsg.className = 'code-msg bad';
      el.codeMsg.textContent = 'That code is not valid.';
    }
    render();
  }

  $('#codeBtn').addEventListener('click', applyCode);
  el.codeInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') applyCode();
  });

  /* Checkout — happens on its own page, which reads the cart from storage */

  el.checkout.addEventListener('click', () => {
    if (items.length === 0) return;
    location.href = '/checkout.html';
  });

  /* Browsing — search text and the everything/single/bundle toggle */

  const catalogue = $('#catalogue');

  if (catalogue) {
    const cards = [...catalogue.querySelectorAll('.card')];
    const rows = [...catalogue.querySelectorAll('.row')];
    const noHits = $('#noHits');
    const finder = $('#finder');
    const scope = $('#scope');

    let term = '';
    let want = 'all';

    function apply() {
      let hits = 0;

      cards.forEach(card => {
        const inScope =
          want === 'all' ||
          (want === 'deal' && card.dataset.deal === '1') ||
          (want === 'entry' && card.dataset.entry === '1');
        const match = inScope && (!term || card.dataset.search.includes(term));
        card.hidden = !match;
        if (match) hits += 1;
      });

      // A row with nothing left in it is noise, so it goes too.
      rows.forEach(row => {
        row.hidden = ![...row.querySelectorAll('.card')].some(c => !c.hidden);
      });

      noHits.hidden = hits > 0;
    }

    finder.addEventListener('input', () => {
      term = finder.value.trim().toLowerCase();
      apply();
    });

    $('#finderGo').addEventListener('click', () => {
      catalogue.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    scope.addEventListener('click', e => {
      const b = e.target.closest('button[data-scope]');
      if (!b) return;
      scope.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      want = b.dataset.scope;
      apply();
    });

    document.querySelectorAll('[data-jump]').forEach(link => {
      link.addEventListener('click', () => {
        const row = catalogue.querySelector(`[data-row="${link.dataset.jump}"]`);
        if (row) setTimeout(() => row.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      });
    });

    // Row arrows: one card width plus the gap, whatever the breakpoint made it.
    catalogue.addEventListener('click', e => {
      const arrow = e.target.closest('.arrow');
      if (!arrow) return;
      const track = arrow.closest('.row').querySelector('.track');
      const card = track.querySelector('.card:not([hidden])');
      const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
      track.scrollBy({ left: step * Number(arrow.dataset.scroll), behavior: 'smooth' });
    });
  }

  render();
})();
