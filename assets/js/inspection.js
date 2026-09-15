import { objectAt } from '../pixel/objects.js';

export function mountInspection(root,snapshot){
  const canvas=root.querySelector('canvas'),stage=root.querySelector('.game-viewport');
  const tooltip=document.createElement('div');tooltip.className='game-tooltip';tooltip.id='object-tooltip';
  tooltip.setAttribute('role','tooltip');tooltip.hidden=true;stage.append(tooltip);
  let pointer=null,overTooltip=false,dismissed=false,lastID='';
  const hide=()=>{tooltip.hidden=true;lastID='';canvas.style.cursor='';canvas.removeAttribute('aria-details');};
  function update(){
    if(!pointer||dismissed||overTooltip)return;
    const rect=canvas.getBoundingClientRect(),box=stage.getBoundingClientRect();
    const {clock,reduced,state}=snapshot();
    const item=objectAt((pointer.x-rect.left)*384/rect.width,(pointer.y-rect.top)*256/rect.height,clock,reduced,state);
    if(!item){hide();return;}
    if(lastID!==item.id){tooltip.textContent=item.text;lastID=item.id;}
    tooltip.hidden=false;canvas.style.cursor='help';canvas.setAttribute('aria-details',tooltip.id);
    const left=Math.max(8,Math.min(pointer.x-box.left+14,box.width-tooltip.offsetWidth-8));
    let top=pointer.y-box.top+18;
    if(top+tooltip.offsetHeight>box.height-8)top=pointer.y-box.top-tooltip.offsetHeight-12;
    tooltip.style.left=left+'px';tooltip.style.top=Math.max(8,top)+'px';
  }
  const point=event=>{pointer={x:event.clientX,y:event.clientY};dismissed=false;overTooltip=false;update();};
  canvas.addEventListener('pointermove',point);
  canvas.addEventListener('pointerdown',point);
  canvas.addEventListener('pointerleave',event=>{
    if(event.pointerType==='touch')return;
    if(event.relatedTarget===tooltip){overTooltip=true;return;}
    pointer=null;hide();
  });
  tooltip.addEventListener('pointerenter',()=>{overTooltip=true;});
  tooltip.addEventListener('pointerleave',event=>{overTooltip=false;if(event.relatedTarget!==canvas){pointer=null;hide();}});
  document.addEventListener('pointerdown',event=>{if(event.target!==canvas&&!tooltip.contains(event.target)){pointer=null;hide();}});
  window.addEventListener('keydown',event=>{
    if(event.code==='Escape'&&!tooltip.hidden){event.preventDefault();event.stopImmediatePropagation();dismissed=true;hide();}
  },true);
  window.addEventListener('scroll',()=>{pointer=null;hide();},{passive:true});
  window.addEventListener('resize',()=>{pointer=null;hide();});
  window.addEventListener('blur',()=>{pointer=null;hide();});
  return update;
}
