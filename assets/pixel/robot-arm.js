// A small articulated tabletop arm, drawn with square pixels over the clear desk.
// Joint positions are discrete: four poses, no continuous rotation or blur.
export function robotArmPose(time,reduced=false) {
  return reduced?0:Math.floor(time*3)%6;
}
export function drawRobotArm(ctx,time,reduced=false) {
  const frame=robotArmPose(time,reduced);
  const poses=[[-7,-11,2,-17],[-5,-13,5,-16],[-3,-14,8,-13],[-2,-12,10,-10],[-3,-14,8,-13],[-5,-13,5,-16]];
  const [ex,ey,hx,hy]=poses[frame];
  const x=337,y=231;
  const rect=(rx,ry,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(rx,ry,w,h);};
  const link=(ax,ay,bx,by)=>{
    // Bresenham-style integer interpolation with a chunky outlined link.
    const n=Math.max(Math.abs(bx-ax),Math.abs(by-ay));
    for(let i=0;i<=n;i++)rect(Math.round(ax+(bx-ax)*i/n)-2,Math.round(ay+(by-ay)*i/n)-2,5,5,'#202020');
    for(let i=0;i<=n;i++)rect(Math.round(ax+(bx-ax)*i/n)-1,Math.round(ay+(by-ay)*i/n)-1,2,2,'#a8a8a8');
  };
  link(x,y-4,x+ex,y+ey);link(x+ex,y+ey,x+hx,y+hy);
  rect(x-7,y-2,14,4,'#202020');rect(x-5,y-2,10,2,'#a8a8a8');
  rect(x+ex-2,y+ey-2,5,5,'#202020');rect(x+ex-1,y+ey-1,2,2,'#eeeeee');
  rect(x+hx-2,y+hy-1,5,3,'#202020');
  rect(x+hx+2,y+hy-3,3,2,'#606060');rect(x+hx+2,y+hy+2,3,2,'#606060');
}
