// Live Sky device orientation.
// World frame: x = East, y = true North, z = Up. Camera looks along device -z.
// Modes:
//  - "absolute": Android Chrome `deviceorientationabsolute` / Firefox `absolute:true`
//    (alpha referenced to magnetic north) -> rotate by magnetic declination.
//  - "ios-compass": iOS Safari, alpha has an arbitrary reference; a continuously
//    refined yaw offset is derived from webkitCompassHeading (magnetic) + declination.
//  - "relative": no north reference available; only the CAL calibration can align it.
export const sensorState={supported:false,active:false,matrix:null,heading:null,pitch:null,roll:null,forward:null,
 mode:null,northReady:false,declination:0,compassAccuracy:null,yawOffset:null};
let listeners=[];
const R=Math.PI/180,norm=n=>(n%360+360)%360,wrap=n=>((n%360)+540)%360-180;
const clamp=n=>Math.max(-1,Math.min(1,n));
function qMul(a,b){return{
 w:a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z,
 x:a.w*b.x+a.x*b.w+a.y*b.z-a.z*b.y,
 y:a.w*b.y-a.x*b.z+a.y*b.w+a.z*b.x,
 z:a.w*b.z+a.x*b.y-a.y*b.x+a.z*b.w
}}
function qAxis(x,y,z,a){a*=R/2;const s=Math.sin(a);return{w:Math.cos(a),x:x*s,y:y*s,z:z*s}}
function qNorm(q){const n=Math.hypot(q.w,q.x,q.y,q.z)||1;return{w:q.w/n,x:q.x/n,y:q.y/n,z:q.z/n}}
function qConj(q){return{w:q.w,x:-q.x,y:-q.y,z:-q.z}}
function qRotate(q,v){const p={w:0,x:v.x,y:v.y,z:v.z},r=qMul(qMul(q,p),qConj(q));return{x:r.x,y:r.y,z:r.z}}
function qSlerp(a,b,t){
 let d=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(d<0){b={w:-b.w,x:-b.x,y:-b.y,z:-b.z};d=-d}
 if(d>.9995)return qNorm({w:a.w+(b.w-a.w)*t,x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});
 const th=Math.acos(d),s=Math.sin(th),wa=Math.sin((1-t)*th)/s,wb=Math.sin(t*th)/s;
 return{w:a.w*wa+b.w*wb,x:a.x*wa+b.x*wb,y:a.y*wa+b.y*wb,z:a.z*wa+b.z*wb};
}
function qAngle(a,b){const d=Math.abs(a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z);return 2*Math.acos(Math.min(1,d))/R}
function qToMatrix(q){q=qNorm(q);const {w,x,y,z}=q;return[
 1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w),
 2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w),
 2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)
]}
const headingOf=v=>norm(Math.atan2(v.x,v.y)/R);
export function applyMatrix(m,v){return{x:m[0]*v.x+m[1]*v.y+m[2]*v.z,y:m[3]*v.x+m[4]*v.y+m[5]*v.z,z:m[6]*v.x+m[7]*v.y+m[8]*v.z}}

