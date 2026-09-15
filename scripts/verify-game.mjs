import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source=await readFile(new URL('../assets/pixel/world.js',import.meta.url),'utf8');
const {WORLD,SOLIDS,TERMINALS,CODE_FURNITURE,furnitureInFront,blocked,makeState,advance,jump,pose,shadowPixels,cameraFrame}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const s=makeState();
assert.deepEqual(TERMINALS.map(t=>t.id),['iot','printing','gaming','code'],'personal portfolio topics');
assert.equal(blocked(s.x,s.y),false);
for(let i=0;i<60;i++)advance(s,'left',1/60);
assert.ok(Math.abs(s.x-(WORLD.spawn.x-48))<0.001,'48 pixels / second');
assert.equal(s.facing,'left');
const first=makeState(),second=makeState();
for(let i=0;i<60;i++)advance(first,'left',1/60);
for(let i=0;i<30;i++)advance(second,'left',1/30);
assert.ok(Math.abs(first.x-second.x)<0.001,'framerate-independent movement');
const wall=makeState();wall.x=172;wall.y=50;
advance(wall,'left',0.05);assert.equal(wall.x,172);assert.equal(wall.facing,'left');assert.equal(wall.moving,false);
assert.equal(jump(wall),true);assert.equal(jump(wall),false);
advance(wall,'left',0.05);assert.equal(wall.x,172,'jump does not bypass walls');
let maxHeight=0;const poses=new Set();
for(let i=0;i<40;i++){advance(wall,null,1/60);maxHeight=Math.max(maxHeight,wall.height);poses.add(pose(wall));}
assert.ok(maxHeight>11&&maxHeight<=12);assert.equal(wall.height,0);assert.equal(wall.jump,0);
assert.ok(poses.has(8)&&poses.has(9)&&poses.has(10)&&poses.has(11),'distinct flight and landing poses');
const reduced=makeState();jump(reduced);
for(let i=0;i<40;i++){advance(reduced,null,1/60,true);assert.equal(reduced.height,0);}
// Flood-fill native foot positions: every terminal must have a navigable path.
const queue=[[WORLD.spawn.x,WORLD.spawn.y]],seen=new Set([queue[0].join(',')]);
for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i];
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const nx=x+dx,ny=y+dy,key=nx+','+ny;
    if(nx<0||ny<0||nx>=WORLD.width||ny>=WORLD.height||seen.has(key)||blocked(nx,ny))continue;
    seen.add(key);queue.push([nx,ny]);
  }
}
for(const t of TERMINALS){assert.ok(seen.has(t.x+','+t.y),'reachable '+t.id);const p=makeState();p.x=t.x;p.y=t.y;assert.ok(advance(p,null,1/60).some(v=>v.id===t.id));}
console.log('PASS: movement, facing, collision, jump phases, reduced motion, FPS parity and four reachable terminals. '+seen.size+' walkable foot positions.');
const artSource=await readFile(new URL('../assets/pixel/characters/technician.js',import.meta.url),'utf8');
const {technicianFrame}=await import('data:text/javascript;base64,'+Buffer.from(artSource).toString('base64'));
for(const direction of ['down','up','left','right'])for(let frame=0;frame<12;frame++){
  const rows=technicianFrame(direction,frame);
  assert.equal(rows.length,32);assert.ok(rows.every(r=>r.length===24&&/^[.0123]+$/.test(r)));
  const occupied=[];rows.forEach((r,y)=>[...r].forEach((p,x)=>{if(p!=='.')occupied.push([x,y]);}));
  const connected=new Set(),todo=[occupied[0]];
  for(let i=0;i<todo.length;i++){
    const [x,y]=todo[i],key=x+','+y;if(connected.has(key))continue;connected.add(key);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy;if(ny>=0&&ny<32&&nx>=0&&nx<24&&rows[ny][nx]!=='.'&&!connected.has(nx+','+ny))todo.push([nx,ny]);
    }
  }
  assert.equal(connected.size,occupied.length,`no disconnected limbs: ${direction}/${frame}`);
  if(frame<=6)assert.equal(Math.max(...occupied.map(p=>p[1])),27,'stable walk ground line');
  if(direction==='left')assert.deepEqual(rows,technicianFrame('right',frame).map(r=>[...r].reverse().join('')),'balanced side views');
}
console.log('PASS: 48 connected poses, fixed walk baseline, centered mirrored profiles and four-tone palette.');
for(let x=238;x<=250;x++)for(let y=156;y<=213;y++)assert.equal(blocked(x,y),false,'clear aisle left of relocated chair');
for(let y=123;y<=168;y++)assert.equal(blocked(280,y),false,'doorway connects to corridor');
for(const f of CODE_FURNITURE){
  const [x,y,w,h]=f.solid;
  for(let px=x;px<x+w;px++)for(let py=y+1;py<y+h;py++)assert.ok(blocked(px,py),'solid furniture: '+f.id);
  assert.equal(furnitureInFront(f,y-1),true,'furniture covers explorer behind it');
  assert.equal(furnitureInFront(f,y+h+5),false,'explorer in front after clearing footprint');
}
for(const [x,y] of [[300,205],[330,205],[263,170],[254,232],[335,235]])assert.ok(blocked(x,y),'previously uncovered furniture');
for(const [x,y] of [[280,164],[244,181],[280,214],[335,214]])assert.ok(seen.has(x+','+y),'reachable workstation/robot aisle');
for(let x=17;x<368;x+=3)for(let y=15;y<240;y+=3){
  if(blocked(x,y))continue;
  for(const [dx,dy] of shadowPixels(x,y))assert.ok(!SOLIDS.some(([sx,sy,w,h])=>x-7+dx>=sx&&x-7+dx<sx+w&&y-3+dy>=sy&&y-3+dy<sy+h),'shadow stays off solids');
}
for(const [w,h] of [[1440,770],[320,480],[390,540],[2560,1100]])for(const [x,y] of [[192,123],[25,20],[360,235]]){
  const v=cameraFrame(w,h,x,y);
  assert.ok(v.width*v.scale<=w+0.01&&v.height*v.scale<=h+0.01,'whole map fits without excessive zoom');
  assert.equal(v.width,384);assert.equal(v.height,256);
  assert.ok(v.x-v.width/2>=-0.5&&v.x+v.width/2<=384.5&&v.y-v.height/2>=-0.5&&v.y+v.height/2<=256.5,'bounded camera');
}
const robotSource=await readFile(new URL('../assets/pixel/robot-arm.js',import.meta.url),'utf8');
const robotURL='data:text/javascript;base64,'+Buffer.from(robotSource).toString('base64');
const ambientSource=(await readFile(new URL('../assets/pixel/ambient.js',import.meta.url),'utf8')).replace('./robot-arm.js',robotURL);
const {drawAmbient,drawCodeScreens,CODE_SCREENS}=await import('data:text/javascript;base64,'+Buffer.from(ambientSource).toString('base64'));
const render=(time,reduced)=>{const pixels=[];const ctx={fillStyle:'',fillRect(...r){assert.ok(r.every(Number.isInteger));pixels.push([...r,this.fillStyle]);}};drawAmbient(ctx,time,reduced);return pixels;};
assert.notDeepEqual(render(0,false),render(0.5,false),'ambient devices animate without collectibles');
assert.deepEqual(render(0,true),render(20,true),'reduced motion freezes every ambient device');
const screenPixels=(time,reduced=false)=>{
  const pixels=new Map(),rows=Object.values(CODE_SCREENS).flat();
  drawCodeScreens({fillStyle:'',fillRect(x,y,w,h){
    assert.equal(w,1);assert.equal(h,1);
    assert.ok(rows.some(([ry,rx,rw])=>y===ry&&x>=rx&&x<rx+rw),'screen animation never crosses bezel');
    pixels.set(x+','+y,this.fillStyle);
  }},time,reduced);return pixels;
};
const screenMaskSize=Object.values(CODE_SCREENS).flat().reduce((sum,r)=>sum+r[2],0);
for(let tick=0;tick<24;tick++)assert.equal(screenPixels(tick/2).size,screenMaskSize,'entire glass cleared before text, no ghost lines');
assert.deepEqual(screenPixels(0),screenPixels(0.4),'typing is stable between half-second steps');
assert.notDeepEqual(screenPixels(1),screenPixels(2),'typing progresses');
assert.deepEqual(screenPixels(0,true),screenPixels(30,true),'screen reduced-motion state stays fixed');
console.log('PASS: clear room entrance, clipped ground shadow, fullscreen camera, automatic pixel animations and reduced motion.');
const propsSource=await readFile(new URL('../assets/pixel/props.js',import.meta.url),'utf8');
const propsURL='data:text/javascript;base64,'+Buffer.from(propsSource).toString('base64');
const {catPose,catFrame,catLegs,drawProps,actorDepth}=await import(propsURL);
const objectsSource=(await readFile(new URL('../assets/pixel/objects.js',import.meta.url),'utf8')).replace('./props.js',propsURL);
const {OBJECTS,objectAt,inspectables}=await import('data:text/javascript;base64,'+Buffer.from(objectsSource).toString('base64'));
assert.ok(OBJECTS.length>40,'tech and collectible catalogue retained');
assert.ok(OBJECTS.every(o=>! /^(Pianta|Lampada|Cassettiera|Portapenne|Sgabello|Cestino|Cassetti:|Mobile|Flaconi:|Scaffale|Libreria:|Tappeto:|Sedia|Valigetta:|Archivio:|Quaderni:|Cornice|Scatolina:|Banco|Tavolino|Scrivania:)/.test(o.text)),'ordinary furnishings absent from popup and select catalogue');
for(const [x,y] of [[25,25],[192,25],[190,225],[360,200],[310,205],[280,235],[65,65],[80,60],[350,133],[42,24]])assert.equal(objectAt(x,y),null,'no fallback popup over common objects');
assert.equal(new Set(inspectables().map(o=>o.id)).size,inspectables().length,'unique hotspots');
assert.equal(objectAt(192,60).text,'MK3: tu sai chi sono');
assert.ok(blocked(192,60),'MK3 cannot be walked through');
assert.ok(seen.has('176,60')&&seen.has('208,60'),'both sides of MK3 remain reachable');
assert.equal(objectAt(260,32).text,'Stampante 3D: sta stampando un gatto.');
assert.equal(objectAt(0,0),null,'empty corners have no object tooltip');
for(let t=0;t<60;t+=0.25){
  const cat=catPose(t);assert.equal(blocked(cat.x,cat.y),false,'cat stays in the corridor');
  assert.equal(objectAt(cat.x,cat.y-5,t).text,'Biscotto: miao!','moving cat hitbox follows sprite');
  assert.deepEqual(catPose(t,true),catPose(0,true),'reduced-motion cat stays still');
  drawProps({fillStyle:'',fillRect(x,y,w,h){assert.ok([x,y,w,h].every(Number.isInteger));assert.ok(x>=0&&y>=0&&x+w<=384&&y+h<=256);}},t);
}
assert.ok(catPose(1).x<catPose(2).x&&catPose(24).x>catPose(25).x,'cat reverses direction');
assert.equal(catPose(22.6).moving,false);assert.equal(catPose(45.6).moving,false);
assert.equal(catPose(22.6).x,325);assert.equal(catPose(45.6).x,55);
assert.equal(new Set(Array.from({length:8},(_,i)=>catFrame(i).join(''))).size,8,'eight distinct walk poses');
for(let frame=0;frame<8;frame++){
  const rows=catFrame(frame);assert.equal(rows.length,18);assert.ok(rows.every(r=>r.length===24&&/^[.0123]+$/.test(r)));
  assert.deepEqual(catFrame(frame,true),rows.map(r=>[...r].reverse().join('')),'mirrored cat has identical proportions');
  assert.ok(catLegs(frame).filter(p=>p.lift===0).length>=3,'walking, not hopping: at least three paws grounded');
}
for(let step=1;step<16;step++){
  const previous=catLegs((step-1)%8),current=catLegs(step%8);
  current.forEach((leg,i)=>{if(!leg.lift&&!previous[i].lift)assert.equal(step+leg.dx,step-1+previous[i].dx,'planted paw stays fixed while body advances');});
}
assert.ok(actorDepth(123)<actorDepth(126)&&actorDepth(129)>actorDepth(126),'cat/player depth follows feet, not actor insertion order');
assert.ok(actorDepth(126)>2,'ground shadows stay below the cat');
for(const start of [0,24])for(let i=1;i<40;i++){
  const a=catPose(start+(i-1)/12+0.001),b=catPose(start+i/12+0.001),aa=catLegs(a.frame),bb=catLegs(b.frame);
  bb.forEach((p,j)=>{if(!p.lift&&!aa[j].lift){
    const sign=b.left?-1:1;
    assert.equal(b.x+sign*p.dx,a.x+sign*aa[j].dx,'world-space paw contact stable in both travel directions');
  }});
}
for(const item of OBJECTS){
  const [x,y,w,h]=item.bounds;let reachable=false;
  for(let py=y;py<y+h&&!reachable;py++)for(let px=x;px<x+w&&!reachable;px++)reachable=objectAt(px,py,0)?.id===item.id;
  assert.ok(reachable,'hoverable object: '+item.text);
}
console.log('PASS: '+OBJECTS.length+' individually hoverable objects, exact MK3/Biscotto copy, cat route, reversal and reduced motion.');
