/* ===== محرك الأصوات — Web Audio API (بدون ملفات خارجية) ===== */
(function (global) {
  'use strict';

  var ctx = null;
  var master = null;
  var cfg = { enabled: true, volume: 0.6 };

  function ensureCtx() {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = cfg.volume;
    master.connect(ctx.destination);
    return ctx;
  }

  // نغمة واحدة: تردد يتحرك من f0 إلى f1 مع مغلّف ADSR بسيط
  function tone(opts) {
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime + (opts.delay || 0);
    var dur = opts.dur || 0.12;

    var osc = c.createOscillator();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.f0, t0);
    if (opts.f1 && opts.f1 !== opts.f0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(opts.f1, 1), t0 + dur);
    }

    var g = c.createGain();
    var peak = (opts.gain == null ? 0.25 : opts.gain);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.012, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // ضجيج قصير مُرشَّح — يعطي إحساس "النقرة" الفيزيائية
  function noise(opts) {
    var c = ensureCtx();
    if (!c) return;
    var dur = opts.dur || 0.05;
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    var src = c.createBufferSource();
    src.buffer = buf;

    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = opts.freq || 2200;
    bp.Q.value = opts.q || 1.2;

    var g = c.createGain();
    g.gain.value = (opts.gain == null ? 0.12 : opts.gain);

    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(c.currentTime + (opts.delay || 0));
  }

  var RECIPES = {
    click: function () {
      noise({ dur: 0.045, freq: 2400, gain: 0.10 });
      tone({ f0: 880, f1: 620, dur: 0.06, type: 'triangle', gain: 0.16 });
    },
    toggle: function () {
      tone({ f0: 1180, f1: 1180, dur: 0.045, type: 'square', gain: 0.07 });
      noise({ dur: 0.03, freq: 3200, gain: 0.06 });
    },
    navigate: function () {
      tone({ f0: 520, f1: 880, dur: 0.14, type: 'sine', gain: 0.13 });
      noise({ dur: 0.06, freq: 1400, gain: 0.05 });
    },
    save: function () {
      tone({ f0: 660, f1: 660, dur: 0.11, type: 'triangle', gain: 0.20 });
      tone({ f0: 880, f1: 880, dur: 0.11, type: 'triangle', gain: 0.20, delay: 0.09 });
      tone({ f0: 1320, f1: 1320, dur: 0.20, type: 'triangle', gain: 0.18, delay: 0.18 });
    },
    'delete': function () {
      tone({ f0: 440, f1: 200, dur: 0.22, type: 'sawtooth', gain: 0.14 });
      tone({ f0: 300, f1: 130, dur: 0.24, type: 'sine', gain: 0.12, delay: 0.05 });
    },
    key: function () {
      // نقرة مفتاح واحدة وقصيرة جداً
      noise({ dur: 0.022, freq: 3000, gain: 0.05 });
      tone({ f0: 1500, f1: 1100, dur: 0.028, type: 'triangle', gain: 0.09 });
    },
    error: function () {
      tone({ f0: 240, f1: 240, dur: 0.09, type: 'square', gain: 0.12 });
      tone({ f0: 200, f1: 200, dur: 0.13, type: 'square', gain: 0.12, delay: 0.12 });
    }
  };

  // نبضة واحدة لكل حدث؛ الأنماط المصفوفية للأحداث المهمة فقط
  var VIBES = { click: 8, toggle: 6, key: 12, navigate: 10, save: [12, 40, 12], 'delete': 30, error: [20, 50, 20] };

  var Sound = {
    configure: function (options) {
      if (options.enabled != null) cfg.enabled = !!options.enabled;
      if (options.volume != null) {
        cfg.volume = Math.max(0, Math.min(1, options.volume));
        if (master) master.gain.value = cfg.volume;
      }
    },
    isEnabled: function () { return cfg.enabled; },
    // نقطة العبور الوحيدة: أي صوت يمر من هنا ويتحقق من الإعداد أولاً
    play: function (name) {
      if (!cfg.enabled) return;
      var recipe = RECIPES[name];
      if (!recipe) return;
      var c = ensureCtx();
      if (!c) return;
      if (c.state === 'suspended') c.resume();
      try { recipe(); } catch (e) { /* تجاهل أخطاء الصوت بصمت */ }
      if (global.navigator && navigator.vibrate && VIBES[name]) {
        // إلغاء أي اهتزاز جارٍ أولاً حتى لا تتراكم النبضات
        try { navigator.vibrate(0); navigator.vibrate(VIBES[name]); } catch (e) {}
      }
    },
    // تهيئة AudioContext عند أول تفاعل (قيود المتصفحات)
    unlock: function () {
      var c = ensureCtx();
      if (c && c.state === 'suspended') c.resume();
    }
  };

  global.Sound = Sound;
})(window);
