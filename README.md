# Luca Sciacca · Pixel Lab

Sito personale Hugo: [www.lucasciacca.com](https://www.lucasciacca.com/).

Un laboratorio top-down monocromatico esplorabile nella homepage, con stanze e
oggetti originali dedicati a sviluppo e IA, stampa 3D, videogiochi ed elettronica/IoT.
La pubblicazione attuale contiene solo la homepage: sei sezioni animate, inventario
tecnologie ed esperienze. I Markdown di articoli e pagine precedenti sono conservati
ma esclusi dalla build. Le vecchie URL restituiranno 404 dopo il deployment.

## Sviluppo

Prerequisiti: Hugo **Extended**, Node.js 22 e npm. La CI usa Hugo 0.128.0;
la build è stata verificata anche con Hugo Extended 0.111.1.

```sh
# Dopo il clone, o quando cambia package-lock.json
npm ci --ignore-scripts

# Avvio locale: http://localhost:1313/
hugo server --disableFastRender

# Build di produzione
hugo --minify --cleanDestinationDir

# Verifica dei link e dei metadati della build
node scripts/verify-site.mjs public
node scripts/verify-game.mjs
node scripts/verify-home.mjs public
```

Sono disponibili anche `npm run dev`, `npm run build` e `npm run check:site`.

## Architettura

- `content/`: Markdown conservati, temporaneamente esclusi dalla pubblicazione.
- `data/portfolio.json`: sezioni, tecnologie e risultati delle esperienze.
- `layouts/`: template Hugo e componenti condivisi.
- `assets/sass/pixel/`: palette, UI, layout, gioco e blocchi di codice.
- `assets/js/common.js`: menu, tema e import dinamico del gioco.
- `assets/js/game.js`: scena, attori, camera, input e missione in Excalibur.js.
- `assets/pixel/laboratory-source.png`: scenario originale, ottimizzato da Hugo.
- `assets/pixel/world.js`: simulazione e collisioni in pixel nativi.
- `assets/pixel/characters/technician.js`: quattro viste e pose del personaggio.
- `assets/fonts/`: font pixel Silkscreen locale con licenza OFL.
- `static/`: immagini dei contenuti, favicon, robots e licenze.
- `public/`, `resources/`: output e cache generati da Hugo, ignorati da Git.

Hugo Pipes compila SCSS e genera il modulo JavaScript del gioco tramite
`js.Build`. Excalibur **0.32.0** è l'unica dipendenza npm, fissata nel lockfile.
Non servono Webpack, Vite, un backend o servizi per eseguire il gioco.

## Gioco

Usa direttamente frecce o WASD per iniziare a camminare, poi Spazio per saltare.
Non ci sono topbar o pulsanti Start/Stop: sotto il menu si vede il gioco completo.
Su touch sono disponibili D-pad e pulsante Salta. Esc mette in pausa.
Le quattro postazioni raccontano IoT, stampa 3D, videogiochi e sviluppo con IA.
Troverai microcontrollori, stampanti, console anche degli anni 2000 e computer.

La grafica è originale; non contiene sprite, mappe, personaggi o loghi estratti
da videogiochi. Il gioco è facoltativo: menu, CTA e comandi alternativi sono HTML.
È previsto il rispetto di `prefers-reduced-motion` e la pausa fuori viewport.

## Pubblicazione

`.github/workflows/hugo.yml` installa le dipendenze e Hugo Extended, compila il
sito e pubblica `public/` sul branch `gh-pages` a ogni push su `master`.
Il dominio rimane `www.lucasciacca.com`. Non è stato eseguito alcun deployment
durante il redesign.

## Documentazione

Vedi [docs/HOMEPAGE-CONTENT.md](docs/HOMEPAGE-CONTENT.md) per contenuti, fonti,
esperienze da confermare e inserimento dei loghi. Vedi [docs/PIXEL-LAB.md](docs/PIXEL-LAB.md) per decisioni, file coinvolti,
verifiche e punti editoriali residui. Le istruzioni per agenti sono in
[AGENTS.md](AGENTS.md).

Licenze delle dipendenze: Excalibur BSD-2-Clause e Silkscreen SIL OFL 1.1,
incluse in `static/licenses/`.
