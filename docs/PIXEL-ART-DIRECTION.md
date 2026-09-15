# Direzione artistica del laboratorio pixel-art

> Documento di ricerca storico. La direzione tematica è stata successivamente aggiornata: le stanze attive sono Elettronica & IoT, Stampa 3D, Videogiochi e Sviluppo & IA. I riferimenti a Speed/SEO/Accessibility nelle proposte originali non sono più requisiti del gioco. Per implementazione e limiti attuali consultare [PIXEL-LAB.md](PIXEL-LAB.md).

## Sintesi

Il nuovo laboratorio deve essere progettato come un piccolo mondo illustrato, non come una dashboard rappresentata da rettangoli. La priorità è rendere riconoscibili il personaggio, i materiali e i percorsi prima di aggiungere decorazioni. Excalibur rimane il motore richiesto, ma non determina lo stile: la qualità dipende dagli asset e dalle pose preparate per il gioco.

La direzione proposta combina composizione spaziale da adventure top-down, economia grafica del Game Boy e oggetti tecnologici degli anni Ottanta e Novanta. Il risultato deve essere originale: nessuna mappa, personaggio, interfaccia o sprite estratto dai giochi di riferimento. Il laboratorio resta il soggetto principale; eventuali elementi naturali servono come cortile, finestre e serra, non come espansione verso un altro gioco.

Questo documento è una specifica di preproduzione, non descrive funzionalità già implementate. Le dimensioni e i tempi indicati sono proposte verificabili per questo progetto, non misurazioni dei giochi Nintendo. Le fonti sono state consultate il 9 settembre 2026.

## 1. Riferimenti: cosa studiare e cosa non confondere

### Adventure SNES e Game Boy

Il manuale ufficiale di *A Link to the Past* documenta esplorazione, interazioni frontali e azioni distinte. Il suo linguaggio spaziale è utile per progettare ambienti navigabili; non è una specifica di animazione né una fonte da cui dedurre durate esatte dei fotogrammi. Non va assunto come modello di un salto libero generico: il nostro salto sarà una meccanica originale. [1]

Il Game Boy dispone di una superficie visibile di 160×144 pixel, tile da 8×8 pixel e quattro indici di colore; gli oggetti hardware possono essere 8×8 o 8×16. Un personaggio può essere composto da più oggetti hardware. Quindi «sprite da 16×24» non significa «un singolo sprite hardware Game Boy». Questi vincoli spiegano l'economia visiva, ma non impongono al sito di emulare l'hardware. [2]

L'originale *Link’s Awakening* è un riferimento più diretto per la leggibilità monocromatica rispetto a una semplice desaturazione di un'immagine SNES. La pagina Nintendo presenta materiale basato sull'edizione del 1993. Nell'immagine della stanza esaminata, il pavimento è chiaro, le pareti hanno masse scure, gli ingressi interrompono il perimetro e il personaggio si distingue dal fondo. Questa è un'osservazione visiva, non una regola universale di ogni schermata. Le immagini promozionali sono ricampionate: non sono adatte a misurare pixel o timing originali. [3]

*Pokémon Red* resta un riferimento secondario per l'economia degli interni e la comunicazione della direzione del personaggio. La pagina ufficiale ne conferma il contesto Game Boy; non è stata usata per attribuire al gioco uno specifico numero di frame o un salto liberamente controllabile. Non bisogna mescolare indiscriminatamente asset Game Boy, GBA e remake tridimensionali. [4]

### Principi di disegno verificati

Pedro Medeiros descrive un procedimento che parte da grandi gruppi contigui di colore, rifinisce le masse e aggiunge dettagli solo dopo. Sottolinea il rischio dei pixel isolati e dei contorni con gradini incoerenti, ammettendo eccezioni funzionali come piccoli occhi o texture. È un metodo d'autore, non una legge assoluta della pixel-art. Per il laboratorio implica valutare prima silhouette e separazione dei piani, poi viti e tasti. [5]

Il suo tutorial top-down mostra un ciclo di sei fotogrammi, sovrapposizione di testa, torso e gambe, opposizione fra braccia e gambe, e un trattamento distinto della vista posteriore. La possibilità di specchiare alcuni frame è utile, ma nel nostro personaggio non deve invertire accessori asimmetrici. Il tutorial sul salto distingue salita, inversione e caduta e mette in guardia contro anticipazioni che ritardano il controllo. Sono riferimenti di costruzione, non sprite da riutilizzare. [6, 7]

