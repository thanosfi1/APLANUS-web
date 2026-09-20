export const sensorState={supported:false,active:false,heading:null,pitch:null,roll:null};
let listener=null,eventName=null;
const norm=n=>(n%360+360)%360;
export async function startSensors(onUpdate){
 if(!("DeviceOrientationEvent" in window)) throw new Error("Η συσκευή δεν υποστηρίζει αισθητήρες προσανατολισμού.");
 if(typeof DeviceOrientationEvent.requestPermission==="function"){
  const result=await DeviceOrientationEvent.requestPermission();
  if(result!=="granted") throw new Error("Δεν δόθηκε άδεια για πυξίδα/γυροσκόπιο.");
 }
 stopSensors();
 listener=e=>{
  let heading=null;
  if(typeof e.webkitCompassHeading==="number") heading=norm(e.webkitCompassHeading);
  else if(e.absolute===true&&typeof e.alpha==="number") heading=norm(360-e.alpha);
  else if(typeof e.alpha==="number") heading=norm(360-e.alpha);
  if(heading===null)return;
  // DeviceOrientation beta=90° when the phone is upright. Convert to line-of-sight altitude:
  // upright/vertical ≈ horizon (0°), phone tilted toward horizontal ≈ zenith (90°).
  const beta=typeof e.beta==="number"?e.beta:90;
  const pitch=Math.max(-10,Math.min(90,90-Math.abs(beta)));
  sensorState.supported=true;sensorState.active=true;sensorState.heading=heading;sensorState.pitch=pitch;sensorState.roll=e.gamma??0;
  onUpdate?.({...sensorState});
 };
 eventName=("ondeviceorientationabsolute" in window)?"deviceorientationabsolute":"deviceorientation";
 window.addEventListener(eventName,listener,true);
 return sensorState;
}
export function stopSensors(){if(listener&&eventName)window.removeEventListener(eventName,listener,true);listener=null;eventName=null;sensorState.active=false;}