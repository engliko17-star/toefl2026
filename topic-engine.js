/* =============================================================
   ДВИЖОК УРОКОВ SPEAKING TOPICS (topic-*.html)
   Подключается в конце страницы темы, ПОСЛЕ скрипта с LESSON, HERO_ART, IDIOM_ART.
   Меняешь здесь — меняется во всех темах.
   ============================================================= */
const INTERVIEWER_ART = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="2" y="2" width="96" height="96" rx="26" fill="#fda4af"/>
  <path d="M22 100 q0 -30 28 -30 q28 0 28 30z" fill="#e11d48"/>
  <rect x="43" y="60" width="14" height="12" rx="4" fill="#fcd9bd"/>
  <circle cx="50" cy="44" r="20" fill="#fcd9bd"/>
  <path d="M29 44 q0 -26 21 -26 q22 0 22 24 q-6 -12 -22 -12 q-14 0 -21 14z" fill="#1e1b4b"/>
  <circle cx="43" cy="46" r="2.4" fill="#1e1b4b"/><circle cx="57" cy="46" r="2.4" fill="#1e1b4b"/>
  <path d="M44 54 q6 5 12 0" stroke="#1e1b4b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="64" y="64" width="22" height="28" rx="4" fill="#fff"/>
  <rect x="68" y="70" width="14" height="3" rx="1.5" fill="#cbd5e1"/><rect x="68" y="76" width="10" height="3" rx="1.5" fill="#cbd5e1"/><rect x="68" y="82" width="12" height="3" rx="1.5" fill="#cbd5e1"/>
</svg>`;

/* Линейные иконки (в стиле Lucide, как на платформе) */
const IC_PATHS = {
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.47 2.5 2.5 0 1 1 3.01 3.01 1 1 0 0 0-.47 1.68l1.68 1.68a2.4 2.4 0 0 1 0 3.42l-1.61 1.61a1 1 0 0 1-1.68-.47 2.5 2.5 0 1 0-3.01 3.01 1 1 0 0 1 .47 1.68l-1.61 1.61a2.4 2.4 0 0 1-3.42 0l-1.68-1.68a1 1 0 0 0-1.68.47 2.5 2.5 0 1 1-3.01-3.01 1 1 0 0 0 .47-1.68l-1.68-1.68a2.4 2.4 0 0 1 0-3.42l1.61-1.61a1 1 0 0 1 1.68.47 2.5 2.5 0 1 0 3.01-3.01 1 1 0 0 1-.47-1.68l1.61-1.61a2.4 2.4 0 0 1 3.42 0z"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><path d="M12 17v5"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  notebook: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
  trending: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  scales: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>',
  flag: '<path d="M4 22V4a1 1 0 0 1 1-1h13l-2.5 4L18 11H5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  map: '<path d="M14.1 6.3 9.9 4.2a2 2 0 0 0-1.8 0L3.4 6.6A1 1 0 0 0 3 7.4v12.8a.7.7 0 0 0 1 .6l4.1-2a2 2 0 0 1 1.8 0l4.2 2.1a2 2 0 0 0 1.8 0l4.7-2.4a1 1 0 0 0 .4-.8V5.7a.7.7 0 0 0-1-.6l-4.1 2a2 2 0 0 1-1.8 0z"/><path d="M15 5.8v15M9 3.2v15"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  landmark: '<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2 21 7H3z"/>',
  chat: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="16" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="16" cy="8" r="1.3" fill="currentColor"/><circle cx="8" cy="16" r="1.3" fill="currentColor"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8"/><path d="M10 21v-5h4v5"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
  shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  sparkles: '<path d="M9.94 14.06 12 21l2.06-6.94L21 12l-6.94-2.06L12 3 9.94 9.94 3 12z"/><path d="M19 3v4M17 5h4"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  laptop: '<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 20h20"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  ladder: '<path d="M8 2v20M16 2v20M8 6h8M8 11h8M8 16h8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11"/><circle cx="4.5" cy="18" r="1.3"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  hourglass: '<path d="M6 2h12M6 22h12"/><path d="M7 2v4l5 6 5-6V2M7 22v-4l5-6 5 6v4"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
  utensils: '<path d="M4 2v7a3 3 0 0 0 6 0V2M7 2v20M17 2c-2 0-4 2-4 6s2 6 4 6v8"/>',
  paw: '<circle cx="5" cy="10" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="10" r="2"/><path d="M12 12c-3 0-6 4-6 7a2 2 0 0 0 3 2c1-.5 2-1 3-1s2 .5 3 1a2 2 0 0 0 3-2c0-3-3-7-6-7z"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 13h.01"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  palette: '<path d="M12 22a10 10 0 1 1 10-10c0 3-2 4-4 4h-2a2 2 0 0 0-1 4c.5.8 0 2-1 2z"/><circle cx="7.5" cy="10.5" r="1.3"/><circle cx="12" cy="7" r="1.3"/><circle cx="16.5" cy="10.5" r="1.3"/>'
};
const IC = (name, size) => `<svg class="tl-ic" ${size ? `style="width:${size}px;height:${size}px"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC_PATHS[name] || ""}</svg>`;

/* =====================================================================
   ДВИЖОК УРОКА (одинаковый для всех тем)
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hl = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<mark class="tl-hl">$1</mark>');
const plain = s => String(s).replace(/\*\*/g, "").replace(/\[(A|R|E|C)\]\s*/g, "").replace(/_/g, "");
const STORE = "topic-" + LESSON.slug + "-";
const store = {
  get(k, d) { try { const v = localStorage.getItem(STORE + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(STORE + k, JSON.stringify(v)); } catch (e) {} }
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const SEG = {
  A: { ru: "Ответ",   en: "Answer",  c: "#6366f1", b: "#eef2ff" },
  R: { ru: "Причина", en: "Reason",  c: "#d97706", b: "#fef3c7" },
  E: { ru: "Пример",  en: "Example", c: "#e11d48", b: "#ffe4e6" },
  C: { ru: "Вывод",   en: "Wrap-up", c: "#0891b2", b: "#cffafe" }
};
const ICON = {
  speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><path d="M12 17v5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
};

/* ---------- Озвучка ---------- */
let voiceCache = null;
function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const vs = speechSynthesis.getVoices();
  if (!vs.length) return null;
  const pref = ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Microsoft Guy", "Alex", "Karen", "Daniel"];
  for (const n of pref) { const v = vs.find(x => x.name.includes(n) && /^en/i.test(x.lang)); if (v) return v; }
  return vs.find(v => v.lang === "en-US") || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) { speechSynthesis.onvoiceschanged = () => { voiceCache = pickVoice(); }; }
function speak(text, rate = 0.92) {
  return new Promise(res => {
    if (!("speechSynthesis" in window)) return res();
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(plain(text));
    u.lang = "en-US"; u.rate = rate;
    const v = voiceCache || pickVoice(); if (v) u.voice = v;
    let done = false;
    const fin = () => { if (!done) { done = true; clearTimeout(t); res(); } };
    u.onend = fin; u.onerror = fin;
    const t = setTimeout(fin, Math.max(3500, text.length * 95));
    speechSynthesis.speak(u);
  });
}

/* ---------- Сигнал ---------- */
let actx = null;
function beep(freq = 880, dur = 0.18) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = freq; o.type = "sine";
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, actx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + dur + 0.02);
  } catch (e) {}
  return new Promise(r => setTimeout(r, dur * 1000 + 60));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Конфетти ---------- */
function confetti() {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cols = ["#6366f1", "#f43f5e", "#f59e0b", "#0891b2", "#0ea5e9", "#a855f7"];
  for (let i = 0; i < 46; i++) {
    const s = document.createElement("i");
    s.className = "tl-confetti";
    s.style.left = Math.random() * 100 + "vw";
    s.style.background = cols[i % cols.length];
    s.style.animationDuration = (1.4 + Math.random() * 1.3) + "s";
    s.style.animationDelay = (Math.random() * .35) + "s";
    if (i % 3 === 0) { s.style.width = s.style.height = "9px"; s.style.borderRadius = "50%"; }
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3400);
  }
}

/* ---------- Запись голоса ---------- */
const Rec = {
  stream: null, rec: null, chunks: [],
  async start() {
    if (!navigator.mediaDevices || !window.MediaRecorder) throw new Error("Запись не поддерживается этим браузером");
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const types = ["audio/mp4", "audio/webm", "audio/ogg"];
    const mime = types.find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    this.rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    this.rec.ondataavailable = e => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.rec.start();
  },
  stop() {
    return new Promise(res => {
      const r = this.rec;
      if (!r || r.state === "inactive") { this.kill(); return res(null); }
      r.onstop = () => { const blob = new Blob(this.chunks, { type: r.mimeType || "audio/webm" }); this.kill(); res(URL.createObjectURL(blob)); };
      try { r.stop(); } catch (e) { this.kill(); res(null); }
    });
  },
  kill() { if (this.stream) this.stream.getTracks().forEach(t => t.stop()); this.stream = null; this.rec = null; }
};