## 2. Perché abbandonare la precedente costruzione grafica

Nel codice attuale, `assets/js/game.js` compone quattro stanze simmetriche dentro una griglia 24×16, disegna su una superficie 768×512 e usa funzioni di `assets/pixel/laboratory.js` per costruire oggetti. Il personaggio è ridisegnato proceduralmente e avanza per celle; manca una sequenza dedicata al salto.

La valutazione artistica è che la ripetizione delle stanze, la prevalenza dei riquadri e il rapporto fra pavimento e arredi facciano leggere il mondo come uno schema. Aggiungere altre linee a un monitor non corregge proporzioni, profondità o silhouette. Analogamente, modificare pochi pixel del viso non sostituisce quattro viste complete del corpo.

Il nuovo lavoro deve sostituire la composizione della mappa, il vocabolario degli oggetti e il modello di movimento. Sono invece requisiti da preservare il caricamento differito, i controlli alternativi HTML, la pausa fuori viewport, il rispetto del movimento ridotto e l'integrazione statica Hugo. La sostituzione del gioco non richiede di eliminare contenuti Markdown, SEO, routing o template editoriali.

## 3. Grammatica visiva proposta

### Risoluzione e scala

Usare un solo pixel nativo per tutti gli asset. Tile di lavoro da 16×16 pixel, divisibili in moduli da 8×8; personaggio visibile circa 16×24 dentro celle di animazione 24×32, con punto di appoggio invariabile. Le celle più ampie consentono braccia e pose di salto senza ritagliare gli arti.

Per la scena di prova usare 256×192 pixel: è una scelta contemporanea di compromesso, non la risoluzione del Game Boy. A questa scala si vedono sedici tile in larghezza e dodici in altezza, sufficienti per una stanza leggibile. Non mostrare l'intero edificio per forza: il personaggio deve mantenere dimensioni credibili.

Il contenitore occupa la prima schermata della homepage; ciò non significa deformare una bitmap fino a coprire qualunque rapporto d'aspetto. Calcolare un ingrandimento intero, espandere la porzione visibile del mondo quando opportuno e usare margini coordinati per i pixel residui. Nei viewport stretti si può ridurre il campo visibile con una camera; HUD e comandi devono avere spazio riservato. Nessun taglio arbitrario delle uscite per riempire il contenitore.

### Quattro toni effettivi

| Ruolo | Valore proposto | Uso prevalente |
|---|---|---|
| Inchiostro | `#202020` | Silhouette, contatto, dettagli essenziali |
| Ombra | `#606060` | Fronti degli arredi, capelli, zone profonde |
| Mezzo tono | `#a8a8a8` | Piani secondari, pareti, metallo |
| Luce | `#eeeeee` | Pavimento libero, piani illuminati, accenti |

Questi quattro valori sono un vincolo dell'immagine del gioco, non di tutte le fotografie del sito. Il testo HTML usa combinazioni controllate separatamente per la leggibilità. Non introdurre grigi intermedi tramite trasparenze, ombre sfocate o filtri. L'ombra del personaggio è una forma piena disegnata, non un'ellisse sfumata.

Il pavimento utilizza soprattutto luce e mezzo tono; gli oggetti importanti hanno silhouette scure. Evitare bordi neri su ogni singola piastrella: l'intera stanza diventerebbe una scacchiera. La raccolta di Accessibility migliora segnaletica e percorsi senza rendere intenzionalmente illeggibile la condizione iniziale.

### Prospettiva

Adottare una proiezione top-down obliqua convenzionale: vedere il piano superiore degli oggetti e una porzione del fronte rivolto verso lo spettatore. Non è isometria e non è una vista verticale da planimetria. Non serve assegnarle un angolo fisico esatto.

Stabilire per famiglia di arredi lo stesso rapporto fra piano superiore e fronte. Un banco può avere un piano profondo 12 pixel e una fascia frontale di 6–8 pixel. Tutte le sedie devono avere seduta, schienale e base compatibili con quel banco. Una porta richiede spessore della parete, apertura scura e soglia chiara; non basta un rettangolo diverso nel pavimento.

