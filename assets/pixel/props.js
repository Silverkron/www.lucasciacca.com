// Original monochrome sprites, authored on the same pixel grid as the technician.
export const ARMOR={x:192,y:75,bounds:[181,44,22,33],text:'MK3: tu sai chi sono'};
export function catPose(time,reduced=false){
  if(reduced)return {x:125,y:126,left:false,frame:0,moving:false};
  const t=((time%46)+46)%46,returning=t>=23,leg=returning?t-23:t;
  const moving=leg<22.5,distance=Math.floor(Math.min(270,leg*12)+0.000001);
  return {x:returning?325-distance:55+distance,y:126,
    left:moving?returning:leg>=22.75?!returning:returning,
    frame:moving?distance%8:0,moving};
}
const armor=[
  '........000000........','.......01222210.......','......0123333210......',
  '......0123333210......','......0100330010......','......0122332210......',
  '.......01222210.......','.......01000010.......','....00001122110000....',
  '...0122101221012210...','..012221122221122210..','..012211233332112210..',
  '..011210230032012110..','..011210230032012110..','...0121023333201210...',
  '...0121012332101210...','...0121001221001210...','...0331000110001330...',
  '...0330.012210.0330...','...0000.011110.0000...',
  '........011110........','.......01211210.......','.......01200210.......',
  '.......01200210.......','.......03300330.......','.......01100110.......',
  '.......01200120.......','......0122002210......','......0333003330......',
  '......0000000000......'
];
// Paw contact order: RH, RF, LH, LF. Six stance frames, two swing frames.
export function catLegs(frame,idle=false){
  return [{hip:9,offset:0,far:true},{hip:18,offset:2,far:true},
    {hip:7,offset:4,far:false},{hip:16,offset:6,far:false}].map(leg=>{
    const phase=(frame-leg.offset+8)%8;
    return {...leg,dx:idle?0:[3,2,1,0,-1,-2,-1,1][phase],lift:idle?0:[0,0,0,0,0,0,1,1][phase]};
  });
}
export function catFrame(frame=0,left=false,idle=false){
  const pixels=Array.from({length:18},()=>Array(24).fill('.'));
  const rect=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)pixels[j][i]=c;};
  const stamp=(rows,x,y)=>rows.forEach((r,j)=>[...r].forEach((c,i)=>{if(c!=='.')pixels[y+j][x+i]=c;}));
  // A thin curved tail, not a square handle. Its lower curve joins the rump.
  stamp(['..00.','.0120','0120.','010..','0120.','.0120','..012','...01'],1,5);
  const leg=p=>{
    const floor=p.far?16:17,foot=p.hip+p.dx,bottom=floor-p.lift;
    // Short tapered limbs: connected fur pixels, no black blocks for joints.
    for(let y=13;y<=bottom;y++){
      const x=Math.round(p.hip+(foot-p.hip)*(y-13)/(bottom-13));
      rect(x,y,2,1,p.far?'1':'2');
    }
    rect(foot,bottom,2,1,p.far?'0':'1');
  };
  const legs=catLegs(frame,idle);legs.filter(p=>p.far).forEach(leg);
  // Flat back and belly, vertical flanks, single-pixel corners: no capsule contour.
  stamp(['.0000000000000.','012232222222210','012222222222210',
    '012222222222210','012111111111110','.0000000000000.'],4,8);
  // Angular cheek and squared jaw; ears still identify the feline silhouette.
  stamp(['.0....0..','012..021.','012002210','012222210','012233210',
    '012230230','012233320','.00000000'],14,3);
  legs.filter(p=>!p.far).forEach(leg);
  const rows=pixels.map(r=>r.join(''));
  return left?rows.map(r=>[...r].reverse().join('')):rows;
}
function stampSprite(ctx,rows,x,y){
  const colors=['#202020','#606060','#a8a8a8','#eeeeee'];
  rows.forEach((row,dy)=>[...row].forEach((p,dx)=>{
    if(p!=='.'){ctx.fillStyle=colors[+p];ctx.fillRect(x+dx,y+dy,1,1);}
  }));
}
export function drawArmor(ctx){
  ctx.fillStyle='#202020';ctx.fillRect(181,74,22,3);
  ctx.fillStyle='#a8a8a8';ctx.fillRect(183,74,18,1);
  stampSprite(ctx,armor,181,44);
}
export function drawCat(ctx,time,reduced=false){
  const c=catPose(time,reduced);
  stampSprite(ctx,catFrame(c.frame,c.left,!c.moving),c.x-12,c.y-17);
}
export function drawCatShadow(ctx,time,reduced=false){
  const c=catPose(time,reduced);
  ctx.fillStyle='#606060';ctx.fillRect(c.x-7,c.y,15,2);
}
export function actorDepth(footY){return 10+footY;}
export function drawProps(ctx,time,reduced=false){
  drawArmor(ctx);drawCatShadow(ctx,time,reduced);drawCat(ctx,time,reduced);
}
