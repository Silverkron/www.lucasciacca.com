---
title: "Font Impact Overlay: quali font stanno sabotando il tuo rendering?"
description: "Uno script che analizza i font realmente usati above the fold, genera tag preload precisi e visualizza su ogni elemento quale font lo sta renderizzando."
date: 2026-03-31 22:01:00 +0300
image: '/images/font-impact-overlay/cover.webp'
tags: [performance, fonts, core-web-vitals, javascript]
---

# **Font Impact Overlay: quali font stanno sabotando il tuo rendering?**

## **Introduzione**

Ogni volta che un utente apre una pagina, il browser corre contro il tempo. Scarica l'HTML, costruisce il DOM, analizza il CSS — e solo alla fine di questa corsa sa quali font servono per disegnare il testo. Se quei font non sono ancora disponibili, succede qualcosa di brutto: il testo scompare, lampeggia, si ridisegna. E tutto questo accade esattamente dove l'utente sta guardando.

Above the fold. Nella prima viewport. Sotto gli occhi di chiunque apra la pagina.

---

## **Il browser non perdona i font lenti**

Quando un font non è pronto al momento del render, il browser sceglie tra tre strategie definite da `font-display`: aspetta in silenzio (`block`), mostra subito un fallback (`swap`), oppure lascia perdere (`optional`). In tutti i casi, qualcosa va storto se il font non è preloadato correttamente.

Il Flash of Invisible Text (FOIT) rende il testo invisibile finché il font non arriva. Il Flash of Unstyled Text (FOUT) mostra prima Arial o Georgia, poi ridisegna tutto con il font custom. Il Cumulative Layout Shift (CLS) — una delle Core Web Vitals (CWV) più penalizzanti per la SEO — esplode ogni volta che questo ridisegno sposta altri elementi della pagina.

Un font critico non preloadato può costare 200–800ms di Largest Contentful Paint (LCP). Nella pratica, significa titoli che appaiono in ritardo, CTA che lampeggiano, pagine che si muovono da sole. Significa utenti che rimbalzano.

---

## **Il problema degli strumenti tradizionali**

Lighthouse, WebPageTest, i DevTools di Chrome: tutti ottimi strumenti. Tutti rispondono alla domanda sbagliata.

Dicono *quali font vengono richiesti durante il caricamento*. Non dicono *quali font influenzano il rendering iniziale della pagina*.

Una pagina tipica carica 4–8 varianti font. Ma nella prima viewport, al momento del primo render, ne servono 2–3 al massimo. Le altre esistono per contenuti sotto la fold, stati hover, componenti che appaiono solo dopo un click. Preloadare tutto è inutile — e dannoso, perché satura il critical path. Preloadare le varianti sbagliate è come non preloadare nulla.

Nessuno strumento tradizionale fa questa distinzione. **Font Impact Overlay** sì.

---

## **Cosa fa lo script**

Font Impact Overlay si esegue direttamente nel browser — come bookmarklet o snippet nella console — e in pochi secondi risponde a una sola domanda, quella giusta: *quali font stanno effettivamente renderizzando testo above the fold in questo momento?*

Per farlo, bypassa completamente il CSS dichiarato e interroga il browser sul risultato reale dopo la cascata, usando `window.getComputedStyle` su ogni elemento visibile nella viewport:

```javascript
for (const el of document.querySelectorAll('*')) {
  if (!inViewport(el) || !hasText(el)) continue;
  const cs = window.getComputedStyle(el);
  const family = cs.fontFamily?.trim();
  // ...
}
```

Se un elemento ha `font-family: 'CustomFont', sans-serif` ma il font non è stato caricato, `getComputedStyle` restituisce il fallback reale — non quello dichiarato. Nessun analizzatore CSS statico può farlo.

Dalla scansione, lo script costruisce una mappa completa: ogni variante font above the fold, con famiglia, peso, stile, URL fisico del file `.woff2`, e numero di elementi che la usano. Da questa mappa genera direttamente l'output azionabile: i tag `<link rel="preload">` da inserire nel `<head>` e i blocchi `@font-face` con `font-display: block` da aggiungere al CSS critico.

---

## **Lo script**

Puoi eseguirlo direttamente nella console del browser su qualsiasi pagina, oppure salvarlo come bookmarklet.

