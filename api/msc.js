export default async function handler(req,res){
res.setHeader("Cache-Control","s-maxage=604800, stale-while-revalidate=86400");
const ra=Number(req.query.ra),dec=Number(req.query.dec);if(!Number.isFinite(ra)||!Number.isFinite(dec))return res.status(400).json({error:"bad coordinates"});
try{
 const radius=0.02;
 const url="https://www.ctio.noirlab.edu/~atokovin/stars/";
 // MSC is a physical 3+ hierarchy catalog. Query its public interface by coordinates is not a stable API,
 // so use CDS VizieR TAP mirror of the Updated MSC for browser-safe structured matching.
 const adql="SELECT TOP 5 * FROM \"J/ApJS/235/6/comp\" WHERE 1=CONTAINS(POINT('ICRS',RAJ2000,DEJ2000),CIRCLE('ICRS',"+ra+","+dec+","+radius+"))";
 const tap="https://tapvizier.cds.unistra.fr/TAPVizieR/tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY="+encodeURIComponent(adql);
 const r=await fetch(tap);if(!r.ok)throw new Error("MSC TAP "+r.status);const j=await r.json();const rows=j.data||[],meta=(j.metadata||[]).map(x=>x.name);
 if(!rows.length)return res.status(200).json({found:false});
 const idx=n=>meta.findIndex(x=>String(x).toLowerCase()===n.toLowerCase());
 const ni=idx("Ncomp"),si=idx("SpT"),wi=idx("WDS");
 let members=0,spectral=[];for(const row of rows){if(ni>=0)members=Math.max(members,Number(row[ni])||0);if(si>=0&&row[si])spectral.push(String(row[si]))}
 if(members<3)members=3;
 return res.status(200).json({found:true,members:Math.min(7,members),spectral:[...new Set(spectral)].slice(0,7),id:wi>=0?rows[0][wi]:null,source:"MSC"});
}catch(e){return res.status(502).json({error:String(e.message||e)})}
}