export const sensorState={supported:false,active:false,matrix:null,heading:null,pitch:null,roll:null};
let listener=null,eventName=null;
const R=Math.PI/180,norm=n=>(n%360+360)%360;
function mul(a,b){const r=Array(9).fill(0);for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)r[i*3+j]+=a[i*3+k]*b[k*3+j];return r}
function rotZ(a){a*=R;return[Math.cos(a),-Math.sin(a),0,Math.sin(a),Math.cos(a),0,0,0,1]}
function rotX(a){a*=R;return[1,0,0,0,Math.cos(a),-Math.sin(a),0,Math.sin(a),Math.cos(a)]}
function rotY(a){a*=R;return[Math.cos(a),0,Math.sin(a),0,1,0,-Math.sin(a),0,Math.cos(a)]}
function transpose(m){return[m[0],m[3],m[6],m[1],m[4],m[7],m[2],m[5],m[8]]}
export function applyMatrix(m,v){return{x:m[0]*v.x+m[1]*v.y+m[2]*v.z,y:m[3]*v.x+m[4]*v.y+m[5]*v.z,z:m[6]*v.x+m[7]*v.y+m[8]*v.z}}
export async function startSensors(onUpdate){
 if(!("DeviceOrientationEvent" in window))throw new Error("Η συσκευή δεν υποστηρίζει αισθητήρες προσανατολισμού.");
 if(typeof DeviceOrientationEvent.requestPermission==="function"){const r=await DeviceOrientationEvent.requestPermission();if(r!=="granted")throw new Error("Δεν δόθηκε άδεια για πυξίδα/γυροσκόπιο.");}
 stopSensors();listener=e=>{
  if(e.beta==null||e.gamma==null)return;
  const screen=(screen.orientation?.angle||window.orientation||0);
  // W3C intrinsic Z-X'-Y'' device orientation, corrected to portrait screen coordinates.
  const alpha=(typeof e.alpha==="number")?e.alpha:0;
  let device=mul(mul(rotZ(alpha),rotX(e.beta)),rotY(e.gamma));
  device=mul(device,rotZ(-screen));
  // Camera looks through the back of the phone: camera basis in world coordinates.
  const cameraToWorld=mul(device,rotX(-90));
  const worldToCamera=transpose(cameraToWorld);
  const forward=applyMatrix(cameraToWorld,{x:0,y:0,z:-1});
  let heading=norm(Math.atan2(forward.x,forward.y)/R),pitch=Math.asin(Math.max(-1,Math.min(1,forward.z)))/R;
  if(typeof e.webkitCompassHeading==="number"){
    const delta=((e.webkitCompassHeading-heading+540)%360)-180;
    heading=norm(heading+delta);
    // Rotate world-to-camera around world vertical by magnetic correction.
    const corr=rotZ(-delta); sensorState.matrix=mul(worldToCamera,corr);
  }else sensorState.matrix=worldToCamera;
  sensorState.supported=true;sensorState.active=true;sensorState.heading=heading;sensorState.pitch=pitch;sensorState.roll=e.gamma;
  onUpdate?.({...sensorState});
 };
 // "deviceorientationabsolute" exists inconsistently on mobile browsers and may never emit.
 // deviceorientation is the reliable event; iOS supplies webkitCompassHeading when available.
 eventName="deviceorientation";window.addEventListener(eventName,listener,true);
 // Mark active only after the first real sensor event; caller can detect a silent sensor.
 return sensorState;
}
export function stopSensors(){if(listener&&eventName)window.removeEventListener(eventName,listener,true);listener=null;eventName=null;sensorState.active=false;sensorState.matrix=null}