export const sensorState={supported:false,active:false,heading:null,pitch:null,roll:null};
let listener=null,eventName=null,last={heading:null,pitch:null};
const norm=n=>(n%360+360)%360;
const angleLerp=(a,b,t)=>a==null?b:norm(a+((((b-a)+540)%360)-180)*t);
export async function startSensors(onUpdate){
 if(!("DeviceOrientationEvent" in window)) throw new Error("Η συσκευή δεν υποστηρίζει αισθητήρες προσανατολισμού.");
 if(typeof DeviceOrientationEvent.requestPermission==="function"){const r=await DeviceOrientationEvent.requestPermission();if(r!=="granted")throw new Error("Δεν δόθηκε άδεια για πυξίδα/γυροσκόπιο.");}
 stopSensors();
 listener=e=>{
  let rawHeading=null;
  if(typeof e.webkitCompassHeading==="number") rawHeading=norm(e.webkitCompassHeading);
  else if(typeof e.alpha==="number") rawHeading=norm(360-e.alpha);
  if(rawHeading===null)return;
  const beta=typeof e.beta==="number"?e.beta:90;
  const gamma=typeof e.gamma==="number"?e.gamma:0;
  // Back-camera optical axis: screen tilt must move the sky opposite to the phone tilt.\n  // Portrait vertical ≈ horizon; tilting camera upward increases the viewed altitude.
  let rawPitch=90-Math.abs(beta);
  if(beta<0)rawPitch=-rawPitch;
  rawPitch=Math.max(-90,Math.min(90,rawPitch));
  last.heading=angleLerp(last.heading,rawHeading,.22);
  last.pitch=last.pitch==null?rawPitch:last.pitch+(rawPitch-last.pitch)*.22;
  sensorState.supported=true;sensorState.active=true;sensorState.heading=last.heading;sensorState.pitch=last.pitch;sensorState.roll=gamma;
  onUpdate?.({...sensorState});
 };
 eventName=("ondeviceorientationabsolute" in window)?"deviceorientationabsolute":"deviceorientation";
 window.addEventListener(eventName,listener,true);return sensorState;
}
export function stopSensors(){if(listener&&eventName)window.removeEventListener(eventName,listener,true);listener=null;eventName=null;last={heading:null,pitch:null};sensorState.active=false;}