/* ---------- Панель ответа ---------- */
const Dock = {
  session: 0, running: false, textShown: true, phases: null,
  el: () => $("#dock"),
  open(label) { $("#dockLabel").textContent = label; $("#dockMsg").textContent = ""; $("#dockOut").innerHTML = ""; this.el().classList.add("tl-show"); },
  close() { this.cancel(); this.el().classList.remove("tl-show"); },
  cancel() {
    this.session++;
    try { speechSynthesis.cancel(); } catch (e) {}
    if (Rec.rec) Rec.stop();
    this.running = false;
    $("#recDot").classList.remove("tl-on");
  },
  setQ(text, show) {
    this.currentQ = text; this.textShown = show;
    const q = $("#dockQ");
    q.textContent = show ? plain(text) : "Текст скрыт — слушайте, как на экзамене";
    q.classList.toggle("tl-hidden-q", !show);
    $("#dockShowQ").textContent = show ? "Скрыть текст" : "Показать текст";
  },
  /* Шкала: для 45-секундных ответов — 4 цветные фазы (Ответ/Причина/Пример/Вывод) */
  buildBar(total, withPhases) {
    const steps = withPhases ? LESSON.answerSteps : [{ k: null, s: total }];
    const sum = steps.reduce((a, s) => a + s.s, 0);
    let acc = 0;
    this.phases = steps.map(s => { const p = { k: s.k, from: acc / sum * total, to: (acc + s.s) / sum * total }; acc += s.s; return p; });
    $("#dockBar").innerHTML = this.phases.map(p => `<div style="flex:${p.to - p.from}"><i style="background:${p.k ? SEG[p.k].c : "#818cf8"}"></i></div>`).join("");
    $("#dockPhase").textContent = ""; $("#dockPhase").style.color = "";
  },
  setTime(left, total) {
    const s = Math.max(0, Math.ceil(left)), el = total - Math.max(0, left);
    $("#dockTime").textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
    $("#dockTime").classList.toggle("tl-red", left <= 10 && total > 15);
    const fills = $$("#dockBar i");
    this.phases.forEach((p, i) => { fills[i].style.width = Math.max(0, Math.min(100, 100 * (el - p.from) / (p.to - p.from))) + "%"; });
    const cur = this.phases.find(p => el < p.to) || this.phases[this.phases.length - 1];
    if (cur.k && el > 0.05) { $("#dockPhase").textContent = "Сейчас: " + SEG[cur.k].ru + " — " + LESSON.answerSteps.find(a => a.k === cur.k).i; $("#dockPhase").style.color = SEG[cur.k].c === "#6366f1" ? "#a5b4fc" : SEG[cur.k].c; }
  },
  state(t) { $("#dockState").textContent = t; },
  async runItem({ text, seconds, showText, phases = false, onSpeak }) {
    const my = this.session;
    this.running = true;
    this.setQ(text, showText);
    this.buildBar(seconds, phases);
    this.setTime(seconds, seconds);
    this.state("Слушайте…");
    if (onSpeak) onSpeak(true);
    await speak(text);
    if (onSpeak) onSpeak(false);
    if (my !== this.session) return { cancelled: true };
    await beep(880);
    let recOn = $("#recToggle").checked, url = null;
    if (recOn) {
      try { await Rec.start(); $("#recDot").classList.add("tl-on"); }
      catch (e) { recOn = false; $("#dockMsg").textContent = "Микрофон недоступен: " + (e.message || e.name) + ". Таймер идёт без записи."; }
    }
    if (my !== this.session) { if (recOn) await Rec.stop(); return { cancelled: true }; }
    this.state(recOn ? "Говорите — идёт запись" : "Говорите!");
    const t0 = performance.now();
    await new Promise(res => {
      const tick = () => {
        if (my !== this.session) return res();
        const left = seconds - (performance.now() - t0) / 1000;
        this.setTime(left, seconds);
        if (left <= 0) return res();
        setTimeout(tick, 150);
      };
      tick();
    });
    if (recOn) { url = await Rec.stop(); $("#recDot").classList.remove("tl-on"); }
    if (my !== this.session) return { cancelled: true, url };
    await beep(660, 0.25);
    this.state("Время вышло");
    this.running = false;
    return { cancelled: false, url };
  },
  async single(label, text, seconds, opts = {}) {
    this.cancel(); this.open(label);
    const r = await this.runItem({ text, seconds, showText: opts.showText !== false, phases: !!opts.phases, onSpeak: opts.onSpeak });
    if (r.cancelled) return;
    this.showResults([{ q: text, url: r.url }]);
  },
  async sequence(label, items, seconds, opts = {}) {
    this.cancel(); this.open(label);
    const my = this.session, results = [];
    for (let i = 0; i < items.length; i++) {
      if (my !== this.session) return;
      $("#dockLabel").textContent = label + " · " + (i + 1) + "/" + items.length;
      const secs = typeof seconds === "function" ? seconds(items[i]) : seconds;
      const r = await this.runItem({ text: items[i], seconds: secs, showText: !!opts.showText, phases: !!opts.phases, onSpeak: opts.onSpeak ? on => opts.onSpeak(i, on) : null });
      if (r.cancelled) return;
      results.push({ q: items[i], url: r.url });
      if (i < items.length - 1) { this.state("Следующий…"); await sleep(opts.gap || 1500); }
    }
    this.state("Готово! Послушайте себя ниже");
    confetti();
    this.showResults(results);
  },
  showResults(results) {
    const any = results.some(r => r.url);
    $("#dockOut").innerHTML = results.map((r, i) =>
      `<div class="tl-res"><b>${results.length > 1 ? (i + 1) + ". " : ""}</b>${esc(plain(r.q))}${r.url ? `<audio controls src="${r.url}"></audio>` : ""}</div>`
    ).join("") + (any ? "" : `<div class="tl-res">Включите «Записывать голос», чтобы потом прослушать свой ответ.</div>`);
  }
};

/* ---------- Рендер ---------- */
const SECTIONS = [
  ["warmup", "Warm-up", "Разогрев", "c-warm"],
  ["vocab", "Vocabulary", "Новая лексика", "c-vocab"],
  ["coll", "Collocations", "Коллокации", "c-coll"],
  ["idioms", "Idioms", "Идиомы", "c-idiom"],
  ["expr", "Expressions", "Фразы для ответа", "c-expr"],
  ["check", "Quick check", "Закрепляем", "c-check"],
  ["repeat", "Listen & Repeat", "Listen & Repeat", "c-repeat"],
  ["interview", "Interview", "Take an Interview: реальные сеты", "c-int"],
  ["club", "Speaking Club", "Speaking Club: тема вдоль и поперёк", "c-club"],
  ["self", "Self-check", "Самопроверка", "c-self"]
];

function frame(id, sub, body, headRight = "") {
  const idx = SECTIONS.findIndex(s => s[0] === id), [, tab, title, cls] = SECTIONS[idx], f = LESSON.frames[id];
  const next = SECTIONS[idx + 1];
  return `
  <section class="tl-frame ${cls}" id="${id}">
    <div class="tl-board">
      <div class="tl-fhead">
        <div class="tl-fhead-l">
          <div class="tl-fart">${IC(f.icon)}</div>
          <div>
            <div class="tl-fkick">Шаг ${idx + 1} из ${SECTIONS.length} · ${tab} <span class="tl-time">${IC("clock")} ${f.time}</span></div>
            <h2>${title}</h2>
            ${sub ? `<div class="tl-sub">${sub}</div>` : ""}
          </div>
        </div>
        ${headRight}
      </div>
      <div class="tl-todo"><span class="tl-todo-t">Что делать</span>${f.steps.map((s, i) => `<span class="tl-st"><b>${i + 1}</b>${esc(s)}</span>`).join("")}</div>
      <div class="tl-fbody">${body}</div>
      <div class="tl-ffoot"><button class="tl-done" data-done="${id}">${ICON.check.replace("<svg", '<svg width="16" height="16"')} <span>${next ? "Готово — дальше: " + next[1] : "Урок пройден!"}</span></button></div>
    </div>
  </section>`;
}
const spk = (text, title = "Послушать") => `<button class="tl-speak" data-say="${esc(plain(text))}" title="${title}" aria-label="${title}">${ICON.speak}</button>`;
const chips = ws => `<div class="tl-chips">${ws.map(w => `<button data-say="${esc(w)}">${esc(w)}</button>`).join("")}</div>`;

