export const sensorState={supported:false,active:false,heading:null,pitch:null,roll:null};
let listener=null;
const norm=n=>(n%360+360)%360;
export async function startSensors(onUpdate){
 if(!("DeviceOrientationEvent" in window)) throw new Error("Η συσκευή δεν υποστηρίζει αισθητήρες προσανατολισμού.");
 if(typeof DeviceOrientationEvent.requestPermission==="function"){
  const result=await DeviceOrientationEvent.requestPermission();
  if(result!=="granted") throw new Error("Δεν δόθηκε άδεια για πυξίδα/γυροσκόπιο.");
 }
 if(listener) window.removeEventListener("deviceorientation",listener,true);
 listener=e=>{
  let heading=null;
  if(typeof e.webkitCompassHeading==="number") heading=e.webkitCompassHeading;
  else if(typeof e.alpha==="number") heading=norm(360-e.alpha);
  if(heading===null)return;
  const pitch=Math.max(-90,Math.min(90,typeof e.beta==="number"?e.beta:0));
  sensorState.supported=true;sensorState.active=true;sensorState.heading=heading;sensorState.pitch=pitch;sensorState.roll=e.gamma??0;
  onUpdate?.({...sensorState});
 };
 window.addEventListener("deviceorientationabsolute" in window?"deviceorientationabsolute":"deviceorientation",listener,true);
 return sensorState;
}
export function stopSensors(){if(listener)window.removeEventListener("deviceorientation",listener,true);listener=null;sensorState.active=false;}