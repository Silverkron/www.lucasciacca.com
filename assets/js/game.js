import { Engine, Scene, Actor, Canvas, Color, ImageSource, ImageFiltering, SpriteSheet, vec, DisplayMode, PointerScope, ScrollPreventionMode } from 'excalibur';
import { WORLD, TERMINALS, RELICS, CODE_FURNITURE, furnitureInFront, makeState, advance, jump, pose, roomAt, shadowPixels, cameraFrame } from '../pixel/world.js';
import { technicianAtlas } from '../pixel/characters/technician.js';
import { drawAmbient } from '../pixel/ambient.js';
import { drawArmor,drawCat,drawCatShadow,catPose,actorDepth } from '../pixel/props.js';
import { mountInspection } from './inspection.js';

export async function mount(root) {
  const canvas=root.querySelector('canvas'), stage=root.querySelector('.game-viewport');
  const reset=root.querySelector('[data-reset]');
  const status=root.querySelector('#game-status'), room=root.querySelector('[data-room]');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  // Load before engine construction: a failed asset request can safely retry.
  const backdrop=new ImageSource(root.dataset.background,{filtering:ImageFiltering.Pixel,bustCache:false});
  const technician=new ImageSource(technicianAtlas(),{filtering:ImageFiltering.Pixel});
  await Promise.all([backdrop.load(),technician.load()]);
  const engine=new Engine({canvasElement:canvas,width:384,height:256,displayMode:DisplayMode.Fixed,
    antialiasing:false,snapToPixel:true,pixelRatio:1,suppressHiDPIScaling:true,
    suppressPlayButton:true,suppressConsoleBootMessage:true,grabWindowFocus:false,global:canvas,
    pointerScope:PointerScope.Canvas,scrollPreventionMode:ScrollPreventionMode.None,maxFps:60,
    backgroundColor:Color.fromHex('#202020'),powerPreference:'low-power'});
  const scene=new Scene();engine.add('laboratory',scene);
  const world=new Actor({pos:vec(0,0),anchor:vec(0,0),z:0});world.graphics.use(backdrop.toSprite());scene.add(world);
  const sheet=SpriteSheet.fromImageSource({image:technician,grid:{rows:4,columns:12,spriteWidth:24,spriteHeight:32}});
  const explorer=new Actor({name:'technician',anchor:vec(0,0),z:3});scene.add(explorer);
  const shadow=new Actor({anchor:vec(0,0),z:2});
  const groundShadow=new Canvas({width:14,height:5,cache:true,draw:ctx=>{
    ctx.clearRect(0,0,14,5);ctx.fillStyle='#606060';
    for(const [x,y] of shadowPixels(state.x,state.y))ctx.fillRect(x,y,1,1);
  }});
  shadow.graphics.use(groundShadow);scene.add(shadow);
  let state=makeState(),playing=true,visible=true,initialized=false,clock=0,lastPose='',lastRelic='',lastGround='',manualPause=false;
  const held=new Map(),keyMap={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
  const markers=new Canvas({width:384,height:256,cache:true,draw:drawMarkers});
  const effects=new Actor({anchor:vec(0,0),z:1});effects.graphics.use(markers);scene.add(effects);
  // Redraw only foreground furniture over an explorer walking behind/beside it.
  // Reuse the source bitmap and animation layer: no extra textures or downloads.
  const foreground=new Canvas({width:384,height:256,cache:true,draw:ctx=>{
    ctx.clearRect(0,0,384,256);
    const rects=CODE_FURNITURE.filter(f=>furnitureInFront(f,state.y)).flatMap(f=>f.front);
    for(const [x,y,w,h] of rects)ctx.drawImage(backdrop.image,x,y,w,h,x,y,w,h);
    ctx.save();ctx.beginPath();
    for(const [x,y,w,h] of rects)ctx.rect(x,y,w,h);
    ctx.clip();drawAmbient(ctx,clock,motion.matches);ctx.restore();
  }});
  const furniture=new Actor({anchor:vec(0,0),z:300});furniture.graphics.use(foreground);scene.add(furniture);
  const armorGraphic=new Canvas({width:384,height:256,cache:true,draw:drawArmor});
  const armorExhibit=new Actor({anchor:vec(0,0),z:actorDepth(77)});armorExhibit.graphics.use(armorGraphic);scene.add(armorExhibit);
  const props=new Canvas({width:384,height:256,cache:true,draw:ctx=>{ctx.clearRect(0,0,384,256);drawCat(ctx,clock,motion.matches);}});
  const biscuit=new Actor({anchor:vec(0,0),z:actorDepth(126)});biscuit.graphics.use(props);scene.add(biscuit);
  const updateInspection=mountInspection(root,()=>({clock,reduced:motion.matches,state}));
  function drawMarkers(ctx) {
    ctx.clearRect(0,0,384,256);
    drawCatShadow(ctx,clock,motion.matches);
    drawAmbient(ctx,clock,motion.matches);
    const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
    TERMINALS.forEach((t,index)=>{
      const active=state.collected.has(t.id);
      rect(t.x-6,t.y-9,12,10,'#202020');rect(t.x-5,t.y-8,10,7,active?'#606060':'#eeeeee');
      rect(t.x-3,t.y+1,6,2,'#606060');
      if(active){rect(t.x-3,t.y-5,2,2,'#eeeeee');rect(t.x-1,t.y-3,2,2,'#eeeeee');rect(t.x+1,t.y-6,2,3,'#eeeeee');}
      else {for(let i=0;i<=index;i++)rect(t.x-3+i*2,t.y-6,1,4,'#202020');}
    });
  }
  function schedule(){if(initialized&&visible&&!document.hidden&&!engine.clock.isRunning())engine.clock.start();}
  function paint() {
    const frame=pose(state),row=['down','up','left','right'].indexOf(state.facing),id=row+':'+frame;
    if(id!==lastPose){explorer.graphics.use(sheet.getSprite(frame,row));lastPose=id;}
    explorer.pos=vec(Math.round(state.x)-12,Math.round(state.y-state.height)-28);
    shadow.pos=vec(Math.round(state.x)-7,Math.round(state.y)-3);
    explorer.z=actorDepth(state.y);
    const ground=Math.round(state.x)+':'+Math.round(state.y);
    if(ground!==lastGround){groundShadow.flagDirty();foreground.flagDirty();lastGround=ground;}
    const view=cameraFrame(stage.clientWidth,stage.clientHeight,state.x,state.y);
    scene.camera.pos=vec(view.x,view.y);
    room.textContent=roomAt(state);
  }
  function collect(id) {
    if(state.collected.has(id))return;
    const t=TERMINALS.find(t=>t.id===id);if(!t)return;
    state.collected.add(id);
    const item=root.querySelector('[data-item="'+id+'"]');item.dataset.collected='';item.setAttribute('aria-label',t.label+': attivo');
    status.textContent=t.message+' '+state.collected.size+'/4.';reset.hidden=false;
    if(state.collected.size===4){root.dataset.complete='';status.textContent='4/4 · Hai esplorato le mie passioni. Ora scopri cosa faccio, qui sotto.';}
    markers.flagDirty();schedule();
  }
  function pause(announce=true) {
    playing=false;held.clear();engine.input.keyboard.clear();engine.stop();
    if(announce)status.textContent='In pausa · Premi una freccia per riprendere. '+state.collected.size+'/4 postazioni esplorate.';
  }
  function play(){manualPause=false;playing=true;reset.hidden=false;schedule();}
  function doJump(){if(!playing)play();if(jump(state)){paint();schedule();}}
  scene.on('preupdate',event=>{
    if(!playing||!visible||document.hidden)return;
    const direction=[...held.values()].at(-1);
    advance(state,direction,event.elapsed/1000,motion.matches).forEach(t=>collect(t.id));
    const relic=RELICS.find(r=>Math.hypot(r.x-state.x,r.y-state.y)<14);
    if(relic&&relic!==lastRelic){status.textContent=relic.text;lastRelic=relic;}else if(!relic)lastRelic='';
    const oldTick=Math.floor(clock*6),oldCatTick=Math.floor(clock*12);clock+=Math.min(event.elapsed/1000,0.05);
    if(!motion.matches&&oldTick!==Math.floor(clock*6)){markers.flagDirty();foreground.flagDirty();}
    if(!motion.matches&&oldCatTick!==Math.floor(clock*12)){props.flagDirty();markers.flagDirty();updateInspection();}
    paint();
  });
  engine.on('postframe',()=>{
    const ambient=!motion.matches;
    if(!playing||!visible||document.hidden||(!held.size&&!state.jump&&!state.landing&&!ambient))engine.stop();
  });
  // Start on the first directional key without stealing focus from navigation/forms.
  window.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    const target=event.target;
    if(target instanceof Element&&target.closest('input,textarea,select,button,a,summary,[contenteditable="true"]'))return;
    const bounds=stage.getBoundingClientRect();
    if(!visible||document.hidden||bounds.bottom<=0||bounds.top>=innerHeight)return;
    if(event.code==='Escape'&&document.activeElement===canvas){event.preventDefault();manualPause=true;pause();canvas.blur();return;}
    const direction=keyMap[event.code];
    if(!direction&&!(event.code==='Space'&&document.activeElement===canvas))return;
    event.preventDefault();
    if(event.repeat)return;
    canvas.focus({preventScroll:true});
    if(event.code==='Space'){doJump();return;}
    if(!playing)play();
    held.delete(event.code);held.set(event.code,direction);schedule();
  });
  window.addEventListener('keyup',event=>held.delete(event.code));
  canvas.addEventListener('blur',()=>{held.clear();engine.input.keyboard.clear();});
  reset.addEventListener('click',()=>{
    pause(false);state=makeState();lastPose='';lastRelic='';clock=0;manualPause=false;playing=true;delete root.dataset.complete;
    root.querySelectorAll('[data-item]').forEach(el=>{delete el.dataset.collected;el.removeAttribute('aria-label');});
    status.textContent='Una nuova esplorazione. Usa le frecce per muoverti.';
    markers.flagDirty();props.flagDirty();updateInspection();paint();schedule();
  });
  root.querySelector('.game-touch').addEventListener('contextmenu',event=>event.preventDefault());
  root.querySelectorAll('[data-direction]').forEach(button=>{
    const key='touch-'+button.dataset.direction;
    button.addEventListener('pointerdown',event=>{
      event.preventDefault();button.setPointerCapture(event.pointerId);if(!playing)play();
      held.delete(key);held.set(key,button.dataset.direction);
      advance(state,button.dataset.direction,1/30,motion.matches).forEach(t=>collect(t.id));paint();schedule();
    });
    for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>held.delete(key));
    button.addEventListener('click',event=>{
      if(event.detail===0){if(!playing)play();for(let i=0;i<4;i++)advance(state,button.dataset.direction,0.05,motion.matches).forEach(t=>collect(t.id));paint();schedule();}
    });
  });
  root.querySelector('[data-jump]').addEventListener('click',doJump);
  const resumeAmbient=()=>{if(!manualPause&&visible&&!document.hidden){playing=true;schedule();}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(false);else resumeAmbient();});
  window.addEventListener('blur',()=>pause(false));
  window.addEventListener('focus',resumeAmbient);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;if(!visible)pause(false);else{paint();resumeAmbient();schedule();}
  }).observe(canvas);
  motion.addEventListener('change',()=>{state.height=0;markers.flagDirty();foreground.flagDirty();props.flagDirty();updateInspection();paint();schedule();});
  function resize() {
    const view=cameraFrame(stage.clientWidth,stage.clientHeight,state.x,state.y);
    engine.screen.resolution={width:view.width,height:view.height};
    engine.screen.viewport={width:view.width*view.scale,height:view.height*view.scale};
    engine.screen.applyResolutionAndViewport();paint();schedule();
  }
  await engine.start('laboratory');initialized=true;
  new ResizeObserver(resize).observe(stage);resize();
  root.dataset.ready='';root.dataset.engine='excalibur-0.32.0';
  root.pixelLabStatus=()=>({engine:'Excalibur.js 0.32.0',version:2,running:engine.clock.isRunning(),playing,reducedMotion:motion.matches,
    position:{x:state.x,y:state.y},facing:state.facing,pose:pose(state),jump:state.jump,height:state.height,
    collected:[...state.collected],ambientTick:Math.floor(clock*6),cat:catPose(clock,motion.matches),depth:{player:explorer.z,cat:biscuit.z,shadow:shadow.z},camera:{x:scene.camera.pos.x,y:scene.camera.pos.y},resolution:{...engine.screen.resolution}});
  paint();schedule();
}
