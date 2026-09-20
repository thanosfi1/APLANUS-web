const BODIES=[
  ["Sun","Ήλιος","#fbbf24"],["Moon","Σελήνη","#f8fafc"],["Mercury","Ερμής","#cbd5e1"],
  ["Venus","Αφροδίτη","#fde68a"],["Mars","Άρης","#fb7185"],["Jupiter","Δίας","#fdba74"],
  ["Saturn","Κρόνος","#fef08a"],["Uranus","Ουρανός","#67e8f9"],["Neptune","Ποσειδώνας","#60a5fa"]
];
export function calculateSky(date,coords){
  if(!window.Astronomy) throw new Error("Astronomy Engine δεν φορτώθηκε");
  const observer=new Astronomy.Observer(coords.lat,coords.lon,0);
  return BODIES.map(([id,name,color])=>{
    const body=Astronomy.Body[id];
    const eq=Astronomy.Equator(body,date,observer,true,true);
    const h=Astronomy.Horizon(date,observer,eq.ra,eq.dec,"normal");
    return {id,name,color,altitude:h.altitude,azimuth:h.azimuth,ra:eq.ra,dec:eq.dec};
  });
}