Luce convenzionale dall'alto a sinistra, mantenuta su tutti gli oggetti. Sagoma esterna netta; spigoli interni meno contrastati. Il tutorial di Medeiros sugli edifici mostra l'utilità di costruire volumi e aperture prima delle texture e di variare le piante. Per il laboratorio la raccomandazione è una geometria asimmetrica contenuta, senza copiare gli edifici illustrati. [8]

## 4. Paesaggi, stanze e materiali

### Composizione dell'edificio

Una piccola reception introduce tre ali e una stanza di interfacce raggiungibile dal corridoio. L'edificio non deve essere quattro quadrati identici. Ogni ambiente ha un oggetto dominante, un percorso leggibile e una zona tranquilla che lasci risaltare il personaggio.

| Ambiente | Massa dominante | Dettagli secondari | Trasformazione |
|---|---|---|---|
| Hardware / Speed | Banco a L e CRT | Console portatile, utensili, cavo raccolto | Ventola attiva, carrello spostato |
| Archivio / SEO | Scaffale alto | Floppy, schedario, etichette | Segnali coerenti e catalogo attivo |
| Studio / AI | Tastiera elettronica | Registratore, bobine, piccolo automa | Sequenza luminosa e automa al lavoro |
| Interfacce / Accessibility | Postazione aperta | Pulsanti grandi, seduta, cartello | Passaggio più ampio e segnaletica ridondante |

Le modifiche devono cambiare oggetti identificabili, non soltanto far lampeggiare indicatori. Le quattro attività restano raggiungibili in qualsiasi ordine e anche attraverso controlli HTML. Non serve introdurre combattimento, nemici, inventario complesso o un sistema di vite.

### Terreno ed elementi naturali

La componente paesaggistica può comparire oltre una finestra e in una piccola serra collegata. Prima disegnare grandi aree: pavimentazione, terra, aiuola e bacino; poi raccordi e dettagli. Un percorso va definito dalla sua massa chiara, non da centinaia di sassolini.

Per gli alberi costruire chioma, tronco e ombra come tre forme leggibili. Raggruppare il fogliame in pochi lobi, evitando una circonferenza perfetta o rumore casuale. Per le rocce usare silhouette irregolari ma compatte, una faccia chiara e una scura; non disegnare tutte le pietre come scatole smussate. Per l'acqua usare pochi gruppi orizzontali e due o tre frame ambientali, disattivabili. Nessun riflesso continuo o shader necessario.

Le transizioni terreno-pavimento devono avere tile di bordo, angoli esterni e interni. Preparare le varianti veramente usate dalla mappa anziché un grande sistema di autotiling prematuro. Collocare le varianti manualmente nella scena iniziale per controllare la composizione.

### Interni e occlusione

Distinguere pavimento, battiscopa, fronte del muro e sommità del muro. Disegnare scaffali con una massa scura continua e pochi gruppi di libri o scatole; evitare un contorno completo per ogni oggetto. Le superfici libere non sono spazi da riempire.

Gli oggetti alti devono poter coprire parzialmente il personaggio quando passa dietro, ma non nascondere un'uscita essenziale. Separare la base dell'arredo dalla parte alta quando necessario. L'ordinamento usa il punto di appoggio sul terreno, non il margine superiore dell'immagine.

## 5. Come disegnare gli oggetti anni Ottanta e Novanta

Gli oggetti piccoli non possono contenere tutto il dettaglio della fotografia. Per ciascuno scegliere due o tre caratteristiche distintive. Prima verificarlo come silhouette a grandezza nativa, poi aggiungere il dettaglio che ne chiarisce la funzione.

| Oggetto | Ingombro indicativo | Caratteristiche da conservare | Da evitare |
|---|---|---|---|
| Portatile da gioco | 10×14 px sul banco | Corpo verticale, schermo incassato, croce e pulsanti | Riproduzione di schermate Nintendo |
| CRT | 24×24 px | Guscio voluminoso, schermo, piede | Monitor piatto con una cornice |
| Tastiera elettronica | 40×16 px | Gruppi ritmici di tasti, pannello comandi, altoparlante | Strisce identiche su tutta la larghezza |
| Registratore | 20×12 px | Finestra del nastro, due bobine, fila comandi | Rettangolo con testo illeggibile |
| Floppy | 8×8 px | Profilo quadrato, otturatore, etichetta | Tutti i dettagli alla stessa intensità |
| Orologio digitale | 8×12 px | Cinturino e display | Numeri microscopici obbligatori |
| Computer compatto | 24×28 px | Schermo alto, unità disco, tastiera separata | Logo come unico segno identificativo |

