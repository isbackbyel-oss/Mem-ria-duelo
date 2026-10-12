(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
const rv=$("rv"),tabs=rv&&rv.querySelector(".tabs2");
if(!rv||!tabs||!$("rvL")||!$("cartao"))return;
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2400)};
const semDe=d=>{const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())),w=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-w);const y=t.getUTCFullYear(),n=Math.ceil(((t-Date.UTC(y,0,1))/864e5+1)/7);return y+"-W"+String(n).padStart(2,"0")};
const SEM=()=>semDe(new Date(Date.now()-3*36e5));
const ANT=()=>semDe(new Date(Date.now()-3*36e5-7*864e5));
const nome=()=>{const t=txt("cartao").split(" · ");return t.slice(0,Math.max(1,t.length-2)).join(" · ").trim()};
let FB=null,P=0,REF=null,fila=Promise.resolve();
async function fb(){
  if(!FB){
    const U="https://www.gstatic.com/firebasejs/10.12.2/";
    const A=await import(U+"firebase-app.js"),F=await import(U+"firebase-firestore.js"),T=await import(U+"firebase-auth.js");
    const app=A.getApp();FB={F,db:F.getFirestore(app),auth:T.getAuth(app)};
  }
  if(!FB.auth.currentUser)await new Promise(r=>{let n=0;const t=setInterval(()=>{if(FB.auth.currentUser||++n>40){clearInterval(t);r()}},250)});
  if(!FB.auth.currentUser)throw new Error("sem conta");
  return FB;
}

// ===== pontos da semana =====
async function carrega(){
  await fb();const{F,db,auth}=FB;
  REF=F.doc(db,"semanal",SEM()+"_"+auth.currentUser.uid);
  const s=await F.getDoc(REF);P=s.exists()?(s.data().p||0):0;
}
function somar(x){
  fila=fila.then(async()=>{
    try{
      if(!REF||REF.id.indexOf(SEM())!==0)await carrega();
      const n=P+x;
      await FB.F.setDoc(REF,{w:SEM(),n:nome(),p:n});P=n;
    }catch(e){}
  });
}
const MULT=s=>/Liga/.test(s)?2:/Ranqueada/.test(s)?1.5:1;
let ini=null,feito=false;
setInterval(()=>{
  const j=$("jogo"),ag=$("again"),on=!!(j&&j.classList.contains("on")),fim=on&&ag&&ag.style.display==="block";
  if(!on){ini=null;feito=false;return}
  if(!fim){if(ini===null)ini=Date.now();feito=false;return}
  if(feito)return;
  feito=true;
  const dur=ini?(Date.now()-ini)/1000:0;ini=null;
  const modo=txt("modoTxt"),s=txt("status");
  if(/Treino/.test(modo)||/Robô/.test(txt("n1"))||dur<20)return;
  const op=txt("n1").replace(/\s*\d+🔥\s*$/,"").trim().toLowerCase(),hj=new Date(Date.now()-3*36e5).toISOString().slice(0,10);
  let O={};try{O=JSON.parse(ls("opw")||"{}")}catch(e){}
  if(O.dia!==hj)O={dia:hj};
  if((O[op]||0)>=8)return;
  O[op]=(O[op]||0)+1;ss("opw",JSON.stringify(O));
  const b=/^Você ganhou/.test(s)?10:/^Empate/.test(s)?4:2;
  const x=Math.min(30,Math.round(b*MULT(modo)));
  somar(x);toast("📅 +"+x+" pts na semana");
},1000);

// ===== aba Semanal no Ranking =====
const bS=document.createElement("button");bS.id="rtS";bS.textContent="📅 Semanal";tabs.appendChild(bS);
const box=document.createElement("div");box.id="rvS";box.style.display="none";$("rvL").after(box);
function sair(){bS.classList.remove("on");box.style.display="none";$("rvL").style.display=""}
["rtG","rtA"].forEach(i=>{const b=$(i);if(b)b.addEventListener("click",sair)});
bS.onclick=()=>{
  ["rtG","rtA"].forEach(i=>{const b=$(i);if(b)b.classList.remove("on")});
  bS.classList.add("on");$("rvL").style.display="none";box.style.display="";lista();
};
async function lista(){
  box.innerHTML='<div class="rw">Carregando…</div>';
  try{
    await fb();const{F,db,auth}=FB,u=auth.currentUser.uid;
    const s=await F.getDocs(F.query(F.collection(db,"semanal"),F.where("w","==",SEM())));
    const L=s.docs.map(d=>({u:d.id.split("_")[1],p:d.data().p||0,n:d.data().n||"?"})).filter(x=>x.p>0).sort((a,b)=>b.p-a.p||(a.n<b.n?-1:1));
    const dia=new Date(Date.now()-3*36e5).getUTCDay()||7,falta=8-dia;
    const med=["🥇","🥈","🥉"];
    box.innerHTML='<p class="nota">Semana '+SEM().slice(5)+" · termina em "+falta+" dia"+(falta===1?"":"s")+"</p>"
      +(L.length?L.slice(0,20).map((x,i)=>'<div class="rw'+(x.u===u?" me":"")+'"><span class="n">'+(med[i]||(i+1))+'</span><span class="av2">'+H((x.n[0]||"?").toUpperCase())+'</span><span class="m"><b>'+H(x.n)+(x.u===u?" (você)":"")+'</b></span><span class="p">'+x.p+" pts</span></div>").join(""):'<div class="rw">Ninguém pontuou ainda. Jogue online para entrar!</div>')
      +'<p class="nota">Pontos: vitória 10 · empate 4 · derrota 2 (Ranqueada ×1,5 · Liga ×2). Prêmio no fim da semana: 🥇 💎3 · 🥈 💎2 · 🥉 💎1</p>';
  }catch(e){box.innerHTML='<div class="rw">Não foi possível carregar.</div>'}
}

// ===== prêmio da semana passada (top 3) =====
async function premio(){
  const ant=ANT();
  if(ls("sr_"+ant))return;
  const M=window.MOEDAS;if(!M||!M.saldo())return;
  try{
    await fb();const{F,db,auth}=FB;
    const s=await F.getDocs(F.query(F.collection(db,"semanal"),F.where("w","==",ant)));
    const L=s.docs.map(d=>({u:d.id.split("_")[1],p:d.data().p||0,n:d.data().n||""})).sort((a,b)=>b.p-a.p||(a.n<b.n?-1:1));
    const i=L.findIndex(x=>x.u===auth.currentUser.uid);
    if(i<0||i>2||L[i].p<=0){ss("sr_"+ant,"1");return}
    const r=await M.ganhar(0,[3,2,1][i]);
    if(r&&r.d>0){ss("sr_"+ant,"1");toast("🏆 Prêmio da semana: "+["🥇","🥈","🥉"][i]+" 💎"+r.d)}
  }catch(e){}
}
setTimeout(premio,9000);
})();