```javascript
(function fontAnalyzer() {
  document.getElementById('__font_overlay__')?.remove();

  const vH = window.innerHeight;
  const vW = window.innerWidth;

  const inViewport = el => {
    const r = el.getBoundingClientRect();
    return r.top < vH && r.bottom > 0 && r.left < vW && r.right > 0;
  };

  const hasText = el =>
          [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());

  const norm = w => (!w || w === 'normal') ? '400' : w === 'bold' ? '700' : w.trim();
  const mime = u => u.includes('.woff2') ? 'font/woff2' : u.includes('.woff') ? 'font/woff' : 'font/truetype';
  const fmt  = u => u.includes('.woff2') ? 'woff2' : u.includes('.woff') ? 'woff' : 'truetype';

  const makeFontFace = (fam, w, s, url, format) =>
          `@font-face{font-family:'${fam}';font-weight:${w};font-style:${s};font-display:block!important;src:url('${url}') format('${format}')}`;

  const domEl = (tag, css = '', attrs = {}) => {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };
  const txt = s => document.createTextNode(s);

  const COLORS = [
    '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD',
    '#98D8C8','#F7DC6F','#BB8FCE','#85C1E9','#F0B27A','#82E0AA'
  ];

  const EXCLUDED = ['swiper','bootstrap','fontawesome','font-awesome','dashicons','slick','animate','normalize'];

  // ── 1. Scansiona above the fold ───────────────────────────────────────────
  const usedVariants = new Map();

  for (const el of document.querySelectorAll('*')) {
    if (!inViewport(el) || !hasText(el)) continue;
    const cs = window.getComputedStyle(el);
    const family = cs.fontFamily?.trim();
    if (!family) continue;
    const cleanFamily = family.replace(/['"]/g, '').split(',')[0].trim();
    const weight = norm(cs.fontWeight);
    const style  = cs.fontStyle?.trim() || 'normal';
    const key    = `${cleanFamily}|${weight}|${style}`;
    if (!usedVariants.has(key)) {
      usedVariants.set(key, { cleanFamily, weight, style, elements: new Set() });
    }
    usedVariants.get(key).elements.add(el);
  }

  const usedFamilies = new Set(
          [...usedVariants.values()].map(v => v.cleanFamily.toLowerCase())
  );

  // ── 2. Raccogli @font-face solo per varianti usate ────────────────────────
  const fontFaceUrls = new Map();
  const cssBlocks = [];
  const seenCss = new Set();
  const localCss = new Set();

  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules || sheet.rules; } catch { continue; }
    if (!rules) continue;

    let sheetUsed = false;

    for (const rule of rules) {
      if (!(rule instanceof CSSFontFaceRule)) continue;

      const fam    = rule.style.getPropertyValue('font-family')?.replace(/['"]/g, '').trim();
      const w      = norm(rule.style.getPropertyValue('font-weight') || 'normal');
      const s      = rule.style.getPropertyValue('font-style')?.trim() || 'normal';
      const srcRaw = rule.style.getPropertyValue('src');
      if (!fam || !srcRaw) continue;

      const famLow = fam.toLowerCase();
      if (!usedFamilies.has(famLow)) continue;

      const matchingVariants = [...usedVariants.values()].filter(v => {
        if (v.cleanFamily.toLowerCase() !== famLow) return false;
        if (v.style !== s) return false;
        const wParts = w.split(/\s+/);
        if (wParts.length === 2) {
          const [min, max] = wParts.map(Number);
          return Number(v.weight) >= min && Number(v.weight) <= max;
        }
        return v.weight === w;
      });

      if (!matchingVariants.length) continue;

      sheetUsed = true;

      const urls    = [...srcRaw.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g)].map(m => m[1]);
      const formats = [...srcRaw.matchAll(/format\(['"]?([^'")\s]+)['"]?\)/g)].map(m => m[1]);

      matchingVariants.forEach(v => {
        const vKey = `${v.cleanFamily}|${v.weight}|${v.style}`;
        if (!fontFaceUrls.has(vKey)) fontFaceUrls.set(vKey, new Set());
        urls.forEach(u => fontFaceUrls.get(vKey).add(u));
      });

      urls.forEach((url, i) => {
        const cssKey = `${fam}|${w}|${s}|${url}`;
        if (seenCss.has(cssKey)) return;
        seenCss.add(cssKey);
        cssBlocks.push(makeFontFace(fam, w, s, url, formats[i] || fmt(url)));
      });
    }

    if (sheetUsed && sheet.href) {
      const h = sheet.href.toLowerCase();
      if (!EXCLUDED.some(p => h.includes(p))) localCss.add(sheet.href);
    }
  }

  // ── 3. Preload CSS ────────────────────────────────────────────────────────
  const cdnCss = [...document.querySelectorAll('link[rel="stylesheet"]')]
          .map(l => l.href)
          .filter(h => {
            if (!h) return false;
            const isCdn = h.includes('fonts.googleapis.com') || h.includes('use.typekit.net') ||
                    h.includes('fonts.adobe.com')       || h.includes('fonts.bunny.net');
            if (!isCdn) return false;
            const d = decodeURIComponent(h).toLowerCase();
            return [...usedFamilies].some(f =>
                    d.includes(f.replace(/\s+/g, '+')) || d.includes(f)
            );
          });

  const allCssSources  = [...new Set([...cdnCss, ...localCss])];
  const preloadCssTags = allCssSources.map(h =>
          `<link rel="preload" as="style" href="${h}" crossorigin="anonymous">`
  );

  // ── 4. Preload font — URL unici above the fold ────────────────────────────
  const seenUrls = new Set();
  const preloadFontTags = [];

  for (const [key] of usedVariants) {
    const urls = fontFaceUrls.get(key) || new Set();
    for (const u of urls) {
      if (seenUrls.has(u) || !/\.(woff2?|ttf|otf)/i.test(u)) continue;
      seenUrls.add(u);
      preloadFontTags.push(
              `<link rel="preload" as="font" type="${mime(u)}" href="${u}" crossorigin="anonymous">`
      );
    }
  }

  const allPreloads = [...preloadCssTags, ...preloadFontTags];

  // ── 5. Highlight + risultati ──────────────────────────────────────────────
  const originalStyles = new Map();
  const results = [];
  let ci = 0;

  const sorted = [...usedVariants.entries()].sort(([, a], [, b]) => {
    const fc = a.cleanFamily.localeCompare(b.cleanFamily);
    return fc !== 0 ? fc : parseInt(a.weight) - parseInt(b.weight);
  });

  for (const [key, v] of sorted) {
    const color = COLORS[ci++ % COLORS.length];
    const urls  = [...(fontFaceUrls.get(key) || [])];

    for (const node of v.elements) {
      if (!originalStyles.has(node)) {
        originalStyles.set(node, { outline: node.style.outline, bg: node.style.backgroundColor });
      }
      node.style.outline = `3px solid ${color}`;
      node.style.backgroundColor = `${color}33`;
      node.dataset.fa = key;
    }

    results.push({ key, ...v, color, urls });
  }

  const groups = {};
  for (const r of results) {
    if (!groups[r.cleanFamily]) groups[r.cleanFamily] = [];
    groups[r.cleanFamily].push(r);
  }

  const wLabel = (w, s) => {
    const L = { '100':'Thin','200':'ExtraLight','300':'Light','400':'Regular',
      '500':'Medium','600':'SemiBold','700':'Bold','800':'ExtraBold','900':'Black' };
    return s !== 'normal' ? `${L[w]||'w'+w} ${s}` : (L[w]||`w${w}`);
  };

  // ── 6. Pannello UI ────────────────────────────────────────────────────────
  const overlay = domEl('div',
          'position:fixed;top:10px;right:10px;z-index:999999;background:rgba(10,12,20,0.95);' +
          'color:#fff;padding:14px 16px;border-radius:10px;font-family:monospace;font-size:12px;' +
          'max-width:400px;max-height:90vh;overflow-y:auto;box-shadow:0 4px 24px rgba(0,0,0,0.7);' +
          'line-height:1.6;backdrop-filter:blur(8px)'
  );
  overlay.id = '__font_overlay__';

  const header    = domEl('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px');
  const title     = domEl('strong', 'font-size:13px');
  title.appendChild(txt('🔤 Font Analyzer — Above the Fold'));
  const btnGroup  = domEl('div', 'display:flex;gap:5px');
  const btnToggle = domEl('button', 'background:#ffffff22;border:none;color:#fff;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px');
  btnToggle.appendChild(txt('Nascondi'));
  const btnClose  = domEl('button', 'background:#ff444466;border:none;color:#fff;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px');
  btnClose.appendChild(txt('✕'));
  btnGroup.append(btnToggle, btnClose);
  header.append(title, btnGroup);
  overlay.appendChild(header);

  const makeSection = (icon, label, lines, color) => {
    const wrap   = domEl('div', 'margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #ffffff22');
    const topRow = domEl('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:5px');
    const lbl    = domEl('div', 'font-size:11px;color:#aaa');
    lbl.appendChild(txt(`${icon} ${label}`));
    const btnCopy = domEl('button', 'background:#ffffff15;border:none;color:#7dd3fc;padding:2px 7px;border-radius:3px;cursor:pointer;font-size:10px');
    btnCopy.appendChild(txt('Copia'));
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(lines.join('\n')).then(() => {
        btnCopy.textContent = '✓ Copiato!';
        setTimeout(() => btnCopy.textContent = 'Copia', 1500);
      });
    });
    topRow.append(lbl, btnCopy);
    wrap.appendChild(topRow);
    if (lines.length) {
      lines.forEach(line => {
        const b = domEl('div',
                `background:#0f172a;border-radius:4px;padding:4px 6px;margin:3px 0;` +
                `font-size:9px;word-break:break-all;white-space:pre-wrap;overflow-x:auto;color:${color}`
        );
        b.appendChild(txt(line));
        wrap.appendChild(b);
      });
    } else {
      const n = domEl('span', 'color:#666;font-size:10px');
      n.appendChild(txt('Nessun risultato'));
      wrap.appendChild(n);
    }
    return wrap;
  };

  overlay.appendChild(makeSection('⚡', `Preload tags (${allPreloads.length})`, allPreloads, '#86efac'));
  overlay.appendChild(makeSection('🎨', `CSS font-display: block (${cssBlocks.length})`, cssBlocks, '#fde68a'));

  const legTitle = domEl('div', 'font-size:11px;color:#aaa;margin-bottom:6px');
  legTitle.appendChild(txt(`🎨 Legenda (${results.length} varianti)`));
  overlay.appendChild(legTitle);

  for (const [family, variants] of Object.entries(groups)) {
    const group = domEl('div', 'margin-bottom:8px;padding:6px;border-radius:6px;background:#ffffff0a');
    const ft    = domEl('div', 'font-weight:bold;font-size:11px;margin-bottom:4px;color:#e2e8f0');
    ft.appendChild(txt(family));
    group.appendChild(ft);

    for (const v of variants) {
      const row  = domEl('div',
              `margin:4px 0;padding:4px 4px 4px 6px;border-left:3px solid ${v.color};` +
              'border-radius:0 4px 4px 0;background:#ffffff07'
      );
      const info = domEl('div', 'display:flex;align-items:center;gap:6px;flex-wrap:wrap');
      const sw   = domEl('span', `width:10px;height:10px;min-width:10px;border-radius:2px;background:${v.color};display:inline-block`);
      const wl   = domEl('span', 'font-size:10px;color:#cbd5e1;font-weight:bold');
      wl.appendChild(txt(wLabel(v.weight, v.style)));
      const co   = domEl('span', 'font-size:9px;color:#64748b');
      co.appendChild(txt(`${v.elements.size} el.`));
      const st   = domEl('span', `font-size:9px;${v.urls.length ? 'color:#4ade80' : 'color:#f87171'}`);
      st.appendChild(txt(v.urls.length ? '✓ trovato' : '⚠ non trovato'));
      info.append(sw, wl, co, st);
      row.appendChild(info);

      v.urls.forEach(u => {
        const r2 = domEl('div', 'margin-top:2px');
        const ic = domEl('span', 'font-size:8px;color:#94a3b8');
        ic.appendChild(txt('📁 '));
        const lk = domEl('a', 'color:#7dd3fc;font-size:9px;word-break:break-all', { href: u, target: '_blank' });
        lk.appendChild(txt(u.length > 52 ? u.slice(0, 51) + '…' : u));
        r2.append(ic, lk);
        row.appendChild(r2);
      });

      group.appendChild(row);
    }
    overlay.appendChild(group);
  }

  document.body.appendChild(overlay);

  // ── 7. Toggle / Close ─────────────────────────────────────────────────────
  let hl = true;
  btnToggle.addEventListener('click', () => {
    hl = !hl;
    for (const [node, orig] of originalStyles) {
      if (hl) {
        const r = results.find(r => r.key === node.dataset.fa);
        if (r) { node.style.outline = `3px solid ${r.color}`; node.style.backgroundColor = `${r.color}33`; }
      } else {
        node.style.outline = orig.outline;
        node.style.backgroundColor = orig.bg;
      }
    }
    btnToggle.textContent = hl ? 'Nascondi' : 'Mostra';
  });

  btnClose.addEventListener('click', () => {
    for (const [node, orig] of originalStyles) {
      node.style.outline = orig.outline;
      node.style.backgroundColor = orig.bg;
      delete node.dataset.fa;
    }
    overlay.remove();
  });

  // ── 8. Console ────────────────────────────────────────────────────────────
  console.group('%c🔤 Font Analyzer — Above the Fold', 'font-size:14px;font-weight:bold;color:#6366f1');
  console.log('👁 Family usate:', [...usedFamilies]);
  console.log(`⚡ Preload CSS (${preloadCssTags.length}):`, preloadCssTags);
  console.log(`⚡ Preload font (${preloadFontTags.length}):`, preloadFontTags);
  console.log(`🎨 CSS blocks (${cssBlocks.length}):`, cssBlocks);
  for (const [fam, variants] of Object.entries(groups)) {
    console.group(`📌 ${fam}`);
    variants.forEach(v => {
      console.group(`%c■ ${wLabel(v.weight, v.style)} (${v.weight})`, `color:${v.color};font-weight:bold`);
      console.log('Elementi:', v.elements.size);
      v.urls.length ? console.log('📁 URL:', v.urls) : console.warn('⚠️ Non trovato');
      console.groupEnd();
    });
    console.groupEnd();
  }
  console.groupEnd();

  window.__fontAnalyzerResults = results;
  return results;
})();
```

---

## **Vedere i font sulla pagina**

La parte più potente dello script non è tecnica. È visiva.

Ogni variante font above the fold riceve un colore distinto. Lo script lo applica come outline e sfondo semi-trasparente a ogni elemento che usa quella variante:

```javascript
node.style.outline = `3px solid ${color}`;
node.style.backgroundColor = `${color}33`;
```

La pagina diventa una mappa. Guardi e capisci istantaneamente.

Il colore più diffuso? È il font più critico da preloadare. Se H1, sottotitolo e CTA sono tutti dello stesso colore, quella variante è la priorità assoluta. Se un colore compare su un solo elemento marginale, quella variante probabilmente non merita un preload dedicato. Se due elementi che dovrebbero avere lo stesso font mostrano colori diversi, c'è un problema di design system — un componente che carica font propri, un peso non trovato che fa fallback, una regola CSS che vince dove non dovrebbe.

Otto colori diversi above the fold significano otto varianti font nella prima viewport. Significa un sito che ha un problema di complessità prima ancora che di performance.

---

## **Preload selettivo: preloadare meno per caricare meglio**

Lo script genera tag preload solo per le varianti realmente usate above the fold. Non di più.

Un caso frequente: Google Fonts con quattro varianti caricate (Regular 400, Italic 400, Bold 700, Bold Italic 700). Nella prima viewport appaiono solo titoli Bold 700 e corpo Regular 400. Le italic non servono al render iniziale, ma vengono comunque richieste, occupano connessioni, pesano sul critical path.

Font Impact Overlay identifica questo scenario e genera solo i due preload necessari:

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/custom-font-700.woff2" crossorigin="anonymous">
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/custom-font-400.woff2" crossorigin="anonymous">
```

