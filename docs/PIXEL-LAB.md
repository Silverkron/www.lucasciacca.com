# Laboratorio personale — implementazione v2

## Ultima revisione: laboratorio vivo e vista a pieno schermo

Questa sezione supera le precedenti descrizioni di inquadratura e attivazione.
La camera è fissa: dopo il feedback «troppo zoomato», l'intera mappa viene adattata
proporzionalmente allo spazio sotto il menu, senza ritagliare stanze. Scala display
anche frazionaria, mantenendo il rendering pixelated e il bitmap nativo invariato.
Il protagonista ha spalle più larghe e occhiali da sole. L'ombra rimane a terra
durante il salto ed è ritagliata per pixel sulle collisioni di muri e arredi.

Le animazioni partono al caricamento: braccio articolato, due stampanti, terminale,
oscilloscopio, tre portatili, CRT, laptop, monitor, assistente e spie. Un solo clock
aggiorna il layer a 6 Hz; nessun timer per oggetto. Reduced motion congela gli
elementi ambientali; fuori viewport e su tab nascosta il motore si ferma e riprende
automaticamente al ritorno. Esc resta una pausa esplicita fino alla prossima freccia.

L'ingresso in basso a destra è stato liberato sia nel disegno sia nelle collisioni.
Asset: `assets/pixel/laboratory-source.png`, modifica tramite ImageGen integrato.
Prompt finale: “Change ONLY the lower-right room: remove the small cabinets and
drawer units directly below its north doorway, in the region x=1000..1140
y=610..750 of the 1536x1024 reference; replace them with matching tiled floor so a
wide clear entrance leads from the doorway down toward the left of the computer
desk. Keep the large computer desk, chairs, south workbench, all walls, door
positions, all other rooms, monochrome palette, framing and dimensions unchanged.”

I cimeli delle saghe richiesti in precedenza restano da aggiungere: la relativa
generazione è stata bloccata dal servizio, senza motivazione specifica. Questa
revisione dello scenario riguarda esclusivamente il passaggio, non quei cimeli.
Nessuna nuova dipendenza.

## Revisione: personaggio e prima schermata

Rimossa interamente la barra «Il laboratorio delle idee», inclusi Start/Stop. L'H1 è conservato come testo per screen reader. Il gioco occupa `100svh` meno l'altezza effettiva del menu, misurata anche quando si apre il menu mobile. La mappa rimane interamente visibile, senza camera che taglia le stanze. Ingrandimenti interi; sotto 384 px, riduzione proporzionale per poter vedere tutto.

Frecce e WASD avviano direttamente il movimento quando il gioco è visibile; non richiedono un click preliminare. Link, menu e campi mantengono i propri eventi. Spazio è limitato al canvas focalizzato, Esc mette in pausa e una nuova freccia riprende. Ricomincia e l'eventuale retry di caricamento sono sotto il gioco, non in una topbar.

Il personaggio è stato corretto sostituendo i piedi traslati su due assi con disegni completi della parte inferiore. Test su tutte le 48 pose verificano connessione della silhouette, palette, profili bilanciati e appoggio stabile durante la camminata. La tavola delle pose è stata verificata visivamente nel browser. A 1440×900, menu e gioco terminano esattamente a 900 px e la mappa si visualizza a 3×; a 390×844 terminano a 844 px, senza overflow orizzontale.

Le misure e le descrizioni della camera riportate più sotto documentano la precedente iterazione v2 e sono superate da questa revisione.

## Ambito

Il gioco precedente è stato sostituito, non il sito Hugo. Contenuti Markdown, URL, template editoriali e metadati restano invariati in questo rifacimento. La cornice della homepage è stata adattata al nuovo scenario. Nessun deployment eseguito.

Le quattro stanze rappresentano gli interessi personali di Luca:

| Stanza | Oggetti | Interazione |
|---|---|---|
| Elettronica & IoT | Sensori, breadboard, microcontrollori, oscilloscopio, CRT | Accensione del banco |
| Stampa 3D | Stampanti FDM, bobine, modelli e utensili | Piccola animazione di stampa |
| Videogiochi | Portatili, doppio schermo, console e controller anni Novanta/Duemila | Mini animazione sul CRT |
| Sviluppo & IA | Computer, laptop con codice, piccolo robot | Postazione e assistente attivi |

Nessuna missione dedicata a SEO, velocità o accessibilità. Le buone pratiche tecniche restano caratteristiche dell'implementazione, non argomenti della vetrina personale. Non sono stati eliminati articoli esistenti su questi argomenti.

## Architettura

Excalibur.js 0.32.0 resta l'unica dipendenza npm. Hugo Pipes compila SCSS e il modulo ES; non ci sono servizi esterni necessari a giocare. `common.js` importa il gioco vicino alla viewport dopo il caricamento della pagina. Le immagini vengono caricate prima di costruire il motore, consentendo il retry di un errore di rete senza creare un secondo engine.

Lo scenario è una bitmap 384×256 derivata da un originale locale. Il file originale ad alta risoluzione non viene referenziato dalla pagina. Personaggio e scenografia hanno lo stesso spazio di coordinate; la camera visualizza una porzione minore sugli schermi stretti. Ingrandimenti interi, nessuna deformazione per riempire lo schermo.

