# Studio del protagonista — maker in un laboratorio retro

## Diagnosi della versione precedente

Il busto bianco largo 16 pixel, con braccia aperte e gambe strette, produceva una
silhouette a triangolo. Il profilo aveva molto meno volume del fronte. I segni
chiari sugli occhiali e sul mento leggevano come occhi e bocca esagerati. Era un
problema di disegno, non del motore Excalibur.

## Direzione scelta

Un maker adulto, sicuro di sé: giacca da lavoro scura, maglia chiara, pantaloni
scuri, scarpe robuste e occhiali da sole. Nessuna armatura o arma sul protagonista.
La presenza viene da spalle definite e appoggio dei piedi, non da braccia divaricate.
I riferimenti nerd appartengono soprattutto alle postazioni del laboratorio.

| Elemento | Regola di disegno |
| --- | --- |
| Cella | 24×32 px; piedi ancorati a y=28 |
| Testa | 12×10 px di ingombro, capelli visibili dall'alto |
| Spalle | Massimo 14 px, raccordo graduale al collo e ai fianchi |
| Occhiali | Due lenti scure, ponte distinto, riflessi minimi |
| Giacca | Grigio scuro, spalle illuminate, maglia chiara stretta al centro |
| Profilo | Naso e lente davanti; braccio leggibile dentro il volume del corpo |
| Palette | Quattro valori: #202020, #606060, #a8a8a8, #eeeeee |

Revisione sul feedback «panzotto»: addome laterale rientrato di un pixel, con
profilo petto-bacino più verticale. Fronte, spalle e ancoraggio dei piedi invariati;
la correzione si riflette automaticamente nella vista sinistra.

## Movimento

Sei pose di camminata per direzione, selezionate dalla distanza percorsa, non dal
numero di frame del browser. Piccolo abbassamento di un pixel nelle fasi di carico;
gambe disegnate complete, braccio laterale in controfase. Nessuna rotazione del
bitmap, deformazione o inclinazione arbitraria del corpo per simulare una svolta.
Girandosi si sostituisce la vista mantenendo lo stesso punto a terra.

Salto: preparazione, salita, apice, discesa e atterraggio. La posizione verticale
del disegno è separata dal movimento sul pavimento; l'ombra non sale insieme al
personaggio e non viene disegnata su muri o mobili. Il salto non supera collisioni.

## Fonti e applicazione

[Derek Yu, Pixel Art Tutorial](https://www.derekyu.com/makegames/pixelart.html):
volumi leggibili attraverso gruppi di chiaro/scuro, compromessi dello sprite
piccolo e controllo tramite ribaltamento. Applicazione qui: ridurre i dettagli
che spezzano la silhouette, restringere la maglia e verificare i due profili.

[Pedro Medeiros / Saint11, raccolta di tutorial](https://saint11.art/blog/pixel-art-tutorials/):
raccolta di studi compatti su pixel art e animazione, utile come riferimento
metodologico. Non sono stati copiati sprite o frame dei tutorial.

Le misure, l'abbigliamento e le pose sopra sono decisioni specifiche di questo
progetto, non prescrizioni degli autori. Non è un ritratto realistico di Luca.

## Verifica

`node scripts/verify-game.mjs` controlla 48 pose, palette, silhouette connessa,
appoggio dei piedi, simmetria dei profili, collisioni e fasi del salto.
Il test geometrico non dimostra da solo la qualità artistica: confrontare sempre
le quattro viste ingrandite e il personaggio alla scala reale dentro la stanza.
