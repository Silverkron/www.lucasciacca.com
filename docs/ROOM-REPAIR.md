# Correzione stanza Sviluppo & IA

## Revisione animazioni dei display

Le vecchie righe del laptop venivano sovrapposte al testo del raster, mentre il
rettangolo del monitor non seguiva esattamente l'interno della cornice. Le righe
cambiavano lunghezza contemporaneamente, dando un effetto di disturbo.

`CODE_SCREENS` e `drawCodeScreens` in `assets/pixel/ambient.js` ora usano maschere
per righe di pixel misurate sul vetro: rettangolo smussato per il monitor e forma
inclinata per il laptop. Ogni fotogramma ripulisce l'interno prima di disegnare
due righe stabili e una riga in scrittura progressiva, aggiornata a 2 Hz. Cornici
e tastiere rimangono intatte. Lo stesso disegno serve il layer base e quello di
occlusione; reduced motion mostra un contenuto statico.

Test aggiunti: ogni pixel resta nella maschera, pulizia completa dei display,
stabilità tra aggiornamenti, progressione e reduced motion. Due fasi del ciclo
sono state controllate ingrandite nel browser. Build Hugo e verifica link passate.

## Cause e modifiche

- Il banco disegnato arrivava a y=209, ma la vecchia collisione terminava a y=198.
- La sedia e le cassette avevano ingombri incompleti; il contenitore dei fascicoli
  non aveva una collisione dedicata.
- Pannello degli attrezzi e griglia erano dipinti sopra il pavimento, senza parete.
- Il personaggio era sempre davanti allo sfondo, anche quando passava di lato agli arredi.

`CODE_FURNITURE` in `assets/pixel/world.js` ora contiene sei ingombri misurati
sull'immagine finale, con regioni di primo piano. Lo stesso elenco alimenta le
collisioni e il layer di occlusione in `assets/js/game.js`. Il primo piano riusa
il bitmap caricato e le animazioni esistenti: nessuna nuova dipendenza o richiesta
di rete. Il salto non cambia la profondità a terra e non scavalca gli arredi.

Rimossi dal disegno i due elementi da parete fuori posto; sedia spostata nel
quadrante superiore sinistro della stanza, liberando il corridoio tra i banchi.
Il terminale HTML/canvas è stato spostato a (244,181), fuori dalla sedia.

## Asset e generazione

File finale: `assets/pixel/laboratory-source.png`. ImageGen integrato, tre modifiche
mirate; nessun fallback CLI. Originali intermedi conservati nella cartella delle
immagini generate di Codex, quindi gli elementi rimossi sono recuperabili.
Prompt usati, nell'ordine:

1. Use case: precise-object-edit. Edit target: attached monochrome top-down laboratory map. In the LOWER RIGHT room only, REMOVE the floating tool pegboard (rectangle approximately x1160..1310,y615..690 on the 1536x1024 image) and the small floating ventilation grille (x1365..1405,y610..658). These wall-mounted objects incorrectly lie on the floor. Replace only these two objects with continuous matching light tiled floor. Do NOT move or redraw the workstation, laptop, monitor, lamp, robot, chair, shelving, south workbench, boxes, doorway, walls, or any other room. Preserve exactly the original composition, positions, monochrome pixel style and 1536x1024 dimensions. No new objects.

2. Use case: precise-object-edit. Edit target attached lab map. Change ONLY the lower-right room chair: move the rolling chair currently directly in front of the computer desk (center approximately 1175,824 in this 1536x1024 image) to the empty floor LEFT of that desk, center approximately 1030,790. Restore matching tiled floor where the chair was. This opens the narrow walking aisle between the two desks. Keep every other object, all desks, monitors, walls, doorway, rooms, dimensions and monochrome pixel style exactly unchanged. No new objects.

3. Use case: precise-object-edit. Edit target attached laboratory. Move ONLY the small rolling chair in the lower-right room UP by exactly 80 pixels in this 1536x1024 image, keeping its horizontal position and size. Its current seat center is approximately (1052,800); the new seat center must be (1052,720). Fill its old position with matching floor tiles. Keep absolutely all other objects, desks, rooms, walls, doors, image size and monochrome pixel art unchanged. The chair must remain LEFT of the computer desk and higher up so people can walk below it.

## Prove

Build Hugo e controllo di 33 pagine senza link interni rotti. Test geometrici su
tutti i sei ingombri, precedenti punti attraversabili, fronte/retro e raggiungibilità
del terminale e del corridoio del robot. In Chrome: percorso dall'atrio al robot,
personaggio fermato a (334.4,214.2) premendo verso il banco per 450 ms; nessuna
variazione della posizione. Approccio laterale in Chrome: arresto a (271.2,194.2),
invariato anche tentando il salto verso il banco. Nessun errore o warning in console.
Il test automatico verifica anche che il salto non oltrepassi le collisioni.
