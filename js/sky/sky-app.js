import {getObserver} from "./location.js";
import {calculateSky} from "./astronomy.js";

const canvas=document.getElementById("skyCanvas"),ctx=canvas.getContext("2d");
const statusEl=document.getElementById("status"),locationEl=document.getElementById("locationLabel"),timeEl=document.getElementById("timeLabel");
let observer={lat:40.6401,lon:22.9444,source:"fallback"},date=new Date();

function resize(){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render()}
function project(body,w,h){const horizon=h*.9,zenith=h*.12;const y=horizon-(Math.max(0,body.altitude)/90)*(horizon-zenith);const x=(body.azimuth/360)*w;return{x,y}}
function render(){
  const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#02040d");g.addColorStop(1,"#10182c");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(148,163,184,.18)";ctx.lineWidth=1;
  for(let a=0;a<=90;a+=30){const y=h*.9-(a/90)*(h*.78);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();ctx.fillStyle="rgba(148,163,184,.55)";ctx.font="11px system-ui";ctx.fillText(a+"°",8,y-5)}
  try{
    const bodies=calculateSky(date,observer).filter(b=>b.altitude>-5);
    for(const b of bodies){const p=project(b,w,h);ctx.beginPath();ctx.arc(p.x,p.y,b.id==="Moon"||b.id==="Sun"?7:4,0,Math.PI*2);ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle="#e2e8f0";ctx.font="12px system-ui";ctx.textAlign="center";ctx.fillText(b.name,p.x,p.y-11)}
    statusEl.textContent=`Ορατά σώματα: ${bodies.filter(b=>b.altitude>0).length}`;
  }catch(e){statusEl.textContent=e.message}
  timeEl.textContent=date.toLocaleTimeString("el-GR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}
async function locate(){statusEl.textContent="Εντοπισμός θέσης…";observer=await getObserver();locationEl.textContent=observer.source==="gps"?`GPS • ${observer.lat.toFixed(3)}, ${observer.lon.toFixed(3)}`:"Θέση: προεπιλογή";render()}
document.getElementById("locateBtn").addEventListener("click",locate);
document.getElementById("nowBtn").addEventListener("click",()=>{date=new Date();render()});
window.addEventListener("resize",resize);
setInterval(()=>{date=new Date();render()},1000);
resize();
