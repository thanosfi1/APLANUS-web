import {getObserver} from "./location.js";
import {calculateSky} from "./astronomy.js";
import {startSensors,stopSensors,sensorState,applyMatrix} from "./sensors.js";
import {startAR,stopAR} from "../ar/ar.js";
import {CONSTELLATIONS} from "./catalog.js";
const canvas=document.getElementById("skyCanvas"),ctx=canvas.getContext("2d"),statusEl=document.getElementById("status"),locationEl=document.getElementById("locationLabel"),timeEl=document.getElementById("timeLabel");
let observer={lat:40.6401,lon:22.9444,source:"fallback"},date=new Date(),viewAz=180,viewAlt=35,fov=65,drag=null,lastObjects=[],pinch=null,arActive=false,showConst=true,showDeep=true,rawAz=180,rawAlt=35,calAz=Number(localStorage.getItem("aplanusCalAz")||0),calAlt=Number(localStorage.getItem("aplanusCalAlt")||0);

const wrap=a=>((a+540)%360)-180;
function project(o,w,h){
 if(arActive&&sensorState.matrix){
  const az=o.azimuth*Math.PI/180,alt=o.altitude*Math.PI/180;
  const world={x:Math.cos(alt)*Math.sin(az),y:Math.cos(alt)*Math.cos(az),z:Math.sin(alt)};
  const v=applyMatrix(sensorState.matrix,world);
  if(v.z>=-.02)return null;
  const vfov=fov*Math.PI/180,hfov=2*Math.atan(Math.tan(vfov/2)*(w/h));
  const x=w/2+(v.x/-v.z)*(w/(2*Math.tan(hfov/2)));
  const y=h/2-(v.y/-v.z)*(h/(2*Math.tan(vfov/2)));
  return{x,y};
 }
 const dx=wrap(o.azimuth-viewAz),dy=o.altitude-viewAlt,scale=w/fov;if(Math.abs(dx)>fov*.65)return null;return{x:w/2+dx*scale,y:h/2-dy*scale};
}
function landscapeHeight(az,layer=0){
 const r=az*Math.PI/180;
 return layer===0?1.1+1.15*Math.sin(r*2.1+.7)+.65*Math.sin(r*5.3+1.8)+.35*Math.sin(r*11.7):
 2.2+1.7*Math.sin(r*1.35+2.4)+.9*Math.sin(r*3.8+.2)+.45*Math.sin(r*8.6+1.1);
}
function drawTerrainLayer(w,h,layer,color){
 const pts=[];
 for(let az=0;az<360;az+=1){
  const p=project({azimuth:az,altitude:Math.max(.15,landscapeHeight(az,layer))},w,h);
  if(p&&p.x>=-w*.25&&p.x<=w*1.25)pts.push(p);
 }
 if(pts.length<2)return;
 pts.sort((a,b)=>a.x-b.x);
 ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(const p of pts)ctx.lineTo(p.x,p.y);
 ctx.lineTo(pts[pts.length-1].x,h);ctx.lineTo(pts[0].x,h);ctx.closePath();ctx.fillStyle=color;ctx.fill();
}
function drawTreeSilhouette(az,baseAlt,w,h,twilight){
 const base=project({azimuth:az,altitude:baseAlt},w,h),top=project({azimuth:az,altitude:baseAlt+1.8},w,h);
 if(!base||!top||base.x<0||base.x>w)return;
 const height=Math.max(7,base.y-top.y),width=Math.max(3,height*.42);
 ctx.fillStyle=twilight?"rgba(5,14,17,.88)":"rgba(1,7,9,.96)";
 ctx.fillRect(base.x-1,base.y-height*.34,2,height*.36);
 ctx.beginPath();ctx.moveTo(base.x,base.y-height);ctx.lineTo(base.x-width,base.y-height*.18);ctx.lineTo(base.x+width,base.y-height*.18);ctx.closePath();ctx.fill();
}
function drawHorizonGround(w,h){
 if(arActive)return;
 let sunAlt=-18;
 try{sunAlt=calculateSky(date,observer).find(o=>o.id==="Sun")?.altitude??-18}catch{}
 const twilight=sunAlt>-18&&sunAlt<2, twilightMix=Math.max(0,Math.min(1,(sunAlt+18)/20));
 const horizon=[];
 for(let az=0;az<360;az+=1){const p=project({azimuth:az,altitude:0},w,h);if(p&&p.x>=-w*.25&&p.x<=w*1.25)horizon.push(p)}
 if(horizon.length<2)return;
 horizon.sort((a,b)=>a.x-b.x);
 const hy=horizon.reduce((s,p)=>s+p.y,0)/horizon.length;
 const haze=ctx.createLinearGradient(0,hy-48,0,hy+30);
 haze.addColorStop(0,"rgba(90,130,170,0)");
 haze.addColorStop(.48,`rgba(125,160,175,${.025+twilightMix*.11})`);
 haze.addColorStop(.7,`rgba(245,158,90,${twilightMix*.055})`);
 haze.addColorStop(1,"rgba(20,45,48,0)");
 ctx.fillStyle=haze;ctx.fillRect(0,hy-52,w,86);
 drawTerrainLayer(w,h,0,twilight?"rgba(17,31,36,.76)":"rgba(8,21,25,.88)");
 drawTerrainLayer(w,h,1,twilight?"rgba(7,19,22,.94)":"rgba(2,11,13,.98)");
 for(const az of [14,31,58,104,127,166,211,239,286,318,344])drawTreeSilhouette(az,Math.max(.3,landscapeHeight(az,1)),w,h,twilight);
 const ground=ctx.createLinearGradient(0,hy,0,h);
 ground.addColorStop(0,twilight?"rgba(8,21,23,.18)":"rgba(2,10,12,.25)");ground.addColorStop(.28,twilight?"rgba(5,15,17,.94)":"rgba(1,8,10,.98)");ground.addColorStop(1,"#010506");
 ctx.beginPath();ctx.moveTo(horizon[0].x,horizon[0].y);for(const p of horizon)ctx.lineTo(p.x,p.y);ctx.lineTo(horizon[horizon.length-1].x,h);ctx.lineTo(horizon[0].x,h);ctx.closePath();ctx.fillStyle=ground;ctx.fill();
 ctx.beginPath();ctx.moveTo(horizon[0].x,horizon[0].y);for(const p of horizon)ctx.lineTo(p.x,p.y);
 ctx.strokeStyle=twilight?"rgba(186,210,214,.24)":"rgba(125,211,252,.25)";ctx.lineWidth=1;ctx.stroke();
}
function render(){
 const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
 if(!arActive){const g=ctx.createRadialGradient(w*.5,h*.45,10,w*.5,h*.45,Math.max(w,h));g.addColorStop(0,"#111b3c");g.addColorStop(1,"#02040d");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}else ctx.clearRect(0,0,w,h);
 ctx.fillStyle="rgba(148,163,184,.65)";ctx.font="11px system-ui";ctx.textAlign="center";
 try{
  const objects=calculateSky(date,observer).filter(o=>o.altitude>-10);lastObjects=objects;
  if(showConst&&!arActive){ctx.strokeStyle="rgba(96,165,250,.28)";ctx.lineWidth=1;for(const [,label,ids] of CONSTELLATIONS){const pts=ids.map(id=>objects.find(o=>o.id===id)).filter(Boolean).map(o=>project(o,w,h)).filter(Boolean);if(pts.length>1){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();const p=pts[Math.floor(pts.length/2)];ctx.fillStyle="rgba(147,197,253,.65)";ctx.fillText(label,p.x,p.y-10)}}}
  for(const o of objects){if(o.type==="deep"&&!showDeep)continue;if(!arActive&&o.altitude<0)continue;const p=project(o,w,h);if(!p||p.y<-30||p.y>h+30)continue;
   const star=o.type==="star",deep=o.type==="deep",r=star?Math.max(1.2,3.6-(o.mag||0)):o.id==="Moon"||o.id==="Sun"?7:4;
   ctx.beginPath();ctx.arc(p.x,p.y,deep?3:r,0,Math.PI*2);ctx.fillStyle=star?"#fff":deep?"#a78bfa":o.color;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=star?3:9;ctx.fill();ctx.shadowBlur=0;
   if(deep||!star||o.mag<1.1){ctx.fillStyle=deep?"#c4b5fd":"#dbeafe";ctx.font=star?"10px system-ui":"12px system-ui";ctx.fillText(o.name,p.x,p.y-r-5);}
  }
  drawHorizonGround(w,h);
  ctx.fillStyle="rgba(203,213,225,.8)";ctx.font="600 11px system-ui";ctx.textAlign="center";
  for(const [az,label] of [[0,"Β"],[90,"Α"],[180,"Ν"],[270,"Δ"]]){const p=project({azimuth:az,altitude:1.5},w,h);if(p&&p.x>-20&&p.x<w+20&&p.y>-20&&p.y<h+20)ctx.fillText(label,p.x,p.y);}
  statusEl.textContent=`AZ ${Math.round(viewAz)}° • ALT ${Math.round(viewAlt)}° • FOV ${Math.round(fov)}°`;
 }catch(e){statusEl.textContent=e.message}
 timeEl.textContent=date.toLocaleTimeString("el-GR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}
function resize(){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render()}
canvas.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY,az:viewAz,alt:viewAlt};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(!drag)return;viewAz=(drag.az-(e.clientX-drag.x)*fov/canvas.clientWidth+360)%360;viewAlt=Math.max(-10,Math.min(90,drag.alt+(e.clientY-drag.y)*fov/canvas.clientWidth));render()});
canvas.addEventListener("pointerup",()=>drag=null);canvas.addEventListener("pointercancel",()=>drag=null);
canvas.addEventListener("touchstart",e=>{if(e.touches.length===2){pinch={d:Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),f:fov}}},{passive:true});
canvas.addEventListener("touchmove",e=>{if(e.touches.length===2&&pinch){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);fov=Math.max(25,Math.min(150,pinch.f*pinch.d/d));render()}},{passive:true});
canvas.addEventListener("touchend",()=>pinch=null,{passive:true});
canvas.addEventListener("click",e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let hit=null,best=24;for(const o of lastObjects){const p=project(o,canvas.clientWidth,canvas.clientHeight);if(!p)continue;const d=Math.hypot(p.x-x,p.y-y);if(d<best){best=d;hit=o}}if(hit)showObject(hit)});
function showObject(o){const labels={star:"ΑΣΤΕΡΑΣ",planet:"ΠΛΑΝΗΤΗΣ",dwarf:"ΠΛΑΝΗΤΗΣ ΝΑΝΟΣ",asteroid:"ΑΣΤΕΡΟΕΙΔΗΣ",moon:"ΔΟΡΥΦΟΡΟΣ",sun:"ΑΣΤΕΡΑΣ",deep:"DEEP SKY"};document.getElementById("objectPanel").hidden=false;document.getElementById("objectName").textContent=o.name;document.getElementById("objectType").textContent=labels[o.type]||"ΟΥΡΑΝΙΟ ΣΩΜΑ";document.getElementById("objectAlt").textContent=o.altitude.toFixed(1)+"°";document.getElementById("objectAz").textContent=o.azimuth.toFixed(1)+"°"}
document.getElementById("closePanel").addEventListener("click",()=>document.getElementById("objectPanel").hidden=true);
canvas.addEventListener("wheel",e=>{e.preventDefault();fov=Math.max(25,Math.min(150,fov+Math.sign(e.deltaY)*10));render()},{passive:false});
async function locate(){statusEl.textContent="Εντοπισμός θέσης…";observer=await getObserver();locationEl.textContent=observer.source==="gps"?`GPS • ${observer.lat.toFixed(3)}, ${observer.lon.toFixed(3)}`:"Θέση: προεπιλογή";render()}
function openCalibration(){const panel=document.getElementById("calibration"),box=document.getElementById("calTargets");panel.hidden=false;box.innerHTML="";const visible=lastObjects.filter(o=>o.altitude>0).sort((a,b)=>(a.type==="star"?1:0)-(b.type==="star"?1:0)).slice(0,10);for(const o of visible){const b=document.createElement("button");b.textContent=o.name;b.onclick=()=>{calAz=wrap(o.azimuth-rawAz);calAlt=o.altitude-rawAlt;localStorage.setItem("aplanusCalAz",calAz);localStorage.setItem("aplanusCalAlt",calAlt);viewAz=(rawAz+calAz+360)%360;viewAlt=Math.max(-10,Math.min(90,rawAlt+calAlt));panel.hidden=true;statusEl.textContent="AR βαθμονομήθηκε ✓";render()};box.appendChild(b)}}
document.getElementById("calBtn").addEventListener("click",openCalibration);document.getElementById("calCancel").addEventListener("click",()=>document.getElementById("calibration").hidden=true);
document.getElementById("arBtn").addEventListener("click",async()=>{const btn=document.getElementById("arBtn"),video=document.getElementById("arVideo"),vp=document.querySelector(".viewport");try{if(arActive){stopAR(video);arActive=false;vp.classList.remove("ar-active");btn.textContent="📷 AR";render();return}await startAR(video);arActive=true;fov=65;vp.classList.add("ar-active");btn.textContent="■ AR";if(!sensorState.active)document.getElementById("sensorBtn").click();render()}catch(e){statusEl.textContent=e.message}});
document.getElementById("sensorBtn").addEventListener("click",async()=>{const btn=document.getElementById("sensorBtn"),dbg=document.getElementById("sensorDebug");dbg.hidden=false;dbg.textContent="Sensor diagnostic…\nDeviceOrientationEvent: "+("DeviceOrientationEvent" in window)+"\nrequestPermission: "+(typeof window.DeviceOrientationEvent?.requestPermission)+"\nsecureContext: "+window.isSecureContext+"\norientation: "+(screen.orientation?.type||"n/a")+"\nUA: "+navigator.userAgent;let rawSeen=0;const probe=e=>{rawSeen++;dbg.textContent="EVENT OK ("+e.type+")\nalpha: "+e.alpha+"\nbeta: "+e.beta+"\ngamma: "+e.gamma+"\nabsolute: "+e.absolute+"\nwebkitCompassHeading: "+e.webkitCompassHeading};window.addEventListener("deviceorientation",probe,{once:true});window.addEventListener("deviceorientationabsolute",probe,{once:true});if(sensorState.active){stopSensors();btn.textContent="🧭";return}try{let got=false;await startSensors(s=>{got=true;rawAz=s.heading;rawAlt=s.pitch;viewAz=(rawAz+calAz+360)%360;viewAlt=Math.max(-10,Math.min(90,rawAlt+calAlt));render()});btn.textContent="🧭 …";setTimeout(()=>{if(got){btn.textContent="🧭 ON"}else{btn.textContent="🧭";statusEl.textContent="Δεν λαμβάνονται δεδομένα αισθητήρων";if(!dbg.textContent.startsWith("EVENT OK"))dbg.textContent+="\n\nRESULT: no orientation event received"}},1200)}catch(e){statusEl.textContent=e.message}});