Queste dimensioni sono da verificare insieme al personaggio: gli oggetti da scrivania non devono sembrare mobili. Gli oggetti molto piccoli possono avere una scheda HTML di ispezione con un'illustrazione ingrandita, ridisegnata e non interpolata.

La storia ufficiale Casio documenta il Casiotone 201 nel 1980 e lo SK-1 nel 1986 nella cronologia degli strumenti. Serve a selezionare forme e contesto plausibili, non a ricostruire un catalogo commerciale. È preferibile una tastiera originale ispirata alla categoria, con eventuale riferimento culturale nel testo. Non è necessario introdurre loghi nei pixel. [9]

## 6. Personaggio: model sheet prima dell'animazione

Proposta: tecnico del laboratorio, capelli corti con una ciocca riconoscibile, giacca da lavoro chiara, pantaloni scuri e scarpe compatte. Nessun cappello, costume, accessorio o silhouette iconica ripresa da Zelda o Pokémon. La leggibilità deve dipendere dalle masse del corpo e non da un dettaglio di un pixel.

Preparare quattro viste ferme: sud, nord, est e ovest. Nella vista sud si vedono sommità dei capelli, viso e torso; nella nord il viso scompare e cambia la distribuzione delle spalle; nel profilo naso, mano e piede avanzato interrompono la silhouette. Non ruotare geometricamente lo sprite per cambiare direzione.

La testa occupa circa 8–10 pixel in altezza, lasciando spazio a torso e gambe realmente animabili. Le mani devono distinguersi dal busto, le scarpe dal pavimento. I quattro disegni devono avere identico punto di appoggio e volumi confrontabili. Specchiare un profilo è ammesso solo dopo aver corretto luce e accessori.

La prova fondamentale è una tavola delle quattro viste affiancate al banco, alla porta e alla console. Se le proporzioni non funzionano ferme, l'animazione non risolverà il problema.

## 7. Camminare

Il movimento sul terreno deve essere continuo e indipendente dalla griglia dei tile. La griglia organizza la mappa, non impone scatti di una casella. Le coordinate fisiche possono conservare frazioni; la posizione finale di disegno viene allineata al pixel senza perdere gli accumuli del movimento.

Proposta iniziale: sei pose per direzione, un ciclo di 600 ms e velocità di 48 pixel nativi al secondo. Sono valori da regolare nel prototipo. Il ciclo va correlato alla distanza effettivamente percorsa: premere contro un muro non deve far pattinare il personaggio all'infinito.

| Frame | Funzione della posa | Dettaglio da disegnare |
|---|---|---|
| 0 | Appoggio sinistro | Piede sinistro avanti, braccio opposto avanti |
| 1 | Trasferimento del peso | Ginocchio piegato, torso al massimo un pixel più basso |
| 2 | Passaggio destro | Piedi ravvicinati ma separabili, mano oltre il fianco |
| 3 | Appoggio destro | Appoggi invertiti, accessori non specchiati |
| 4 | Trasferimento opposto | Stesso volume della testa e del torso |
| 5 | Passaggio sinistro | Raccordo pulito verso il frame 0 |

Nella vista posteriore mantenere il movimento verticale più contenuto; in quelle laterali chiarire l'alternanza delle gambe con sovrapposizione e contrasto, non allargando e restringendo tutto il corpo. Evitare ridimensionamenti CSS o deformazioni automatiche: ogni posa è un disegno.

L'animazione ritorna a un idle della direzione corrente all'arresto. Non resettare il ciclo a ogni evento ripetuto della tastiera. Nessuna animazione respiratoria è necessaria nella prima versione. Il tutorial top-down offre un riferimento utile alla costruzione dei sei frame, senza determinare i tempi scelti qui. [6]

## 8. Girarsi

