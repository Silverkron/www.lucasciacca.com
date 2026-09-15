# Laboratorio personale — grafica v2

- `laboratory-source.png`: scenario raster originale generato con ImageGen integrato e revisionato per le tematiche personali. Hugo ne produce una versione PNG 384×256 con nearest-neighbor; l'originale non viene scaricato dal gioco.
- `world.js`: collisioni in pixel nativi, quattro laboratori, oggetti, movimento, salto e selezione delle pose. Nessuna dipendenza dal browser nella simulazione.
- `characters/technician.js`: matrici originali delle quattro viste; compone una sprite sheet 288×128 una sola volta. Dodici celle per direzione: idle, sei passi, cinque pose del salto. Excalibur seleziona gli sprite in base a distanza e stato.
- `../js/game.js`: integrazione Excalibur, camera, controlli, animazioni ambientali e interfaccia HTML.

Le stanze sono Elettronica & IoT, Stampa 3D, Videogiochi, Sviluppo & IA. I riferimenti includono hardware degli anni Novanta e Duemila e strumenti maker contemporanei. Non è una simulazione di ottimizzazione di siti web.

La grafica del personaggio e delle interazioni usa quattro toni. Lo scenario raster è monocromatico ma contiene grigi intermedi: non è un'emulazione hardware a quattro colori esatti. La mappa viene mostrata interamente, con ingrandimenti interi senza smoothing; solo sotto la dimensione nativa viene ridotta proporzionalmente per non tagliarla. Non confondere il preset Excalibur `pixelArt` con nearest-neighbor: qui si usa esplicitamente il secondo.

`technicianFrame()` espone ogni posa come matrice verificabile: corpo e arti collegati, appoggio della camminata fisso a y=28, profili speculari. Non spostare nuovamente piedi separati su entrambi gli assi: causava arti disallineati e una camminata laterale incoerente.

Lo scenario è una composizione statica: mobili e muri sono solidi con collisioni ai piedi. Non include tetti rimovibili, occlusione dinamica degli arredi o autotiling. Cambiando disposizione agli oggetti bisogna aggiornare anche `SOLIDS` e verificare tutti i percorsi.

Il prompt finale e la provenienza degli asset sono in `docs/PIXEL-ART-PROMPTS.md`. Nessuno sprite, personaggio o mappa è stato estratto da un videogioco esistente.
