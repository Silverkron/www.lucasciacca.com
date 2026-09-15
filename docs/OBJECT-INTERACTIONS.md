# Oggetti del laboratorio

## Implementazione

`assets/pixel/objects.js` contiene 52 regioni statiche con frasi individuali:
dispositivi, utensili, videogiochi, stampe 3D e quattro postazioni. Su richiesta
sono stati rimossi i popup di piante, scrivanie, scaffali, sedie, lampade e altri
oggetti comuni, insieme alle regioni generiche dei banchi. Gli arredi rimangono
visibili e solidi, ma non sono nel catalogo interattivo. Componenti minuscoli disegnati
come un unico gruppo condividono la descrizione del gruppo.

Biscotto, MK3 e protagonista aggiungono tre regioni dinamiche al catalogo.
Frasi richieste conservate: `Biscotto: miao!` e `MK3: tu sai chi sono`.
La prima stampante mostra `Stampante 3D: sta stampando un gatto.`

`assets/pixel/props.js` disegna due sprite originali tramite matrici di pixel,
riusando la palette monocromatica. Biscotto percorre il corridoio orizzontale tra
x=55 e x=325, a 12 pixel nativi al secondo, con una pausa di mezzo secondo agli
estremi prima di ripartire. Il ciclo di otto pose sfalsa le quattro zampe.
Non blocca il giocatore. L'espositore MK3 è solido e lascia passaggi sui due lati.
Nessuna immagine esterna, libreria, richiesta di rete o timer aggiuntivo.

La cache dei dispositivi segue il clock ambientale a 6 Hz; quella del gatto viene
aggiornata a 12 Hz usando lo stesso clock, senza timer aggiuntivi. Il gatto resta fermo con
reduced motion; il motore continua a fermarsi fuori viewport e nelle tab nascoste.

`assets/js/inspection.js` converte le coordinate del puntatore dalla dimensione
effettiva del canvas a 384×256. Un solo popup HTML viene aggiornato, mantenuto nei
confini della viewport e chiuso con Esc, all'uscita, allo scroll o al tocco esterno.
Il popup è raggiungibile dal puntatore senza sparire. Esc chiude prima il popup;
una seconda pressione può mettere in pausa il gioco quando il canvas ha focus.

Su touch si tocca un oggetto. Sotto il gioco, «Gli oggetti del laboratorio» offre
un select con 55 elementi e una descrizione annunciata tramite role=status,
senza introdurre oltre cento fermate nella navigazione Tab del canvas.

## Verifiche

- `node scripts/verify-game.mjs`: 52 regioni effettivamente selezionabili, ID unici,
  frasi esatte, percorso e inversione del gatto, coordinate intere, reduced motion,
  passaggi ai lati della MK3, assenza di popup sugli arredi e regressioni di movimento/collisioni.
- Build Hugo e verifica di 33 pagine senza link interni rotti.
- Chrome desktop 1440×900: popup MK3, stampante, gatto in movimento e chiusura Esc.
- Chrome mobile 390×844: tocco su oggetto vicino al bordo, popup contenuto nella
  viewport, catalogo alternativo e assenza di overflow orizzontale.

Se il disegno dello scenario cambia, aggiornare sia le collisioni in world.js
sia le regioni in objects.js. Sono coordinate editoriali, non riconoscimento
automatico del contenuto dell'immagine.
