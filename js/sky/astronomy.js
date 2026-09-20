import {BRIGHT_STARS} from "./stars.js";
const BODIES=[
["Sun","Ήλιος","#fbbf24","sun"],["Moon","Σελήνη","#f8fafc","moon"],["Mercury","Ερμής","#cbd5e1","planet"],["Venus","Αφροδίτη","#fde68a","planet"],["Mars","Άρης","#fb7185","planet"],["Jupiter","Δίας","#fdba74","planet"],["Saturn","Κρόνος","#fef08a","planet"],["Uranus","Ουρανός","#67e8f9","planet"],["Neptune","Ποσειδώνας","#60a5fa","planet"]
];
export function calculateSky(date,coords){
 if(!window.Astronomy) throw new Error("Astronomy Engine δεν φορτώθηκε");
 const observer=new Astronomy.Observer(coords.lat,coords.lon,0);
 const bodies=BODIES.map(([id,name,color,type])=>{const eq=Astronomy.Equator(Astronomy.Body[id],date,observer,true,true);const h=Astronomy.Horizon(date,observer,eq.ra,eq.dec,"normal");return{id,name,color,type,altitude:h.altitude,azimuth:h.azimuth};});
 const stars=BRIGHT_STARS.map(([id,name,ra,dec,mag])=>{const h=Astronomy.Horizon(date,observer,ra,dec,"normal");return{id,name,type:"star",mag,altitude:h.altitude,azimuth:h.azimuth};});
 return [...stars,...bodies];
}