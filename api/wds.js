export default async function handler(req,res){
  res.setHeader("Cache-Control","s-maxage=604800, stale-while-revalidate=86400");
  const ra=Number(req.query.ra),dec=Number(req.query.dec);
  if(!Number.isFinite(ra)||!Number.isFinite(dec)) return res.status(400).json({error:"bad coordinates"});
  const q="SELECT TOP 30 wds,component_id,spect_type,ra,dec FROM wds WHERE 1=CONTAINS(POINT('ICRS',ra,dec),CIRCLE('ICRS',"+ra+","+dec+",0.0083333333))";
  const u="https://heasarc.gsfc.nasa.gov/xamin/vo/tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY="+encodeURIComponent(q);
  try{
    const r=await fetch(u); if(!r.ok) throw new Error("HEASARC "+r.status);
    const j=await r.json(), rows=j.data||[], meta=(j.metadata||[]).map(x=>x.name);
    const idx=n=>meta.findIndex(x=>String(x).toLowerCase()===n), wi=idx("wds"),ci=idx("component_id"),si=idx("spect_type");
    if(!rows.length)return res.status(200).json({found:false,members:1,spectral:[]});
    const groups={}; for(const row of rows){const id=row[wi]||"unknown";(groups[id]??=[]).push(row)}
    const best=Object.values(groups).sort((a,b)=>b.length-a.length)[0];
    const labels=new Set(["A"]); const spectral=[];
    for(const row of best){const c=String(row[ci]||"AB").replace(/[^A-Z]/g,""); for(const ch of c)labels.add(ch); const sp=String(row[si]||"").split(/[+\/]/).filter(Boolean); spectral.push(...sp)}
    return res.status(200).json({found:true,members:Math.max(2,labels.size),spectral:[...new Set(spectral)].slice(0,6),wds:best[0][wi]});
  }catch(e){return res.status(502).json({error:String(e.message||e)})}
}