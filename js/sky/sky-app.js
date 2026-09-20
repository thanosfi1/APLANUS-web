import {getObserver} from "./location.js";
import {calculateSky} from "./astronomy.js";
const canvas=document.getElementById("skyCanvas"),ctx=canvas.getContext("2d"),statusEl=document.getElementById("status"),locationEl=document.getElementById("locationLabel"),timeEl=document.getElementById("timeLabel");
let observer={lat:40.6401,lon:22.9444,source:"fallback"},date=new Date(),viewAz=180,viewAlt=35,fov=100,drag=null;

const wrap=a=>((a+540)%360)-180;
function project(o,w,h){const dx=wrap(o.azimuth-viewAz),dy=o.altitude-viewAlt,scale=w/fov;if(Math.abs(dx)>fov*.65)return null;return{x:w/2+dx*scale,y:h/2-dy*scale};}
function render(){
 const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
 const g=ctx.createRadialGradient(w*.5,h*.45,10,w*.5,h*.45,Math.max(w,h));g.addColorStop(0,"#111b3c");g.addColorStop(1,"#02040d");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.fillStyle="rgba(148,163,184,.65)";ctx.font="11px system-ui";ctx.textAlign="center";
 for(const [az,label] of [[0,"Β"],[90,"Α"],[180,"Ν"],[270,"Δ"]]){const p=project({azimuth:az,altitude:2},w,h);if(p)ctx.fillText(label,p.x,p.y);}
 try{
  const objects=calculateSky(date,observer).filter(o=>o.altitude>-10);
  for(const o of objects){const p=project(o,w,h);if(!p||p.y<-30||p.y>h+30)continue;
   const star=o.type==="star",r=star?Math.max(1.2,3.6-(o.mag||0)):o.id==="Moon"||o.id==="Sun"?7:4;
   ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fillStyle=star?"#fff":o.color;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=star?3:9;ctx.fill();ctx.shadowBlur=0;
   if(!star||o.mag<1.1){ctx.fillStyle="#dbeafe";ctx.font=star?"10px system-ui":"12px system-ui";ctx.fillText(o.name,p.x,p.y-r-5);}
  }
  statusEl.textContent=`AZ ${Math.round(viewAz)}° • ALT ${Math.round(viewAlt)}° • FOV ${Math.round(fov)}°`;
 }catch(e){statusEl.textContent=e.message}
 timeEl.textContent=date.toLocaleTimeString("el-GR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}
function resize(){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render()}
canvas.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY,az:viewAz,alt:viewAlt};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(!drag)return;viewAz=(drag.az-(e.clientX-drag.x)*fov/canvas.clientWidth+360)%360;viewAlt=Math.max(-10,Math.min(90,drag.alt+(e.clientY-drag.y)*fov/canvas.clientWidth));render()});
canvas.addEventListener("pointerup",()=>drag=null);canvas.addEventListener("pointercancel",()=>drag=null);
canvas.addEventListener("wheel",e=>{e.preventDefault();fov=Math.max(25,Math.min(150,fov+Math.sign(e.deltaY)*10));render()},{passive:false});
async function locate(){statusEl.textContent="Εντοπισμός θέσης…";observer=await getObserver();locationEl.textContent=observer.source==="gps"?`GPS • ${observer.lat.toFixed(3)}, ${observer.lon.toFixed(3)}`:"Θέση: προεπιλογή";render()}
document.getElementById("locateBtn").addEventListener("click",locate);document.getElementById("nowBtn").addEventListener("click",()=>{date=new Date();render()});window.addEventListener("resize",resize);setInterval(()=>{date=new Date();render()},1000);resize();