function focusObject(o){viewAz=o.azimuth;viewAlt=o.altitude;fov=35;document.getElementById("searchPanel").hidden=true;document.getElementById("tonightPanel").hidden=true;showObject(o);render()}
document.getElementById("searchBtn").onclick=()=>{const p=document.getElementById("searchPanel");p.hidden=!p.hidden;document.getElementById("searchInput").focus()};
document.getElementById("searchInput").oninput=e=>{const q=e.target.value.toLocaleLowerCase("el");const box=document.getElementById("searchResults");box.innerHTML="";if(q.length<1)return;lastObjects.filter(o=>(o.name+" "+o.id).toLocaleLowerCase("el").includes(q)).slice(0,12).forEach(o=>{const b=document.createElement("button");b.textContent=o.name+" · "+o.id;b.onclick=()=>focusObject(o);box.appendChild(b)})};
document.getElementById("tonightBtn").onclick=()=>{const p=document.getElementById("tonightPanel"),box=document.getElementById("tonightList");p.hidden=!p.hidden;box.innerHTML="";lastObjects.filter(o=>o.altitude>15&&(o.type!=="star"||o.mag<1.5)).sort((a,b)=>b.altitude-a.altitude).slice(0,12).forEach(o=>{const b=document.createElement("button");b.textContent=o.name+" · "+Math.round(o.altitude)+"°";b.onclick=()=>focusObject(o);box.appendChild(b)})};
document.getElementById("constBtn").onclick=()=>{showConst=!showConst;render()};
document.getElementById("deepBtn").onclick=()=>{showDeep=!showDeep;render()};
document.getElementById("nightBtn").onclick=()=>document.body.classList.toggle("night-mode");
document.getElementById("timeSlider").oninput=e=>{const hrs=Number(e.target.value);date=new Date(Date.now()+hrs*3600000);document.getElementById("timeOffset").textContent=hrs===0?"Τώρα":(hrs>0?"+":"")+hrs+"ω";render()};
document.getElementById("locateBtn").addEventListener("click",locate);document.getElementById("nowBtn").addEventListener("click",()=>{date=new Date();document.getElementById("timeSlider").value=0;document.getElementById("timeOffset").textContent="Τώρα";render()});window.addEventListener("resize",resize);setInterval(()=>{if(Number(document.getElementById("timeSlider").value)===0)date=new Date();render()},1000);resize();