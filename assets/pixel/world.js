// Coordinates are native image pixels. Physics uses the technician's feet.
export const WORLD = { width: 384, height: 256, spawn: { x: 192, y: 123 } };
// Lower-right room: one measured definition for collision and foreground depth.
// All coordinates refer to the current 384×256 background, not its earlier draft.
export const CODE_FURNITURE = [
  {id:'workstation',solid:[276,174,75,35],front:[[276,174,75,35],[302,170,22,4],[328,160,10,14],[338,167,11,7]]},
  {id:'chair',solid:[256,163,15,18],front:[[256,163,15,18]]},
  {id:'south-bench',solid:[266,216,85,24],front:[[266,216,85,24]]},
  {id:'case',solid:[231,220,15,20],front:[[231,220,15,20]]},
  {id:'file-crate',solid:[248,224,14,16],front:[[248,224,14,16]]},
  {id:'shelving',solid:[352,151,16,89],front:[[352,151,16,89]]}
];
export function furnitureInFront(furniture,footY) {
  const [,y,,height]=furniture.solid;
  return footY<y+height+5;
}
export const SOLIDS = [
  [181,44,22,33], // MK3 exhibit footprint; the corridor remains open on both sides.
  [0,0,384,15], [0,240,384,16], [0,0,17,256], [368,0,16,256],
  [158,0,10,97], [217,0,9,97], [158,150,10,106], [217,150,9,106],
  [8,96,83,12], [117,96,51,12], [217,96,50,12], [294,96,82,12],
  [8,137,83,14], [117,137,51,14], [217,137,50,14], [294,137,82,14],
  // Hardware benches, stool, plant and waste basket.
  [18,16,137,49], [18,52,24,33], [60,61,12,13], [18,75,22,20], [146,62,10,11],
  // 3D printers, filament cabinets, side table and stool.
  [230,16,132,49], [346,55,18,19], [330,72,35,21], [315,78,13,14],
  // Videogame handhelds, consoles, CRT, game shelves and stool.
  [18,151,66,26], [18,174,27,42], [20,216,132,21], [140,155,17,57], [49,197,14,14],
  ...CODE_FURNITURE.map(furniture=>furniture.solid),
  [181,17,22,23], [183,215,20,24], [21,113,15,18], [346,113,18,20]
];
export const TERMINALS = [
  { id:'iot', label:'IoT', x:104, y:80, room:'01 · ELETTRONICA & IoT', message:'IoT · Sensori collegati. Il banco di elettronica prende vita.' },
  { id:'printing', label:'Stampa 3D', x:280, y:81, room:'02 · STAMPA 3D', message:'Stampa 3D · Dal modello all’oggetto, uno strato alla volta.' },
  { id:'gaming', label:'Videogiochi', x:99, y:188, room:'03 · VIDEOGIOCHI', message:'Videogiochi · Console accesa. Dai pixel portatili ai controller degli anni 2000.' },
  { id:'code', label:'Codice & IA', x:244, y:181, room:'04 · SVILUPPO & IA', message:'Sviluppo & IA · Il piccolo assistente è online. Idee, codice ed esperimenti.' }
];
export const RELICS = [
  { x:335,y:211, text:'BRACCIO ROBOTICO · Snodi, pinza e qualche riga di codice: un piccolo laboratorio di automazione.' },
  { x:45,y:72, text:'ELETTRONICA · Breadboard, microcontrollori e sensori: il codice incontra il mondo fisico.' },
  { x:113,y:71, text:'IoT · Piccoli dispositivi connessi, esperimenti da costruire e programmare.' },
  { x:303,y:72, text:'STAMPA 3D · Filamento, estrusore e un modello digitale che diventa un oggetto.' },
  { x:66,y:184, text:'PORTATILI · Dal Game Boy ai due schermi degli anni 2000. Un omaggio alle diverse generazioni di gioco.' },
  { x:91,y:210, text:'VIDEOGIOCHI · CRT, dischi e stick analogici: cambia l’hardware, resta la voglia di esplorare.' },
  { x:310,y:209, text:'SVILUPPO & IA · Software, strumenti intelligenti e curiosità da trasformare in progetti.' }
];
export function blocked(x,y) {
  return SOLIDS.some(([sx,sy,w,h]) => x+4>sx && x-4<sx+w && y>sy && y-5<sy+h);
}
// Clip the ground shadow against furniture/walls, independently of the sprite.
export function shadowPixels(x,y) {
  const pixels=[];
  for(let dy=0;dy<5;dy++)for(let dx=0;dx<14;dx++){
    if((dy===0||dy===4)&&(dx<2||dx>11))continue;
    const px=Math.round(x)-7+dx,py=Math.round(y)-3+dy;
    if(!SOLIDS.some(([sx,sy,w,h])=>px>=sx&&px<sx+w&&py>=sy&&py<sy+h))pixels.push([dx,dy]);
  }
  return pixels;
}
export function cameraFrame(width,height,x,y) {
  // Fit the entire laboratory; no cover zoom or tracking/cropping of rooms.
  const scale=Math.max(0.1,Math.min(width/WORLD.width,height/WORLD.height));
  return {width:WORLD.width,height:WORLD.height,scale,x:WORLD.width/2,y:WORLD.height/2};
}
export function makeState() {
  return { ...WORLD.spawn, facing:'down', distance:0, moving:false, jump:0, landing:0, height:0, collected:new Set() };
}
export function jump(state) {
  if (state.jump || state.landing) return false;
  state.jump = 0.001;
  return true;
}
export function advance(state, direction, seconds, reduced=false) {
  const dt=Math.min(Math.max(seconds,0),0.05);
  state.moving=false;
  if(direction) {
    if(!state.jump) state.facing=direction;
    const [dx,dy]={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];
    const distance=48*dt;
    const x=state.x+dx*distance, y=state.y+dy*distance;
    if(!blocked(x,y)) { state.x=x;state.y=y;state.distance+=distance;state.moving=true; }
  }
  state.landing=Math.max(0,state.landing-dt);
  if(state.jump) {
    state.jump+=dt;
    const u=Math.min(1,state.jump/0.45);
    state.height=reduced?0:4*12*u*(1-u);
    if(u===1) { state.jump=0;state.height=0;state.landing=0.07; }
  }
  return TERMINALS.filter(t=>!state.jump && !state.collected.has(t.id) && Math.hypot(t.x-state.x,t.y-state.y)<11);
}
export function pose(state) {
  if(state.jump) return state.jump<0.06?7:state.jump<0.18?8:state.jump<0.28?9:10;
  if(state.landing) return 11;
  return state.moving ? 1+Math.floor(state.distance/4.8)%6 : 0;
}
export function roomAt({x,y}) {
  if((x>=168&&x<=217)||(y>=108&&y<=137)) return 'ATRIO · LABORATORIO';
  return TERMINALS[(y<123?0:2)+(x<192?0:1)].room;
}
