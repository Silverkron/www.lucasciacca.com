import { drawRobotArm } from './robot-arm.js';

// Scanline masks measured inside the screen glass, excluding frames/keyboards.
// [y, x, width] preserves the laptop's skewed perspective on the native grid.
export const CODE_SCREENS={
  monitor:[[176,306,12],[177,305,14],[178,305,14],[179,305,14],[180,305,14],
    [181,305,14],[182,305,14],[183,305,14],[184,305,14],[185,306,12]],
  laptop:[[178,288,5],[179,282,11],[180,281,12],[181,281,13],[182,281,13],
    [183,281,13],[184,282,12],[185,282,12],[186,282,11],[187,283,6]]
};
export function drawCodeScreens(ctx,time,reduced=false){
  const stage=reduced?6:Math.floor(time*2)%12;
  for(const [name,rows] of Object.entries(CODE_SCREENS)){
    // Every write is clipped in integer pixels, including the initial clear.
    const pixel=(x,y,color)=>{
      if(rows.some(([ry,rx,w])=>ry===y&&x>=rx&&x<rx+w)){
        ctx.fillStyle=color;ctx.fillRect(x,y,1,1);
      }
    };
    for(const [y,x,w] of rows)for(let i=0;i<w;i++)pixel(x+i,y,'#202020');
    const line=(x,y,n,color)=>{for(let i=0;i<n;i++)pixel(x+i,y,color);};
    if(name==='monitor'){
      line(307,178,7,'#a8a8a8');line(307,180,5,'#a8a8a8');
      line(307,183,Math.min(stage,7),'#eeeeee');
      if(reduced||stage%2===0)pixel(307+Math.min(stage,7),183,'#eeeeee');
    }else{
      // Short stepped baselines follow the angle of the laptop display.
      line(283,181,4,'#a8a8a8');line(287,180,4,'#a8a8a8');
      line(283,184,3,'#a8a8a8');line(286,183,Math.min(stage,5),'#eeeeee');
      if(reduced||stage%2===0)pixel(286+Math.min(stage,5),183,'#eeeeee');
    }
  }
}

// Original, discrete device animations. One shared 6 Hz clock; no timers/assets.
export function drawAmbient(ctx,time,reduced=false) {
  const tick=reduced?0:Math.floor(time*6),phase=tick%8;
  const rect=(x,y,w,h,c='#eeeeee')=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  const screen=(x,y,w,h)=>rect(x,y,w,h,'#202020');
  drawRobotArm(ctx,time,reduced);
  // Oscilloscope and the electronics workstation's blinking terminal cursor.
  screen(94,35,10,7);
  for(let i=0;i<9;i++)rect(94+i,37+((i+phase)%4<2?0:2),1,1);
  screen(63,28,13,10);
  rect(65,30,8,1,'#a8a8a8');rect(65,32,5,1,'#a8a8a8');
  if(phase<4)rect(65,35,2,1);
  for(let i=0;i<3;i++)rect(113+i*3,46,1,1,(phase+i)%4===0?'#eeeeee':'#606060');
  // Both printer heads traverse their rails, building separate little models.
  for(const [x,y,offset] of [[250,30,0],[311,29,3]]){
    screen(x,y,18,16);rect(x+2,y+13,14,1,'#a8a8a8');
    const layer=1+(Math.floor(tick/3)+offset)%5;
    rect(x+6,y+13-layer,7,layer,'#a8a8a8');
    rect(x+2,y+2,14,1,'#606060');rect(x+2+(phase+offset)%11,y+2,4,3);
  }
  // Handheld screens and CRT: a tiny autonomous paddle game.
  screen(23,160,5,4);rect(23+phase%4,162,1,1);
  screen(42,158,8,5);rect(43+(phase>>1),160,2,1);
  screen(74,161,5,5);rect(75,162+phase%3,2,1);
  screen(71,216,18,10);rect(72,218+phase%3,1,4);rect(87,218+(7-phase)%3,1,4);
  rect(75+phase,218+phase%5,1,1);
  // Stable terminal content and slow typing; never draw over a screen bezel.
  drawCodeScreens(ctx,time,reduced);
  screen(340,182,7,3);
  if(phase!==7){rect(341,183,1,1);rect(345,183,1,1);}
  for(const [x,y] of [[329,189],[84,39],[128,226]])rect(x,y,1,1,phase<4?'#eeeeee':'#606060');
}
