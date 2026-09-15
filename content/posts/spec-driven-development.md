---
title: "Spec Driven Development: cos'è, come funziona e perché sta cambiando il modo di sviluppare software con AI"
description: "Spec Driven Development: scrivi prima le specifiche, poi il codice. Scopri cos'è, come funziona con GitHub Spec Kit e Claude Code, e accedi al repository di esempio."
date: 2026-04-14 23:32:00 +0300
image: '/images/spec-driven-development/cover.webp'
tags: [spec-driven-development, ai-coding, github-spec-kit, typescript, vibe-coding]
---

Hai chiesto a Claude Code o Copilot di costruire qualcosa di non banale. I primi cento commit sono andati lisci. Poi, intorno alle 500 righe, qualcosa ha cominciato a stridere: l'agente scrive codice coerente con l'ultimo file che ha letto, non con le decisioni prese tre settimane fa. Hai aggiunto una feature e ne ha rotta un'altra. Non è colpa del modello — è che non c'era nessun contratto scritto su come il sistema doveva funzionare. Lo spec driven development è la risposta a questo problema, e in questo articolo vediamo cos'è, come si applica in pratica e dove puoi trovare un esempio concreto in TypeScript.

---

## Il problema del vibe coding

Il vibe coding funziona. Per uno script, per un prototipo, per qualcosa che butti via dopo una settimana, è probabilmente l'approccio più veloce che esista. Scrivi un prompt, l'agente genera, tu rivedi, vai avanti.

Il problema arriva quando il progetto cresce. Secondo una ricerca di Cognition, gli agenti AI spendono il 60% del loro tempo in ricerca di contesto — a rileggere file, a ricostruire relazioni tra componenti, a capire cosa è già stato fatto. Solo il restante 40% va in scrittura effettiva. Su un codebase piccolo, questo non si sente. Su un progetto da qualche decina di file, diventa un collo di bottiglia visibile.

C'è un secondo problema, meno ovvio ma più insidioso: le decisioni implicite. Quando scrivi "implementa il sistema di login", il tuo agente AI sceglie bcrypt o argon2. Decide se serve la verifica email. Sceglie una strategia di sessione. Nessuna di queste cose era nel prompt — l'agente le ha scelte lui. Ogni scelta implicita è un punto di divergenza tra quello che ti aspettavi e quello che hai ottenuto. All'inizio non lo noti. Poi arriva il momento in cui aggiungi una feature che dipende da una di quelle scelte implicite, e la cosa inizia a scricchiolare.

Il vibe coding — sviluppo AI-assisted basato su prompt liberi, senza struttura preventiva — non è sbagliato in sé. È sbagliato usarlo per codice che deve durare, scalare o essere mantenuto da più di una persona. Gli AI coding agents sono strumenti precisi usati in modo impreciso.

Lo spec-driven development fa una cosa sola: rende esplicite le decisioni prima che l'agente scriva la prima riga.

---

## Cos'è lo Spec Driven Development

Lo Spec Driven Development (SDD) è un approccio allo sviluppo software in cui la specifica viene scritta prima del codice e diventa l'unica fonte di verità del progetto. Il codice è un artefatto generato dalla specifica — non il contrario.

Questo inverte l'ordine mentale a cui siamo abituati. Normalmente pensiamo al codice come alla cosa "reale" e alla documentazione come a qualcosa che viene dopo, se viene. Nello sviluppo guidato da specifiche, la spec è il prodotto principale. Il codice è ciò che la implementa.

La specifica definisce il "cosa" e il "perché". Non il "come". Quando scrivi `spec.md` per una feature, dici cosa deve fare il sistema, quali sono i requisiti funzionali, cosa non è incluso in questa versione, e come capisci che è finita. Non dici quale framework usare, quale libreria, quale pattern. Quelle decisioni arrivano dopo, in una fase dedicata.

Questo non è documentazione nel senso tradizionale — non è un artefatto burocratico che si compila per compliance e poi finisce in un cassetto. È un contratto tra te e l'agente AI. Quando l'agente implementa, non indovina i requisiti: li legge. La spec è il contesto fisso che resta invariato per tutta la durata dell'implementazione.

Un punto di chiarimento utile: lo SDD non è TDD, non è BDD. Il Test Driven Development si occupa della correttezza a livello implementativo — scrivi il test prima del codice. Il Behaviour Driven Development lavora sugli scenari utente. Lo spec driven development opera a un livello più alto: definisce gli invarianti architetturali e i requisiti funzionali prima che esista una sola riga di codice o un singolo test. In pratica i tre approcci sono complementari, non alternativi.

