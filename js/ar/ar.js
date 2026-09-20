let stream=null;
export async function startAR(video){
 if(!navigator.mediaDevices?.getUserMedia)throw new Error("Η κάμερα δεν υποστηρίζεται.");
 stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
 video.srcObject=stream;await video.play();return true;
}
export function stopAR(video){stream?.getTracks().forEach(t=>t.stop());stream=null;if(video)video.srcObject=null;}
export const AR_VERSION="0.1-camera-overlay";