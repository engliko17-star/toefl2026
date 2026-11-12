// Проверка микрофона перед Speaking и контроль звука в каждой записи.
// Подключается в speaking_player.html (практика), tests.html (полный мок,
// speaking-engine.js) и speaking_mini_mock_player.html (мини-мок).
//
//   MicCheck.run(host, { stream, audioCtx })  — экран проверки внутри host;
//       Promise → { ok, checked, stream }. ok:false — ученица нажала Cancel
//       или ушла со страницы. stream — живой поток микрофона (мог смениться).
//   MicCheck.meter(stream, audioCtx)          — слушать громкость записи; .stop() → итог
//   MicCheck.silent(итог)                     — в записи не было голоса
//   MicCheck.constraints()                    — настройки для getUserMedia
//                                               (микрофон, выбранный на проверке)
(function () {
    var VOICE_RMS = 0.015;   // ≈ −36 дБ: громче — считаем голосом
    var PASS_MS = 400;       // столько голоса нужно, чтобы проверка прошла
    var HELP_MS = 7000;      // через столько без голоса — подсказки, что проверить
    var KEY = 'micDeviceId';

    function savedDevice() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
    function saveDevice(id) { try { if (id) localStorage.setItem(KEY, id); else localStorage.removeItem(KEY); } catch (e) { /* только на этот раз */ } }
    function constraints() {
        var id = savedDevice();
        return { audio: id ? { deviceId: { ideal: id } } : true };
    }

    // Громкость потока: раз в 50 мс берём кусок сигнала и считаем RMS.
    // Пока звук на устройстве не идёт (AudioContext на паузе), ничего не считаем —
    // иначе получили бы «тишину», которой на самом деле не было.
    function meter(stream, ctx) {
        var st = { ms: 0, voicedMs: 0, peak: 0, level: 0 };
        var src = null, an = null, timer = null;
        try {
            if (!stream || !ctx) throw new Error('нет потока или AudioContext');
            if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(function () {});
            src = ctx.createMediaStreamSource(stream);
            an = ctx.createAnalyser();
            an.fftSize = 1024;
            src.connect(an);
            var fbuf = an.getFloatTimeDomainData ? new Float32Array(an.fftSize) : null;
            var bbuf = fbuf ? null : new Uint8Array(an.fftSize);
            var lastT = -1;
            timer = setInterval(function () {
                var tracks = stream.getAudioTracks();
                if (!tracks.length || tracks.every(function (t) { return t.readyState === 'ended'; })) { clearInterval(timer); return; }
                if (ctx.state !== 'running') return;
                var t = ctx.currentTime;
                if (lastT < 0 || t <= lastT) { lastT = t; return; }
                var dt = Math.min(250, (t - lastT) * 1000);
                lastT = t;
                var s = 0, i, v;
                if (fbuf) { an.getFloatTimeDomainData(fbuf); for (i = 0; i < fbuf.length; i++) { v = fbuf[i]; s += v * v; } s = Math.sqrt(s / fbuf.length); }
                else { an.getByteTimeDomainData(bbuf); for (i = 0; i < bbuf.length; i++) { v = (bbuf[i] - 128) / 128; s += v * v; } s = Math.sqrt(s / bbuf.length); }
                st.ms += dt;
                st.level = s;
                if (s > st.peak) st.peak = s;
                if (s >= VOICE_RMS) st.voicedMs += dt;
            }, 50);
        } catch (e) {
            st.error = String((e && e.message) || e);
        }
        return {
            stats: st,
            stop: function () {
                clearInterval(timer);
                try { if (src) src.disconnect(); } catch (e) { /* уже отключён */ }
                return { ms: Math.round(st.ms), voicedMs: Math.round(st.voicedMs), peak: +st.peak.toFixed(4), error: st.error };
            }
        };
    }

    // Голоса не было: звук измерялся хотя бы секунду, а голоса набралось меньше четверти секунды
    function silent(r) { return !!r && !r.error && r.ms >= 1000 && r.voicedMs < 250; }

    // Уровень 0…1 для полоски: −55 дБ и тише — пусто, −12 дБ — полная
    function barLevel(rms) {
        if (!(rms > 0)) return 0;
        var db = 20 * Math.log10(rms);
        return Math.max(0, Math.min(1, (db + 55) / 43));
    }

    var CSS = [
        '.mc{width:100%;max-width:380px;margin:auto;padding:24px;text-align:center;font-family:inherit;color:#334155;box-sizing:border-box}',
        '.mc *{box-sizing:border-box}',
        '.mc-icon{width:64px;height:64px;margin:0 auto 16px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:#eef2ff;color:#4f46e5;transition:background-color .2s,color .2s}',
        '.mc-icon svg{width:30px;height:30px}',
        '.mc.is-ok .mc-icon{background:#d1fae5;color:#059669}',
        '.mc.is-help .mc-icon{background:#fee2e2;color:#dc2626}',
        '.mc-title{margin:0 0 8px;font-size:20px;font-weight:700;color:#1e293b;letter-spacing:-.01em}',
        '.mc-text{margin:0 0 22px;font-size:14px;line-height:1.55;color:#64748b}',
        '.mc-text b{color:#334155;font-weight:600}',
        // Индикатор: 24 столбика, загораются по громкости
        '.mc-meter{display:flex;align-items:flex-end;justify-content:center;gap:4px;height:44px;margin:0 auto 14px}',
        '.mc-meter i{display:block;width:7px;border-radius:4px;background:#e2e8f0;transition:background-color .08s}',
        '.mc-meter i.on{background:#6366f1}',
        '.mc.is-ok .mc-meter i.on{background:#10b981}',
        '.mc-status{min-height:22px;margin:0 0 6px;font-size:14px;font-weight:600;color:#64748b}',
        '.mc.is-ok .mc-status{color:#047857}',
        '.mc.is-help .mc-status{color:#b91c1c}',
        '.mc-help{display:none;margin:14px 0 0;padding:16px 18px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left}',
        '.mc.is-help .mc-help{display:block}',
        '.mc-help ul{margin:0;padding:0 0 0 18px;font-size:13px;line-height:1.55;color:#475569}',
        '.mc-help li{margin:0 0 6px}',
        '.mc-device{display:none;margin:12px 0 0;font-size:13px;color:#475569}',
        '.mc-device.has{display:block}',
        '.mc-device select{display:block;width:100%;margin-top:6px;padding:9px 10px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;font:inherit;font-size:14px;color:#1e293b}',
        '.mc-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:18px}',
        '.mc-btn{appearance:none;border:0;cursor:pointer;font:inherit;font-size:14px;font-weight:700;border-radius:12px;padding:12px 20px;min-height:44px}',
        '.mc-btn.primary{background:#0f172a;color:#fff}',
        '.mc-btn.primary:hover{background:#4f46e5}',
        '.mc-btn.ghost{background:transparent;color:#64748b;padding:12px 14px}',
        '.mc-btn.ghost:hover{color:#0f172a}',
        '.mc-btn:focus-visible{outline:3px solid #a5b4fc;outline-offset:2px}',
        '.mc-retry,.mc-skip{display:none}',
        '.mc.is-help .mc-retry,.mc.is-help .mc-skip,.mc.no-meter .mc-skip{display:inline-block}',
        '@media (prefers-reduced-motion:reduce){.mc-meter i,.mc-icon{transition:none}}'
    ].join('');

    var MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/></svg>';
    var OK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

    var HTML = '<div class="mc" role="group" aria-label="Microphone check">'
        + '<div class="mc-icon">' + MIC_SVG + '</div>'
        + '<h2 class="mc-title">Microphone check</h2>'
        + '<p class="mc-text">Say a few words out loud, for example: <b>“Hello, my name is Anna. I am getting ready for the TOEFL.”</b></p>'
        + '<div class="mc-meter" aria-hidden="true"></div>'
        + '<p class="mc-status" role="status" aria-live="polite">Listening…</p>'
        + '<div class="mc-help">'
        + '<ul>'
        + '<li>Check that the microphone is not muted (a mute key on the laptop or on the headset).</li>'
        + '<li>Close calls in other apps: Zoom, Telegram, WhatsApp, Skype.</li>'
        + '<li>Make sure the browser is allowed to use the microphone in your device settings.</li>'
        + '<li>Using headphones? Plug in their microphone properly or unplug them.</li>'
        + '</ul>'
        + '<label class="mc-device">Microphone<select></select></label>'
        + '</div>'
        + '<div class="mc-actions">'
        + '<button type="button" class="mc-btn primary mc-retry">Try again</button>'
        + '<button type="button" class="mc-btn ghost mc-skip">Continue anyway</button>'
        + '<button type="button" class="mc-btn ghost mc-cancel">Cancel</button>'
        + '</div>'
        + '</div>';

    function injectStyle() {
        if (document.getElementById('mic-check-style')) return;
        var s = document.createElement('style');
        s.id = 'mic-check-style';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    }

    function stopStream(s) { try { if (s) s.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* уже остановлен */ } }

    function run(host, opts) {
        opts = opts || {};
        injectStyle();
        return new Promise(function (resolve) {
            // Что было в host (экран Start), убираем на время проверки и потом возвращаем
            var kept = document.createDocumentFragment();
            while (host.firstChild) kept.appendChild(host.firstChild);
            // Подсказки длинные: на телефоне боком экран может не вместить — даём прокрутку
            var hostStyle = { overflowY: host.style.overflowY, justifyContent: host.style.justifyContent };
            host.style.overflowY = 'auto';
            host.style.justifyContent = 'flex-start';
            host.insertAdjacentHTML('beforeend', HTML);
            var root = host.lastElementChild;
            var $ = function (sel) { return root.querySelector(sel); };
            var bars = [];
            for (var b = 0; b < 24; b++) { var i = document.createElement('i'); i.style.height = (10 + Math.round(30 * Math.sin(Math.PI * (b + 0.5) / 24))) + 'px'; $('.mc-meter').appendChild(i); bars.push(i); }

            var ctx = opts.audioCtx || null;
            var stream = opts.stream || null;
            var m = null, tick = null, startedAt = 0, finished = false, passedAt = 0;

            function setState(cls, text) {
                root.classList.remove('is-ok', 'is-help', 'no-meter');
                if (cls) root.classList.add(cls);
                $('.mc-status').textContent = text;
                $('.mc-icon').innerHTML = cls === 'is-ok' ? OK_SVG : MIC_SVG;
            }
            function finish(result) {
                if (finished) return;
                finished = true;
                clearInterval(tick);
                if (m) m.stop();
                if (!result.ok) { stopStream(stream); stream = null; }
                if (root.parentNode === host) {
                    host.removeChild(root);
                    host.appendChild(kept);
                    host.style.overflowY = hostStyle.overflowY;
                    host.style.justifyContent = hostStyle.justifyContent;
                }
                result.stream = stream;
                resolve(result);
            }
            function listen() {
                clearInterval(tick);
                if (m) m.stop();
                m = meter(stream, ctx);
                startedAt = Date.now();
                passedAt = 0;
                setState('', 'Listening…');
                tick = setInterval(function () {
                    // Ушли с экрана (Exit в тесте) — проверка больше не нужна
                    if (!root.isConnected) { finish({ ok: false }); return; }
                    var st = m.stats;
                    var lit = Math.round(barLevel(st.level) * bars.length);
                    for (var k = 0; k < bars.length; k++) bars[k].classList.toggle('on', k < lit);
                    if (passedAt) {
                        if (Date.now() - passedAt > 900) finish({ ok: true, checked: true });
                        return;
                    }
                    if (st.voicedMs >= PASS_MS) {
                        passedAt = Date.now();
                        setState('is-ok', 'Your microphone works');
                        try { sessionStorage.setItem('micCheckPassedAt', String(Date.now())); } catch (e) { /* не страшно */ }
                        return;
                    }
                    var waited = Date.now() - startedAt;
                    // Звук на этом устройстве не измеряется — проверку не навязываем
                    if (st.error || (waited > 2500 && st.ms === 0)) {
                        if (!root.classList.contains('no-meter')) { setState('no-meter', 'This browser cannot check the microphone. You can continue.'); }
                        return;
                    }
                    if (waited > HELP_MS && !root.classList.contains('is-help')) {
                        setState('is-help', 'We can’t hear you');
                        fillDevices();
                    }
                }, 60);
            }
            function fillDevices() {
                var label = $('.mc-device'), sel = $('.mc-device select');
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
                navigator.mediaDevices.enumerateDevices().then(function (list) {
                    var mics = list.filter(function (d) { return d.kind === 'audioinput' && d.label && d.deviceId !== 'communications'; });
                    if (mics.length < 2) { label.classList.remove('has'); return; }
                    var cur = '';
                    try { cur = stream.getAudioTracks()[0].getSettings().deviceId || ''; } catch (e) { /* нет данных */ }
                    sel.innerHTML = '';
                    mics.forEach(function (d) {
                        var o = document.createElement('option');
                        o.value = d.deviceId; o.textContent = d.label;
                        if (d.deviceId === cur) o.selected = true;
                        sel.appendChild(o);
                    });
                    label.classList.add('has');
                }).catch(function () {});
            }
            function reacquire() {
                setState('', 'Turning the microphone on…');
                stopStream(stream);
                stream = null;
                navigator.mediaDevices.getUserMedia(constraints()).then(function (s) {
                    if (finished) { stopStream(s); return; }
                    stream = s;
                    listen();
                }).catch(function (err) {
                    if (finished) return;
                    setState('is-help', 'The microphone is not available: ' + ((err && err.name) || 'error'));
                });
            }

            $('.mc-retry').onclick = reacquire;
            $('.mc-skip').onclick = function () { finish({ ok: true, checked: false }); };
            $('.mc-cancel').onclick = function () { finish({ ok: false }); };
            $('.mc-device select').onchange = function () { saveDevice(this.value); reacquire(); };

            if (stream) listen(); else reacquire();
        });
    }

    // Проверка недавно прошла (для практики: не спрашивать на каждом наборе)
    function passedRecently(minutes) {
        try {
            var t = +sessionStorage.getItem('micCheckPassedAt') || 0;
            return t > 0 && Date.now() - t < minutes * 60000;
        } catch (e) { return false; }
    }

    window.MicCheck = { run: run, meter: meter, silent: silent, constraints: constraints, passedRecently: passedRecently };
})();