Il cambio di direzione è prima di tutto una selezione di una diversa vista. Un input verso est deve orientare immediatamente il personaggio verso est, anche se un ostacolo impedisce lo spostamento. Un ritardo per mostrare una rotazione decorativa rende impreciso il controllo.

Separare `facing`, stato del movimento e fase della camminata. Al cambio di direzione durante il passo, conservare per quanto possibile la fase dell'appoggio; non ripartire sempre dal medesimo piede. Un eventuale frame di raccordo non deve bloccare posizione o input.

Per mantenere quattro direzioni chiare con due tasti premuti, la prima versione può usare l'ultima direzione premuta, riprendendo quella ancora tenuta al rilascio. È una scelta esplicita di controllo, da applicare anche al D-pad. Non introdurre diagonali con velocità aumentata accidentalmente. Il rilascio del tasto, la perdita del focus e la cancellazione del puntatore devono interrompere correttamente il comando.

## 9. Saltare

### Disegno delle pose

Il salto deve far capire che il corpo lascia il terreno. Non basta far salire e scendere lo stesso idle. Preparare una posa di spinta, una di salita, una di apice, una di discesa e una di atterraggio per ogni direzione. Il tutorial di Medeiros evidenzia proprio fasi distinte e una transizione fra salita e caduta; il nostro adattamento top-down aggiunge un riferimento a terra esplicito. [7]

| Fase | Durata iniziale proposta | Disegno e comportamento |
|---|---|---|
| Spinta | Primi 0–40 ms del volo | Gambe raccolte, mani separate; risposta subito all'input |
| Salita | Fino a circa 180 ms | Piedi staccati, corpo leggibile sopra l'ombra |
| Apice | Intorno a 180–270 ms | Gambe raccolte; arco continuo, nessuna pausa artificiale |
| Discesa | Fino a 450 ms | Piedi preparati al contatto, braccia riequilibrate |
| Atterraggio | 60–80 ms dopo il contatto | Piegamento di un pixel, poi idle o passo |

Il recupero dell'atterraggio è interrompibile dal movimento. Non imporre una lunga anticipazione prima dello stacco e non aggiungere scuotimento della camera. Polvere e particelle sono opzionali e non necessarie nel laboratorio.

### Modello spaziale

Usare coordinate sul terreno `(x, y)` e altezza separata `h`. L'immagine si disegna in `(x, y − h)`; l'ombra resta in `(x, y)`. Non riutilizzare la coordinata verticale della mappa come altezza del salto.

Per un primo arco controllabile, con `u` che va da 0 a 1 durante 450 ms, usare `h = 4 × H × u × (1 − u)` e `H = 12` pixel nativi. È una curva proposta, non una formula attribuita ai giochi citati. L'altezza di disegno viene arrotondata solo alla fine. L'ombra può passare fra due o tre sagome piene, senza dissolvenze.

La collisione sul terreno rimane attiva contro muri e arredi; il salto non consente di attraversare qualsiasi ostacolo perché lo sprite è visivamente più alto. Per la prima versione è sufficiente un salto in posto o in movimento su terreno libero. Un ostacolo superabile richiederebbe una proprietà esplicita, una verifica dell'atterraggio e test dedicati: non va introdotto implicitamente.

L'ordine di profondità resta legato al punto sul terreno, non a `y − h`, altrimenti il personaggio cambierebbe strato durante il volo. Bloccare il facing per il breve salto semplifica le pose; l'eventuale controllo aereo deve essere stabilito e testato, non lasciato alla casualità degli eventi input.

### Accessibilità del salto

Spazio quando il canvas è focalizzato, pulsante touch dedicato di almeno 44×44 CSS pixel e indicazione HTML del comando. Nessun salto obbligatorio per raggiungere contenuti, CTA o completare le quattro attività. Il tasto Spazio non deve impedire lo scroll quando il focus è fuori dal gioco.

Con movimento ridotto eliminare particelle, oscillazioni e movimenti ambientali. Offrire una rappresentazione semplificata del salto, senza grande escursione verticale, conservando stato e collisioni. La modalità alternativa HTML rimane disponibile. Tornando da una pausa, il personaggio non deve avanzare di un grande delta accumulato.

## 10. Produzione degli asset e integrazione Excalibur