Per la definizione formale, la voce [Wikipedia su Spec-driven development](https://en.wikipedia.org/wiki/Spec-driven_development) offre un buon punto di partenza, con le radici storiche che risalgono ai workflow NASA degli anni '60 e la formalizzazione accademica del 2004.

---

## Le quattro fasi del processo

Lo SDD si articola in quattro fasi sequenziali. Ogni fase produce un artefatto che la successiva usa come input. Questo è il workflow che strumenti come GitHub Spec Kit codificano nei comandi `/specify`, `/plan`, `/tasks`, `/implement`.

### 1. Specify — definisci il cosa

Qui scrivi `spec.md`. Dentro ci vanno le user stories, i requisiti funzionali numerati, i criteri di accettazione (testabili, non vaghi), e una sezione "out of scope" che lista esplicitamente cosa non è incluso in questa iterazione.

Nessun riferimento al tech stack. Nessuna menzione di Express, PostgreSQL, Redis. Se scrivi "il sistema deve rispondere in meno di 200ms", stai scrivendo un requisito non funzionale legittimo. Se scrivi "il sistema usa Redis per la cache", stai già saltando alla fase due.

L'AI può aiutarti a redigere la spec — a strutturarla, a suggerire edge case che non hai considerato, a riformulare requisiti ambigui. Ma le decisioni sono tue. Nessun modello conosce i vincoli di business del tuo progetto.

### 2. Plan — scegli il come

Solo qui entra il tech stack. Qui scrivi `plan.md`: quali tecnologie usi, come si struttura il sistema (route/service/types, o quello che è appropriato per il tuo contesto), il data model con le interfacce TypeScript, i contratti API in forma di tabelle Markdown, le decisioni architetturali con la motivazione.

Il plan include anche qualcosa che nella pratica si rivela molto utile: il **constitution check**. Verifica esplicita che le scelte tecniche rispettino i principi definiti in `constitution.md`.

`constitution.md` merita una nota a parte. È il documento che definisce le regole invarianti del progetto: TypeScript strict, niente `any`, separazione netta tra route e service layer, convenzioni di naming, standard di test. Viene scritto una volta, all'inizio del progetto, e ogni nuova feature deve rispettarlo. Non è un README, non è un'opinione — è il contratto che vale per tutto il codebase.

### 3. Tasks — scomponi il lavoro

Il plan si traduce in `tasks.md`: una lista ordinata di task granulari, ognuno mappato a un file specifico o una funzione precisa. Un task dovrebbe corrispondere a qualcosa come "crea `src/services/taskService.ts` con i metodi `create`, `findById`, `update`". Non "implementa il service layer" — troppo vago per un agente.

I task hanno dipendenze esplicite (T003 dipende da T001 e T002), indicano se possono essere eseguiti in parallelo, e hanno scope definito. Questo è il livello di granularità che rende l'implementazione prevedibile.

### 4. Implement — l'AI esegue con contesto

L'agente lavora su ogni task usando spec, plan e tasks come contesto fisso. Non sceglie il framework, perché è già nel plan. Non inventa requisiti, perché sono nella spec. Non viola le convenzioni di progetto, perché le ha in `constitution.md`.

Il risultato è codice coerente con le decisioni prese nelle tre fasi precedenti — non con l'ultimo prompt della sessione.

---

## Spec Driven Development vs Vibe Coding

La differenza sostanziale non è nel volume di lavoro — è in quando quel lavoro viene fatto.

| | Vibe coding | Spec Driven Development |
|---|---|---|
| Punto di partenza | Prompt libero | Specifica strutturata |
| Ruolo dell'AI | Indovina i requisiti | Segue un contratto |
| Documentazione | Assente o posticipata | È l'artefatto principale |
| Scalabilità | Crolla oltre ~500 righe | Mantiene coerenza architetturale |
| Onboarding nuovi dev | Difficile, contesto implicito | La spec è il contesto |
| Tech stack | Deciso dall'AI | Deciso esplicitamente nel plan |

Il tradeoff è reale: scrivere spec, plan e tasks prima di toccare il codice richiede tempo. Quel tempo non è sprecato — viene recuperato nei cicli successivi, in meno debugging, in feature che non rompono quelle precedenti. Ma il ritorno non è immediato, e su un progetto che non supererà le 300 righe probabilmente non arriva mai.

Per script veloci, automazioni one-off, prototipi esplorativi: il vibe coding è ancora la scelta giusta. Lo SDD vale la pena quando il context engineering — gestire cioè il contesto degli agenti su un codebase che cresce — diventa il collo di bottiglia reale.

---

## I principali tool per lo Spec Driven Development nel 2026

Tre strumenti si sono affermati come riferimenti del settore, con approcci abbastanza diversi tra loro.

**GitHub Spec Kit** è il più diffuso: CLI open source con 88.000 stelle su GitHub ad aprile 2026, workflow in quattro fasi, compatibile con oltre 20 agenti AI tra cui Claude Code, Copilot, Cursor e Gemini CLI. La scelta più flessibile per chi vuole adottare lo SDD senza vincolarsi a un agente specifico. Il Thoughtworks Technology Radar lo cita come "emerging technique" nel 2026.

**AWS Kiro** è un IDE costruito su VS Code da Amazon. Workflow in tre fasi con integrazione nativa AWS. Più semplice come punto di ingresso, ma porta con sé un legame stretto con l'ecosistema cloud Amazon.

**Tessl** lavora con un approccio "living spec": la specifica si aggiorna automaticamente in sincronia con il codice durante l'implementazione, senza bisogno di riconciliazione manuale. Ancora in fase sperimentale, ma rappresenta la versione più radicale dell'idea — quella dove la spec non va mai in out-of-sync con il codice.

Per un confronto dettagliato tra questi tool, il repository include un file dedicato [`TOOLS.md`](https://github.com/Silverkron/example-spec-driven-development/blob/it/TOOLS.md) con una tabella comparativa e note di contesto aggiornate ad aprile 2026.

---

## Imparare lo SDD con un esempio pratico in TypeScript

Capire lo spec-driven development sulla carta è abbastanza semplice. Applicarlo su un esempio reale — con artefatti scritti per davvero, codice che li implementa, e una narrativa che ti guida attraverso le scelte fatte — è un altro livello.

Il repository che accompagna questo articolo è stato costruito esattamente per questo. Tre scenari in progressione narrativa, tutti attorno a **Taskly**, un task manager fittizio per team di piccole dimensioni. Stack TypeScript/Node.js con Express. Tutti gli artefatti SDD (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`) sono stati scritti a mano, senza usare il CLI di spec-kit, proprio perché l'obiettivo è mostrare il processo senza aggiungere dipendenze da tool. Nella pagina principale c'è anche una nota su `spec-kit-nodejs` — la port Node.js dello strumento — per chi vuole poi automatizzare il processo.

**Scenario 1 — Costruire un API server da zero.** Il team deve creare il server REST di Taskly. Si parte dalla spec (user stories, requisiti, criteri di accettazione), si scrive il plan (Express, TypeScript strict, struttura a route/service/types), si producono i task, poi arriva il codice. Ogni decisione tecnica è tracciata nel documento che l'ha generata. Se nel codice c'è `router.get('/tasks', ...)`, nello `spec.md` c'è il requisito che l'ha resa necessaria.

**Scenario 2 — Aggiungere un microservizio separato.** Le notifiche vengono estratte in un servizio autonomo che comunica con il task server via HTTP. Questo scenario mostra come lo SDD si applica in un'architettura a microservizi TypeScript: il nuovo servizio ha la sua `constitution.md` indipendente e una spec con una sezione "Integration considerations" che documenta come i due servizi si parlano, quali sono i contratti, cosa succede in caso di errore. Il codice rimane semplice — niente message broker, niente infrastruttura complicata — perché l'obiettivo è didattico.

**Scenario 3 — Aggiungere una feature a un codebase esistente (brownfield).** Il team vuole aggiungere l'assegnazione dei task a un utente. Questo è il caso più frequente nella vita reale: non stai costruendo da zero, stai estendendo qualcosa che esiste già e che non deve rompersi. La spec include vincoli di retrocompatibilità, elenca i file che verranno modificati, e il plan verifica esplicitamente che le feature precedenti continuino a funzionare. Il brownfield development è probabilmente il caso d'uso dove lo SDD porta più valore — e anche quello meno coperto dagli esempi che si trovano online.

Ogni scenario inizia dagli artefatti SDD e li segue fino al codice — che resta illustrativo e leggibile, non un progetto di produzione. L'obiettivo è mostrare il processo, non il prodotto.

[Esplora il repository su GitHub](https://github.com/Silverkron/example-spec-driven-development/tree/it) — ogni cartella ha un README narrativo che ti guida attraverso le scelte fatte in ogni fase.

---

## Quando usare (e quando no) lo Spec Driven Development

**Vale l'investimento quando:**
- Stai costruendo una feature medio-grande con più di un developer o agente coinvolto
- Hai un codebase con AI agents che devono mantenere coerenza su decine di file
- Il team cambia spesso o c'è onboarding frequente — la spec funziona da documentazione vivente
- I requisiti cambiano, ma vuoi tracciare le decisioni nel tempo

**Non vale la pena quando:**
- Stai scrivendo uno script da 50 righe che userai una volta
- Stai esplorando un'idea senza sapere ancora dove vuoi arrivare
- Stai facendo un proof of concept che non andrà in produzione

L'investimento iniziale è reale: scrivere spec, plan e tasks prima di toccare il codice richiede ore, a volte giorni su feature complesse. Il ritorno si vede sul secondo e terzo ciclo di sviluppo, non sul primo.

---

## Conclusioni

Lo spec-driven development non è una teoria nuova. È una risposta concreta a un problema che ogni team con AI coding ha già incontrato almeno una volta: agenti veloci, codice plausibile, sistema incoerente. Spostare le decisioni prima dell'implementazione — e scriverle in modo che l'agente possa leggerle — risolve il problema alla radice.

Il codice smette di essere il punto di partenza e diventa il risultato di un processo strutturato. Non è più l'AI che interpreta, sei tu che definisci.

Se vuoi vedere lo SDD applicato su un esempio concreto in TypeScript, il repository è disponibile su GitHub — con tutti gli artefatti scritti a mano e una guida narrativa per ogni scenario. [Esplora il repository su GitHub](https://github.com/Silverkron/example-spec-driven-development/tree/it).
