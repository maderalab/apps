/* Health — morning check-in tracker.
   Records blood pressure, weight and height per day and computes BMI.

   Multiple PROFILES are supported (e.g. family members); each profile keeps its
   own check-ins and weight-unit preference, stored separately. Everything lives
   in one localStorage object, so data persists on the device across reloads /
   restarts until explicitly cleared (no server, no build). */
(function () {
    'use strict';

    var DATA_KEY = 'health.data';      // { activeId, profiles: [{id, name, weightUnit, entries:[...]}] }
    var LB_PER_KG = 2.2046226218;

    // Legacy single-profile keys (migrated on first load).
    var OLD_ENTRIES = 'health.entries', OLD_HEIGHT = 'health.heightCm', OLD_UNIT = 'health.weightUnit';

    // ---------- storage ----------
    function loadRaw(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw == null ? fallback : JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    }
    function persist() {
        try { localStorage.setItem(DATA_KEY, JSON.stringify(data)); } catch (e) {}
    }
    function uid() {
        return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
    }

    // ---------- load / migrate ----------
    var data = loadRaw(DATA_KEY, null);
    if (!data || !Array.isArray(data.profiles) || !data.profiles.length) {
        // Migrate a pre-profile install, or start fresh.
        var oldEntries = loadRaw(OLD_ENTRIES, []);
        var oldHeight = loadRaw(OLD_HEIGHT, null);
        var oldUnit = loadRaw(OLD_UNIT, 'kg');
        var migrated = oldEntries.map(function (e) {
            return { date: e.date, sys: e.sys, dia: e.dia, weight: e.weight, heightCm: oldHeight };
        });
        data = { activeId: 'p1', profiles: [{ id: 'p1', name: 'Me', weightUnit: oldUnit, entries: migrated }] };
        persist();
    }

    function activeProfile() {
        return data.profiles.filter(function (p) { return p.id === data.activeId; })[0] || data.profiles[0];
    }

    // ---------- weight unit helpers ----------
    function unit() { return activeProfile().weightUnit || 'kg'; }
    function kgToDisplay(kg) { return unit() === 'lb' ? kg * LB_PER_KG : kg; }
    function displayToKg(v) { return unit() === 'lb' ? v / LB_PER_KG : v; }
    function round1(n) { return Math.round(n * 10) / 10; }

    // ---------- date helpers ----------
    function todayISO() {
        var d = new Date();
        var off = d.getTimezoneOffset();
        return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
    }
    function fmtDate(iso) {
        var parts = iso.split('-');
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var m = months[parseInt(parts[1], 10) - 1] || '';
        return { day: m + ' ' + parseInt(parts[2], 10), year: parts[0] };
    }
    function isoToLocal(iso) {
        var p = iso.split('-');
        return new Date(+p[0], +p[1] - 1, +p[2]);   // local midnight
    }

    // ---------- classifications ----------
    // ACC/AHA blood-pressure categories.
    function bpCategory(sys, dia) {
        if (sys == null || dia == null) return null;
        if (sys >= 180 || dia >= 120) return { text: 'Crisis', cls: 'tag-high' };
        if (sys >= 140 || dia >= 90) return { text: 'High (S2)', cls: 'tag-high' };
        if (sys >= 130 || dia >= 80) return { text: 'High (S1)', cls: 'tag-elevated' };
        if (sys >= 120) return { text: 'Elevated', cls: 'tag-elevated' };
        if (sys < 90 || dia < 60) return { text: 'Low', cls: 'tag-low' };
        return { text: 'Normal', cls: 'tag-normal' };
    }
    function bmiCategory(bmi) {
        if (bmi == null) return null;
        if (bmi < 18.5) return { text: 'Underweight', cls: 'tag-low' };
        if (bmi < 25) return { text: 'Normal', cls: 'tag-normal' };
        if (bmi < 30) return { text: 'Overweight', cls: 'tag-elevated' };
        return { text: 'Obese', cls: 'tag-high' };
    }
    function computeBmi(weightKg, heightCm) {
        if (weightKg == null || !heightCm) return null;
        var m = heightCm / 100;
        return weightKg / (m * m);
    }

    // ---------- elements ----------
    var $ = function (id) { return document.getElementById(id); };
    var fDate = $('fDate'), fSys = $('fSys'), fDia = $('fDia'), fHeight = $('fHeight'), fWeight = $('fWeight');
    var formMsg = $('formMsg'), formBadge = $('formBadge');
    var unitToggle = $('unitToggle'), weightUnitLabel = $('weightUnit');
    var profileBtn = $('profileBtn'), profileMenu = $('profileMenu');

    // ---------- form helpers ----------
    function num(el) {
        var v = el.value.trim();
        if (v === '') return null;
        var n = parseFloat(v);
        return isFinite(n) ? n : null;
    }
    function setMsg(text, cls) {
        formMsg.textContent = text || '';
        formMsg.className = 'form-msg' + (cls ? ' ' + cls : '');
    }
    function updateBadge() {
        formBadge.textContent = fDate.value === todayISO() ? 'Today' : 'Past day';
    }
    function syncUnitUI() {
        weightUnitLabel.textContent = unit();
        Array.prototype.forEach.call(unitToggle.querySelectorAll('button'), function (b) {
            b.classList.toggle('active', b.getAttribute('data-unit') === unit());
        });
    }

    // Most recent recorded height (before/at the given date) — "yesterday's" value.
    function lastHeight(beforeDate) {
        var es = activeProfile().entries;
        for (var i = 0; i < es.length; i++) {
            if ((beforeDate == null || es[i].date <= beforeDate) && es[i].heightCm != null) return es[i].heightCm;
        }
        return null;
    }

    function refreshFormForDate() {
        var es = activeProfile().entries;
        var existing = es.filter(function (e) { return e.date === fDate.value; })[0];
        fSys.value = existing && existing.sys != null ? existing.sys : '';
        fDia.value = existing && existing.dia != null ? existing.dia : '';
        fWeight.value = existing && existing.weight != null ? round1(kgToDisplay(existing.weight)) : '';
        // Height defaults to the last recorded value so it carries forward day to day.
        var h = existing && existing.heightCm != null ? existing.heightCm : lastHeight(fDate.value);
        fHeight.value = h != null ? h : '';
        setMsg(existing ? 'Editing this day’s check-in.' : '', existing ? 'ok' : '');
        updateBadge();
    }

    // ---------- save ----------
    function onSave() {
        var date = fDate.value || todayISO();
        var sys = num(fSys), dia = num(fDia), height = num(fHeight), weightInput = num(fWeight);

        if (sys == null && dia == null && weightInput == null) {
            setMsg('Enter at least one measurement.', 'error');
            return;
        }
        if ((sys != null) !== (dia != null)) {
            setMsg('Enter both systolic and diastolic (or neither).', 'error');
            return;
        }
        if (height != null && (height < 80 || height > 250)) {
            setMsg('Height should be between 80 and 250 cm.', 'error');
            return;
        }

        var weightKg = weightInput != null ? displayToKg(weightInput) : null;
        var es = activeProfile().entries;
        es = es.filter(function (e) { return e.date !== date; });
        es.push({ date: date, sys: sys, dia: dia, weight: weightKg, heightCm: height });
        es.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        activeProfile().entries = es;
        persist();

        setMsg('Saved ✓', 'ok');
        render();
    }

    // ---------- profiles ----------
    function setActive(id) {
        data.activeId = id;
        persist();
        closeMenu();
        syncUnitUI();
        fDate.value = todayISO();
        refreshFormForDate();
        renderProfile();
        render();
    }
    // Inline name editor / delete confirm (no prompt()/confirm() — those are
    // blocked in many embedded webviews, which is why the old menu did nothing).
    var editMode = null;   // null | 'new' | 'rename' | 'delete'

    function openEditor(mode) {
        editMode = mode;
        var input = $('profileNameInput'), msg = $('profileConfirmMsg');
        $('profileEdit').hidden = false;
        if (mode === 'delete') {
            input.hidden = true;
            msg.hidden = false;
            msg.textContent = 'Delete “' + activeProfile().name + '”?';
        } else {
            msg.hidden = true;
            input.hidden = false;
            input.value = mode === 'rename' ? activeProfile().name : '';
            input.focus();
            input.select();
        }
    }
    function closeEditor() {
        editMode = null;
        $('profileEdit').hidden = true;
    }
    function commitEditor() {
        if (editMode === 'delete') {
            if (data.profiles.length > 1) {
                var id = activeProfile().id;
                data.profiles = data.profiles.filter(function (x) { return x.id !== id; });
                closeEditor();
                setActive(data.profiles[0].id);
            } else {
                closeEditor();
            }
            return;
        }
        var name = ($('profileNameInput').value || '').trim();
        if (!name) { $('profileNameInput').focus(); return; }
        if (editMode === 'new') {
            var p = { id: uid(), name: name, weightUnit: unit(), entries: [] };
            data.profiles.push(p);
            closeEditor();
            setActive(p.id);
        } else if (editMode === 'rename') {
            activeProfile().name = name;
            persist();
            closeEditor();
            renderProfile();
            renderProfileList();
        }
    }

    function toggleMenu() { profileMenu.hidden ? openMenu() : closeMenu(); }
    function openMenu() {
        renderProfileList();
        closeEditor();
        var del = profileMenu.querySelector('[data-act="delete"]');
        if (del) del.disabled = data.profiles.length <= 1;
        profileMenu.hidden = false;
    }
    function closeMenu() { closeEditor(); profileMenu.hidden = true; }

    function renderProfileList() {
        var list = $('profileList');
        list.innerHTML = '';
        data.profiles.forEach(function (p) {
            var li = document.createElement('li');
            if (p.id === data.activeId) li.className = 'active';
            li.innerHTML =
                '<span class="mini-avatar">' + (p.name[0] || '?') + '</span>' +
                '<span class="p-name"></span>' +
                (p.id === data.activeId ? '<span class="check">✓</span>' : '');
            li.querySelector('.p-name').textContent = p.name;
            li.addEventListener('click', function () { setActive(p.id); });
            list.appendChild(li);
        });
    }

    function renderProfile() {
        var p = activeProfile();
        $('profileName').textContent = p.name;
        $('profileAvatar').textContent = p.name[0] || '?';
    }

    // ---------- CSV export / import ----------
    // Columns: date, systolic, diastolic, weight_<unit>, height_cm. Weight is
    // written in the active unit (header says which); import converts back to kg.
    function toCsv() {
        var u = unit();
        var rows = [['date', 'systolic', 'diastolic', 'weight_' + u, 'height_cm']];
        activeProfile().entries.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (e) {
            rows.push([
                e.date,
                e.sys != null ? e.sys : '',
                e.dia != null ? e.dia : '',
                e.weight != null ? round1(kgToDisplay(e.weight)) : '',
                e.heightCm != null ? e.heightCm : ''
            ]);
        });
        return rows.map(function (r) { return r.join(','); }).join('\n');
    }

    function fromCsv(text) {
        var lines = text.split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
        if (!lines.length) return [];
        var header = lines[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
        var iDate = header.indexOf('date'), iSys = header.indexOf('systolic'),
            iDia = header.indexOf('diastolic'), iH = header.indexOf('height_cm');
        var wIdx = -1, wUnit = 'kg';
        header.forEach(function (h, idx) {
            if (h.indexOf('weight') === 0) { wIdx = idx; if (h.indexOf('lb') >= 0) wUnit = 'lb'; }
        });
        if (iDate < 0) return null;   // not a recognizable Health CSV

        var out = [];
        for (var i = 1; i < lines.length; i++) {
            var c = lines[i].split(',');
            var date = (c[iDate] || '').trim();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
            var cell = function (idx) {
                if (idx < 0) return null;
                var v = (c[idx] || '').trim();
                if (v === '') return null;
                var x = parseFloat(v);
                return isFinite(x) ? x : null;
            };
            var w = cell(wIdx);
            out.push({
                date: date,
                sys: cell(iSys),
                dia: cell(iDia),
                weight: w != null ? (wUnit === 'lb' ? w / LB_PER_KG : w) : null,
                heightCm: cell(iH)
            });
        }
        return out;
    }

    function onExport() {
        if (!activeProfile().entries.length) { alert('No check-ins to export.'); return; }
        var safe = (activeProfile().name || 'profile').replace(/[^\w-]+/g, '_');
        var blob = new Blob([toCsv()], { type: 'text/csv;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'health-' + safe + '-' + todayISO() + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 0);
    }

    function onImportFile(ev) {
        var file = ev.target.files && ev.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
            var rows = fromCsv(String(reader.result));
            ev.target.value = '';   // allow re-importing the same file
            if (rows === null) { alert('Unrecognized CSV — needs a “date” column.'); return; }
            if (!rows.length) { alert('No valid rows found in the CSV.'); return; }

            // Merge by date (imported rows overwrite same-date entries).
            var byDate = {};
            activeProfile().entries.forEach(function (e) { byDate[e.date] = e; });
            rows.forEach(function (r) { byDate[r.date] = r; });
            var es = Object.keys(byDate).map(function (k) { return byDate[k]; });
            es.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
            activeProfile().entries = es;
            persist();

            refreshFormForDate();
            render();
            alert('Imported ' + rows.length + ' row(s) into “' + activeProfile().name + '”.');
        };
        reader.readAsText(file);
    }

    // ---------- render ----------
    function render() {
        var snapshot = $('snapshot'), history = $('history'), emptyMsg = $('emptyMsg'), clearBtn = $('clearBtn');
        var es = activeProfile().entries;
        var u = unit();

        var latest = es[0];
        if (latest) {
            snapshot.hidden = false;
            var d = fmtDate(latest.date);
            $('snapDate').textContent = d.day + ', ' + d.year;

            var bp = bpCategory(latest.sys, latest.dia);
            $('mBp').textContent = (latest.sys != null && latest.dia != null) ? latest.sys + '/' + latest.dia : '—';
            tag($('mBpTag'), bp);

            $('mWeight').textContent = latest.weight != null ? round1(kgToDisplay(latest.weight)) + ' ' + u : '—';
            $('mHeight').textContent = latest.heightCm != null ? latest.heightCm + ' cm' : '—';

            var bmi = computeBmi(latest.weight, latest.heightCm);
            $('mBmi').textContent = bmi != null ? bmi.toFixed(1) : (latest.weight != null ? 'Set height' : '—');
            tag($('mBmiTag'), bmi != null ? bmiCategory(bmi) : null);
        } else {
            snapshot.hidden = true;
        }

        history.innerHTML = '';
        es.forEach(function (e) {
            var li = document.createElement('li');
            li.className = 'history-item';
            var d = fmtDate(e.date);
            var stats = [];
            if (e.sys != null && e.dia != null) stats.push('<span>BP <b>' + e.sys + '/' + e.dia + '</b></span>');
            if (e.weight != null) stats.push('<span>Wt <b>' + round1(kgToDisplay(e.weight)) + u + '</b></span>');
            var bmi = computeBmi(e.weight, e.heightCm);
            if (bmi != null) stats.push('<span>BMI <b>' + bmi.toFixed(1) + '</b></span>');

            li.innerHTML =
                '<div class="hi-date">' + d.day + '<small>' + d.year + '</small></div>' +
                '<div class="hi-stats">' + (stats.join('') || '<span>—</span>') + '</div>' +
                '<button class="hi-del" title="Delete" data-date="' + e.date + '">×</button>';
            history.appendChild(li);
        });

        emptyMsg.hidden = es.length > 0;
        clearBtn.hidden = es.length === 0;

        renderCharts();
    }

    function tag(el, cat) {
        if (cat) {
            el.textContent = cat.text;
            el.className = 'metric-tag ' + cat.cls;
        } else {
            el.textContent = '';
            el.className = 'metric-tag';
        }
    }

    // ---------- 30-day trend charts ----------
    var WINDOW_DAYS = 30;

    function fmtNum(n, decimals) {
        return decimals ? (Math.round(n * 10) / 10).toFixed(1) : Math.round(n).toString();
    }

    // seriesList: [{data:[{di, v}], color}] where di is the day index (0..WINDOW-1).
    function svgChart(seriesList, decimals) {
        var all = [];
        seriesList.forEach(function (s) { s.data.forEach(function (p) { all.push(p.v); }); });
        if (!all.length) return '<div class="chart-empty">No data in the last 30 days</div>';

        var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
        if (min === max) { min -= 1; max += 1; }
        var pad = (max - min) * 0.18;
        min -= pad; max += pad;

        var W = 300, H = 82, padL = 4, padR = 26, padT = 10, padB = 8;
        function X(di) { return padL + (di / (WINDOW_DAYS - 1)) * (W - padL - padR); }
        function Y(v) { return padT + (1 - (v - min) / (max - min)) * (H - padT - padB); }

        var parts = [];
        // Top/bottom gridlines with min/max value labels.
        parts.push('<line x1="' + padL + '" y1="' + Y(max).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(max).toFixed(1) + '" stroke="#eceefb"/>');
        parts.push('<line x1="' + padL + '" y1="' + Y(min).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(min).toFixed(1) + '" stroke="#eceefb"/>');
        parts.push('<text x="' + (W - padR + 3) + '" y="' + (Y(max) + 3).toFixed(1) + '" font-size="8" fill="#b3b8c8">' + fmtNum(max, decimals) + '</text>');
        parts.push('<text x="' + (W - padR + 3) + '" y="' + (Y(min) + 3).toFixed(1) + '" font-size="8" fill="#b3b8c8">' + fmtNum(min, decimals) + '</text>');

        seriesList.forEach(function (s) {
            if (!s.data.length) return;
            if (s.data.length > 1) {
                var pts = s.data.map(function (p) { return X(p.di).toFixed(1) + ',' + Y(p.v).toFixed(1); }).join(' ');
                parts.push('<polyline points="' + pts + '" fill="none" stroke="' + s.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>');
            }
            s.data.forEach(function (p) {
                parts.push('<circle cx="' + X(p.di).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="2.4" fill="' + s.color + '"/>');
            });
            var last = s.data[s.data.length - 1];
            parts.push('<text x="' + X(last.di).toFixed(1) + '" y="' + (Y(last.v) - 5).toFixed(1) + '" font-size="9" font-weight="700" fill="' + s.color + '" text-anchor="middle">' + fmtNum(last.v, decimals) + '</text>');
        });

        return '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">' + parts.join('') + '</svg>';
    }

    function renderCharts() {
        var trends = $('trends');
        var es = activeProfile().entries;
        var startMs = isoToLocal(todayISO()).getTime() - (WINDOW_DAYS - 1) * 86400000;
        function di(iso) { return Math.round((isoToLocal(iso).getTime() - startMs) / 86400000); }

        var sys = [], dia = [], wt = [], bmi = [];
        es.forEach(function (e) {
            var d = di(e.date);
            if (d < 0 || d > WINDOW_DAYS - 1) return;
            if (e.sys != null) sys.push({ di: d, v: e.sys });
            if (e.dia != null) dia.push({ di: d, v: e.dia });
            if (e.weight != null) wt.push({ di: d, v: round1(kgToDisplay(e.weight)) });
            var b = computeBmi(e.weight, e.heightCm);
            if (b != null) bmi.push({ di: d, v: b });
        });
        [sys, dia, wt, bmi].forEach(function (a) { a.sort(function (x, y) { return x.di - y.di; }); });

        if (!(sys.length || dia.length || wt.length || bmi.length)) {
            trends.hidden = true;
            return;
        }
        trends.hidden = false;

        $('chartBp').innerHTML = svgChart([{ data: sys, color: '#764ba2' }, { data: dia, color: '#667eea' }], 0);
        $('chartWeight').innerHTML = svgChart([{ data: wt, color: '#667eea' }], 1);
        $('chartBmi').innerHTML = svgChart([{ data: bmi, color: '#764ba2' }], 1);

        $('chartWeightNow').textContent = wt.length ? wt[wt.length - 1].v + ' ' + unit() : '';
        $('chartBmiNow').textContent = bmi.length ? bmi[bmi.length - 1].v.toFixed(1) : '';
    }

    // ---------- events ----------
    $('saveBtn').addEventListener('click', onSave);
    fDate.addEventListener('change', refreshFormForDate);

    unitToggle.addEventListener('click', function (ev) {
        var btn = ev.target.closest('button[data-unit]');
        if (!btn) return;
        var next = btn.getAttribute('data-unit');
        if (next === unit()) return;
        var current = num(fWeight);                  // value in the OLD unit
        activeProfile().weightUnit = next;
        persist();
        if (current != null) fWeight.value = round1(next === 'lb' ? current * LB_PER_KG : current / LB_PER_KG);
        syncUnitUI();
        render();
    });

    profileBtn.addEventListener('click', function (ev) { ev.stopPropagation(); toggleMenu(); });
    profileMenu.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var actBtn = ev.target.closest('[data-act]');
        if (actBtn) {
            if (actBtn.disabled) return;
            openEditor(actBtn.getAttribute('data-act'));
            return;
        }
        if (ev.target.closest('#profileEditOk')) commitEditor();
        else if (ev.target.closest('#profileEditCancel')) closeEditor();
    });
    $('profileNameInput').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); commitEditor(); }
        else if (ev.key === 'Escape') { ev.preventDefault(); closeEditor(); }
    });
    document.addEventListener('click', function () { closeMenu(); });

    $('history').addEventListener('click', function (ev) {
        var btn = ev.target.closest('.hi-del');
        if (!btn) return;
        var date = btn.getAttribute('data-date');
        activeProfile().entries = activeProfile().entries.filter(function (e) { return e.date !== date; });
        persist();
        refreshFormForDate();
        render();
    });

    $('exportBtn').addEventListener('click', onExport);
    $('importBtn').addEventListener('click', function () { $('importFile').click(); });
    $('importFile').addEventListener('change', onImportFile);

    $('clearBtn').addEventListener('click', function () {
        if (confirm('Delete all check-ins for this profile?')) {
            activeProfile().entries = [];
            persist();
            refreshFormForDate();
            render();
        }
    });

    // ---------- init ----------
    fDate.value = todayISO();
    fDate.max = todayISO();
    syncUnitUI();
    renderProfile();
    refreshFormForDate();
    render();
})();