Creare sorgenti modificabili e relativi export, separando personaggio, tile, oggetti e UI. Aseprite permette di organizzare animazioni tramite tag ed esportare sprite sheet; è uno strumento di authoring, non una nuova dipendenza del sito. Il formato esportato può essere PNG lossless con metadati JSON. [10, 11]

Struttura proposta:

```text
assets/pixel/
  characters/technician.png
  characters/technician.json
  tiles/laboratory.png
  objects/retro-equipment.png
  ui/interaction.png
  maps/laboratory.json
art-source/
  technician.aseprite
  laboratory.aseprite
```

Non dichiarare esistenti questi file prima di averli prodotti. Un editor diverso è accettabile se conserva pixel esatti, palette e frame. L'eventuale generazione assistita può servire come bozzetto; una grande immagine ridotta automaticamente o una sprite sheet incoerente non è un asset finito.

In Excalibur, `SpriteSheet` organizza le immagini in celle e `Animation` gestisce successioni di frame e durate. Usare clip nominate come `idle-south`, `walk-east`, `jump-north`; la logica decide quale clip mostrare e non ridisegna a mano ogni parte del corpo a ogni frame. Le animazioni a ciclo e quelle a esecuzione singola devono avere strategie distinte. [12, 13]

La documentazione Excalibur distingue nearest-neighbor senza antialias dal preset `pixelArt`, che impiega anche un filtro dedicato. Non sono sinonimi. Per la resa rigorosamente allineata proposta, verificare la configurazione effettiva della versione installata e scegliere consapevolmente una delle due strategie; non sommare opzioni incompatibili sperando che aumentino la fedeltà. Nessuna rotazione o scala frazionaria degli sprite è necessaria. [14]

Il terreno statico può essere una tilemap o una composizione precalcolata; i mobili con occlusione e gli elementi animati devono avere strati separati. Non è necessario creare un Actor per ogni piastrella. Il motore viene importato quando il gioco serve, le risorse restano locali e le pagine interne non devono scaricarle.

## 11. Sequenza di realizzazione e criteri di accettazione

La ricostruzione deve cominciare da una scena di prova, non da tutto l'edificio. Produrre una stanza con porta, banco, CRT, portatile, pianta e personaggio. Mostrare lo stesso quadro a risoluzione nativa e ingrandimento intero. Solo dopo che questi elementi risultano coerenti conviene popolare le altre stanze.

La seconda prova è una tavola delle pose più una preview animata delle quattro camminate e del salto. Controllare piedi, punto di appoggio, volume della testa, accessori e contatto con il terreno. Il passaggio al gioco completo deve avvenire dopo questa verifica visiva, altrimenti si moltiplica una direzione artistica ancora incerta.

| Area | Condizione concreta di accettazione |
|---|---|
| Disegno | CRT, portatile e tastiera riconoscibili senza etichetta; proporzioni coerenti |
| Palette | Quattro toni opachi negli asset, oltre alla trasparenza esterna |
| Personaggio | Quattro viste complete, nessun salto di posizione fra frame |
| Camminata | Movimento continuo; nessuna scivolata contro muri; velocità indipendente dagli FPS |
| Direzione | Risposta immediata, nessuna rotazione interpolata dello sprite |
| Salto | Ombra a terra, collisioni stabili, atterraggio corretto in quattro direzioni |
| Profondità | Passaggio davanti/dietro arredi coerente anche durante il salto |
| Responsive | Nessuna uscita essenziale coperta dall'HUD; controlli raggiungibili a 320 px |
| Accessibilità | Gioco opzionale; focus visibile; comandi HTML equivalenti e pausa |
| Prestazioni | Motore assente dal percorso iniziale; loop fermo quando non necessario |
| Hugo e SEO | Build e verificatore statico superati; contenuti e URL preservati |

I budget proposti per gli export iniziali sono complessivamente sotto 100 KB compressi per tile, oggetti e personaggio, da misurare e non da assumere raggiunti. La dimensione del motore va misurata separatamente. Evitare audio, effetti di post-processing e nuove librerie nella prima iterazione.

Per il reset tecnico occorre distinguere i file del gioco dalle modifiche condivise del sito. Non usare un reset globale del worktree: contiene anche modifiche editoriali indipendenti. Prima della sostituzione, conservare una copia recuperabile della versione precedente; una build valida deve restare disponibile durante il passaggio.

