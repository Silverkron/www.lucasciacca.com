---
title:  Programmare in x4
description: "Trasforma il tuo lavoro con l'Intelligenza Artificiale: accelera la produttività, abbraccia l'innovazione e scopri il tuo vero potenziale creativo."
date:   2024-11-11 22:26:35 +0300
image:  '/images/programmare-4x/copertina.webp'
tags:   [ai-coding, vibe-coding, code, story]
---

# **Programmare in x4**

Negli ultimi giorni ho iniziato a riflettere su quanto il mio flusso di lavoro sia cambiato radicalmente. Programmo da dieci anni, e in questo tempo ho visto il mio percorso trasformarsi da piccoli bugfix e feature minori fino alla creazione di interi progetti complessi. Tuttavia, mai come ora, ho percepito una rivoluzione così netta. L'introduzione dell'Intelligenza Artificiale ha cambiato il mio modo di lavorare in un modo che non avrei mai immaginato.

Ripenso ai giorni passati a studiare documentazioni, a cercare errori nascosti che mi bloccavano, al tempo speso per imparare e migliorare. Tutto questo ha costruito la mia esperienza, il mio modo di pensare e di programmare. Ma ora, grazie all'IA, il mio modo di scrivere codice è cambiato profondamente. L'IA mi ha permesso di lavorare con una velocità e una precisione che erano impensabili.

Questo cambiamento non è solo tecnologico, è personale. Non si tratta solo di adottare un nuovo strumento, ma di reinventare il mio approccio al problem-solving. L'IA non è solo un assistente; è un catalizzatore che mi ha permesso di fare un salto di qualità, aumentando la mia produttività e cambiando le regole del gioco.

Negli ultimi mesi, mi sono trovato a risolvere problemi che, un tempo, avrebbero richiesto settimane, riuscendo a completare tutto in pochi giorni o ore. Tutto questo grazie all'IA, che mi ha permesso di programmare in "x4", accelerando il mio processo creativo e liberandomi da molte delle difficoltà tecniche del passato. La velocità con cui posso passare dall'idea alla realizzazione è diventata un vero vantaggio competitivo, permettendomi di concentrare più tempo sull'innovazione e meno sui dettagli operativi.

## **Un esempio concreto: Un worker che esegue un PING**

### **Perché questo esempio?**

Recentemente ho sviluppato un progetto che rappresenta bene l'impatto dell'IA sul mio lavoro. L'obiettivo era creare un clone di "Uptimerobot" da integrare nella nostra suite di strumenti, con una struttura scalabile. Ho scelto i worker di Cloudflare per raggiungere una scalabilità ottimale e mantenere il sistema semplice.

### **Descrizione del progetto**

Il sistema effettua un ping ogni cinque minuti per verificare se un sito sia online, raccogliendo i dati in maniera autonoma e garantendo una scalabilità infinita grazie ai worker. Un altro requisito essenziale era la capacità di utilizzare lo storage di Cloudflare per gestire una mole di dati molto ampia, mantenendo una struttura serverless. Il requisito essenziale era la capacità del sistema di crescere e gestire un numero sempre maggiore di siti senza interventi manuali.

## **Come avrei affrontato questo progetto una volta**

### **Analisi iniziale e ricerca**

Un tempo, l'approccio a un progetto di questo tipo avrebbe richiesto una lunga fase di analisi. Avrei iniziato dedicando giorni all'analisi del problema e alla definizione delle specifiche. Questo significava comprendere a fondo le esigenze del progetto e individuare le tecnologie più adatte a soddisfarle. Ogni scelta doveva essere giustificata da un'attenta valutazione delle opzioni disponibili, e questo spesso significava leggere documentazioni e confrontare diverse soluzioni.

### **Sperimentazione e prototipazione**

Dopo la fase di studio, sarei passato alla sperimentazione. Il mio approccio è sempre stato molto pratico: avrei iniziato con piccoli test per comprendere meglio il funzionamento delle tecnologie scelte. La prototipazione avrebbe riguardato lo sviluppo di componenti separati per vedere come integrarle al meglio nel progetto principale. Era un processo che richiedeva pazienza e tentativi ripetuti.

### **Costruzione e iterazione**

Una volta capito come funzionavano i vari pezzi, avrei iniziato a costruire il core del progetto. La prima versione era sempre un punto di partenza imperfetto, che necessitava di continui test e miglioramenti. Scrivere codice e testarlo erano due fasi che si intrecciavano continuamente, in un ciclo che spesso durava settimane. Ogni problema rilevato richiedeva una revisione del codice, una riscrittura di alcune parti o, talvolta, una riprogettazione completa.

### **Ottimizzazione e rifinitura**

Infine, dopo aver ottenuto una versione funzionante, mi sarei dedicato all'ottimizzazione. Questo significava cercare modi per migliorare le performance, rendere il codice più pulito e applicare pattern di design che potessero renderlo più manutenibile. Era una fase lunga e meticolosa, spesso caratterizzata da riscritture multiple e debug estensivo. L'obiettivo era sempre quello di raggiungere uno stato dell'arte, una versione del progetto di cui potessi essere veramente soddisfatto.

### **Conclusione del processo tradizionale**

In sintesi, affrontare questo progetto con un approccio tradizionale avrebbe richiesto settimane di lavoro, fatte di analisi, sperimentazioni, riscritture e miglioramenti continui. Ogni passo era fondamentale per costruire una soluzione solida, ma il processo era lungo e spesso frustrante. La differenza con il mio approccio attuale, grazie all'IA, è stata davvero rivoluzionaria.