---

## **font-display: block per i font che contano**

Per i font sotto la fold, `font-display: swap` funziona bene: mostra un fallback, sostituisce quando il font custom è pronto. Il FOUT è tollerabile perché l'utente non ha ancora visto quella zona.

Above the fold è diverso. Quel testo è già visibile. Quando il font cambia, l'utente lo vede — e il browser registra CLS. Lo script genera i blocchi `@font-face` con `font-display: block !important` solo per le varianti della prima viewport:

```css
@font-face {
  font-family: 'CustomFont';
  font-weight: 700;
  font-style: normal;
  font-display: block !important;
  src: url('/fonts/custom-font-700.woff2') format('woff2')
}
```

Con il preload attivo, il font è già in download quando il browser arriva al render tree. L'attesa è minima. Il testo appare direttamente con il font corretto, senza flash, senza shift, senza CWV compromesse.

---

## **Varianti mancanti: quando il browser usa i ripieghi**

Il pannello dello script segnala con `⚠ non trovato` le varianti per cui non esiste nessuna regola `@font-face` nei fogli di stile analizzati. Sono i casi più insidiosi: il font è referenziato nel CSS, ma il browser sta usando silenziosamente qualcos'altro.

Può essere un font non caricato per un errore 404, una variante non inclusa nel subset caricato (Medium 500 dichiarato ma solo Regular 400 e Bold 700 disponibili), oppure un `@font-face` iniettato dinamicamente da uno script terzo dopo l'esecuzione dell'analisi.

In tutti i casi, la segnalazione è un punto di indagine concreto: significa che tra design system e implementazione c'è un gap che il browser sta coprendo in silenzio, con risultati visivi che nessuno ha approvato.

---

## **Conclusioni**

La distinzione che conta non è tra font caricati e font non caricati. È tra font che influenzano il rendering iniziale e font che esistono solo nel CSS.

Font Impact Overlay fa esattamente questa distinzione — interroga il browser sullo stato reale, non sul dichiarato — e restituisce output azionabile in trenta secondi: tag preload precisi, CSS pronti da copiare, e una mappa visiva che rende immediatamente evidente dove intervenire.

Esegui lo script, copia i tag nel `<head>`, aggiungi il CSS al critical path, misura l'impatto su LCP e CLS.

Il rendering non aspetta. I font above the fold neanche.