/* Диаграмма потоков: ленты рисуются SVG, ширина ленты = доля бюджета */
/* pct — доля ветки (в сумме 100). Без pct ветки равные, а вместо процента показывается tag. */
function flowHtml(F) {
  const H = 300, centers = [50, 150, 250], k = 0.62;
  const hasPct = F.branches.every(b => typeof b.pct === "number");
  const share = b => hasPct ? b.pct : 100 / F.branches.length;
  let y = 0;
  const ribbons = F.branches.map((b, i) => {
    const h = H * share(b) / 100, y0 = y, y1 = y + h; y = y1;
    const t = h * k, c = centers[i], y2 = c - t / 2, y3 = c + t / 2;
    const m0 = (y0 + y1) / 2;
    return `<path d="M0 ${y0} C55 ${y0} 45 ${y2} 100 ${y2} L100 ${y3} C45 ${y3} 55 ${y1} 0 ${y1} Z" fill="${b.color}" fill-opacity=".28"/>
            <path class="tl-flow-line" d="M0 ${m0} C55 ${m0} 45 ${c} 100 ${c}" stroke="${b.color}" stroke-width="3" fill="none" vector-effect="non-scaling-stroke"/>`;
  }).join("");
  return `
  <div class="tl-flow">
    <div class="tl-h3" style="--c:#0369a1">${IC(F.icon || "map")} ${esc(F.title)}</div>
    <div class="tl-flow-grid">
      <div class="tl-flow-src"><div class="tl-small">${esc(F.source.kicker || (hasPct ? "100%" : ""))}</div><div class="tl-big">${esc(F.source.title)}</div><div class="tl-small">${esc(F.source.ru)}</div>${chips(F.source.words)}</div>
      <div class="tl-flow-mid"><svg class="tl-flow-svg" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true">${ribbons}</svg></div>
      <div class="tl-flow-dst">${F.branches.map(b => `
        <div class="tl-flow-node" style="--fc:${b.color}">
          <div class="tl-flow-node-h"><b>${esc(b.title)} <small>· ${esc(b.ru)}</small></b>${hasPct ? `<span>${b.pct}%</span>` : (b.tag ? `<em class="tl-flow-tag">${esc(b.tag)}</em>` : "")}</div>
          <small>${esc(b.sub)}</small>${chips(b.words)}
        </div>`).join("")}</div>
    </div>
    ${hasPct ? `<div class="tl-flow-bar">${F.branches.map(b => `<div style="flex:${b.pct};background:${b.color}">${esc(b.title)} ${b.pct}%</div>`).join("")}</div>` : ""}
    <div class="tl-flow-foot">${F.notes.map(n => `<div>${n}</div>`).join("")}</div>
  </div>`;
}

/* Шкала Saver ↔ Spender */
function scaleHtml(S) {
  return `
  <div class="tl-scale" id="scale">
    <div class="tl-h3" style="--c:#7c3aed">${IC("sliders")} ${esc(S.title)}</div>
    <div class="tl-scale-ends"><span style="color:#0284c7">${esc(S.left)}</span><span style="color:#e11d48">${esc(S.right)}</span></div>
    <div class="tl-scale-track">
      ${S.words.map((w, i) => `<div class="tl-scale-w ${i % 2 ? "tl-dn" : "tl-up"}" style="left:${w.p}%" data-sp="${w.p}" data-say="${esc(w.w)}">${esc(w.w)}</div>`).join("")}
      <div class="tl-scale-line"></div>
      <div class="tl-scale-thumb" id="scaleThumb"></div>
      <input type="range" min="0" max="100" value="${store.get("scale", 40)}" id="scaleInput" aria-label="Где ты на шкале">
    </div>
    <div class="tl-scale-say"><div style="flex:1"><span class="tl-say-label">Скажи о себе</span><span id="scaleSay"></span></div><span id="scaleSpk"></span></div>
  </div>`;
}

function modelHtml(text) {
  const parts = text.split(/\[(A|R|E|C)\]\s*/);
  const segs = [];
  if (parts[0].trim()) segs.push({ k: null, t: parts[0] });
  for (let i = 1; i < parts.length; i += 2) segs.push({ k: parts[i], t: parts[i + 1] || "" });
  const words = s => plain(s).trim().split(/\s+/).length;
  const total = segs.reduce((a, s) => a + words(s.t), 0) || 1;
  const bar = segs.filter(s => s.k).map(s => `<div style="flex:${words(s.t)};background:${SEG[s.k].c}" title="${SEG[s.k].ru} ≈ ${Math.round(45 * words(s.t) / total)} с"></div>`).join("");
  const body = segs.map(s => s.k
    ? `<span class="tl-seg" style="--sc:${SEG[s.k].c};--sb:${SEG[s.k].b}"><span class="tl-seg-tag">${SEG[s.k].ru}</span>${hl(s.t.trim())}</span> `
    : hl(s.t)).join("");
  return (bar ? `<div class="tl-mbar">${bar}</div>` : "") + body;
}

/* Псевдо-волна для предложения (стабильная для одного текста) */
function waveHtml(s) {
  let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const n = Math.min(64, Math.round(s.length / 1.6));
  let out = "";
  for (let i = 0; i < n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const env = Math.sin(Math.PI * (i + .5) / n);
    const v = 4 + Math.round((0.35 + 0.65 * ((h >>> 16) % 100) / 100) * env * 18);
    out += `<i style="height:${v}px;animation-delay:${(i % 7) * 0.07}s"></i>`;
  }
  return `<div class="tl-wave">${out}</div>`;
}

