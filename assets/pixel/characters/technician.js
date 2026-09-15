// Original, connected poses on a shared 24×32 cell; ground contact stays at y=28.
export const PALETTE=['#202020','#606060','#a8a8a8','#eeeeee'];
const heads={
  down:[
    '...000000...','..01221110..','.0122111110.','.0111111110.',
    '.0000030000.','.0300030030.','.0233333320.','..02322320..',
    '...023320...','....0220....'
  ],
  up:[
    '...000000...','..01221110..','.0122111110.','.0111111110.',
    '.0111111110.','.0111111110.','..01111110..','..01111110..',
    '...011110...','....0000....'
  ],
  right:[
    '...000000...','..01221110..','.0122111110.','.0111111110.',
    '.0110000000.','.011030000..','..012333330.','..01223320..',
    '...002320...','....0220....'
  ]
};
const torsos={
  down:['...00222200...','..0122332110..','.012113311210.','01221133111210','01221133111210','01321133111230','.032111111230.','..0011111100..'],
  up:['...00111100...','..0122222110..','.012211112210.','01221111111210','01221111111210','01321111111230','.032111111230.','..0011111100..'],
  right:['....002200....','...01232110...','...01232110...','...01231110...','...01201110...','...01203310...','....010320....','.....00110....']
};
// Six complete lower-body drawings: feet lift, never translate away from hips.
const frontLegs=[
  ['01100110','01100110','01200120','03300110','00000330','.....000'],
  ['01100110','01100110','01200120','01100330','03300000','0000....'],
  ['01100110','01100110','01100120','01200110','03300330','00000000'],
  ['01100110','01100110','01200120','01100330','03300000','000.....'],
  ['01100110','01100110','01200120','03300110','00000330','....0000'],
  ['01100110','01100110','01200110','01100120','03300330','00000000']
];
const sideLegs=[
  ['...0110...','..011110..','.01100110.','.010..010.','0330..0330','0000..0000'],
  ['...0110...','...01110..','..011110..','..010010..','..0330330.','..0000000.'],
  ['...0110...','...0110...','...01110..','...01010..','...03330..','...00000..'],
  ['...0110...','..011110..','.01200110.','.010..010.','0330..0330','0000..0000'],
  ['...0110...','...01110..','..012110..','..010010..','..0330330.','..0000000.'],
  ['...0110...','...0110...','...01210..','...01010..','...03330..','...00000..']
];
export function technicianFrame(direction,frame) {
  const pixels=Array.from({length:32},()=>Array(24).fill('.'));
  const side=direction==='left'||direction==='right', view=side?'right':direction;
  const walking=frame>=1&&frame<=6, flight=frame>=8&&frame<=10;
  const crouch=frame===7||frame===11, phase=walking?frame-1:2;
  const stamp=(rows,x,y)=>rows.forEach((row,dy)=>[...row].forEach((c,dx)=>{if(c!=='.')pixels[y+dy][x+dx]=c;}));
  let legs=side?sideLegs[phase]:frontLegs[phase];
  if(flight)legs=side?['...0110...','..011110..','..012110..','..033330..','..000000..','..........']:['01100110','01200120','03300330','00000000','........','........'];
  stamp(legs,side?7:8,22);
  const dip=crouch||walking&&[1,4].includes(phase)?1:0;
  stamp(torsos[view],5,14+dip);
  stamp(heads[view],6,4+dip);
  if(side&&walking){
    // The visible hand swings one pixel across the coat, not off the body.
    const x=11+[1,0,-1,-1,0,1][phase];
    stamp(['11','23','11'],x,18+dip);
  }
  const rows=pixels.map(row=>row.join(''));
  return direction==='left'?rows.map(row=>[...row].reverse().join('')):rows;
}
export function technicianAtlas() {
  const canvas=document.createElement('canvas');canvas.width=24*12;canvas.height=32*4;
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  ['down','up','left','right'].forEach((direction,row)=>{
    for(let frame=0;frame<12;frame++)technicianFrame(direction,frame).forEach((line,y)=>[...line].forEach((c,x)=>{
      if(c!=='.'){ctx.fillStyle=PALETTE[+c];ctx.fillRect(frame*24+x,row*32+y,1,1);}
    }));
  });
  return canvas.toDataURL('image/png');
}
