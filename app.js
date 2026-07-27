/* ===== مصاريفي الشهرية — منطق التطبيق ===== */
(function () {
  'use strict';

  /* ---------- ثوابت عربية ---------- */
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var DAYS = ['الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var DAYS_SHORT = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  var CURRENCIES = ['ر.ع', 'ر.س', 'د.إ', 'د.ك', 'د.ب', 'ر.ق', 'ج.م', '$'];

  /* ---------- التصنيفات (15 أيقونة) ---------- */
  var S = '<g fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">';
  var CATS = [
    { id: 'electronics', name: 'إلكترونيات', color: '#17A35B',
      svg: S + '<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10" y="10" width="4" height="4"/><path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3"/></g>' },
    { id: 'movies', name: 'أفلام', color: '#E03B33',
      svg: S + '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M6.8 5v14M17.2 5v14"/></g><path fill="#fff" d="M10.2 9.4l4.4 2.6-4.4 2.6z"/>' },
    { id: 'internet', name: 'إنترنت', color: '#1E7FE0',
      svg: S + '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4.2" ry="9"/><path d="M3.4 9h17.2M3.4 15h17.2"/></g>' },
    { id: 'phone', name: 'هاتف', color: '#F0468A',
      svg: S + '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 5.5h3"/></g><circle cx="12" cy="18" r="1.2" fill="#fff"/>' },
    { id: 'repair', name: 'صيانة', color: '#7B48D3',
      svg: S + '<path d="M14.8 3.2a5 5 0 0 0-3.6 8.3L3.5 19.2l1.8 1.8 7.7-7.7a5 5 0 0 0 6.4-6.6l-2.6 2.6-2.5-.7-.7-2.5 2.6-2.6a5 5 0 0 0-1.4-.3z"/></g>' },
    { id: 'water', name: 'ماء', color: '#16A6C4',
      svg: S + '<path d="M3 8c2-1.7 4-1.7 6 0s4 1.7 6 0 4-1.7 6 0"/><path d="M3 13c2-1.7 4-1.7 6 0s4 1.7 6 0 4-1.7 6 0"/><path d="M3 18c2-1.7 4-1.7 6 0s4 1.7 6 0 4-1.7 6 0"/></g>' },
    { id: 'electricity', name: 'كهرباء', color: '#F0B929',
      svg: '<path fill="#fff" d="M13.2 2L4 14h6l-1.2 8L19 10h-6.4l.6-8z"/>' },
    { id: 'food', name: 'طعام', color: '#7CB342',
      svg: S + '<circle cx="12" cy="12" r="8.6"/></g><path fill="#fff" d="M9 6v4.3c0 .8.5 1.4 1.15 1.6V18h1.2v-6.1c.65-.2 1.15-.8 1.15-1.6V6h-.9v3.5h-.68V6h-.9v3.5h-.68V6H9zm6.7 0c-.95.75-1.45 2-1.45 3.4 0 1.2.4 2 1.1 2.35V18h1.15V6h-.8z"/>' },
    { id: 'fuel', name: 'بترول', color: '#E8A317',
      svg: S + '<path d="M3.5 21V4.5A1.5 1.5 0 0 1 5 3h6.5A1.5 1.5 0 0 1 13 4.5V21"/><path d="M2.2 21h12.6"/><rect x="6" y="6" width="4.5" height="3.4"/><path d="M13 10h3.4c.8 0 1.4.6 1.4 1.4v5.1a1.6 1.6 0 0 0 3.2 0V8.4L18.4 5.8"/></g>' },
    { id: 'rent', name: 'إيجار', color: '#1E63C8',
      svg: S + '<path d="M3.2 11L12 4l8.8 7"/><path d="M5.5 9.8V19.5h13V9.8"/><circle cx="12" cy="13.6" r="1.6"/><path d="M12 15.2V17.8"/></g>' },
    { id: 'health', name: 'صحة', color: '#E8355F',
      svg: S + '<path d="M12 20.5S4 15 4 9.8A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4c0 5.2-8 10.7-8 10.7z"/><path d="M12 10.2v4.6M9.7 12.5h4.6"/></g>' },
    { id: 'bills', name: 'فواتير', color: '#2E7CE0',
      svg: S + '<path d="M5.5 2.5h13v19l-2.2-1.6-2.2 1.6-2.2-1.6-2.2 1.6-2.2-1.6z"/><path d="M8.5 7.2h7M8.5 11h7M8.5 14.8h4"/></g>' },
    { id: 'tv', name: 'اشتراكات', color: '#D62828',
      svg: S + '<rect x="2.5" y="4.5" width="19" height="13" rx="2"/><path d="M8 21h8M12 17.5V21"/></g><path fill="#fff" d="M10.3 8.2l4.6 2.8-4.6 2.8z"/>' },
    { id: 'bank', name: 'بنك', color: '#12897E',
      svg: S + '<path d="M2.5 9.5L12 4l9.5 5.5"/><path d="M5 11.2v7.3M9.7 11.2v7.3M14.3 11.2v7.3M19 11.2v7.3M3 20.5h18"/></g>' },
    { id: 'clothes', name: 'ملابس', color: '#7A3FC4',
      svg: S + '<path d="M8.5 3L4 5.4 2.6 10l3 1v10h12.8V11l3-1L20 5.4 15.5 3 12 5.4 8.5 3z"/></g>' }
  ];
  var CAT_BY_ID = {};
  CATS.forEach(function (c) { CAT_BY_ID[c.id] = c; });

  var TAG_COLORS = ['#2563C9', '#17A35B', '#F0B929', '#E8547C', '#9AA0A6'];

  /* ---------- التخزين ---------- */
  var K_EXP = 'mx_expenses', K_SET = 'mx_settings', K_SEED = 'mx_seeded', K_BUD = 'mx_budgets';

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var state = {
    expenses: load(K_EXP, []),
    settings: Object.assign({ soundEnabled: true, volume: 0.6, currency: 'ر.ع' }, load(K_SET, {})),
    budgets: load(K_BUD, {}),   // { "2026-07": { budget: 500, savings: 50 } }
    view: { y: new Date().getFullYear(), m: new Date().getMonth() },
    draft: null,     // المصروف قيد التحرير
    reveal: false    // إظهار المبالغ المخفية بالنجوم (لا يُحفظ)
  };

  /* بيانات تجريبية عند أول تشغيل فقط */
  if (!localStorage.getItem(K_SEED)) {
    if (!state.expenses.length) {
      state.expenses = [
        { id: uid(), date: '2026-07-12', note: 'بترول', amount: 10, cat: 'fuel', color: '#F0B929' },
        { id: uid(), date: '2026-07-13', note: 'بترول', amount: 10, cat: 'fuel', color: '#F0B929' }
      ];
      save(K_EXP, state.expenses);
      state.view = { y: 2026, m: 6 };
    }
    localStorage.setItem(K_SEED, '1');
  }

  /* ---------- أدوات ---------- */
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function $(id) { return document.getElementById(id); }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function fmtMoney(n) {
    var v = (Math.round(n * 1000) / 1000).toFixed(3);
    var parts = v.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtDateLong(iso) {
    var d = fromISO(iso);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ' - ' + DAYS[d.getDay()];
  }
  function fmtDateCard(iso) {
    var d = fromISO(iso);
    return DAYS[d.getDay()] + ' - ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ---------- المبلغ الإجمالي والمدخرات (لكل شهر) ---------- */
  function monthKey() { return state.view.y + '-' + pad(state.view.m + 1); }

  function getBudget() {
    var b = state.budgets[monthKey()] || {};
    return { budget: +b.budget || 0, savings: +b.savings || 0 };
  }
  function setBudget(field, value) {
    var k = monthKey();
    state.budgets[k] = Object.assign({ budget: 0, savings: 0 }, state.budgets[k]);
    state.budgets[k][field] = value;
    save(K_BUD, state.budgets);
  }

  // نجمة لكل خانة رقمية (بحد أدنى 3 نجوم)
  function stars(n) {
    var digits = Math.floor(Math.abs(n)).toString().length;
    return new Array(Math.max(3, digits) + 1).join('✦');
  }
  function masked(n) {
    return state.reveal ? fmtMoney(n) + ' ' + state.settings.currency : stars(n);
  }

  /* ---------- الصوت ---------- */
  function applySound() {
    Sound.configure({ enabled: state.settings.soundEnabled, volume: state.settings.volume });
  }
  function beep(name) { Sound.play(name); }
  applySound();
  ['pointerdown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function once() {
      Sound.unlock();
      window.removeEventListener(ev, once);
    }, { once: true });
  });

  /* ---------- التنقل بين الشاشات ---------- */
  var screens = ['screen-main', 'screen-detail', 'screen-settings'];
  function show(id, silent) {
    screens.forEach(function (s) { $(s).classList.toggle('is-active', s === id); });
    $(id).scrollTop = 0;
    if (!silent) beep('navigate');
  }

  /* ---------- التنبيهات ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  var dlgResolve = null;
  function confirmDlg(msg, okLabel) {
    $('dlg-msg').textContent = msg;
    $('dlg-ok').querySelector('.wide-btn-text').textContent = okLabel || 'تأكيد';
    $('dlg-overlay').hidden = false;
    return new Promise(function (res) { dlgResolve = res; });
  }
  function closeDlg(val) {
    $('dlg-overlay').hidden = true;
    if (dlgResolve) { dlgResolve(val); dlgResolve = null; }
  }
  $('dlg-ok').addEventListener('click', function () { beep('click'); closeDlg(true); });
  $('dlg-cancel').addEventListener('click', function () { beep('click'); closeDlg(false); });

  /* ---------- نافذة إدخال مبلغ ---------- */
  var numField = null;
  function openNumber(field, title) {
    numField = field;
    var b = getBudget();
    $('num-title').textContent = title;
    $('num-input').value = b[field] ? fmtMoney(b[field]) : '';
    $('num-overlay').hidden = false;
    setTimeout(function () { $('num-input').focus(); $('num-input').select(); }, 60);
  }
  function saveNumber() {
    var v = parseAmount($('num-input').value);
    if (v < 0) { beep('error'); toast('المبلغ غير صالح'); return; }
    setBudget(numField, v);
    $('num-overlay').hidden = true;
    beep('save');
    toast(numField === 'budget' ? 'تم حفظ المبلغ الإجمالي' : 'تم حفظ المدخرات');
    renderMain();
  }

  /* ---------- الشاشة الرئيسية ---------- */
  function monthExpenses() {
    return state.expenses.filter(function (e) {
      var d = fromISO(e.date);
      return d.getFullYear() === state.view.y && d.getMonth() === state.view.m;
    }).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  }

  function renderMain() {
    $('month-label').textContent = MONTHS[state.view.m] + ' ' + state.view.y;
    $('total-cur').textContent = state.settings.currency;

    var list = monthExpenses();
    var spent = list.reduce(function (s, e) { return s + e.amount; }, 0);

    // خانة المجموع تعرض الفارق: المبلغ الإجمالي − (المصروفات + المدخرات)
    // قبل تحديد المبلغ الإجمالي لا يوجد فارق، فتُعرض المصاريف كما هي
    var b = getBudget();
    var hasBudget = b.budget > 0;
    var remain = b.budget - (spent + b.savings);
    $('total-label').textContent = hasBudget ? 'الـمـتـبـقـي' : 'الـمـجـمـوع';
    $('total-amount').textContent = fmtMoney(hasBudget ? remain : spent);
    document.querySelector('.total-card').classList.toggle('over', hasBudget && remain < 0);

    $('budget-val').textContent = masked(b.budget);
    $('savings-val').textContent = masked(b.savings);
    ['budget-val', 'savings-val'].forEach(function (id) {
      $(id).classList.toggle('revealed', state.reveal);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-eye]'), function (b2) {
      b2.classList.toggle('on', state.reveal);
      b2.setAttribute('aria-pressed', state.reveal ? 'true' : 'false');
    });

    var box = $('expense-list');
    box.innerHTML = '';
    $('empty-note').hidden = list.length > 0;

    list.forEach(function (e) {
      var cat = CAT_BY_ID[e.cat] || CATS[0];
      var btn = document.createElement('button');
      btn.className = 'exp-card';
      // اللون المختار يظهر في دائرة الأيقونة وفي الشريط الجانبي للبطاقة
      btn.style.setProperty('--tag', TAG_COLORS.indexOf(e.color) >= 0 ? e.color : '#F0B929');
      btn.setAttribute('aria-label', 'تعديل مصروف ' + (e.note || cat.name));
      btn.innerHTML =
        '<span class="exp-badge"><svg viewBox="0 0 24 24">' + cat.svg + '</svg></span>' +
        '<span class="exp-mid">' +
          '<span class="exp-date">' + fmtDateCard(e.date) + '</span>' +
          '<span class="exp-name">' + escapeHtml(e.note || cat.name) + '</span>' +
        '</span>' +
        '<span class="exp-amt"><b>' + fmtMoney(e.amount) + '</b><span>' + state.settings.currency + '</span></span>';
      btn.addEventListener('click', function () { beep('click'); openDetail(e); });
      box.appendChild(btn);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function shiftMonth(delta) {
    var m = state.view.m + delta, y = state.view.y;
    if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
    state.view = { y: y, m: m };
    beep('navigate');
    renderMain();
  }

  /* ---------- شاشة التفاصيل ---------- */
  function buildCatGrid() {
    var g = $('icon-grid');
    g.innerHTML = '';
    CATS.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'cat-btn';
      b.dataset.cat = c.id;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-label', c.name);
      b.innerHTML = '<span class="cat-disc" style="background:' + c.color + '"><svg viewBox="0 0 24 24">' + c.svg + '</svg></span>';
      b.addEventListener('click', function () {
        state.draft.cat = c.id;
        if (!$('note-input').value.trim()) $('note-input').value = c.name;
        beep('toggle');
        syncSelections();
      });
      g.appendChild(b);
    });
  }

  function buildColorRow() {
    var r = $('color-row');
    r.innerHTML = '';
    TAG_COLORS.forEach(function (col) {
      var b = document.createElement('button');
      b.className = 'color-btn';
      b.dataset.color = col;
      b.style.background = col;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-label', 'اللون ' + col);
      b.addEventListener('click', function () {
        state.draft.color = col;
        beep('toggle');
        syncSelections();
      });
      r.appendChild(b);
    });
  }

  function syncSelections() {
    Array.prototype.forEach.call($('icon-grid').children, function (b) {
      var on = b.dataset.cat === state.draft.cat;
      b.classList.toggle('sel', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call($('color-row').children, function (b) {
      var on = b.dataset.color === state.draft.color;
      b.classList.toggle('sel', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  function openDetail(exp) {
    var isNew = !exp;
    if (isNew) {
      var today = new Date();
      var d = (today.getFullYear() === state.view.y && today.getMonth() === state.view.m)
        ? today : new Date(state.view.y, state.view.m, 1);
      state.draft = { id: null, date: toISO(d), note: '', amount: 0, cat: 'fuel', color: '#F0B929' };
    } else {
      state.draft = Object.assign({}, exp);
    }
    $('date-text').textContent = fmtDateLong(state.draft.date);
    $('note-input').value = state.draft.note;
    $('amount-input').value = state.draft.amount ? fmtMoney(state.draft.amount) : '';
    $('btn-delete').style.display = isNew ? 'none' : '';
    syncSelections();
    show('screen-detail');
  }

  function parseAmount(txt) {
    var n = parseFloat(String(txt).replace(/,/g, '').replace(/[٠-٩]/g, function (d) {
      return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);
    }).trim());
    return isNaN(n) ? 0 : n;
  }

  function saveDraft() {
    var amount = parseAmount($('amount-input').value);
    if (amount <= 0) {
      beep('error');
      toast('الرجاء إدخال مبلغ صحيح أكبر من صفر');
      $('amount-input').focus();
      return;
    }
    state.draft.amount = amount;
    state.draft.note = $('note-input').value.trim() || (CAT_BY_ID[state.draft.cat] || {}).name || '';

    if (state.draft.id) {
      state.expenses = state.expenses.map(function (e) {
        return e.id === state.draft.id ? Object.assign({}, state.draft) : e;
      });
    } else {
      state.draft.id = uid();
      state.expenses.push(Object.assign({}, state.draft));
    }
    save(K_EXP, state.expenses);

    var d = fromISO(state.draft.date);
    state.view = { y: d.getFullYear(), m: d.getMonth() };

    beep('save');
    toast('تم حفظ المصروف');
    renderMain();
    show('screen-main', true);
  }

  function deleteDraft() {
    confirmDlg('هل تريد حذف هذا المصروف؟', 'حذف').then(function (ok) {
      if (!ok) return;
      state.expenses = state.expenses.filter(function (e) { return e.id !== state.draft.id; });
      save(K_EXP, state.expenses);
      beep('delete');
      toast('تم حذف المصروف');
      renderMain();
      show('screen-main', true);
    });
  }

  /* ---------- التقويم المخصص ---------- */
  var cal = { mode: 'day', y: 2026, m: 6, sel: null };

  function openCalendar(mode) {
    cal.mode = mode;
    if (mode === 'day') {
      var d = fromISO(state.draft.date);
      cal.y = d.getFullYear(); cal.m = d.getMonth(); cal.sel = state.draft.date;
    } else {
      cal.y = state.view.y; cal.m = state.view.m; cal.sel = null;
    }
    $('cal-overlay').hidden = false;
    renderCalendar();
  }

  function renderCalendar() {
    var week = $('cal-week'), grid = $('cal-grid');
    if (cal.mode === 'month') {
      $('cal-title').textContent = cal.y;
      week.innerHTML = '';
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = 'repeat(3,1fr)';
      MONTHS.forEach(function (name, i) {
        var b = document.createElement('button');
        b.className = 'cal-day' + (i === state.view.m && cal.y === state.view.y ? ' sel' : '');
        b.style.aspectRatio = 'auto';
        b.style.padding = '12px 4px';
        b.textContent = name;
        b.addEventListener('click', function () {
          state.view = { y: cal.y, m: i };
          beep('click');
          $('cal-overlay').hidden = true;
          renderMain();
        });
        grid.appendChild(b);
      });
      return;
    }

    grid.style.gridTemplateColumns = 'repeat(7,1fr)';
    $('cal-title').textContent = MONTHS[cal.m] + ' ' + cal.y;
    week.innerHTML = DAYS_SHORT.map(function (d) { return '<span>' + d + '</span>'; }).join('');

    var first = new Date(cal.y, cal.m, 1).getDay();
    var days = new Date(cal.y, cal.m + 1, 0).getDate();
    var todayISO = toISO(new Date());
    grid.innerHTML = '';

    for (var i = 0; i < first; i++) {
      var blank = document.createElement('span');
      blank.className = 'cal-day blank';
      grid.appendChild(blank);
    }
    for (var day = 1; day <= days; day++) {
      (function (day) {
        var iso = cal.y + '-' + pad(cal.m + 1) + '-' + pad(day);
        var b = document.createElement('button');
        b.className = 'cal-day' + (iso === cal.sel ? ' sel' : '') + (iso === todayISO ? ' today' : '');
        b.textContent = day;
        b.setAttribute('aria-label', fmtDateLong(iso));
        b.addEventListener('click', function () {
          state.draft.date = iso;
          $('date-text').textContent = fmtDateLong(iso);
          beep('click');
          $('cal-overlay').hidden = true;
        });
        grid.appendChild(b);
      })(day);
    }
  }

  function calShift(delta) {
    if (cal.mode === 'month') { cal.y += delta; }
    else {
      cal.m += delta;
      if (cal.m < 0) { cal.m = 11; cal.y--; } else if (cal.m > 11) { cal.m = 0; cal.y++; }
    }
    beep('navigate');
    renderCalendar();
  }

  /* ---------- الضبط ---------- */
  function renderSettings() {
    var sw = $('sw-sound');
    sw.setAttribute('aria-checked', state.settings.soundEnabled ? 'true' : 'false');
    $('vol-range').value = Math.round(state.settings.volume * 100);
    $('vol-val').textContent = Math.round(state.settings.volume * 100) + '%';

    var row = $('currency-row');
    row.innerHTML = '';
    CURRENCIES.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'chip' + (c === state.settings.currency ? ' sel' : '');
      b.textContent = c;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', c === state.settings.currency ? 'true' : 'false');
      b.addEventListener('click', function () {
        state.settings.currency = c;
        save(K_SET, state.settings);
        beep('toggle');
        renderSettings();
        renderMain();
      });
      row.appendChild(b);
    });
  }

  function exportData() {
    var payload = { app: 'monthly-expenses', version: 2, exportedAt: new Date().toISOString(),
                    settings: state.settings, budgets: state.budgets, expenses: state.expenses };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'expenses-' + toISO(new Date()) + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    beep('save');
    toast('تم تصدير البيانات');
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.expenses)) throw new Error('bad');
        var clean = data.expenses.filter(function (e) {
          return e && typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && typeof e.amount === 'number';
        }).map(function (e) {
          return { id: e.id || uid(), date: e.date, note: String(e.note || ''), amount: e.amount,
                   cat: CAT_BY_ID[e.cat] ? e.cat : 'fuel', color: TAG_COLORS.indexOf(e.color) >= 0 ? e.color : '#F0B929' };
        });
        confirmDlg('استيراد ' + clean.length + ' مصروف؟ سيتم استبدال البيانات الحالية.', 'استيراد').then(function (ok) {
          if (!ok) return;
          state.expenses = clean;
          if (data.budgets && typeof data.budgets === 'object') {
            state.budgets = data.budgets;
            save(K_BUD, state.budgets);
          }
          if (data.settings) {
            state.settings = Object.assign(state.settings, data.settings);
            save(K_SET, state.settings);
            applySound();
            renderSettings();
          }
          save(K_EXP, state.expenses);
          beep('save');
          toast('تم استيراد البيانات');
          renderMain();
        });
      } catch (e) {
        beep('error');
        toast('الملف غير صالح');
      }
    };
    reader.readAsText(file);
  }

  /* ---------- ربط الأحداث ---------- */
  $('btn-prev-month').addEventListener('click', function () { shiftMonth(-1); });
  $('btn-next-month').addEventListener('click', function () { shiftMonth(1); });
  $('btn-month-picker').addEventListener('click', function () { beep('click'); openCalendar('month'); });
  $('btn-add').addEventListener('click', function () { beep('click'); openDetail(null); });
  $('card-budget').addEventListener('click', function () { beep('click'); openNumber('budget', 'المبلغ الإجمالي'); });
  $('card-savings').addEventListener('click', function () { beep('click'); openNumber('savings', 'المدخرات'); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-eye]'), function (b) {
    b.addEventListener('click', function () {
      state.reveal = !state.reveal;
      beep('toggle');
      renderMain();
    });
  });
  $('num-ok').addEventListener('click', saveNumber);
  $('num-cancel').addEventListener('click', function () { beep('click'); $('num-overlay').hidden = true; });
  $('num-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') saveNumber(); });
  $('num-overlay').addEventListener('click', function (e) {
    if (e.target === this) { beep('click'); this.hidden = true; }
  });
  $('btn-open-settings').addEventListener('click', function () { beep('click'); renderSettings(); show('screen-settings'); });

  $('btn-back').addEventListener('click', function () { beep('click'); show('screen-main'); });
  $('btn-save').addEventListener('click', saveDraft);
  $('btn-delete').addEventListener('click', function () { beep('click'); deleteDraft(); });
  $('btn-date').addEventListener('click', function () { beep('click'); openCalendar('day'); });

  $('amount-input').addEventListener('blur', function () {
    var n = parseAmount(this.value);
    this.value = n > 0 ? fmtMoney(n) : '';
  });
  $('amount-input').addEventListener('focus', function () {
    this.value = this.value.replace(/,/g, '');
  });
  $('note-input').addEventListener('keydown', function (e) { if (e.key !== 'Enter') beep('toggle'); });

  $('btn-back-settings').addEventListener('click', function () { beep('click'); show('screen-main'); });
  $('sw-sound').addEventListener('click', function () {
    state.settings.soundEnabled = !state.settings.soundEnabled;
    save(K_SET, state.settings);
    applySound();
    renderSettings();
    beep('toggle');   // يُسمع فقط عند التشغيل
    toast(state.settings.soundEnabled ? 'الصوت مُفعّل' : 'الصوت مُغلق');
  });
  $('vol-range').addEventListener('input', function () {
    state.settings.volume = (+this.value) / 100;
    $('vol-val').textContent = this.value + '%';
    applySound();
  });
  $('vol-range').addEventListener('change', function () {
    save(K_SET, state.settings);
    beep('click');
  });
  $('btn-export').addEventListener('click', function () { beep('click'); exportData(); });
  $('btn-import').addEventListener('click', function () { beep('click'); $('import-file').click(); });
  $('import-file').addEventListener('change', function () {
    if (this.files && this.files[0]) importData(this.files[0]);
    this.value = '';
  });
  $('btn-wipe').addEventListener('click', function () {
    beep('click');
    confirmDlg('سيتم حذف كل المصاريف نهائياً. هل أنت متأكد؟', 'متابعة').then(function (ok) {
      if (!ok) return;
      confirmDlg('تأكيد أخير: لا يمكن التراجع عن هذه العملية.', 'مسح الكل').then(function (ok2) {
        if (!ok2) return;
        state.expenses = [];
        state.budgets = {};
        save(K_EXP, state.expenses);
        save(K_BUD, state.budgets);
        beep('delete');
        toast('تم مسح كل البيانات');
        renderMain();
      });
    });
  });

  $('cal-prev').addEventListener('click', function () { calShift(-1); });
  $('cal-next').addEventListener('click', function () { calShift(1); });
  $('cal-cancel').addEventListener('click', function () { beep('click'); $('cal-overlay').hidden = true; });
  $('cal-overlay').addEventListener('click', function (e) {
    if (e.target === this) { beep('click'); this.hidden = true; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('dlg-overlay').hidden) { closeDlg(false); return; }
    if (!$('num-overlay').hidden) { $('num-overlay').hidden = true; return; }
    if (!$('cal-overlay').hidden) { $('cal-overlay').hidden = true; return; }
    if ($('screen-main').classList.contains('is-active')) return;
    show('screen-main');
  });

  /* ---------- الإقلاع ---------- */
  buildCatGrid();
  buildColorRow();
  renderSettings();
  renderMain();
  show('screen-main', true);
})();