function render() {
  const L = LESSON;
  const coreN = L.vocab.filter(v => v.level === "core").length, advN = L.vocab.length - coreN;
  let h = `
    <a class="tl-back" href="lessons.html">← Все темы</a>
    <div class="tl-hero">
      <div>
        <div class="tl-eyebrow">Speaking Topics · ${esc(L.category)}</div>
        <h1>${esc(L.titleEn)}</h1>
        <div class="tl-ru">${esc(L.titleRu)}</div>
        <p>${esc(L.intro)}</p>
        <div class="tl-meta">${L.meta.map(([n, t]) => `<span><b>${esc(n === "{Q}" ? String(totalQ()) : n)}</b> ${esc(t)}</span>`).join("")}</div>
        <div class="tl-hero-actions">
          <button class="tl-btn-light" data-goto="warmup">${IC("rocket", 16)} Начать урок</button>
          <button class="tl-btn-ghost" data-goto="interview">${IC("mic", 16)} Сразу к интервью</button>
          <button class="tl-btn-ghost" id="focusBtnHero">${IC("target", 16)} Режим фокуса</button>
          <button class="tl-btn-ghost" id="dysBtn">Режим чтения</button>
        </div>
      </div>
      <div class="tl-hero-art">${HERO_ART}</div>
    </div>
    <div class="tl-navwrap">
      <nav class="tl-nav" id="tlNav">${SECTIONS.map(([id, t], i) => `<a href="#${id}" data-id="${id}"><span class="tl-num">${i + 1}</span>${t}</a>`).join("")}</nav>
      <div class="tl-prog"><span id="progTxt"></span><div class="tl-prog-bar"><div id="progBar"></div></div><button class="tl-focus-btn" id="focusBtn">${IC("target", 13)} Фокус</button></div>
    </div>`;

  // 1. Warm-up
  h += frame("warmup", "Ответь вслух на 2–3 вопроса — пока без новой лексики. В конце урока вернись и ответь ещё раз: почувствуешь разницу.",
    `<div class="tl-grid tl-grid-4">${L.warmup.map(q => `<div class="tl-sticky"><span>${esc(q)}</span>${spk(q)}</div>`).join("")}</div>`);

  // 2. Vocabulary
  h += frame("vocab", `Сначала две схемы — как слова связаны между собой. Потом карточки: <b>Core</b> (${coreN}) — обязательный минимум, <b>Advanced</b> (${advN}) — для 5–6 баллов.`,
    flowHtml(L.flow) + scaleHtml(L.scale) +
    `<div class="tl-row" style="justify-content:space-between;margin-bottom:12px">
       <div class="tl-tabs" id="vocabTabs"><button data-lv="core" class="tl-on">Core · B2</button><button data-lv="adv">Advanced · C1</button><button data-lv="all">Все</button></div>
       <span class="tl-hint">Динамик — слово + пример</span>
     </div>
     <div class="tl-grid tl-grid-3" id="vocabGrid"></div>`);

  // 3. Collocations
  h += frame("coll", "Слова, которые «дружат». Не <i>make a budget</i>, а <b>draw up a budget</b>. Цветной кубик — часть, которую чаще всего путают.",
    `<div class="tl-grid tl-grid-2">${L.collocations.map(g => `
      <div class="tl-coll-group"><div class="tl-h3">${IC(g.icon, 18)} ${esc(g.group)}</div>${g.items.map(c => {
        const blocks = c.en.split(/(_[^_]+_)/).filter(x => x.trim()).map(x => x.startsWith("_") ? `<span class="tl-blk tl-blk-key">${esc(x.slice(1, -1))}</span>` : `<span class="tl-blk tl-blk-rest">${esc(x.trim())}</span>`).join("");
        return `<div class="tl-coll"><div class="tl-coll-main"><div class="tl-blocks">${blocks}</div><div class="tl-coll-ru">${esc(c.ru)}</div><div class="tl-ex">${esc(c.ex)}</div></div>${spk(plain(c.en) + ". " + c.ex)}</div>`;
      }).join("")}
      </div>`).join("")}</div>`);

  // 4. Idioms
  h += frame("idioms", "Сначала картинка — буквальный образ, потом реальный смысл. Наведи на карточку — картинка оживёт. Одна уместная идиома за ответ — плюс; три подряд — минус.",
    `<div class="tl-grid tl-grid-3">${L.idioms.map(d => `
      <div class="tl-idiom">
        <div class="tl-idiom-pic"><svg class="tl-art" viewBox="0 0 160 96" aria-hidden="true">${IDIOM_ART[d.art] || ""}</svg>${spk(d.en + ". " + d.ex)}</div>
        <div class="tl-idiom-lit">${esc(d.lit)}</div>
        <div class="tl-idiom-en">${esc(d.en)}</div>
        <div class="tl-idiom-ru">= ${esc(d.ru)}</div>
        <div class="tl-idiom-mean">${esc(d.meaning)}</div>
        <div class="tl-ex">“${esc(d.ex)}”</div>
        <div class="tl-reg ${d.reg === "ok" ? "tl-reg-ok" : "tl-reg-careful"}">${d.reg === "ok" ? "✓ Можно на экзамене" : "! Осторожно"} — ${esc(d.note)}</div>
      </div>`).join("")}</div>`);

  // 5. Expressions
  h += frame("expr", "Готовые «каркасы» под эту тему. Нажми на фразу — услышишь интонацию.",
    `<div class="tl-grid tl-grid-3">${L.expressions.map(g => `
      <div class="tl-expr-group"><h3><span class="tl-ic-tile">${IC(g.icon)}</span> ${esc(g.fn)}</h3>${g.items.map(p => `<button class="tl-phrase" data-say="${esc(p.replace(/…/g, ""))}"><span>${esc(p)}</span>${ICON.speak}</button>`).join("")}</div>`).join("")}</div>
     <div class="tl-tline">
       <div class="tl-tline-h">${IC("clock", 18)} Ответ на 45 секунд — 4 цветных блока</div>
       <div class="tl-tbar">${L.answerSteps.map(s => `<div style="flex:${s.s};background:${SEG[s.k].c}">${SEG[s.k].ru}<br>${s.s} с</div>`).join("")}</div>
       <div class="tl-tlegend">${L.answerSteps.map(s => `<div style="--sc:${SEG[s.k].c};--sb:${SEG[s.k].b}"><b>${SEG[s.k].ru} · ${SEG[s.k].en}</b><i>${esc(s.i)}</i></div>`).join("")}</div>
       <div class="tl-hint" style="margin-top:8px">Эти же цвета — в модельных ответах и в таймере, когда ты отвечаешь: он подсказывает, какой блок говорить сейчас.</div>
     </div>`);

  // 6. Quick check
  h += frame("check", "Четыре мини-игры на лексику урока. Делай по порядку или выбери любую.",
    `<div class="tl-tabs tl-ex-tabs" id="exTabs">
        <button data-ex="match" class="tl-on">Matching</button><button data-ex="gap">Gap-fill</button><button data-ex="flash">Карточки</button><button data-ex="para">Перефразируй</button>
     </div>
     <div class="tl-panel-ex tl-show" id="ex-match"></div>
     <div class="tl-panel-ex" id="ex-gap"></div>
     <div class="tl-panel-ex" id="ex-flash"></div>
     <div class="tl-panel-ex" id="ex-para"></div>`);

  // 7. Listen & Repeat
  h += frame("repeat", esc(L.repeat.scenario) + " На экзамене 7 предложений, от коротких к длинным, текст не показывают.",
    `<div class="tl-row" style="margin-bottom:14px">
        <button class="tl-btn tl-btn-accent" id="repExam">${ICON.play} Пройти как на экзамене</button>
        <label class="tl-hint" style="display:inline-flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" id="repHide" checked> Скрыть текст</label>
     </div>
     <div id="repList">${L.repeat.sentences.map((s, i) => `
       <div class="tl-rep" data-rep-row="${i}"><div class="tl-rep-n">${i + 1}</div>
         <div class="tl-rep-mid"><div class="tl-rep-text tl-blur" data-rep-text title="Нажми, чтобы увидеть текст">${esc(s)}</div>${waveHtml(s)}</div>
         <button class="tl-speak" data-rep-play="${i}" title="Послушать" aria-label="Послушать">${ICON.speak}</button>
         <button class="tl-chipbtn" data-rep="${i}">${ICON.mic} Повторить</button></div>`).join("")}</div>`);

  // 8. Interview — реальные сеты
  h += frame("interview", "Все сеты по этой теме из базы платформы — официальные TOEFL, mock и практика. Вопрос звучит, сразу 45 секунд, без подготовки. Таймер подсказывает, какой блок ответа говорить сейчас.",
    RUBRIC_HTML + `<div class="tl-tabs tl-set-tabs" id="setTabs">${L.sets.map((st, i) => `<button data-set="${i}" class="${i ? "" : "tl-on"}"><span class="tl-sb tl-sb-${st.badge}"></span>${esc(st.title)}</button>`).join("")}</div>
     ${L.sets.map((st, i) => `
       <div class="tl-set ${i ? "" : "tl-show"}" data-set-panel="${i}">
         <div class="tl-scenario">${INTERVIEWER_ART}<div class="tl-scen-txt">
           <div class="tl-row" style="gap:6px"><span class="tl-badge2 tl-b-${st.badge}">${BADGE[st.badge]}</span><span style="font-size:12px;font-weight:700;color:#c7d2fe">${esc(st.src)}</span></div>
           <div style="font-size:18px;font-weight:800;color:#fff;margin-top:6px">${esc(st.title)}</div>
           <div style="margin-top:4px;line-height:1.55">${esc(st.scenario)}</div>
           <button class="tl-btn tl-btn-accent" style="margin-top:12px" data-run-set="${i}">${ICON.play} Пройти сет · ${st.questions.length} вопроса подряд</button></div></div>
         <div style="margin-top:14px">${st.questions.map((q, qi) => qCard(q, "set" + i + "-" + qi, { label: "Question " + (qi + 1) })).join("")}</div>
       </div>`).join("")}`,
    `<label class="tl-hint" style="display:inline-flex;gap:6px;align-items:center;cursor:pointer;background:#fff;padding:8px 12px;border-radius:12px"><input type="checkbox" id="recDefault"> Записывать ответы</label>`);

  // 9. Speaking Club
  const clubN = L.club.reduce((a, c) => a + c.questions.length, 0);
  h += frame("club", `Разбираем тему так, как это делают в разговорном клубе: ${clubN} вопросов в ${L.club.length} блоках — все вопросы по теме из базы плюс те, которых в базе пока нет. У каждого вопроса есть «Копнём глубже» — уточняющие вопросы, как в живом разговоре.`,
    `<div class="tl-club-bar">
       <div class="tl-tabs" id="clubFilter">
         <button data-cf="all" class="tl-on">Все</button>${Object.entries(QTYPE).map(([k, v]) => `<button data-cf="${k}"><i class="tl-dot-t" style="background:${v.c}"></i>${v.ru}</button>`).join("")}<button data-cf="db">${IC("db", 13)} Из базы</button>
       </div>
       <div class="tl-row">
         <button class="tl-btn tl-btn-accent" id="clubRandom">${IC("dice", 16)} Случайный вопрос</button>
         <span class="tl-score" id="clubCount"></span>
       </div>
     </div>
     <div class="tl-prog-bar" style="margin:10px 0 18px;height:8px"><div id="clubBar"></div></div>
     ${L.club.map((c, ci) => `
       <details class="tl-cat" data-cat="${ci}" ${ci === 0 ? "open" : ""}>
         <summary><span class="tl-ic-tile">${IC(c.icon)}</span>
           <div style="flex:1;min-width:0"><b>${esc(c.title)}</b><span>${esc(c.en)} · <em data-cat-n="${ci}">${c.questions.length}</em> вопросов</span>
             <div class="tl-cat-bar"><div data-cat-bar="${ci}"></div></div></div>
           <span class="tl-cat-chev">${IC("chevron", 18)}</span></summary>
         <div class="tl-cat-body">${c.questions.map((q, qi) => qCard(q, "c" + ci + "-" + qi, { club: true })).join("")}</div>
       </details>`).join("")}`);

  // 10. Self-check
  const C = 2 * Math.PI * 30;
  h += frame("self", "После ответа (или прослушав запись) отметь, что получилось. Цель — чтобы облако слов закрасилось целиком.",
    `<div class="tl-grid tl-grid-2">
       <div>${L.checklist.map((c, i) => `<label class="tl-check"><input type="checkbox" data-chk="${i}"><span>${esc(c)}</span></label>`).join("")}</div>
       <div class="tl-card">
         <div class="tl-ring">
           <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="30" fill="none" stroke="#e2e8f0" stroke-width="8"/><circle id="lexRing" cx="36" cy="36" r="30" fill="none" stroke="#6366f1" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 36 36)" style="transition:stroke-dashoffset .4s"/><text id="lexPct" x="36" y="41" text-anchor="middle" font-size="15" font-weight="800" fill="#0f172a">0%</text></svg>
           <div><b>Целевая лексика, которую я использовал(а)</b><div class="tl-hint" id="lexCount"></div></div>
         </div>
         <div class="tl-cloud" id="lexCloud">${L.targetLexis.map((w, i) => `<button data-lex="${i}">${esc(w)}</button>`).join("")}</div>
         <button class="tl-btn tl-btn-soft" style="margin-top:14px" id="selfReset">Сбросить</button>
       </div>
     </div>`);

  h += `<footer class="tl-foot">Speaking Topics · ${esc(L.titleEn)}</footer>`;
  $("#lesson").innerHTML = h;

  renderVocab("core");
  renderMatching(); renderGap(); renderFlash(); renderPara();
  bind();
}

