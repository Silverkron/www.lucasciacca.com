---
title: Come ti ricerco full-text
description: "Trasforma il tuo lavoro con l'Intelligenza Artificiale: accelera la produttività, abbraccia l'innovazione e scopri il tuo vero potenziale creativo."
date: 2025-02-09 21:34:10 +0300
image: '/images/come-ti-ricerco-full-text/moon.webp'
tags: [full-text, lunr-js, code]
---

# **Come ti ricerco full-text**

## **Introduzione**

Quando si gestiscono grandi quantità di dati testuali, offrire agli utenti una **ricerca rapida e precisa** può sembrare una sfida complessa. Molti pensano che sia necessario un motore di ricerca server-side o un’infrastruttura dedicata per ottenere risultati accurati. Ma la realtà è che, spesso, non serve nulla di tutto questo.

Grazie a **Lunr.js**, puoi implementare una **ricerca full-text** direttamente lato client, senza dipendere da server o database. Questa libreria leggera ti consente di creare un indice di ricerca locale, utilizzando dati **statici** come file JSON o altri contenuti pre-caricati. Il risultato? Un sistema di ricerca avanzato e veloce, perfetto per siti web statici e applicazioni frontend.

---

## **Cos'è la ricerca full-text?**

La **ricerca full-text** permette di analizzare ampie quantità di testo, individuando risultati basati su parole chiave o frasi. Non si limita a trovare esatte corrispondenze, ma utilizza tecniche avanzate come:
- **Tokenizzazione:** Il testo viene suddiviso in unità (token) come parole o frasi.
- **Stemming:** Le parole vengono ridotte alla loro radice (es. "correndo" → "correre").
- **Stop word:** Rimozione di parole comuni (come articoli e preposizioni) per migliorare la precisione.

Queste tecniche consentono di restituire risultati anche in caso di errori di battitura o variazioni nella query di ricerca, migliorando l'esperienza utente.

---

## **Cos'è Lunr.js?**

**Lunr.js** è una libreria **JavaScript** open-source che offre un motore di ricerca full-text lato client. Non ha dipendenze esterne e permette di creare un indice di ricerca personalizzato direttamente nel browser. È pensata per scenari in cui l'applicazione non ha accesso a un motore di ricerca backend o a un database.

Tra le sue principali funzionalità troviamo:
- **Ricerca fuzzy:** Tolleranza agli errori di battitura.
- **Operatori logici:** Utilizzo di `+`, `-` e altri operatori per definire i criteri di ricerca.
- **Boosting:** Possibilità di aumentare la rilevanza di determinati campi.

Grazie a queste caratteristiche, Lunr.js è ideale per progetti come siti statici, documentazioni tecniche e applicazioni con dataset medio-piccoli.

---

## **Obiettivo dell'articolo**

Implementare una **ricerca full-text** non richiede infrastrutture complesse. In questo articolo ti dimostrerò che è possibile ottenere una ricerca avanzata con una semplice gestione dei dati **statici** e l'utilizzo di **Lunr.js**.

Vedremo come:
- Creare un **indice di ricerca** partendo da un dataset JSON.
- Implementare una **ricerca dinamica** che restituisca risultati in tempo reale.
- Ottimizzare la gestione dei dati per garantire **prestazioni elevate**, anche su migliaia di documenti.

Seguendo pochi passaggi, potrai integrare una ricerca completa nel tuo progetto, mantenendo la tua applicazione veloce, reattiva e semplice da mantenere.

---

## **Descrizione del progetto**

### **Contesto del progetto**

In questo esempio pratico, ci occuperemo di creare una funzionalità di **ricerca full-text** per un archivio digitale composto da circa 8000 volumi. L'obiettivo è permettere agli utenti di trovare rapidamente informazioni specifiche come il titolo di un libro, l'autore o la casa editrice, senza bisogno di una connessione a un server backend.

Questo tipo di ricerca è particolarmente utile per:
- **Biblioteche digitali.**
- **Siti statici di documentazione.**
- **Cataloghi di prodotti o contenuti.**

Tutto ciò sarà possibile sfruttando **dati statici** caricati in un file JSON e indicizzati tramite **Lunr.js**.

---

### **Struttura del dataset**

Il dataset utilizzato è composto da documenti strutturati, ognuno dei quali contiene informazioni testuali utili per la ricerca. I campi principali includono:

- **ID:** Un identificativo univoco per ciascun volume.
- **Titolo:** Il titolo del libro.
- **Autore:** Il nome dell’autore.
- **Casa editrice:** Il nome dell'editore.

Un esempio di documento nel file JSON potrebbe essere il seguente:
```json
{
  "id": 1,
  "title": "Il nome della rosa",
  "author": "Umberto Eco",
  "publisher": "Bompiani"
}
```

Questo tipo di struttura consente di indicizzare facilmente i dati e di effettuare ricerche mirate su uno o più campi.

---

### **Obiettivo della ricerca**

L’obiettivo è fornire una ricerca rapida e precisa su questo dataset, consentendo agli utenti di:
- Inserire una **parola chiave** e ottenere risultati immediati.
- Applicare ricerche più avanzate utilizzando operatori (`+`, `-`, fuzzy search).
- Navigare tra i risultati con un'interfaccia dinamica aggiornata in tempo reale.

Utilizzeremo **Lunr.js** per gestire la logica di indicizzazione e ricerca, mentre il dataset sarà precaricato nel browser per minimizzare i tempi di risposta.

Grazie a questa configurazione, anche dataset di diverse migliaia di record possono essere gestiti con prestazioni ottimali.

---

## **Implementazione della funzionalità di ricerca**

### **Creazione dell’indice di ricerca**

Per poter effettuare una ricerca full-text, il primo passo è creare un **indice** utilizzando Lunr.js. Questo indice raccoglie e analizza i dati testuali del dataset, consentendo di eseguire query rapide.

Ecco come creare un indice di base:
```javascript
// Creazione dell'indice
const idx = lunr(function () {
// Definizione dei campi da indicizzare
  this.field('title');
  this.field('author');

// Aggiunta dei documenti all'indice
  dataset.forEach(doc => this.add(doc));
});
```

In questo esempio, i campi **title** e **author** vengono indicizzati, mentre il dataset contiene i documenti con i campi strutturati come nel JSON visto in precedenza.

---

### **Ricerca base**

Una volta creato l'indice, è possibile effettuare una **ricerca base** utilizzando il metodo `search()` di Lunr.js. Questo metodo accetta una parola chiave e restituisce i documenti corrispondenti.

Ecco un esempio di codice per eseguire una ricerca base:
```javascript
// Eseguire una ricerca con una parola chiave
const results = idx.search("Eco");

// Analisi dei risultati
results.forEach(result => {
  console.log("ID documento trovato:", result.ref);
});
```

Il metodo `search()` restituisce un array di risultati, ognuno dei quali contiene un riferimento (`ref`) al documento indicizzato.

---

### **Query avanzate**

Per migliorare la precisione della ricerca, Lunr.js supporta diverse **funzionalità avanzate**:

- **Operatori logici:**
  - `+` : Il termine è obbligatorio.
  - `-` : Il termine non deve essere presente nei risultati.

- **Ricerca fuzzy:** Utilizzando `~`, è possibile eseguire una ricerca approssimativa per tollerare errori di battitura.
  ```javascript
  const results = idx.search("nome~1");
  ```

- **Boosting dei campi:** È possibile aumentare l'importanza di determinati campi nella ricerca.
  ```javascript
  const results = idx.search("title^10 author");
  ```

Ecco un esempio completo di query avanzata:
```javascript
const results = idx.search("+titolo~1 -editore +autore^5");
```

Questa query obbliga la presenza di un termine simile a "titolo", esclude i risultati con "editore" e assegna una maggiore rilevanza al campo "autore".

---

### **Aggiornamento dinamico dei risultati**

Dopo aver eseguito la ricerca, è necessario aggiornare l'interfaccia utente per visualizzare i risultati. Ecco un esempio di codice per gestire l'aggiornamento dinamico:

```javascript
function updateResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  results.forEach(result => {
// Recupera i dettagli del documento dall'indice
    const doc = dataset.find(item => item.id === result.ref);

    // Crea un elemento HTML per visualizzare il risultato
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `
      <h3>${doc.title}</h3>
      <p><strong>Autore:</strong> ${doc.author}</p>
      <p><strong>Editore:</strong> ${doc.publisher}</p>
    `;

    // Aggiunge l'elemento al contenitore dei risultati
    resultsContainer.appendChild(resultItem);
  });
}
```

