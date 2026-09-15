# Biscotto: silhouette e camminata

## Ricerca online

[Frigon et al., Journal of Neurophysiology (2014)](https://journals.physiology.org/doi/full/10.1152/jn.00524.2013)
descrivono nel campione studiato una sequenza laterale di appoggio: posteriore
destro, anteriore destro, posteriore sinistro, anteriore sinistro. Distinguono
appoggio e oscillazione; durata delle fasi e coordinazione dipendono dalla velocità.
Questo sostiene la scelta di zampe sfalsate, non una traslazione simultanea delle
quattro estremità. Il modello del gioco è una semplificazione, non una simulazione
biomeccanica né una descrizione di tutte le andature feline.

[Cats Protection, Understanding your cat’s behaviour](https://www.cats.org.uk/media/1020/eg09_understanding_your_cats_behaviour.pdf)
associa coda sollevata e rilassata e orecchie rivolte in avanti a un approccio
amichevole. Biscotto riprende questi segnali visivi: passeggia tranquillo nel
laboratorio, non è in postura di caccia o di allarme.

## Problema precedente

Il vecchio sprite aveva un corpo lungo e basso e solo due disegni differenti
delle zampe, ripetuti in quattro frame. Le estremità si spostavano insieme, senza
una fase di appoggio riconoscibile. Il collo e la coda rendevano ambigua la specie.

## Disegno implementato

Cella di 24×18 pixel; dorso e ventre piatti, fianchi verticali e angoli di un solo
pixel, senza contorno ovale. Due orecchie triangolari, guancia chiara e mascella
squadrata, coda alzata con punta curva. Quattro zampe, quelle lontane più scure
e un pixel più alte nella proiezione. Otto pose originali con profilo sinistro
specchiato, senza deformare lo sprite. Nessun asset copiato dalle fonti.

Ogni zampa ha sei fasi di appoggio e due di recupero. Le quattro partenze sono
sfalsate di due frame. A ogni pixel percorso il ciclo avanza una posa. Dopo il
feedback sulle zampe meccaniche, gli arti sono corti e continui, senza blocchi neri
alle articolazioni, e il sollevamento è limitato a un pixel. L'appoggio arretra
di un pixel per ciascun pixel di avanzamento del corpo: la stessa distanza intera
alimenta sia posizione sia posa, anche nel tragitto di ritorno. L'escursione da +3
a -2 pixel conserva un appoggio fermo senza rinunciare alla sagoma squadrata.
La velocità è 12 px/s, il layer viene aggiornato a 12 Hz.
Il corpo resta stabile; non viene fatto saltellare per simulare il passo.

Agli estremi il gatto si ferma per 0,5 secondi, cambia orientamento a metà sosta
e riparte. Reduced motion conserva una posa ferma. L'area del popup segue tutta
la nuova cella; il testo rimane «Biscotto: miao!».

## Verifica

Test: otto pose distinte, dimensioni/palette, profili specchiati, almeno tre zampe
in appoggio, appoggi fermi mentre il corpo avanza, percorso, pause, inversione e hitbox.
Tavola delle sedici pose controllata nel browser, oltre al gatto alla scala del
laboratorio. Le regole artistiche e i tempi sono scelte del progetto, non valori
ricavati sperimentalmente dalle fonti.

## Profondità

Gatto e armatura ora sono attori distinti. Il gatto ha profondità pari a 10 più la
coordinata dei piedi (126), il protagonista usa la propria coordinata a terra.
Le ombre sono layer di pavimento separati, sempre sotto entrambi gli sprite.
Il salto cambia l'altezza del disegno, non l'ordine di profondità. In Chrome sono
stati verificati il passaggio dietro/davanti e il salto, senza errori in console.