const QTYPE = {
  personal:   { ru: "Личное",    c: "#0284c7" },
  experience: { ru: "Опыт",      c: "#ea580c" },
  opinion:    { ru: "Мнение",    c: "#e11d48" },
  compare:    { ru: "Сравнение", c: "#4f46e5" },
  hypo:       { ru: "Что если",  c: "#9333ea" }
};
const BADGE = { official: "Official TOEFL", mock: "Mock", platform: "Практика", lesson: "Урок" };
const QREG = {};
function totalQ() { return LESSON.sets.reduce((a, s) => a + s.questions.length, 0) + LESSON.club.reduce((a, c) => a + c.questions.length, 0); }

/* same: "setid-index" — взять модельные ответы (4 и 5+) из вопроса сета, чтобы не дублировать текст */
function sameSource(q) {
  if (!q.same) return null;
  const m = /^(.*)-(\d+)$/.exec(q.same);
  const st = m && LESSON.sets.find(x => x.id === m[1]);
  return (st && st.questions[+m[2]]) || null;
}

/* Модельные ответы: model — ответ на 4 (B2), model5 — ответ на 5+ (C1). Переключатель уровня запоминается. */
function modelBlock(q, id) {
  const lv = store.get("mlv", "5");
  const both = q.model && q.model5;
  const variant = (k, text) => `<div class="tl-mv" data-mv="${id}|${k}" ${both && k !== lv ? "hidden" : ""}>
      <div class="tl-mv-top"><span class="tl-mv-tag tl-mv-${k}">${k === "5" ? "Ответ на 5+ · C1" : "Ответ на 4 · B2"}</span>${spk(text, "Прослушать модельный ответ")}</div>
      ${modelHtml(text)}
      ${k === "5" ? `<div class="tl-mv-note">Сравни с ответом на 4: идея та же — сильнее грамматика (придаточные, условные, cleft, причастные обороты), точнее слова и разнообразнее связки.</div>` : `<div class="tl-mv-note">Хороший ответ по теме и со структурой. До 5 не хватает разнообразия грамматики, точности слов и связок между мыслями.</div>`}
    </div>`;
  return `<div class="tl-model">
    <div class="tl-model-head"><span>Model answer · ~45 сек</span>
      ${both ? `<div class="tl-mtabs">${["5", "4"].map(k => `<button data-mlv="${k}" class="${k === lv ? "tl-on" : ""}">${k === "5" ? "5+ · C1" : "4 · B2"}</button>`).join("")}</div>` : ""}
    </div>
    ${q.model5 ? variant("5", q.model5) : ""}${q.model ? variant("4", q.model) : ""}
  </div>`;
}

/* Рубрика Take an Interview (ETS, TOEFL iBT Technical Manual, 2025, Figure A4) — кратко по-русски */
const RUBRIC_HTML = `
<details class="tl-rubric">
  <summary><span class="tl-ic-tile">${IC("checkCircle")}</span><div><b>Как оценивают ответ: рубрика ETS для Take an Interview</b><span>Каждый ответ — от 0 до 5 баллов. Итог Speaking 1–6: 4–4.5 = B2, 5–5.5 = C1, 6 = C2</span></div><span class="tl-cat-chev">${IC("chevron", 18)}</span></summary>
  <div class="tl-rubric-body">
    <div class="tl-rub-grid">
      <div class="tl-rub tl-rub-5"><b>5 · полностью успешный</b><ul>
        <li>Полный ответ на вопрос, по теме и <u>хорошо развёрнут</u></li>
        <li>Естественный разговорный темп, паузы уместны</li>
        <li>Легко понять; ритм и интонация передают смысл</li>
        <li><u>Разнообразная и точная</u> грамматика и лексика — передаёт точные оттенки смысла</li></ul></div>
      <div class="tl-rub tl-rub-4"><b>4 · в целом успешный</b><ul>
        <li>По теме и развёрнуто, но <u>может не хватать связок</u> между предложениями</li>
        <li>Темп в целом хороший, паузы немного мешают</li>
        <li>Отдельные слова требуют небольшого усилия слушателя</li>
        <li>Грамматики и лексики хватает для <u>общего</u> смысла</li></ul></div>
      <div class="tl-rub tl-rub-3"><b>3 · частично успешный</b><ul>
        <li>По теме, но <u>мало развёрнуто</u></li>
        <li>Частые или долгие паузы, много слов-паразитов</li>
        <li>Произношение иногда мешает пониманию</li>
        <li>Ограниченная грамматика и лексика заметно снижают точность</li></ul></div>
    </div>
    <div class="tl-rub-ai"><b>Что измеряет автоматический оценщик:</b> беглость (темп, длина фраз без пауз, число пауз и запинок) · разборчивость (произношение, ритм, ударения) · язык (разнообразие и «нечастотность» слов, грамматическая точность) · организацию (связность и связки между мыслями).</div>
    <div class="tl-rub-ai"><b>Как получить 5:</b> ответь прямо → объясни причину → дай конкретный пример → сделай вывод; меняй конструкции (<i>Having lived…, What matters most is…, If I hadn't…, which is why…</i>) и связки (<i>admittedly, whereas, what's more, as a result</i>); говори ровно, без длинных пауз, все 45 секунд.</div>
    <div class="tl-rub-src">Источник: ETS, TOEFL iBT® Technical Manual (2025), рубрика Take an Interview и таблица соответствия CEFR.</div>
  </div>
</details>`;