La simulazione pura in `assets/pixel/world.js` gestisce movimento continuo, collisioni ai piedi, orientamento, distanza percorsa, stato del salto e raccolte. Il personaggio non si sposta più a scatti di una casella. Il passo si seleziona dalla distanza, non dalla ripetizione della tastiera. La direzione cambia anche davanti a un ostacolo; non si ruota la bitmap.

Il salto dura circa 450 ms con altezza massima 12 pixel e recupero di 70 ms. L'ombra resta a terra, il corpo usa un offset verticale separato. I muri rimangono solidi durante il salto. Non ci sono ostacoli che obbligano a saltare. Le pose sono originali, non riproduzioni frame-by-frame di animazioni Nintendo.

La sprite sheet viene costruita una volta da matrici modificabili, poi utilizzata tramite Excalibur SpriteSheet. Le sequenze sono pilotate dalla simulazione anziché da un timer Animation indipendente, così non si continua a camminare contro un muro. Il gioco non necessita di Aseprite per essere compilato.

## Controlli e interfaccia

Frecce/WASD per camminare, Spazio per saltare quando il canvas ha il focus, Esc per mettere in pausa. D-pad e pulsante Salta su mobile; annullamento del puntatore e perdita del focus liberano i comandi. Con due direzioni premute prevale l'ultima; al rilascio torna quella ancora tenuta.

HUD, notifiche e controlli sono HTML fuori dalla porzione di mappa, per non coprire le porte. I quattro pulsanti in «Esplora senza giocare» offrono le stesse attivazioni. Le normali CTA dei progetti sono sempre disponibili, anche senza JavaScript. Si può continuare a camminare dopo 4/4.

Il loop si ferma in pausa, quando non visibile e quando inattivo prima di aver acceso dispositivi ambientali. Con `prefers-reduced-motion` sono disattivate le animazioni ambientali e l'escursione verticale del salto. Il loop torna a fermarsi dopo l'azione. Le coordinate usano un delta limitato per evitare grandi spostamenti al ritorno da una pausa.

## File del rifacimento

- `assets/js/game.js`: riscritto.
- `assets/pixel/world.js`: nuova simulazione, collisioni e temi personali.
- `assets/pixel/characters/technician.js`: nuovo personaggio e atlas.
- `assets/pixel/laboratory-source.png`: nuova scenografia originale.
- `assets/sass/pixel/_game.scss`: nuova cornice, viewport e controlli.
- `layouts/partials/game.html`: asset Hugo e contenuti HTML aggiornati.
- `scripts/verify-game.mjs`: nuovi test della simulazione.
- `README.md`, `AGENTS.md`, documentazione pixel: aggiornati.

Rimossi `assets/pixel/laboratory.js` e `assets/pixel/characters/sprites.js`, non più utilizzati. La versione precedente è recuperabile nella copia locale `/private/tmp/pixel-lab-v1.toUFmU/game-before-rebuild.tar.gz`; essendo temporanea, non è un archivio permanente del progetto.

## Verifiche

`node scripts/verify-game.mjs` verifica velocità, equivalenza a 30/60 FPS, orientamento contro muro, collisioni durante il salto, fasi e atterraggio, movimento ridotto e raggiungibilità delle quattro postazioni tramite flood-fill dei punti di appoggio. Le collisioni sono state aggiornate anche per il nuovo banco dei videogiochi.

Build Hugo e controllo di 33 pagine generate: nessun link interno mancante rilevato. Le verifiche statiche non controllano i servizi esterni. Durante il test browser è stato corretto l'uso del delta Excalibur (`event.elapsed`, non `event.delta`). Movimento, salto e percorso completo sono stati provati tramite eventi di input; la diagnostica `pixelLabStatus()` è soltanto in lettura.

Non attribuire alla versione v2 i punteggi Lighthouse della precedente implementazione. Le prestazioni di produzione devono essere misurate sul deployment reale.

Verifica finale del 9 settembre 2026: temi personali presenti nell'HUD e nei quattro controlli alternativi; completamento HTML 4/4, pausa fuori viewport, salto con salita/apice/discesa/atterraggio e arresto del loop successivo verificati nel browser. Nessun errore console rilevato nella sessione finale; nessun overflow orizzontale a 320, 390 e 1440 CSS pixel. A 320 px la camera usa ora 2× per mantenere leggibile il personaggio. Il percorso completo tramite tastiera era stato verificato prima della revisione tematica; la raggiungibilità finale è stata riconfermata dai test della simulazione.

Dimensioni della build locale: modulo gioco 504.520 byte non compressi, scenario pubblicato 146.738 byte PNG. Il budget indicativo di 100 KB per gli asset del dossier non è raggiunto; la sorgente da circa 1,7 MB non è pubblicata né caricata. Non sono state aggiunte dipendenze rispetto alla precedente versione Excalibur.

## Limiti artistici espliciti

La scena usa grigi intermedi, non quattro colori esatti come il personaggio. È un'illustrazione generata e poi revisionata, non un tileset disegnato interamente a mano. La struttura mantiene quattro ali collegate da un corridoio: non implementa ancora la pianta asimmetrica esplorata nel dossier di preproduzione. Gli oggetti hanno collisioni, ma non livelli di occlusione dinamica. Questi aspetti non vanno descritti come già completati.

## Comandi

```sh
npm ci --ignore-scripts
hugo server --disableFastRender
```

Sviluppo: `http://localhost:1313/`.

```sh
hugo --minify --cleanDestinationDir
node scripts/verify-game.mjs
node scripts/verify-site.mjs public
```