## 12. Limiti e decisioni ancora da validare

Le fonti ufficiali consultate non forniscono una sprite sheet completa con timing verificati dei giochi citati. Nessun valore temporale di questo documento pretende di replicarli. I tutorial sono esempi di un artista e vanno adattati alla palette monocromatica e alla prospettiva scelta.

Risoluzione di prova, proporzioni del tecnico, durata del salto e densità degli oggetti richiedono verifica visuale: un documento non sostituisce quella prova. Il campo visibile finale va calibrato sui viewport reali. L'eventuale serra resta subordinata alla qualità del laboratorio, non è un requisito per dilatare la mappa.

## Fonti

1. Nintendo, [The Legend of Zelda: A Link to the Past — manuale digitale](https://www.nintendo.com/es-es/games/oms/snes-classic/manuals/zelda/manual.pdf), senza data nel documento consultato. Controlli, interazioni e schermate; non usato per timing.
2. Comunità gbdev, [Pan Docs — Graphics](https://gbdev.io/pandocs/Graphics.html), documentazione tecnica continuamente aggiornata. Risoluzione, tile e oggetti hardware; consultazione disponibile tramite indice, accesso diretto intermittente.
3. Nintendo, [ゼルダの伝説 夢をみる島 — pagina dell'originale Game Boy](https://www.nintendo.com/jp/games/zelda-links-awakening/index.html), senza data editoriale; materiale riferito al 1993. [Schermata della stanza osservata](https://www.nintendo.com/jp/games/zelda-links-awakening/assets/img/img_slide_1.jpg). Riferimento visivo, non asset di produzione.
4. Nintendo, [Pokémon Red Version — Game Boy](https://www.nintendo.com/en-gb/Games/Game-Boy/Pokemon-Red-Version-266109.html), scheda di catalogo, senza data editoriale. Contesto della piattaforma; nessuna misura di animazione derivata.
5. Pedro Medeiros, [2 — Cluster Sketching and Painting](https://saint11.art/pixel_art_articles/article2/), 21 febbraio 2021. Metodo di costruzione e pulizia dei gruppi di pixel.
6. Pedro Medeiros, [Top Down Walk Cycle](https://saint11.art/img/pixel-tutorials/TopDownWalkCycle.gif), tavola animata nell'[archivio dell'autore](https://saint11.art/blog/pixel-art-tutorials/), archivio pubblicato il 12 luglio 2020; data della singola tavola non verificata. Disegni direzionali e ciclo di sei frame.
7. Pedro Medeiros, [Jump](https://saint11.art/img/pixel-tutorials/Jump.gif), stesso archivio, data della singola tavola non verificata. Fasi del salto e risposta del controllo; esempi prevalentemente laterali, adattamento top-down proposto nel testo.
8. Pedro Medeiros, [Top Down Houses](https://saint11.art/img/pixel-tutorials/Top-Down-Houses-Compressed.gif), stesso archivio, data della singola tavola non verificata. Costruzione di volumi, aperture e piante articolate.
9. Casio, [The history of Casiotone](https://www.casio.com/europe/electronic-musical-instruments/brands/casiotone/history/), senza data editoriale. Cronologia e fotografie di strumenti, inclusi Casiotone 201 e SK-1.
10. Igara Studio, [Aseprite — Sprite sheets](https://www.aseprite.org/docs/sprite-sheet/), documentazione aggiornata senza data di revisione esposta. Importazione ed esportazione.
11. Igara Studio, [Aseprite — Tags](https://www.aseprite.org/docs/tags/), documentazione aggiornata senza data di revisione esposta. Organizzazione delle animazioni.
12. Excalibur.js Project, [SpriteSheet API](https://excaliburjs.com/api/class/SpriteSheet/), documentazione corrente. Celle, sorgenti e accesso agli sprite.
13. Excalibur.js Project, [Animation](https://excaliburjs.com/docs/animation/), documentazione corrente. Frame, durate ed eventi. Verificare sempre contro la versione 0.32.0 installata prima dell'implementazione.
14. Excalibur.js Project, [Pixel Art](https://excaliburjs.com/docs/pixel-art/), documentazione corrente. Distinzione fra nearest-neighbor e preset con filtro dedicato.