/** Pure orientation fusion (no DOM access) so it can be tested outside the browser. */
export function createFusion(){
 const f={mode:null,declination:0,yawOffset:null,compassSamples:0,lastRelHeading:null,smooth:null,compassAccuracy:null,startedAt:null};
 // Device -> world quaternion from W3C Euler angles, corrected for screen rotation.
 // Validated Sensor Lab transform. Keep this sequence unchanged.
 function deviceQuat(alpha,beta,gamma,screenAngle){
  let q=qMul(qMul(qAxis(0,0,1,alpha),qAxis(1,0,0,beta)),qAxis(0,1,0,gamma));
  return qNorm(qMul(q,qAxis(0,0,1,-screenAngle)));
 }
 f.update=(e,screenAngle=0,now=0)=>{
  if(e.beta==null||e.gamma==null)return null;
  if(f.startedAt==null)f.startedAt=now;
  const alpha=typeof e.alpha==="number"?e.alpha:0;
  const absolute=e.type==="deviceorientationabsolute"||e.absolute===true;
  // Once absolute events have been seen, ignore relative duplicates (Android fires both).
  if(f.mode==="absolute"&&!absolute)return null;
  const compass=e.webkitCompassHeading,acc=e.webkitCompassAccuracy;
  const hasCompass=typeof compass==="number"&&compass>=0&&compass<=360;
  if(absolute&&typeof e.alpha==="number")f.mode="absolute";
  else if(!f.mode||f.mode==="relative")f.mode=hasCompass?"ios-compass":"relative";
  const q=deviceQuat(alpha,e.beta,e.gamma,screenAngle);
  // Rotating by +θ about Up decreases compass heading by θ.
  // Magnetic heading Hm -> true heading Hm + D, so rotate by -D.
  let yaw=0;
  if(f.mode==="absolute"){yaw=-f.declination;f.yawOffset=yaw}
  else if(f.mode==="ios-compass"){
   f.compassAccuracy=Number.isFinite(acc)?acc:null;
   const fwd=qRotate(q,{x:0,y:0,z:-1}),pitch=Math.asin(clamp(fwd.z))/R,rel=headingOf(fwd);
   const turning=f.lastRelHeading==null?0:Math.abs(wrap(rel-f.lastRelHeading));f.lastRelHeading=rel;
   const accOk=!(Number.isFinite(acc)&&(acc<0||acc>40));
   // webkitCompassHeading follows the back-camera direction while the phone is held up
   // (camera near the horizon). Use only that zone, and not during fast turns where the
   // compass lags behind the gyroscope.
   if(hasCompass&&accOk&&Math.abs(pitch)<50&&turning<4){
    const target=wrap(rel-(compass+f.declination));
    if(f.yawOffset==null){f.yawOffset=target}
    else{
     const early=now-f.startedAt<2500||f.compassSamples<20;
     let k=early?.15:.025;if(Number.isFinite(acc)&&acc>0)k*=Math.min(1,12/acc);
     f.yawOffset=wrap(f.yawOffset+wrap(target-f.yawOffset)*k);
    }
    f.compassSamples++;
   }
   yaw=f.yawOffset??0;
  }
  const target=qNorm(qMul(qAxis(0,0,1,yaw),q));
  // Adaptive smoothing: strong for small jitter, near-instant for real movement.
  if(!f.smooth)f.smooth=target;
  else{const ang=qAngle(f.smooth,target);f.smooth=ang>25?target:qNorm(qSlerp(f.smooth,target,Math.min(1,.18+ang/6)))}
  const fwd=qRotate(f.smooth,{x:0,y:0,z:-1});
  return{
   matrix:qToMatrix(qConj(f.smooth)),forward:fwd,heading:headingOf(fwd),pitch:Math.asin(clamp(fwd.z))/R,roll:e.gamma,
   mode:f.mode,northReady:f.mode==="absolute"||(f.mode==="ios-compass"&&f.yawOffset!=null),
   declination:f.declination,compassAccuracy:f.compassAccuracy,yawOffset:f.yawOffset
  };
 };
 return f;
}

let fusion=null,declination=0;
/** Magnetic declination (deg, east positive) for the current observer; see wmm.js. */
export function setDeclination(deg){declination=Number.isFinite(deg)?deg:0;sensorState.declination=declination;if(fusion)fusion.declination=declination}

export async function startSensors(onUpdate){
 if(!("DeviceOrientationEvent" in window))throw new Error("Η συσκευή δεν υποστηρίζει αισθητήρες προσανατολισμού.");
 if(typeof DeviceOrientationEvent.requestPermission==="function"){
  let r;try{r=await DeviceOrientationEvent.requestPermission()}catch{throw new Error("iPhone: ενεργοποίησε Πρόσβαση σε κίνηση και προσανατολισμό για το Safari και ξαναπάτησε 🧭.")}
  if(r!=="granted")throw new Error("iPhone: δεν δόθηκε άδεια Κίνησης & Προσανατολισμού.");
 }
 stopSensors();
 fusion=createFusion();fusion.declination=declination;
 const handler=e=>{
  const screenAngle=window.screen?.orientation?.angle ?? window.orientation ?? 0;
  const s=fusion.update(e,screenAngle,performance.now());if(!s)return;
  Object.assign(sensorState,s,{supported:true,active:true});
  onUpdate?.({...sensorState});
 };
 for(const name of ["deviceorientationabsolute","deviceorientation"]){
  if(name==="deviceorientationabsolute"&&!("ondeviceorientationabsolute" in window))continue;
  window.addEventListener(name,handler,true);listeners.push([name,handler]);
 }
 return sensorState;
}
export function stopSensors(){
 for(const [name,h] of listeners)window.removeEventListener(name,h,true);
 listeners=[];fusion=null;
 sensorState.active=false;sensorState.matrix=null;sensorState.forward=null;sensorState.northReady=false;sensorState.mode=null;
}
