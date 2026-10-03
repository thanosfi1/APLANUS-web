export const sensorState={supported:false,active:false,matrix:null,heading:null,pitch:null,roll:null,forward:null};
let listener=null,eventName=null;
const R=Math.PI/180,norm=n=>(n%360+360)%360;
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
function qToMatrix(q){q=qNorm(q);const {w,x,y,z}=q;return[
 1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w),
 2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w),
 2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)
]}
export function applyMatrix(m,v){return{x:m[0]*v.x+m[1]*v.y+m[2]*v.z,y:m[3]*v.x+m[4]*v.y+m[5]*v.z,z:m[6]*v.x+m[7]*v.y+m[8]*v.z}}
export async function startSensors(onUpdate){
 if(!("DeviceOrientationEvent" in window))throw new Error("Η συσκευή δεν υποστηρίζει αισθητήρες προσανατολισμού.");
 if(typeof DeviceOrientationEvent.requestPermission==="function"){
  let r;try{r=await DeviceOrientationEvent.requestPermission()}catch{throw new Error("iPhone: ενεργοποίησε Πρόσβαση σε κίνηση και προσανατολισμό για το Safari και ξαναπάτησε 🧭.")}
  if(r!=="granted")throw new Error("iPhone: δεν δόθηκε άδεια Κίνησης & Προσανατολισμού.");
 }
 stopSensors();listener=e=>{
  if(e.beta==null||e.gamma==null)return;
  const alpha=typeof e.alpha==="number"?e.alpha:0;
  const screenAngle=window.screen?.orientation?.angle ?? window.orientation ?? 0;
  // W3C intrinsic Z-X'-Y'': q = qZ(alpha) qX(beta) qY(gamma).
  let q=qMul(qMul(qAxis(0,0,1,alpha),qAxis(1,0,0,e.beta)),qAxis(0,1,0,e.gamma));
  // Device -> back-camera frame and current screen orientation, kept as quaternion.
  q=qMul(q,qAxis(1,0,0,-90));
  q=qMul(q,qAxis(0,0,1,-screenAngle));
  q=qNorm(q);
  let forward=qRotate(q,{x:0,y:0,z:-1});
  let heading=norm(Math.atan2(forward.x,forward.y)/R);
  let pitch=Math.asin(clamp(forward.z))/R;
  // iOS compass supplies a stable north reference when the sight line is not vertical.
  if(typeof e.webkitCompassHeading==="number"&&Math.abs(forward.z)<.96){
   const delta=((e.webkitCompassHeading-heading+540)%360)-180;
   q=qNorm(qMul(qAxis(0,0,1,delta),q));
   forward=qRotate(q,{x:0,y:0,z:-1});
   heading=norm(Math.atan2(forward.x,forward.y)/R);
   pitch=Math.asin(clamp(forward.z))/R;
  }
  // q maps camera -> world; conjugate maps fixed world vectors -> camera.
  sensorState.matrix=qToMatrix(qConj(q));
  sensorState.supported=true;sensorState.active=true;sensorState.heading=heading;sensorState.pitch=pitch;sensorState.roll=e.gamma;sensorState.forward=forward;
  onUpdate?.({...sensorState});
 };
 eventName="deviceorientation";window.addEventListener(eventName,listener,true);return sensorState;
}
export function stopSensors(){if(listener&&eventName)window.removeEventListener(eventName,listener,true);listener=null;eventName=null;sensorState.active=false;sensorState.matrix=null;sensorState.forward=null}
