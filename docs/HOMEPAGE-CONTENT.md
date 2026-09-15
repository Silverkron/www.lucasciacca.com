# Vetrina personale — settembre 2026

## Pubblicazione

Solo homepage e 404. `config.toml` esclude temporaneamente i Markdown secondari
con `ignoreFiles` e disabilita sezioni, tassonomie e RSS con `disableKinds`.
Nessun Markdown è stato cancellato, incluso quello modificato dall'utente.
Menu, footer e CTA del gioco ora puntano alle ancore della home.
La sitemap contiene solo la home; title, description, Open Graph e Twitter sono
coerenti con il profilo CTO. Aggiunto JSON-LD Person.

Le vecchie URL diventano 404 al prossimo deploy (richiesta di ritiro delle pagine).
Questo comporta la loro progressiva rimozione dagli indici: non è una migrazione
con conservazione del posizionamento di articoli e progetti. Per ripubblicare,
rimuovere le esclusioni e ripristinare i menu intenzionalmente. Il deployment
esistente usa `clean: true`, quindi non conserva le vecchie pagine.

## Contenuti modificabili

`data/portfolio.json`:

- `sections`: copy, URL e scena. Ordine richiesto mantenuto.
- `technologies`: DevOps → destra, Software Engineer → sinistra, Nerd → destra.
  Liste fornite dall'utente: 55 / 18 / 38 voci, con etichette testuali.
  Duplicati rimossi anche tra categorie, mantenendo la prima occorrenza;
  REST API unificato con REST, WAF esplicitato come AWS WAF. Servizi distinti
  dello stesso fornitore restano separati. VS Code e JetBrains sono due voci,
  con nota di preferenza per JetBrains. Non sono stati aggiunti loghi esterni.
  Ordine editoriale: prima le tecnologie più specialistiche (Durable Objects,
  Workers AI, CAN Bus), poi le più comuni. La deduplicazione precede il riordino:
  la categoria assegnata non cambia quando si sposta una voce nella propria riga.
  Ogni futuro elemento: `{"name":"Nome approvato","logo":"/images/technologies/nome.svg"}`.
  Usare loghi locali autorizzati; immagine 20×20, alt vuoto perché il nome è HTML.
  La durata del nastro cresce con il numero di voci, evitando accelerazioni
  con liste lunghe. Al focus il nastro torna statico e può essere scorso a mano.
- `experiences`: sette esperienze più rilevanti descritte direttamente dall'utente.
  `company` identifica il prodotto, `organization` l'azienda di riferimento,
  `role` e `url` sono facoltativi. Le date non sono state fornite e non compaiono.
  Riassunto, tre attività in `achievements` e l'intero stack fornito dall'utente
  in `technologies` sono sempre visibili, senza collapse, come richiesto.
  Ordine editoriale, non cronologia dichiarata: Tuurbo, SEO Tester Online,
  BreathPod, WashOut, Loom Social, Hostess.it, StudentFlat.
  Le tecnologie per esperienza restano contestuali, senza modificare gli slider.
  Rimosso `pendingExperiences`: l'elenco dell'utente sostituisce le vecchie bozze.

## Fonti e limiti

Consultate il 15 settembre 2026:

- https://www.tuurbo.ai/ e https://www.tuurbo.ai/about/: prodotto AI/automazione,
  Luca indicato come CTO. Il 2024 nella sezione è l'anno fornito dall'utente,
  non una data di inizio rapporto di lavoro ricostruita.
- https://www.seotesteronline.com/: piattaforma di strumenti per il web.
- https://it.linkedin.com/in/lucasciacca93: risultato indicizzato conferma
  “CTO e Co-Founder di Tuurbo.ai & SEO Tester Online”. Apertura diretta bloccata;
  le sei voci della sezione esperienza non mostrano tutti i nomi, ruoli o periodi.
- https://theorg.com/org/seo-tester-online/org-chart/luca-sciacca: fonte secondaria
  esplicitamente “Unverified”, segnala Pane&Design, WashOut, HOSTESS.IT e White
  Dart Communication. Inizialmente conservati solo come promemoria non pubblicato;
  le descrizioni successive dell'utente sostituiscono questa fonte secondaria.
  La data Tuurbo riportata lì differisce dal 2024 dell'utente: non utilizzata.
- https://www.instagram.com/lucasciaccadev/: profilo non accessibile alla ricerca.
  Non sono stati attribuiti all'utente progetti o post non verificati.

L'utente ha successivamente fornito le sette esperienze rilevanti con attività
e tecnologie: contenuti pubblicati sulla base di questa fonte diretta. Non serve
più il PDF per questa selezione; eventuali date richiedono ancora conferma.

## Animazioni

Sei scene SVG originali a coordinate intere 192×128; palette monocromatica,
pavimenti a tile, dispositivi e tecnico con occhiali. Forme native riutilizzate
per ogni stanza; nessun asset esterno e nessun'altra istanza di Excalibur.
CSS `steps()` per scanner, stampa, moduli, pacchetti e robot; nastri lineari.
Un IntersectionObserver condiviso abilita solo le scene visibili; tab nascosta
e pulsante pausa fermano l'intera sezione. `prefers-reduced-motion` disabilita
animazioni e rende i nastri consultabili con scorrimento manuale. Senza JS le
illustrazioni sono statiche e tutti i contenuti sono presenti nell'HTML.
Il laboratorio principale e le sue collisioni non sono stati ridisegnati.

## Verifica

`hugo --minify --cleanDestinationDir`

`node scripts/verify-site.mjs public`

`node scripts/verify-home.mjs public`

`node scripts/verify-game.mjs`

Controllo Chrome: desktop 1440 px (scuro), mobile 390×844 (chiaro), sei titoli e
ancore, overflow assente, direzioni dei tre nastri misurate nel tempo, pausa
manuale e fuori viewport. Nessuna dipendenza aggiunta.