## **Come ho affrontato il progetto con l'IA**

### **Gli strumenti utilizzati**

Per questo progetto ho usato **Claude 3.5 Sonnet**, una versione che, probabilmente, quando leggerai questo articolo sarà obsoleta. Ma per me era la più recente. Ritengo Claude la migliore IA per generare codice al momento, ed è stata essenziale per velocizzare tutto il processo.

### **Il primo prompt**

Ho creato un prompt lungo e dettagliato, che mi ha preso circa 20 minuti. Ho descritto il contesto, le feature necessarie, i competitor da cui prendere spunto, link alla documentazione, screenshot, e nomi specifici delle tecnologie da usare. Il primo output di Claude conteneva già tutto il necessario: dal core del worker ai servizi per l’utilizzo delle API di Cloudflare e la gestione dello storage. Sebbene non perfetto, mi ha fornito una base molto valida.

### **Adattamenti e revisioni**

Dopo la prima generazione, il testing locale era una grossa lacuna, quindi ho chiesto a Claude di generare script specifici su NPM per abilitare test locali. L'intero flusso si è poi evoluto attraverso 26 revisioni, in cui ho cambiato la logica di analisi, limitato il numero di siti da monitorare e migliorato la gestione delle chiamate simultanee. Infine, ho chiesto la generazione del README per il team di sviluppo.

### **Conclusione del lavoro**

Il progetto è stato completato in due serate, con poca concentrazione, mentre guardavo un anime in sottofondo. Non è perfetto, ma ho raggiunto il mio obiettivo con una velocità impensabile rispetto al passato.

![Conversazione con Claude](/images/programmare-4x/claude.webp)

## **Analisi del flusso di lavoro con IA**

### **Revisione continua e velocità di iterazione**

Grazie all'IA, la revisione del codice è diventata un processo continuo e molto più veloce. Ho generato ben 26 revisioni durante lo sviluppo, e ogni iterazione ha portato miglioramenti significativi. Anche se il flusso non è perfetto, il tempo risparmiato è stato notevole. L'IA mi ha permesso di effettuare cambiamenti rapidi e test immediati, un ciclo di iterazione che, nel passato, avrebbe richiesto giorni interi.

### **Importanza della conoscenza pregressa**

Uno degli aspetti cruciali è che l'IA, seppur potente, richiede comunque una buona conoscenza di base delle tecnologie utilizzate. Non sempre sceglie gli strumenti giusti, ed è compito mio guidarla, sapere quali tecnologie sono più adatte e prevedere cosa potrebbe implementare. La mia esperienza è stata determinante per correggere il corso e indirizzare l'IA verso soluzioni ottimali.

### **Affidabilità e limiti dell'IA**

Nonostante i benefici, l'IA non è infallibile. Le scelte di design proposte spesso non considerano appieno i costi o le performance. Ad esempio, alcune implementazioni potevano comportare un aumento dei costi operativi o una riduzione dell'efficienza. È fondamentale mantenere il controllo del processo, analizzare le proposte dell'IA e intervenire per ottimizzarle. L'IA è un assistente, non un sostituto completo del pensiero critico.

### **Un risultato incredibile senza debug**

Uno dei vantaggi più sorprendenti è stata l'assenza quasi totale di necessità di debug. Il codice generato dall'IA, se ben guidato, funzionava spesso al primo tentativo. Questo è stato un cambiamento drastico rispetto al mio metodo tradizionale, dove il debug rappresentava una parte significativa del lavoro. Le ore passate a cercare bug, leggere documentazioni e risolvere problemi logici sembrano ora un lontano ricordo. Questo mi ha permesso di concentrarmi su miglioramenti più avanzati e sull'ottimizzazione.

### **Conclusione del flusso con IA**

L'uso dell'IA ha trasformato il mio approccio allo sviluppo. Non solo mi ha permesso di risparmiare un'enorme quantità di tempo, ma mi ha anche dato la possibilità di iterare rapidamente e ottenere un risultato funzionante in un tempo ridotto. Tuttavia, questo flusso richiede comunque attenzione e una guida esperta per garantire che le soluzioni siano le migliori possibili. L'IA ha cambiato le regole del gioco, ma il gioco rimane comunque nelle mie mani.

![Terminale con output](/images/programmare-4x/terminale.webp)

## **Conclusioni**

> "L'Intelligenza Artificiale non toglie il lavoro, ma toglie il lavoro ripetitivo, permettendoci di dedicare più tempo alla creatività e all'innovazione."

Questo è il cambiamento più significativo che ho sperimentato grazie all'IA. Mi ha aiutato a spostare il mio focus dalle difficoltà tecniche al pensiero creativo, migliorando enormemente la qualità del mio lavoro e la mia produttività.

Se sei uno sviluppatore, un designer, un manager o chiunque altro sia coinvolto nella creazione o gestione di progetti, l'IA può diventare un alleato fondamentale. È uno strumento che, se usato correttamente, può amplificare le tue capacità e aprire nuove possibilità. La mia esperienza mi ha insegnato che l'IA non è qui per sostituirci, ma per darci il potere di fare di più, di farlo più velocemente e con maggiore precisione.

Invito tutti a sperimentare e a integrare l'IA nel proprio flusso di lavoro. Potresti scoprire che quel che sembrava difficile diventa improvvisamente più semplice, e che il tempo risparmiato può essere utilizzato per creare, innovare e migliorare. Questo è il vero lieto fine: lavorare meglio, con meno stress, e con un impatto ancora maggiore. Prova l'IA e scopri quanto può trasformare il tuo modo di lavorare, qualunque esso sia.