function qCard(q, id, opt = {}) {
  QREG[id] = q;
  const src = sameSource(q);
  if (src) { if (!q.model) q.model = src.model; if (!q.model5) q.model5 = src.model5; }
  const lx = q.lx || q.lexis || [];
  const hasMore = (q.ideas && q.ideas.length) || lx.length;
  const ty = q.t && QTYPE[q.t];
  return `
  <div class="tl-q ${opt.club ? "tl-q-club" : ""}" id="q-${id}" data-qid="${id}" ${q.t ? `data-t="${q.t}"` : ""} ${q.src ? 'data-db="1"' : ""}>
    <div class="tl-q-top"><div style="min-width:0">
      ${opt.label ? `<div class="tl-q-n">${esc(opt.label)}</div>` : ""}
      ${ty || q.src ? `<div class="tl-q-tags">${ty ? `<span class="tl-qt" style="--tc:${ty.c}">${ty.ru}</span>` : ""}${q.src ? `<span class="tl-qsrc">${IC("db", 11)} ${esc(q.src)}</span>` : ""}</div>` : ""}
      <div class="tl-q-text">${esc(q.q)}</div></div>${spk(q.q)}</div>
    <div class="tl-q-actions">
      <button class="tl-chipbtn tl-go" data-answer="${id}">${ICON.mic} Ответить · 45 с</button>
      ${q.f && q.f.length ? `<button class="tl-chipbtn" data-toggle="fu-${id}">${IC("chat", 14)} Копнём глубже</button>` : ""}
      ${hasMore ? `<button class="tl-chipbtn" data-toggle="ideas-${id}">${ICON.bulb} ${q.ideas ? "Идеи и лексика" : "Лексика"}</button>` : ""}
      ${q.model || q.model5 ? `<button class="tl-chipbtn" data-toggle="model-${id}">${ICON.eye} ${q.model && q.model5 ? "Модельные ответы · 4 и 5+" : "Модельный ответ"}</button>` : ""}
      ${opt.club ? `<label class="tl-discussed"><input type="checkbox" data-disc="${id}"> Обсудили</label>` : ""}
    </div>
    ${q.f && q.f.length ? `<div class="tl-q-more" id="fu-${id}"><div class="tl-fu">${q.f.map((f, i) => `
        <div class="tl-fu-row"><span class="tl-fu-n">${i + 1}</span><span class="tl-fu-t">${esc(f)}</span>${spk(f)}<button class="tl-chipbtn" data-fu="${id}|${i}">${ICON.mic} 30 с</button></div>`).join("")}</div></div>` : ""}
    ${hasMore ? `<div class="tl-q-more" id="ideas-${id}">
        ${q.ideas ? `<ul class="tl-ideas">${q.ideas.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${lx.length ? `<div class="tl-lexis">${lx.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
      </div>` : ""}
    ${q.model || q.model5 ? `<div class="tl-q-more" id="model-${id}">${modelBlock(q, id)}</div>` : ""}
  </div>`;
}

/* ---------- Speaking Club: фильтры, прогресс, рулетка ---------- */
function bindClub() {
  let filter = "all";
  const cards = () => $$("#club .tl-q-club");
  const done = new Set(store.get("club", []));
  const visible = c => filter === "all" || (filter === "db" ? c.dataset.db === "1" : c.dataset.t === filter);
  const update = () => {
    const all = cards();
    all.forEach(c => { c.style.display = visible(c) ? "" : "none"; c.classList.toggle("tl-q-done", done.has(c.dataset.qid)); });
    $$("#club .tl-cat").forEach(cat => {
      const qs = $$(".tl-q-club", cat), vis = qs.filter(visible), d = qs.filter(c => done.has(c.dataset.qid)).length;
      cat.style.display = vis.length ? "" : "none";
      $("[data-cat-n]", cat).textContent = vis.length;
      $("[data-cat-bar]", cat).style.width = (100 * d / qs.length) + "%";
    });
    const n = all.filter(c => done.has(c.dataset.qid)).length;
    $("#clubCount").textContent = "Обсудили " + n + " / " + all.length;
    $("#clubBar").style.width = (100 * n / all.length) + "%";
  };
  $$("#clubFilter button").forEach(b => b.onclick = () => {
    $$("#clubFilter button").forEach(x => x.classList.remove("tl-on")); b.classList.add("tl-on");
    filter = b.dataset.cf;
    $$("#club .tl-cat").forEach((c, i) => c.open = filter !== "all" || i === 0);
    update();
  });
  $$("[data-disc]").forEach(cb => {
    cb.checked = done.has(cb.dataset.disc);
    cb.onchange = () => {
      cb.checked ? done.add(cb.dataset.disc) : done.delete(cb.dataset.disc);
      store.set("club", [...done]); update();
      if (cb.checked && done.size % 10 === 0) confetti();
    };
  });
  $("#clubRandom").onclick = () => {
    let pool = cards().filter(c => visible(c) && !done.has(c.dataset.qid));
    if (!pool.length) pool = cards().filter(visible);
    if (!pool.length) return;
    const c = pool[Math.floor(Math.random() * pool.length)];
    c.closest("details").open = true;
    $$(".tl-q-pick").forEach(x => x.classList.remove("tl-q-pick"));
    c.classList.add("tl-q-pick");
    c.scrollIntoView({ behavior: "smooth", block: "center" });
    Dock.single("Speaking Club · случайный вопрос", QREG[c.dataset.qid].q, 45, { phases: true });
  };
  update();
}

/* ---------- Vocabulary ---------- */
function renderVocab(lv) {
  const list = LESSON.vocab.filter(v => lv === "all" || v.level === lv);
  $("#vocabGrid").innerHTML = list.map(v => `
    <div class="tl-card tl-vcard ${v.level === "adv" ? "tl-adv" : ""}">
      <div class="tl-vmain">
        <div class="tl-row" style="gap:6px"><span class="tl-word-en">${esc(v.en)}</span><span class="tl-pos">${esc(v.pos)}</span></div>
        <div class="tl-word-ru">${esc(v.ru)}</div>
        <div class="tl-ex">${esc(v.ex)}</div>
      </div>
      <div class="tl-vside"><span class="tl-badge ${v.level === "adv" ? "tl-badge-adv" : "tl-badge-core"}">${v.level === "adv" ? "C1" : "B2"}</span>${spk(v.en.replace(/\(.*?\)/g, "") + ". " + v.ex)}</div>
    </div>`).join("");
}

/* ---------- Шкала Saver ↔ Spender ---------- */
function bindScale() {
  const S = LESSON.scale, inp = $("#scaleInput");
  if (!inp) return;
  const upd = () => {
    const v = +inp.value;
    $("#scaleThumb").style.left = v + "%";
    const say = S.says.find(s => v < s.max) || S.says[S.says.length - 1];
    $("#scaleSay").innerHTML = hl(say.t);
    $("#scaleSpk").innerHTML = spk(say.t);
    let best = null, bd = 1e9;
    $$(".tl-scale-w").forEach(w => { const d = Math.abs(+w.dataset.sp - v); if (d < bd) { bd = d; best = w; } });
    $$(".tl-scale-w").forEach(w => w.classList.toggle("tl-near", w === best));
    store.set("scale", v);
  };
  inp.addEventListener("input", upd);
  $$(".tl-scale-w").forEach(w => w.addEventListener("click", () => { inp.value = w.dataset.sp; upd(); }));
  upd();
}

/* ---------- Matching ---------- */
function renderMatching() {
  const pairs = LESSON.matching.map((p, i) => ({ ...p, i }));
  const right = shuffle(pairs);
  $("#ex-match").innerHTML = `
    <div class="tl-row" style="justify-content:space-between;margin-bottom:12px"><span class="tl-hint">Нажми идиому слева, потом её значение справа.</span>
      <span class="tl-row"><span class="tl-score" id="matchScore">0/${pairs.length}</span><button class="tl-btn tl-btn-soft" id="matchReset">${ICON.shuffle} Заново</button></span></div>
    <div class="tl-match">
      <div class="tl-match-col">${pairs.map(p => `<button class="tl-mitem tl-left" data-ml="${p.i}">${esc(p.a)}</button>`).join("")}</div>
      <div class="tl-match-col">${right.map(p => `<button class="tl-mitem" data-mr="${p.i}">${esc(p.b)}</button>`).join("")}</div>
    </div>`;
  let sel = null, score = 0;
  $$("#ex-match [data-ml]").forEach(b => b.onclick = () => {
    if (b.classList.contains("tl-ok")) return;
    $$("#ex-match [data-ml]").forEach(x => x.classList.remove("tl-sel"));
    b.classList.add("tl-sel"); sel = b.dataset.ml;
  });
  $$("#ex-match [data-mr]").forEach(b => b.onclick = () => {
    if (b.classList.contains("tl-ok") || sel == null) return;
    const left = $(`#ex-match [data-ml="${sel}"]`);
    if (b.dataset.mr === sel) {
      b.classList.add("tl-ok"); left.classList.remove("tl-sel"); left.classList.add("tl-ok");
      score++; $("#matchScore").textContent = score + "/" + pairs.length; sel = null;
      if (score === pairs.length) { $("#matchScore").textContent = "Отлично! " + score + "/" + pairs.length; $("#matchScore").classList.add("tl-win"); confetti(); }
    } else {
      b.classList.add("tl-bad"); setTimeout(() => b.classList.remove("tl-bad"), 400);
    }
  });
  $("#matchReset").onclick = renderMatching;
}

/* ---------- Gap-fill ---------- */
function norm(s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim(); }
function renderGap() {
  const items = LESSON.gapfill;
  const bank = shuffle(items.map(x => x.a[0]));
  $("#ex-gap").innerHTML = `
    <div class="tl-hint" style="margin-bottom:8px">Вставь коллокацию: печатай или нажимай на слова из банка — они встанут в выбранное поле.</div>
    <div class="tl-bank" id="gapBank">${bank.map(w => `<button data-w="${esc(w)}">${esc(w)}</button>`).join("")}</div>
    ${items.map((it, i) => {
      const [a, b] = it.t.split("___");
      return `<div class="tl-gap" data-g="${i}">${i + 1}. ${esc(a)}<input type="text" autocomplete="off" spellcheck="false" data-gi="${i}" aria-label="Пропуск ${i + 1}">${esc(b || "")}<span class="tl-fix"></span></div>`;
    }).join("")}
    <div class="tl-row" style="margin-top:12px"><button class="tl-btn tl-btn-dark" id="gapCheck">${ICON.check} Проверить</button><button class="tl-btn tl-btn-soft" id="gapShow">Показать ответы</button><button class="tl-btn tl-btn-soft" id="gapReset">Заново</button><span class="tl-score" id="gapScore" style="display:none"></span></div>`;
  let focused = $('#ex-gap input[data-gi="0"]');
  $$("#ex-gap input").forEach(inp => {
    inp.addEventListener("focus", () => focused = inp);
    inp.addEventListener("input", () => { inp.closest(".tl-gap").classList.remove("tl-ok", "tl-bad"); inp.closest(".tl-gap").querySelector(".tl-fix").textContent = ""; syncBank(); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter") $("#gapCheck").click(); });
  });
  $$("#gapBank button").forEach(b => b.onclick = () => {
    const target = focused && !focused.value ? focused : $$("#ex-gap input").find(x => !x.value) || focused;
    if (!target) return;
    target.value = b.dataset.w; target.dispatchEvent(new Event("input"));
    const next = $$("#ex-gap input").find(x => !x.value); if (next) { next.focus(); focused = next; }
  });
  function syncBank() {
    const used = $$("#ex-gap input").map(x => norm(x.value));
    $$("#gapBank button").forEach(b => b.classList.toggle("tl-used", used.includes(norm(b.dataset.w))));
  }
  let shown = false;
  $("#gapCheck").onclick = () => {
    let ok = 0;
    items.forEach((it, i) => {
      const row = $(`#ex-gap [data-g="${i}"]`), v = norm($(`input`, row).value);
      const good = it.a.some(a => norm(a) === v);
      row.classList.toggle("tl-ok", good); row.classList.toggle("tl-bad", !good);
      $(".tl-fix", row).textContent = good ? "" : (v ? "→ " + it.a[0] : "");
      if (good) ok++;
    });
    const s = $("#gapScore"); s.style.display = "inline-flex";
    const win = ok === items.length;
    s.textContent = (win ? "Отлично! " : "") + ok + "/" + items.length; s.classList.toggle("tl-win", win);
    if (win && !shown) confetti();
  };
  $("#gapShow").onclick = () => { shown = true; items.forEach((it, i) => { $(`#ex-gap input[data-gi="${i}"]`).value = it.a[0]; }); syncBank(); $("#gapCheck").click(); };
  $("#gapReset").onclick = renderGap;
}

/* ---------- Flashcards ---------- */
let flash = { deck: [], i: 0, lv: "core" };
function renderFlash() {
  $("#ex-flash").innerHTML = `
    <div class="tl-flash-wrap">
      <div class="tl-tabs" id="flashTabs"><button data-lv="core" class="tl-on">Core</button><button data-lv="adv">Advanced</button><button data-lv="coll">Коллокации</button><button data-lv="idiom">Идиомы</button></div>
      <div class="tl-flash" id="flashCard"><div class="tl-flash-in">
        <div class="tl-face tl-face-front"><span class="tl-ftag" id="fTag"></span><div class="tl-fw" id="fFront"></div><small>нажми, чтобы перевернуть</small></div>
        <div class="tl-face tl-face-back"><div class="tl-fr" id="fBack"></div><div class="tl-ex" id="fEx" style="color:#4338ca"></div></div>
      </div></div>
      <div class="tl-flash-dots" id="fDots"></div>
      <div class="tl-row" style="justify-content:center">
        <button class="tl-btn tl-btn-soft" id="fPrev">←</button>
        <span class="tl-score" id="fPos"></span>
        <button class="tl-btn tl-btn-soft" id="fNext">→</button>
        <button class="tl-btn tl-btn-soft" id="fSay">${ICON.speak} Слушать</button>
        <button class="tl-btn tl-btn-soft" id="fShuffle">${ICON.shuffle} Перемешать</button>
      </div>
    </div>`;
  const TAG = { core: "Core · B2", adv: "Advanced · C1", coll: "Collocation", idiom: "Idiom" };
  const build = lv => {
    let d = [];
    if (lv === "core" || lv === "adv") d = LESSON.vocab.filter(v => v.level === lv).map(v => ({ f: v.en, b: v.ru, ex: v.ex }));
    if (lv === "coll") LESSON.collocations.forEach(g => g.items.forEach(c => d.push({ f: plain(c.en), b: c.ru, ex: c.ex })));
    if (lv === "idiom") d = LESSON.idioms.map(x => ({ f: x.en, b: x.ru, ex: x.ex }));
    flash = { deck: d, i: 0, lv };
    $("#fDots").innerHTML = d.map(() => "<i></i>").join("");
  };
  const show = () => {
    const c = flash.deck[flash.i]; $("#flashCard").classList.remove("tl-flipped");
    setTimeout(() => { $("#fTag").textContent = TAG[flash.lv]; $("#fFront").textContent = c.f; $("#fBack").textContent = c.b; $("#fEx").textContent = c.ex; }, 120);
    $("#fPos").textContent = (flash.i + 1) + " / " + flash.deck.length;
    $$("#fDots i").forEach((d, i) => d.classList.toggle("tl-on", i === flash.i));
  };
  build("core"); show();
  $("#flashCard").onclick = () => $("#flashCard").classList.toggle("tl-flipped");
  $("#fNext").onclick = () => { flash.i = (flash.i + 1) % flash.deck.length; show(); };
  $("#fPrev").onclick = () => { flash.i = (flash.i - 1 + flash.deck.length) % flash.deck.length; show(); };
  $("#fSay").onclick = () => { const c = flash.deck[flash.i]; speak(c.f.replace(/\(.*?\)/g, "") + ". " + c.ex); };
  $("#fShuffle").onclick = () => { flash.deck = shuffle(flash.deck); flash.i = 0; show(); };
  $$("#flashTabs button").forEach(b => b.onclick = () => { $$("#flashTabs button").forEach(x => x.classList.remove("tl-on")); b.classList.add("tl-on"); build(b.dataset.lv); show(); });
}

/* ---------- Paraphrase ---------- */
function renderPara() {
  $("#ex-para").innerHTML = `
    <div class="tl-hint" style="margin-bottom:12px">Скажи простую фразу «дороже» — вслух, с лексикой урока. Потом открой вариант и сравни.</div>
    ${LESSON.paraphrase.map((p, i) => `
      <div class="tl-para" data-p="${i}">
        <div class="tl-para-row">
          <div class="tl-para-plain"><span class="tl-tag tl-tag-plain">Просто</span>${esc(p.plain)}</div>
          <button class="tl-chipbtn" data-popen="${i}">${ICON.eye} Показать</button>
        </div>
        <div class="tl-para-better">${p.better.map(b => `<div><span class="tl-tag tl-tag-up">Сильнее</span>${hl(b)}</div>`).join("")}</div>
      </div>`).join("")}`;
  $$("#ex-para [data-popen]").forEach(b => b.onclick = () => {
    const card = b.closest(".tl-para"); card.classList.toggle("tl-open");
    b.innerHTML = card.classList.contains("tl-open") ? "Скрыть" : ICON.eye + " Показать";
  });
}

/* ---------- Прогресс, фокус, навигация ---------- */
const Progress = {
  done: [], cur: "warmup", focus: false,
  init() { this.done = store.get("done", []); this.cur = store.get("cur", "warmup"); this.focus = store.get("focus", false); this.apply(); },
  apply() {
    const n = this.done.length, N = SECTIONS.length;
    $("#progTxt").textContent = "Пройдено " + n + " / " + N;
    $("#progBar").style.width = (100 * n / N) + "%";
    $$("#tlNav a").forEach(a => {
      const d = this.done.includes(a.dataset.id); a.classList.toggle("tl-done-n", d);
      $(".tl-num", a).textContent = d ? "✓" : (SECTIONS.findIndex(s => s[0] === a.dataset.id) + 1);
    });
    $$("[data-done]").forEach(b => b.classList.toggle("tl-is-done", this.done.includes(b.dataset.done)));
    document.body.classList.toggle("tl-focus", this.focus);
    $("#focusBtn").classList.toggle("tl-on", this.focus); $("#focusBtnHero").classList.toggle("tl-on", this.focus);
    $$(".tl-frame").forEach(f => f.classList.toggle("tl-current", f.id === this.cur));
    if (this.focus) $$("#tlNav a").forEach(a => a.classList.toggle("tl-active", a.dataset.id === this.cur));
  },
  go(id, scroll = true) {
    this.cur = id; store.set("cur", id); this.apply();
    if (scroll) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  },
  markDone(id) {
    if (!this.done.includes(id)) this.done.push(id);
    store.set("done", this.done);
    const idx = SECTIONS.findIndex(s => s[0] === id), next = SECTIONS[idx + 1];
    if (this.done.length === SECTIONS.length) confetti();
    if (next) this.go(next[0]); else this.apply();
  },
  toggleFocus() { this.focus = !this.focus; store.set("focus", this.focus); this.apply(); this.go(this.cur); }
};

/* ---------- Привязка событий ---------- */
function bind() {
  document.addEventListener("click", e => {
    const s = e.target.closest("[data-say]");
    if (s) { e.preventDefault(); speak(s.dataset.say); return; }
    const g = e.target.closest("[data-goto]");
    if (g) { Progress.go(g.dataset.goto); return; }
    const d = e.target.closest("[data-done]");
    if (d) { Progress.markDone(d.dataset.done); return; }
    const n = e.target.closest("#tlNav a");
    if (n) { e.preventDefault(); Progress.go(n.dataset.id); }
  });

  $$("#vocabTabs button").forEach(b => b.onclick = () => { $$("#vocabTabs button").forEach(x => x.classList.remove("tl-on")); b.classList.add("tl-on"); renderVocab(b.dataset.lv); });
  bindScale();

  $$("#exTabs button").forEach(b => b.onclick = () => {
    $$("#exTabs button").forEach(x => x.classList.remove("tl-on")); b.classList.add("tl-on");
    $$(".tl-panel-ex").forEach(p => p.classList.remove("tl-show")); $("#ex-" + b.dataset.ex).classList.add("tl-show");
  });

  // Ответ на 4 / 5+: выбор уровня применяется ко всем карточкам и запоминается
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-mlv]");
    if (!b) return;
    const lv = b.dataset.mlv; store.set("mlv", lv);
    $$("[data-mlv]").forEach(x => x.classList.toggle("tl-on", x.dataset.mlv === lv));
    $$(".tl-model").forEach(m => { if ($$(".tl-mv", m).length > 1) $$(".tl-mv", m).forEach(v => v.hidden = !v.dataset.mv.endsWith("|" + lv)); });
  });
  $$("[data-toggle]").forEach(b => b.onclick = () => {
    const el = document.getElementById(b.dataset.toggle); el.classList.toggle("tl-show"); b.classList.toggle("tl-on", el.classList.contains("tl-show"));
  });

  const setRec = v => { $("#recToggle").checked = v; $("#recDefault").checked = v; store.set("rec", v); };
  setRec(store.get("rec", false));
  $("#recToggle").onchange = e => setRec(e.target.checked);
  $("#recDefault").onchange = e => setRec(e.target.checked);

  $$("[data-answer]").forEach(b => b.onclick = () => Dock.single("Ответ · 45 секунд", QREG[b.dataset.answer].q, 45, { phases: true }));
  $$("[data-fu]").forEach(b => b.onclick = () => { const [id, i] = b.dataset.fu.split("|"); Dock.single("Копнём глубже · 30 секунд", QREG[id].f[+i], 30); });
  $$("[data-run-set]").forEach(b => b.onclick = () => { const st = LESSON.sets[+b.dataset.runSet]; Dock.sequence(st.title, st.questions.map(q => q.q), 45, { showText: false, phases: true, gap: 1500 }); });
  $$("#setTabs button").forEach(b => b.onclick = () => {
    $$("#setTabs button").forEach(x => x.classList.remove("tl-on")); b.classList.add("tl-on");
    $$("[data-set-panel]").forEach(p => p.classList.toggle("tl-show", p.dataset.setPanel === b.dataset.set));
  });
  bindClub();

  // Listen & Repeat: волна «оживает», пока звучит предложение
  const playing = (i, on) => { const r = $(`[data-rep-row="${i}"]`); if (r) r.classList.toggle("tl-playing", on); };
  const repSecs = s => Math.min(14, Math.max(6, Math.round(s.split(/\s+/).length * 0.55 + 4)));
  $("#repHide").onchange = () => $$("[data-rep-text]").forEach(t => t.classList.toggle("tl-blur", $("#repHide").checked));
  $$("[data-rep-text]").forEach(t => t.onclick = () => t.classList.remove("tl-blur"));
  $$("[data-rep-play]").forEach(b => b.onclick = async () => { const i = +b.dataset.repPlay; playing(i, true); await speak(LESSON.repeat.sentences[i]); playing(i, false); });
  $$("[data-rep]").forEach(b => b.onclick = () => { const i = +b.dataset.rep, s = LESSON.repeat.sentences[i]; Dock.single("Listen & Repeat · " + (i + 1), s, repSecs(s), { showText: !$("#repHide").checked, onSpeak: on => playing(i, on) }); });
  $("#repExam").onclick = () => Dock.sequence("Listen & Repeat", LESSON.repeat.sentences, repSecs, { showText: false, gap: 900, onSpeak: playing });

  $("#dockClose").onclick = () => Dock.close();
  $("#dockStop").onclick = () => { if (Dock.running) { Dock.cancel(); Dock.state("Остановлено"); $$(".tl-rep").forEach(r => r.classList.remove("tl-playing")); } else Dock.close(); };
  $("#dockShowQ").onclick = () => { if (Dock.currentQ) Dock.setQ(Dock.currentQ, !Dock.textShown); };

  // Self-check
  const chk = store.get("chk", []), lex = store.get("lex", []);
  $$("[data-chk]").forEach(c => { c.checked = chk.includes(+c.dataset.chk); c.onchange = () => store.set("chk", $$("[data-chk]").filter(x => x.checked).map(x => +x.dataset.chk)); });
  const Cc = 2 * Math.PI * 30;
  const lexUpdate = () => {
    const on = $$("#lexCloud .tl-on").length, n = LESSON.targetLexis.length;
    $("#lexCount").textContent = on + " из " + n + " слов";
    $("#lexPct").textContent = Math.round(100 * on / n) + "%";
    $("#lexRing").setAttribute("stroke-dashoffset", Cc * (1 - on / n));
    store.set("lex", $$("#lexCloud .tl-on").map(x => +x.dataset.lex));
    return on;
  };
  $$("#lexCloud button").forEach(b => { b.classList.toggle("tl-on", lex.includes(+b.dataset.lex)); b.onclick = () => { b.classList.toggle("tl-on"); const on = lexUpdate(); if (on === 15 && b.classList.contains("tl-on")) confetti(); }; });
  lexUpdate();
  $("#selfReset").onclick = () => { $$("[data-chk]").forEach(c => c.checked = false); $$("#lexCloud button").forEach(b => b.classList.remove("tl-on")); store.set("chk", []); lexUpdate(); };

  // Режим чтения
  const dysOn = () => { try { const v = localStorage.getItem("dyslexia-mode"); return v === "true" || v === "1" || v === "on"; } catch (e) { return false; } };
  document.body.classList.toggle("dyslexia-mode", dysOn());
  $("#dysBtn").onclick = () => { const on = !document.body.classList.contains("dyslexia-mode"); document.body.classList.toggle("dyslexia-mode", on); try { localStorage.setItem("dyslexia-mode", on ? "1" : "0"); } catch (e) {} };

  // Фокус
  $("#focusBtn").onclick = () => Progress.toggleFocus();
  $("#focusBtnHero").onclick = () => Progress.toggleFocus();
  Progress.init();

  const links = $$("#tlNav a");
  const io = new IntersectionObserver(entries => {
    if (Progress.focus) return;
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.toggle("tl-active", a.dataset.id === en.target.id));
        const act = links.find(a => a.dataset.id === en.target.id);
        if (act) $("#tlNav").scrollTo({ left: act.offsetLeft - 16, behavior: "smooth" });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  $$(".tl-frame").forEach(f => io.observe(f));
}

/* ---------- Старт ---------- */
(async function init() {
  render();
  if (window.lucide && lucide.createIcons) { try { lucide.createIcons(); } catch (e) {} }
  if (typeof requireAuth === "function") {
    try {
      const user = await requireAuth();
      if (user) window.currentUser = user;
      // Бесплатная версия: тема закрыта, если в topics.js у неё guest: false
      const meta = (typeof TOPICS !== "undefined" && Array.isArray(TOPICS)) ? TOPICS.find(t => t.slug === LESSON.slug) : null;
      if (user && user.role === "guest" && meta && !meta.guest && typeof authShowUpsell === "function") {
        document.getElementById("lesson").innerHTML = '<a class="tl-back" href="lessons.html">← Все темы</a>';
        authShowUpsell();
      }
    } catch (e) { console.warn("auth:", e); }
  }
})();
