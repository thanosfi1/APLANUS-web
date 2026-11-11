// Magnetic declination from the World Magnetic Model WMM2025 (valid 2025.0-2030.0).
// Coefficients: NOAA NCEI Geomagnetic Modeling Team & British Geological Survey (2024),
// World Magnetic Model 2025, https://doi.org/10.25921/aqfd-sd83 — public domain.
// Rows: n,m,g,h,gDot,hDot (nT, nT/year), epoch 2025.0.
const EPOCH=2025.0,COEF="1,0,-29351.8,0,12,0;1,1,-1410.8,4545.4,9.7,-21.5;2,0,-2556.6,0,-11.6,0;2,1,2951.1,-3133.6,-5.2,-27.7;2,2,1649.3,-815.1,-8,-12.1;3,0,1361,0,-1.3,0;3,1,-2404.1,-56.6,-4.2,4;3,2,1243.8,237.5,0.4,-0.3;3,3,453.6,-549.5,-15.6,-4.1;4,0,895,0,-1.6,0;4,1,799.5,278.6,-2.4,-1.1;4,2,55.7,-133.9,-6,4.1;4,3,-281.1,212,5.6,1.6;4,4,12.1,-375.6,-7,-4.4;5,0,-233.2,0,0.6,0;5,1,368.9,45.4,1.4,-0.5;5,2,187.2,220.2,0,2.2;5,3,-138.7,-122.9,0.6,0.4;5,4,-142,43,2.2,1.7;5,5,20.9,106.1,0.9,1.9;6,0,64.4,0,-0.2,0;6,1,63.8,-18.4,-0.4,0.3;6,2,76.9,16.8,0.9,-1.6;6,3,-115.7,48.8,1.2,-0.4;6,4,-40.9,-59.8,-0.9,0.9;6,5,14.9,10.9,0.3,0.7;6,6,-60.7,72.7,0.9,0.9;7,0,79.5,0,0,0;7,1,-77,-48.9,-0.1,0.6;7,2,-8.8,-14.4,-0.1,0.5;7,3,59.3,-1,0.5,-0.8;7,4,15.8,23.4,-0.1,0;7,5,2.5,-7.4,-0.8,-1;7,6,-11.1,-25.1,-0.8,0.6;7,7,14.2,-2.3,0.8,-0.2;8,0,23.2,0,-0.1,0;8,1,10.8,7.1,0.2,-0.2;8,2,-17.5,-12.6,0,0.5;8,3,2,11.4,0.5,-0.4;8,4,-21.7,-9.7,-0.1,0.4;8,5,16.9,12.7,0.3,-0.5;8,6,15,0.7,0.2,-0.6;8,7,-16.8,-5.2,0,0.3;8,8,0.9,3.9,0.2,0.2;9,0,4.6,0,0,0;9,1,7.8,-24.8,-0.1,-0.3;9,2,3,12.2,0.1,0.3;9,3,-0.2,8.3,0.3,-0.3;9,4,-2.5,-3.3,-0.3,0.3;9,5,-13.1,-5.2,0,0.2;9,6,2.4,7.2,0.3,-0.1;9,7,8.6,-0.6,-0.1,-0.2;9,8,-8.7,0.8,0.1,0.4;9,9,-12.9,10,-0.1,0.1;10,0,-1.3,0,0.1,0;10,1,-6.4,3.3,0,0;10,2,0.2,0,0.1,0;10,3,2,2.4,0.1,-0.2;10,4,-1,5.3,0,0.1;10,5,-0.6,-9.1,-0.3,-0.1;10,6,-0.9,0.4,0,0.1;10,7,1.5,-4.2,-0.1,0;10,8,0.9,-3.8,-0.1,-0.1;10,9,-2.7,0.9,0,0.2;10,10,-3.9,-9.1,0,0;11,0,2.9,0,0,0;11,1,-1.5,0,0,0;11,2,-2.5,2.9,0,0.1;11,3,2.4,-0.6,0,0;11,4,-0.6,0.2,0,0.1;11,5,-0.1,0.5,-0.1,0;11,6,-0.6,-0.3,0,0;11,7,-0.1,-1.2,0,0.1;11,8,1.1,-1.7,-0.1,0;11,9,-1,-2.9,-0.1,0;11,10,-0.2,-1.8,-0.1,0;11,11,2.6,-2.3,-0.1,0;12,0,-2,0,0,0;12,1,-0.2,-1.3,0,0;12,2,0.3,0.7,0,0;12,3,1.2,1,0,-0.1;12,4,-1.3,-1.4,0,0.1;12,5,0.6,0,0,0;12,6,0.6,0.6,0.1,0;12,7,0.5,-0.1,0,0;12,8,-0.1,0.8,0,0;12,9,-0.4,0.1,0,0;12,10,-0.2,-1,-0.1,0;12,11,-1.3,0.1,0,0;12,12,-0.7,0.2,-0.1,-0.1";
const N=12,G=[],H=[],GD=[],HD=[];
for(let n=0;n<=N;n++){G[n]=Array(N+1).fill(0);H[n]=Array(N+1).fill(0);GD[n]=Array(N+1).fill(0);HD[n]=Array(N+1).fill(0)}
for(const row of COEF.split(";")){const [n,m,g,h,gd,hd]=row.split(",").map(Number);G[n][m]=g;H[n][m]=h;GD[n][m]=gd;HD[n][m]=hd}
// Schmidt semi-normalisation factors.
const S=[];for(let n=0;n<=N;n++){S[n]=Array(N+1).fill(0)}
S[0][0]=1;for(let n=1;n<=N;n++){S[n][0]=S[n-1][0]*(2*n-1)/n;for(let m=1;m<=n;m++)S[n][m]=S[n][m-1]*Math.sqrt((n-m+1)*(m===1?2:1)/(n+m))}
function decimalYear(date){const y=date.getUTCFullYear(),start=Date.UTC(y,0,1),end=Date.UTC(y+1,0,1);return y+(date.getTime()-start)/(end-start)}
/** Declination in degrees (east positive) at geodetic lat/lon (deg), altitude (km above WGS84), date. */
export function magneticDeclination(lat,lon,altKm=0,date=new Date()){
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return 0;
 const R=Math.PI/180,dt=(date instanceof Date?decimalYear(date):date)-EPOCH;
 // WGS84 geodetic -> geocentric spherical.
 const A=6378.137,F=1/298.257223563,E2=F*(2-F),RE=6371.2;
 const phi=lat*R,sp=Math.sin(phi),cp=Math.cos(phi),Rc=A/Math.sqrt(1-E2*sp*sp);
 const p=(Rc+altKm)*cp,z=(Rc*(1-E2)+altKm)*sp,r=Math.hypot(p,z),phiC=Math.asin(z/r);
 const x=Math.sin(phiC),s=Math.max(1e-12,Math.cos(phiC)),lam=lon*R,ar=RE/r;
 const P=[],dP=[];for(let n=0;n<=N;n++){P[n]=Array(N+1).fill(0);dP[n]=Array(N+1).fill(0)}
 P[0][0]=1;
 for(let n=1;n<=N;n++)for(let m=0;m<=n;m++){
  if(n===m){P[n][m]=s*P[n-1][m-1];dP[n][m]=s*dP[n-1][m-1]+x*P[n-1][m-1]}
  else if(n===1){P[n][m]=x*P[n-1][m];dP[n][m]=x*dP[n-1][m]-s*P[n-1][m]}
  else{const K=((n-1)*(n-1)-m*m)/((2*n-1)*(2*n-3));P[n][m]=x*P[n-1][m]-K*P[n-2][m];dP[n][m]=x*dP[n-1][m]-s*P[n-1][m]-K*dP[n-2][m]}
 }
 let Bt=0,Bp=0,Br=0,arn=ar*ar;
 for(let n=1;n<=N;n++){arn*=ar;
  for(let m=0;m<=n;m++){
   const g=(G[n][m]+dt*GD[n][m])*S[n][m],h=(H[n][m]+dt*HD[n][m])*S[n][m],cm=Math.cos(m*lam),sm=Math.sin(m*lam);
   Br+=(n+1)*arn*(g*cm+h*sm)*P[n][m];Bt-=arn*(g*cm+h*sm)*dP[n][m];Bp+=arn*m*(-g*sm+h*cm)*P[n][m];
  }
 }
 Bp/=-s;
 const Xs=-Bt,Ys=Bp,Zs=-Br,psi=phiC-phi;
 const X=Xs*Math.cos(psi)-Zs*Math.sin(psi),Y=Ys;
 return Math.atan2(Y,X)/R;
}