Questa funzione aggiorna dinamicamente la lista dei risultati ogni volta che viene eseguita una query, migliorando l’esperienza utente.

---

## **Ottimizzazioni per grandi dataset**

Quando il numero di documenti cresce (ad esempio oltre i 10.000 record), è fondamentale adottare alcune strategie per mantenere le prestazioni della ricerca elevate. Lunr.js, pur essendo molto efficiente, potrebbe rallentare in queste condizioni, quindi vediamo alcune **tecniche di ottimizzazione**.

---

### **Pre-caricamento dei dati**

Caricare l’intero dataset al momento del caricamento della pagina potrebbe causare ritardi. Una soluzione efficace è il **caricamento asincrono** dei dati statici in background, evitando di bloccare l’interfaccia utente.

#### **Esempio di caricamento asincrono**
```javascript
async function loadDataset() {
    const response = await fetch('path/to/dataset.json');
    return await response.json();
}

// Utilizzo del dataset una volta caricato
loadDataset().then(data => {
// Creazione dell'indice dopo il caricamento
    createIndex(data);
});
```

Questa tecnica consente di mantenere un **tempo di caricamento iniziale** contenuto, migliorando la percezione di velocità da parte dell’utente.

---

### **Minimizzazione dell'indice**

Indicizzare troppi campi o contenuti troppo lunghi può aumentare il peso dell'indice e rallentare le query. Per dataset di grandi dimensioni, è consigliabile:
- **Limitare i campi indicizzati** ai più rilevanti.
- **Rimuovere informazioni non necessarie** dal contenuto indicizzato.

Ad esempio, se solo il titolo e l'autore sono cruciali per la ricerca, evita di indicizzare il testo completo del libro.

#### **Esempio di configurazione dell'indice ottimizzata**
```javascript
const idx = lunr(function () {
  this.field('title', {boost: 10});
  this.field('author');

  dataset.forEach(doc => this.add({id: doc.id, title: doc.title, author: doc.author}));
});
```

In questo modo, riduci il tempo di elaborazione e il peso complessivo dell’indice.

---

### **Caching dei dati**

Per evitare di dover ricostruire l’indice a ogni caricamento della pagina, puoi sfruttare il **caching** tramite `localStorage`. Questa tecnica consente di memorizzare sia il dataset che l’indice nel browser dell'utente, migliorando le prestazioni nelle visite successive.

#### **Esempio di caching**
```javascript
// Salvataggio dell'indice e del dataset nel browser
localStorage.setItem('searchIndex', JSON.stringify(idx));
localStorage.setItem('dataset', JSON.stringify(dataset));

// Recupero dei dati dal localStorage
const cachedIndex = JSON.parse(localStorage.getItem('searchIndex'));
const cachedDataset = JSON.parse(localStorage.getItem('dataset'));

// Ricostruzione dell'indice
if (cachedIndex) {
  const idx = lunr.Index.load(cachedIndex);
}
```

Utilizzando questa tecnica, l’applicazione sarà più veloce nelle sessioni successive, riducendo la necessità di ricaricare l’intero dataset.

---

---

## **Esempio pratico di applicazione**

In questa sezione vedremo come l'applicazione della ricerca full-text con **Lunr.js** è stata utilizzata in un progetto reale. Il dataset contiene circa **8000 volumi**, e l'obiettivo principale è permettere agli utenti di trovare velocemente i libri desiderati attraverso titolo, autore o casa editrice.

---

### **Presentazione del progetto**

Il progetto consiste nella realizzazione di un sistema di ricerca per un catalogo digitale di volumi. I dati sono gestiti tramite un file JSON pre-generato, caricato staticamente all'avvio dell'applicazione. La ricerca è implementata interamente lato client utilizzando **Lunr.js**.

L’interfaccia utente consente di inserire una parola chiave e di ottenere immediatamente i risultati, senza la necessità di richieste aggiuntive al server. Ogni risultato mostra il titolo del libro, il nome dell’autore e la casa editrice.

---

### **Codice sorgente e spiegazione**

Di seguito vediamo i principali step dell’applicazione, dal caricamento dei dati alla visualizzazione dei risultati.

#### **1. Caricamento del dataset**

Il dataset viene caricato in modo asincrono tramite una funzione `fetch()`:

```javascript
async function loadDataset() {
  const response = await fetch('dataset.json');
  return await response.json();
}

loadDataset().then(data => {
  createIndex(data);
});
```

