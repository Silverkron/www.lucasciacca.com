import { ARMOR,catPose } from './props.js';

// Tech devices, tools and collectibles only; ordinary furnishings have no hotspots.
// Keep humorous descriptions editorial, not factual product/biographical claims.
const entries=[
  [98,71,12,12,'Postazione IoT: collega i sensori, accendi le idee.'],
  [274,72,12,12,'Postazione 3D: dal modello al mondo reale.'],
  [93,179,12,12,'Postazione gaming: premi nostalgia per continuare.'],
  [238,172,12,12,'Postazione sviluppo e IA: esperimenti in corso.'],
  // Electronics & IoT, clockwise across the bench.
  [58,18,23,28,'Vecchio computer: il cursore lampeggia, la pazienza pure.'],
  [81,26,8,20,'Tower: qui dentro il cavo giusto è sempre quello sotto.'],
  [87,17,46,16,'Pannello degli attrezzi: ogni problema ha il suo cacciavite.'],
  [92,33,22,12,'Oscilloscopio: guarda come ballano gli elettroni.'],
  [137,17,16,11,'Ventola: fa del suo meglio per raffreddare le idee.'],
  [128,28,13,12,'Lente da banco: quel componente era piccolo già prima.'],
  [28,41,10,16,'Game Boy: quattro pile e spariva il pomeriggio.'],
  [21,48,6,8,'Batteria: piccola riserva per grandi esperimenti.'],
  [27,64,10,5,'Pinze: diplomazia per fili testardi.'],
  [40,47,12,6,'Cacciavite: il tasto undo dell’hardware.'],
  [40,39,17,7,'Breadboard: qui le idee fanno contatto.'],
  [58,47,8,6,'Microcontrollore: piccolo cervello, grandi responsabilità.'],
  [66,47,8,6,'Sensore: sente cose che noi umani ignoriamo.'],
  [75,45,17,9,'Tastiera: un invio alla volta.'],
  [98,47,9,7,'Mouse: questo non interessa a Biscotto.'],
  [109,44,24,10,'Scheda IoT: sta cercando il Wi-Fi del frigorifero.'],
  // 3D printing room.
  [246,16,28,35,'Stampante 3D: sta stampando un gatto.'],
  [277,19,28,27,'Bobine di filamento: spaghetti per stampanti affamate.'],
  [308,16,27,35,'Seconda stampante 3D: promette che manca solo un minuto.'],
  [339,19,15,25,'Filamento di scorta: non è mai abbastanza.'],
  [249,49,10,12,'Miniatura: un piccolo abitante appena uscito dal piatto.'],
  [261,51,14,12,'Solido geometrico: sembra semplice finché non lo modelli.'],
  [278,48,11,9,'Campione di stampa: il primo strato decide tutto.'],
  [281,57,13,5,'Spatola: separa la creazione dal suo destino adesivo.'],
  [295,47,10,16,'Cono di prova: una montagna di layer.'],
  [307,53,12,10,'Barchetta di test: galleggia soprattutto nelle discussioni.'],
  [320,49,12,14,'Vaso a reticolo: buchi progettati, non errori.'],
  [360,48,9,27,'Schema appeso: in teoria dovrebbe funzionare.'],
  [333,72,8,9,'Misuratore: fidarsi è bene, misurare è meglio.'],
  [339,81,8,6,'Utensile da rifinitura: addio piccoli supporti.'],
  [346,73,12,13,'Modello sfaccettato: ogni faccia ha una storia.'],
  // Gaming room.
  [20,153,13,22,'Game Boy classico: il salvataggio è sacro.'],
  [38,154,17,20,'Console a due schermi: il futuro aveva una cerniera.'],
  [56,154,12,19,'Custodie dei giochi: scegliere richiede più tempo che giocare.'],
  [70,153,15,20,'Portatile retro: un altro livello e poi basta.'],
  [43,219,20,16,'Controller: la memoria muscolare non si disinstalla.'],
  [65,208,31,27,'Televisore CRT: pixel grandi, ricordi ancora più grandi.'],
  [98,221,21,14,'Gamepad analogico: negli anni 2000 i pollici presero il comando.'],
  [119,211,17,24,'Console con disco: quel rumore era l’inizio dell’avventura.'],
  [138,208,11,28,'Console verticale: da non urtare durante il salvataggio.'],
  // Development & AI room.
  [277,172,23,24,'Laptop: funziona sulla mia macchina.'],
  [302,170,22,24,'Monitor: il bug si nasconde nell’ultima riga.'],
  [325,174,10,23,'Computer da sviluppo: compila, pensa, ricompila.'],
  [336,178,16,18,'Assistente robot: ha una risposta, controlliamola comunque.'],
  [326,198,10,11,'Piccola tower: lavora sotto copertura.'],
  [285,218,21,12,'Scheda elettronica: il software ha trovato casa.'],
  [308,218,17,15,'Cuffie: modalità concentrazione attivata.'],
  [328,209,24,26,'Braccio robotico: sta provando a prendere una pausa.'],
];
export const OBJECTS=entries.map(([x,y,w,h,text],index)=>({id:'object-'+index,bounds:[x,y,w,h],text}));
export function inspectables(time=0,reduced=false,player=null){
  const cat=catPose(time,reduced);
  const items=[{id:'biscotto',bounds:[cat.x-12,cat.y-17,24,19],text:'Biscotto: miao!'},
    {id:'mk3',bounds:ARMOR.bounds,text:ARMOR.text}];
  if(player)items.push({id:'protagonist',bounds:[player.x-7,player.y-player.height-24,14,24],text:'Luca: idee, codice e qualche esperimento di troppo.'});
  return [...items,...OBJECTS];
}
export function objectAt(x,y,time=0,reduced=false,player=null){
  return inspectables(time,reduced,player).find(({bounds:[bx,by,w,h]})=>x>=bx&&x<bx+w&&y>=by&&y<by+h)||null;
}
