# Revisione SEO tecnica

## Verifica del repository e della build

- Canonical home corretto: https://www.lucasciacca.com/.
- Sitemap con la sola homepage, nessuna pagina ritirata o 404.
- Contenuti professionali, attività e tecnologie sono HTML statico; non dipendono
  dal canvas né da JavaScript per essere letti.
- Lingua HTML it-IT; lingua predefinita Hugo impostata esplicitamente su it.
- H1 unico ora visibile nell'introduzione HTML, lasciando invariata l'area gioco.
- Title, description, OG e Twitter coerenti. Foto social JPEG esistente 635×634,
  alt e dimensioni dichiarate; card summary adatta al ritratto quasi quadrato.
- ProfilePage con mainEntity Person, identificatori stabili, immagine e profili
  social derivati dalla configurazione. Nessuna data, recensione o metrica inventata.
- Pagina errore con title/description propri, noindex e nessun canonical.
- robots.txt consente il crawling e indica la sitemap; rimossa direttiva
  Crawl-delay (non supportata da Google), senza bloccare le URL ritirate.

## llms.txt

`static/llms.txt` è copiato da Hugo in `/llms.txt`. La home lo collega con
`rel="describedby"`. Contiene profilo, attività, link alle sezioni HTML e ai
profili ufficiali. Aggiornarlo insieme ai contenuti della home; non vi sono copie
di articoli ritirati. Segue la struttura Markdown proposta da llmstxt.org.
Non è un file di controllo accessi, non sostituisce robots.txt/sitemap e non
offre garanzie di indicizzazione, ranking o citazione nei sistemi AI.

## Limiti e controlli dopo il deployment

Questa revisione riguarda il repository e la build locale, non Search Console
né i dati reali di traffico/Core Web Vitals. Nessun deployment eseguito.

1. Controllare status HTTP reali: home, robots, sitemap e llms 200; vecchie URL
   ritirate 404. Non reindirizzare indiscriminatamente gli articoli alla home.
2. Verificare HTTPS e redirect delle varianti http/apex verso www con un solo
   dominio finale. Il repository non può garantire le impostazioni DNS/hosting.
3. Validare la home pubblicata con Rich Results Test e URL Inspection; inviare
   la sitemap in Search Console. La validità locale del JSON non garantisce
   risultati avanzati né indicizzazione.
4. Il ritiro degli articoli elimina anche le loro pagine di destinazione SEO:
   perdita di visibilità su quelle URL attesa, non risolvibile con metatag.
5. Verificare le anteprime social dopo il deploy; le piattaforme possono mantenere
   in cache immagini e metadati precedenti.

## Comandi

```sh
hugo --minify --cleanDestinationDir
node scripts/verify-site.mjs public
node scripts/verify-home.mjs public
node scripts/verify-seo.mjs public
```

## Riferimenti consultati

- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
- https://llmstxt.org/
