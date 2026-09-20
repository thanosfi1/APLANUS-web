const FALLBACK={lat:40.6401,lon:22.9444,source:"fallback"};
export async function getObserver(){
  if(!("geolocation" in navigator)) return FALLBACK;
  return new Promise(resolve=>navigator.geolocation.getCurrentPosition(
    p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude,accuracy:p.coords.accuracy,source:"gps"}),
    ()=>resolve(FALLBACK),
    {enableHighAccuracy:true,timeout:8000,maximumAge:60000}
  ));
}