---

#### **2. Creazione dell’indice**

Dopo il caricamento del dataset, l’indice di ricerca viene generato con Lunr.js. I campi principali indicizzati sono `title`, `author` e `publisher`.

```javascript
function createIndex(dataset) {
    const idx = lunr(function () {
        this.field('title', {boost: 10});
        this.field('author');
        this.field('publisher');

        dataset.forEach(doc => this.add(doc));
    });

// Salvataggio dell'indice in memoria locale
    localStorage.setItem('searchIndex', JSON.stringify(idx));
}
```

---

#### **3. Implementazione della ricerca**

Quando l’utente inserisce una parola chiave, viene eseguita una ricerca sull'indice:

```javascript
function searchBooks(query) {
  const results = idx.search(query);
  updateResults(results);
}
```

La funzione `updateResults()` si occupa di aggiornare dinamicamente la lista dei risultati:

```javascript
function updateResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "";

    results.forEach(result => {
        const doc = dataset.find(item => item.id === result.ref);

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
      <h3>${doc.title}</h3>
      <p><strong>Autore:</strong> ${doc.author}</p>
      <p><strong>Editore:</strong> ${doc.publisher}</p>
    `;

        resultsContainer.appendChild(resultItem);
    });
}
```

---

### **Risultati e benefici**

Grazie all'implementazione con Lunr.js, il progetto ha ottenuto numerosi benefici, tra cui:
- **Ricerca istantanea:** I risultati sono restituiti in tempo reale, migliorando l’esperienza utente.
- **Semplicità di gestione:** Il sistema è completamente autonomo, senza dipendenza da backend o server esterni.
- **Ottimizzazione per grandi dataset:** Nonostante il volume dei dati, l'applicazione rimane fluida e reattiva.

Questa soluzione è ideale per scenari in cui è necessario mantenere le prestazioni elevate utilizzando esclusivamente dati statici.

---

## **Conclusioni**

### **Riepilogo dei vantaggi**

Implementare una **ricerca full-text** lato client con **Lunr.js** può essere una soluzione sorprendentemente potente e semplice. Con pochi passaggi, è possibile creare un sistema di ricerca veloce, autonomo e facilmente integrabile in qualsiasi applicazione frontend. Ecco i principali vantaggi che Lunr.js offre:
- **Nessuna dipendenza da backend:** Funziona interamente lato client, rendendo perfetta l'integrazione in siti statici.
- **Ricerca avanzata:** Supporto per operatori logici, ricerca fuzzy e boosting dei campi.
- **Prestazioni ottimizzate:** Anche con migliaia di documenti, la ricerca rimane rapida se ben configurata.

Grazie a queste caratteristiche, Lunr.js è ideale per progetti di dimensioni medio-piccole come documentazioni tecniche, cataloghi digitali o archivi di contenuti.

---

### **Consigli per progetti simili**

Tuttavia, è importante considerare alcune limitazioni. Lunr.js, pur essendo molto efficiente, può diventare meno performante con dataset estremamente grandi o complessi. In questi casi, è necessario adottare strategie di ottimizzazione (pre-caricamento dei dati, minimizzazione dell'indice e caching) per mantenere le prestazioni accettabili.

Se il progetto richiede una gestione ancora più scalabile e robusta, potresti valutare una soluzione alternativa.

---

### **Un possibile successore: Meilisearch**

Poiché **Lunr.js** non è più regolarmente aggiornato, un'ottima alternativa è **Meilisearch** ([link al repository GitHub](https://github.com/meilisearch/meilisearch)). Meilisearch è un motore di ricerca open-source progettato per gestire grandi volumi di dati con prestazioni elevate. Tra i suoi vantaggi troviamo:
- **Ricerca ultra-veloce.**
- **Ricerca fuzzy e facettata** integrate nativamente.
- **API REST** per una facile integrazione con frontend e backend.

Se hai bisogno di una ricerca più complessa o scalabile, Meilisearch rappresenta un'opzione da considerare.

---

### **Risorse utili**

- [Repository GitHub del progetto realizzato](https://github.com/Silverkron/library-search).
- [Documentazione ufficiale di Lunr.js](https://lunrjs.com/).
- [Repository GitHub di Meilisearch](https://github.com/meilisearch/meilisearch).
