// =====================================================================
// news-admin.js — вкладка «Что нового» в панели преподавателя (teacher-board).
//
// Преподаватель пишет новость (заголовок, текст, картинка, кнопка-ссылка),
// смотрит предпросмотр и публикует. Ученицы видят её во всплывающем окне
// (whats-new.js) один раз, на любом устройстве.
//
// Данные: таблица platform_news, картинки — хранилище Supabase, bucket «news».
// Картинка перед загрузкой уменьшается до 1280 px по ширине (JPEG), чтобы
// окно у учениц открывалось быстро даже с телефона.
//
// Несколько новостей сразу: сохраните их черновиками, отметьте в списке
// в нужном порядке и нажмите «Опубликовать вместе». Ученицы увидят их
// в одном окне, листая «Дальше», — в том порядке, в каком вы их отметили.
// =====================================================================
(function () {
    'use strict';
    const db = () => window.supabaseClient;
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icons = () => { try { lucide.createIcons(); } catch (e) { /* */ } };
    const BUCKET = 'news';
    // Подсказки для ссылки кнопки — основные страницы платформы
    const PAGES = [
        ['index.html', 'Главная'], ['reading.html', 'Reading'], ['listening.html', 'Listening'], ['speaking.html', 'Speaking'],
        ['writing.html', 'Writing'], ['vocabulary.html', 'Словарь T-Vocab'], ['reading-trainer.html', 'Тренажёр типов вопросов'],
        ['tests.html', 'Пробные тесты'], ['grammar.html', 'Грамматика'], ['irregular-verbs.html', 'Неправильные глаголы']
    ];

    const st = { list: [], loaded: false, edit: null, busy: false, error: '', pick: [] };   // pick — id отмеченных черновиков, по порядку
    const MAX_IN_WINDOW = 5;   // столько новостей помещается в одно окно у учениц (news_unseen … limit 5)
    const picked = () => st.pick.map(id => st.list.find(n => String(n.id) === String(id))).filter(n => n && !n.is_published);
    const empty = () => ({ id: null, title: '', body: '', image_url: '', button_label: '', button_url: '', is_published: false, published_at: null });

    function root() { return document.getElementById('newsView'); }

    async function load() {
        const { data, error } = await db().from('platform_news').select('*').order('created_at', { ascending: false });
        if (error) {
            st.error = /platform_news|schema cache|does not exist|relation/i.test(error.message || '')
                ? 'Таблицы новостей ещё нет: запустите SQL platform_news.sql в Supabase.'
                : 'Не удалось загрузить новости: ' + error.message;
            st.list = [];
        } else { st.error = ''; st.list = data || []; }
        st.loaded = true;
        st.pick = picked().map(n => n.id);
    }

    function fmt(iso) {
        if (!iso) return '';
        try { return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
    }

    function render() {
        const r = root(); if (!r) return;
        const e = st.edit || empty();
        const field = 'w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';
        r.innerHTML = `
        ${st.error ? `<div class="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-900">${esc(st.error)}</div>` : ''}
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <section class="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div class="flex items-center justify-between gap-3 mb-4">
              <h2 class="text-lg font-extrabold text-slate-900">${e.id ? 'Редактирование новости' : 'Новая новость'}</h2>
              ${e.id ? `<button type="button" data-na="new" class="text-xs font-bold text-indigo-600 hover:underline">+ Новая</button>` : ''}
            </div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">Заголовок</label>
            <input id="naTitle" class="${field}" maxlength="120" placeholder="Например: Новый тренажёр по типам вопросов" value="${esc(e.title)}">

            <label class="block text-xs font-bold text-slate-500 mb-1.5 mt-4">Текст</label>
            <textarea id="naBody" class="${field} min-h-[150px] leading-relaxed" placeholder="Что появилось и зачем это ученице">${esc(e.body)}</textarea>
            <p class="text-[11px] text-gray-400 mt-1.5">Пустая строка — новый абзац. Строка с «- » — пункт списка. **Так** — жирный текст.</p>

            <label class="block text-xs font-bold text-slate-500 mb-1.5 mt-4">Картинка <span class="font-medium text-gray-400">— необязательно</span></label>
            <div id="naImgBox">${e.image_url
                ? `<div class="relative rounded-xl overflow-hidden border border-gray-200"><img src="${esc(e.image_url)}" class="w-full max-h-64 object-cover" alt="">
                     <button type="button" data-na="imgDel" class="absolute top-2 right-2 bg-white/90 hover:bg-white text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow">Убрать</button></div>`
                : `<label class="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-200 hover:border-indigo-300 rounded-xl py-7 cursor-pointer text-gray-400 hover:text-indigo-500 transition">
                     <i data-lucide="image-plus" class="w-7 h-7"></i><span class="text-sm font-bold">Выбрать картинку или скриншот</span>
                     <span class="text-[11px]">JPG, PNG — уменьшим автоматически</span>
                     <input id="naFile" type="file" accept="image/*" class="hidden"></label>`}</div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div><label class="block text-xs font-bold text-slate-500 mb-1.5">Текст кнопки <span class="font-medium text-gray-400">— необязательно</span></label>
                <input id="naBtnLabel" class="${field}" maxlength="40" placeholder="Попробовать" value="${esc(e.button_label)}"></div>
              <div><label class="block text-xs font-bold text-slate-500 mb-1.5">Куда ведёт кнопка</label>
                <input id="naBtnUrl" class="${field}" list="naPages" placeholder="reading-trainer.html" value="${esc(e.button_url)}">
                <datalist id="naPages">${PAGES.map(([u, l]) => `<option value="${u}">${esc(l)}</option>`).join('')}</datalist></div>
            </div>

            <div class="flex flex-wrap gap-2.5 mt-6">
              <button type="button" data-na="preview" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-slate-700 hover:bg-gray-200 flex items-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i>Как увидят ученицы</button>
              <button type="button" data-na="save" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-slate-700 hover:bg-gray-50" ${st.busy ? 'disabled' : ''}>Сохранить черновик</button>
              ${e.is_published ? '' : `<button type="button" data-na="saveNext" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 flex items-center gap-2" ${st.busy ? 'disabled' : ''} title="Сохранить черновиком и сразу открыть пустую форму для следующей новости"><i data-lucide="plus" class="w-4 h-4"></i>Сохранить и написать ещё</button>`}
              <button type="button" data-na="publish" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2" ${st.busy ? 'disabled' : ''}><i data-lucide="send" class="w-4 h-4"></i>${e.is_published ? 'Сохранить' : 'Опубликовать'}</button>
            </div>
            ${e.is_published ? `<p class="text-[11px] text-gray-400 mt-2">Новость уже опубликована. Правки увидят те, кто откроет её позже; показать её всем ещё раз можно в списке справа.</p>` : ''}
            <p id="naMsg" class="text-sm font-semibold mt-3 min-h-[20px]"></p>
          </section>

          <aside class="lg:col-span-2">
            <h3 class="text-sm font-extrabold text-slate-900 mb-3">Все новости</h3>
            ${batchBar()}
            <div class="space-y-3">${!st.loaded ? '<p class="text-sm text-gray-400">Загрузка…</p>'
                : !st.list.length ? '<p class="text-sm text-gray-400 bg-white border border-gray-200 rounded-2xl p-4">Пока ни одной новости.</p>'
                : st.list.map(card).join('')}</div>
          </aside>
        </div>`;
        icons();
        const f = document.getElementById('naFile');
        if (f) f.addEventListener('change', () => { if (f.files && f.files[0]) uploadImage(f.files[0]); });
    }

    // Панель «несколько новостей сразу» — появляется, когда есть черновики
    function batchBar() {
        if (!st.loaded || !st.list.some(n => !n.is_published)) return '';
        const sel = picked(), k = sel.length;
        const word = k === 1 ? 'новость' : (k >= 2 && k <= 4) ? 'новости' : 'новостей';
        return `<div class="mb-3 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p class="text-xs text-indigo-900 leading-relaxed">${k
            ? `Отмечено <b>${k}</b>. Ученицы увидят их в одном окне в этом порядке: ${sel.map((n, i) => `<b>${i + 1}</b>&nbsp;${esc(n.title.length > 28 ? n.title.slice(0, 27) + '…' : n.title)}`).join(', ')}.`
            : 'Чтобы опубликовать <b>несколько новостей сразу</b>, отметьте черновики кружком слева — в том порядке, в каком ученицы должны их увидеть.'}</p>
          ${k > MAX_IN_WINDOW ? `<p class="text-xs text-amber-700 font-semibold mt-1.5">В окне помещается ${MAX_IN_WINDOW} новостей — остальные ученицы не увидят. Оставьте не больше ${MAX_IN_WINDOW}.</p>` : ''}
          ${k ? `<div class="flex flex-wrap gap-2 mt-2.5">
            <button type="button" data-na="batchShow" class="px-3 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 hover:bg-gray-50 border border-indigo-100 flex items-center gap-1.5"><i data-lucide="eye" class="w-3.5 h-3.5"></i>Посмотреть вместе</button>
            <button type="button" data-na="batchPub" class="px-3 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5" ${st.busy ? 'disabled' : ''}><i data-lucide="send" class="w-3.5 h-3.5"></i>Опубликовать ${k} ${word} вместе</button>
            <button type="button" data-na="batchClear" class="px-2 py-2 rounded-lg text-xs font-bold text-indigo-700 hover:underline">Снять отметки</button></div>` : ''}
          <p id="naBatchMsg" class="text-xs font-semibold mt-2 empty:hidden"></p>
        </div>`;
    }

    function card(n) {
        const pub = n.is_published;
        const order = st.pick.indexOf(n.id) + 1;
        const pickBtn = pub ? '' : `<button type="button" data-na="pick" data-id="${n.id}" aria-pressed="${order > 0}" title="${order ? 'Убрать из публикации вместе' : 'Отметить для публикации вместе'}"
            class="w-7 h-7 shrink-0 self-center rounded-full border-2 flex items-center justify-center text-xs font-extrabold transition ${order ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-transparent hover:border-indigo-400'}">${order || ''}</button>`;
        return `<div class="bg-white border ${st.edit && st.edit.id === n.id ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'} rounded-2xl p-3.5 shadow-sm">
          <div class="flex gap-3">
            ${pickBtn}
            ${n.image_url ? `<img src="${esc(n.image_url)}" class="w-16 h-16 rounded-xl object-cover shrink-0" alt="">` : `<div class="w-16 h-16 rounded-xl bg-indigo-50 text-indigo-400 flex items-center justify-center shrink-0"><i data-lucide="megaphone" class="w-6 h-6"></i></div>`}
            <div class="min-w-0 flex-1">
              <p class="font-bold text-sm text-slate-900 leading-snug line-clamp-2">${esc(n.title)}</p>
              <p class="mt-1 text-[11px] font-bold ${pub ? 'text-emerald-600' : 'text-gray-400'}">${pub ? 'Опубликовано · ' + esc(fmt(n.published_at)) : 'Черновик'}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-3">
            <button type="button" data-na="edit" data-id="${n.id}" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-slate-700 hover:bg-gray-200">Изменить</button>
            <button type="button" data-na="show" data-id="${n.id}" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-slate-700 hover:bg-gray-200">Посмотреть</button>
            ${pub ? `<button type="button" data-na="again" data-id="${n.id}" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100" title="Окно снова появится у всех учениц">Показать ещё раз</button>
                     <button type="button" data-na="unpub" data-id="${n.id}" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-slate-700 hover:bg-gray-200">Скрыть</button>`
                  : `<button type="button" data-na="pub" data-id="${n.id}" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700">Опубликовать</button>`}
            <button type="button" data-na="del" data-id="${n.id}" class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 ml-auto">Удалить</button>
          </div></div>`;
    }

    function readForm() {
        const e = Object.assign(empty(), st.edit || {});
        e.title = (document.getElementById('naTitle').value || '').trim();
        e.body = (document.getElementById('naBody').value || '').trim();
        e.button_label = (document.getElementById('naBtnLabel').value || '').trim();
        e.button_url = (document.getElementById('naBtnUrl').value || '').trim();
        return e;
    }
    function msg(text, ok) {
        const m = document.getElementById('naMsg');
        if (m) { m.textContent = text || ''; m.className = 'text-sm font-semibold mt-3 min-h-[20px] ' + (ok ? 'text-emerald-600' : 'text-rose-600'); }
    }

    // Картинка: уменьшаем до 1280 px и загружаем в хранилище
    async function shrink(file) {
        const url = URL.createObjectURL(file);
        try {
            const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
            const scale = Math.min(1, 1280 / img.naturalWidth);
            const c = document.createElement('canvas');
            c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
            const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
            ctx.drawImage(img, 0, 0, c.width, c.height);
            return await new Promise(res => c.toBlob(res, 'image/jpeg', 0.85));
        } finally { URL.revokeObjectURL(url); }
    }
    async function uploadImage(file) {
        st.edit = readForm();
        const box = document.getElementById('naImgBox');
        if (box) box.innerHTML = '<p class="text-sm text-gray-400 py-6 text-center">Загружаем картинку…</p>';
        try {
            const blob = await shrink(file);
            const path = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
            const { error } = await db().storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false });
            if (error) throw error;
            st.edit.image_url = db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
            render();
        } catch (e) {
            console.error(e);
            render();
            msg(/bucket|not found/i.test(e.message || '') ? 'Хранилища картинок ещё нет: запустите SQL platform_news.sql.' : 'Картинка не загрузилась: ' + (e.message || e), false);
        }
    }

    async function save(publish, next) {
        const e = readForm();
        if (!e.title) { msg('Напишите заголовок', false); return; }
        if (e.button_label && !e.button_url) { msg('Укажите, куда ведёт кнопка', false); return; }
        st.busy = true; st.edit = e; render();
        const row = { title: e.title, body: e.body, image_url: e.image_url || null, button_label: e.button_label || null, button_url: e.button_url || null, updated_at: new Date().toISOString() };
        if (publish && !e.is_published) { row.is_published = true; row.published_at = new Date().toISOString(); }
        const q = e.id ? db().from('platform_news').update(row).eq('id', e.id) : db().from('platform_news').insert(row);
        const { data, error } = await q.select().single();
        st.busy = false;
        if (error) { render(); msg('Не сохранилось: ' + error.message, false); return; }
        // новый черновик сразу отмечаем для публикации вместе с остальными
        if (!publish && !e.id && data && !st.pick.includes(data.id)) st.pick.push(data.id);
        await load();
        st.edit = (publish || next) ? null : data;
        render();
        msg(publish ? 'Опубликовано — ученицы увидят окно при следующем открытии платформы'
            : next ? 'Черновик сохранён и отмечен в списке справа. Пишите следующую новость' : 'Черновик сохранён', true);
        if (next) { const t = document.getElementById('naTitle'); if (t) t.focus(); }
    }

    // Публикуем отмеченные черновики разом. Время ставим с шагом в секунду:
    // ученицы видят сначала самую свежую, поэтому первой отмеченной — самое позднее время.
    async function publishBatch() {
        const sel = picked();
        if (!sel.length) return;
        if (!confirm('Опубликовать сразу ' + sel.length + ' — ученицы увидят их в одном окне?')) return;
        st.busy = true; render();
        const base = Date.now(), failed = [];
        for (let i = 0; i < sel.length; i++) {
            const at = new Date(base - i * 1000).toISOString();
            const { error } = await db().from('platform_news')
                .update({ is_published: true, published_at: at, updated_at: new Date().toISOString() }).eq('id', sel[i].id);
            if (error) failed.push(sel[i].title + ': ' + error.message);
        }
        st.busy = false;
        st.pick = [];
        if (st.edit && sel.some(n => n.id === st.edit.id)) st.edit = null;
        await load(); render();
        if (failed.length) alert('Не все опубликовались:\n' + failed.join('\n'));
        else msg('Опубликовано ' + sel.length + ' — ученицы увидят их в одном окне при следующем открытии платформы', true);
    }

    async function act(name, id) {
        const n = st.list.find(x => String(x.id) === String(id));
        // Действия из списка не должны стирать то, что набрано в форме
        if (['pub', 'unpub', 'again', 'del', 'show', 'pick', 'batchShow', 'batchPub', 'batchClear'].includes(name) && document.getElementById('naTitle')) st.edit = readForm();
        if (name === 'pick' && n && !n.is_published) {
            const i = st.pick.indexOf(n.id);
            if (i >= 0) st.pick.splice(i, 1); else st.pick.push(n.id);
            render(); return;
        }
        if (name === 'batchClear') { st.pick = []; render(); return; }
        if (name === 'batchShow') {
            const base = Date.now();
            const sel = picked().map((x, i) => Object.assign({}, x, { published_at: new Date(base - i * 1000).toISOString() }));
            if (sel.length && window.WhatsNew) WhatsNew.preview(sel);
            return;
        }
        if (name === 'batchPub') return publishBatch();
        if (name === 'new') { st.edit = null; render(); return; }
        if (name === 'edit' && n) { st.edit = Object.assign({}, n); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        if (name === 'show' && n) { window.WhatsNew && WhatsNew.preview(Object.assign({}, n, { published_at: n.published_at || new Date().toISOString() })); return; }
        if (name === 'preview') { const e = readForm(); if (!e.title) { msg('Напишите заголовок', false); return; } window.WhatsNew && WhatsNew.preview(Object.assign({}, e, { published_at: new Date().toISOString() })); return; }
        if (name === 'save') return save(false);
        if (name === 'saveNext') return save(false, true);
        if (name === 'publish') return save(true);
        if (name === 'imgDel') { st.edit = readForm(); st.edit.image_url = ''; render(); return; }
        if (!n) return;
        let patch = null;
        if (name === 'pub') patch = { is_published: true, published_at: n.published_at || new Date().toISOString() };
        if (name === 'unpub') patch = { is_published: false };
        if (name === 'again') { if (!confirm('Показать эту новость всем ученицам ещё раз?')) return; patch = { is_published: true, published_at: new Date().toISOString() }; }
        if (name === 'del') {
            if (!confirm('Удалить новость «' + n.title + '»?')) return;
            const { error } = await db().from('platform_news').delete().eq('id', n.id);
            if (error) { alert('Не удалилось: ' + error.message); return; }
            if (st.edit && st.edit.id === n.id) st.edit = null;
            await load(); render(); return;
        }
        if (patch) {
            patch.updated_at = new Date().toISOString();
            const { error } = await db().from('platform_news').update(patch).eq('id', n.id);
            if (error) { alert('Не сохранилось: ' + error.message); return; }
            await load(); render();
        }
    }

    document.addEventListener('click', e => {
        const b = e.target.closest('[data-na]');
        if (!b || !root() || !root().contains(b)) return;
        e.preventDefault();
        act(b.dataset.na, b.dataset.id);
    });

    window.NewsAdmin = {
        show: async function () { if (!st.loaded) { render(); await load(); } render(); }
    };
})();
