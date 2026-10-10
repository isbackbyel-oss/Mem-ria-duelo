(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
const menu=$("menu");
if(!menu||!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const BR=()=>new Date(Date.now()-3*36e5).toISOString().slice(0,10);
const ONT=()=>new Date(Date.now()-27*36e5).toISOString().slice(0,10);
const fmt=n=>(n||0).toLocaleString("pt-BR");
const css=document.createElement("style");
css.textContent=`#mcBar{display:flex;gap:10px;justify-content:center}.mc{display:flex;align-items:center;gap:8px;padding:4px 6px 4px 12px;border-radius:20px;border:2px solid #2a6fd0;background:rgba(10,24,70,.85);color:#fff;font-weight:800;min-height:40px;box-shadow:none}.mc i{font-style:normal;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#19c96b;color:#fff}.mt{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 120px);transform:translateX(-50%);z-index:96;padding:8px 16px;border-radius:14px;background:#0b6fd8;color:#fff;font-weight:800;animation:pop .3s ease-out;white-space:nowrap}.lgd{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;width:100%;max-width:360px}.lgd div{padding:8px 0;border-radius:10px;border:2px solid #1e5f9e;background:rgba(14,34,64,.8);text-align:center;font-size:.7rem}.lgd .at{border-color:#ffb020;box-shadow:0 0 12px rgba(255,176,32,.7)}.lgd .ok{opacity:.55}`;
document.head.appendChild(css);
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};

// ===== contadores no topo da tela inicial =====
const bar=document.createElement("div");bar.id="mcBar";
bar.innerHTML='<button class="mc" id="mcM">🪙 <b id="mcMv">0</b><i>+</i></button><button class="mc" id="mcD">💎 <b id="mcDv">0</b><i>+</i></button>';
menu.insertBefore(bar,menu.firstChild);
$("mcM").onclick=$("mcD").onclick=()=>toast("🛒 A loja chega na próxima fase!");

// ===== carteira (Firebase) =====
let FB=null,W=null,REF=null,fila=Promise.resolve();
async function fb(){
  if(!FB){
    const U="https://www.gstatic.com/firebasejs/10.12.2/";
    const P=await import(U+"firebase-app.js"),F=await import(U+"firebase-firestore.js"),T=await import(U+"firebase-auth.js");
    const app=P.getApp();FB={F,db:F.getFirestore(app),auth:T.getAuth(app)};
  }
  if(!FB.auth.currentUser)await new Promise(r=>{let n=0;const t=setInterval(()=>{if(FB.auth.currentUser||++n>40){clearInterval(t);r()}},250)});
  if(!FB.auth.currentUser)throw new Error("sem conta");
  return FB;
}
const pintar=()=>{if(W){$("mcMv").textContent=fmt(W.m);$("mcDv").textContent=fmt(W.d)}};
async function carteira(){
  if(W)return;
  await fb();const{F,db,auth}=FB;
  REF=F.doc(db,"carteiras",auth.currentUser.uid);
  const s=await F.getDoc(REF);
  if(s.exists())W=Object.assign({m:0,d:0,g:0,gd:0,dia:"",ld:"",ln:0},s.data());
  else{W={m:0,d:0,g:0,gd:0,dia:BR(),ld:"",ln:0};await F.setDoc(REF,W)}
  pintar();
}
function ganhar(m,d,extra){
  const p=fila.then(async()=>{
    try{
      await carteira();
      const hj=BR(),mesmo=W.dia===hj,g=mesmo?W.g:0,gd=mesmo?W.gd:0,pedido=m;
      m=Math.max(0,Math.min(m,150,1000-g));d=Math.max(0,Math.min(d,3,5-gd));
      if(pedido>0&&m===0)toast("Limite diário de moedas atingido");
      if(!m&&!d&&!extra)return{m:0,d:0};
      const n=Object.assign({},W,{m:W.m+m,d:W.d+d,g:g+m,gd:gd+d,dia:hj},extra||{});
      await FB.F.updateDoc(REF,n);
      W=n;pintar();
      if(m||d)toast("+"+(m?"🪙"+fmt(m):"")+(m&&d?" ":"")+(d?"💎"+d:""));
      return{m:m,d:d};
    }catch(e){return{m:0,d:0,erro:1}}
  });
  fila=p.catch(()=>{});
  return p;
}
window.MOEDAS={ganhar:ganhar,saldo:()=>W};
setTimeout(()=>carteira().catch(()=>{}),2500);

// ===== recompensa de login (ciclo de 7 dias) =====
const CICLO=[[20,0],[30,0],[40,0],[50,0],[60,0],[80,0],[100,2]];
let mostrou=false;
function login(){
  if(mostrou||!W||W.ld===BR()||!menu.classList.contains("on"))return;
  mostrou=true;
  const ln=W.ld===ONT()?(W.ln%7)+1:1,c=CICLO[ln-1];
  const ov=document.createElement("div");
  ov.style.cssText="position:fixed;inset:0;z-index:85;background:rgba(4,10,22,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center";
  ov.innerHTML='<div style="font-size:3rem">🎁</div><b style="font-size:1.4rem">Recompensa de login</b><div>Dia '+ln+' de 7 — volte amanhã para o próximo prêmio!</div><div class="lgd">'
    +CICLO.map((x,i)=>'<div class="'+(i+1===ln?"at":i+1<ln?"ok":"")+'">Dia '+(i+1)+"<br>🪙"+x[0]+(x[1]?"<br>💎"+x[1]:"")+(i+1<ln?"<br>✔":"")+"</div>").join("")
    +'</div><button id="lgR" class="opc big"><span class="tx"><b>Receber 🪙'+c[0]+(c[1]?" + 💎"+c[1]:"")+"</b></span></button>";
  document.body.appendChild(ov);
  $("lgR").onclick=async()=>{
    $("lgR").disabled=true;
    const r=await ganhar(c[0],c[1],{ld:BR(),ln:ln});
    ov.remove();if(r.erro)mostrou=false;
  };
}
setInterval(login,3000);

// ===== missões do dia =====
setInterval(()=>{
  const e=$("msN");if(!W||!e)return;
  const n=parseInt(e.textContent)||0;
  let dd="";try{dd=JSON.parse(ls("viciante")||"{}").dia||""}catch(x){}
  if(!dd)return;
  const k="mp_"+dd,pago=+ls(k)||0;
  if(n>pago){ss(k,n);ganhar(30*(n-pago),(pago<3&&n>=3)?1:0)}
},2500);

// ===== subir de patente =====
const ORD=["Bronze","Prata","Ouro","Platina","Diamante","Heroico","Mestre"];
setInterval(()=>{
  if(!W)return;
  const t=txt("cartao").split(" · "),i=ORD.indexOf((t[t.length-2]||"").trim());
  if(i<0)return;
  const g=ls("patMax");
  if(g===null){ss("patMax",i);return}
  if(i>+g){ss("patMax",i);ganhar(200,i>=2?2:1)}
},3000);

// ===== fim de partida online =====
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
  const op=txt("n1").replace(/\s*\d+🔥\s*$/,"").trim().toLowerCase(),hj=BR();
  let O={};try{O=JSON.parse(ls("opd")||"{}")}catch(e){}
  if(O.dia!==hj)O={dia:hj};
  if((O[op]||0)>=5){toast("Limite de moedas com este adversário hoje");return}
  O[op]=(O[op]||0)+1;ss("opd",JSON.stringify(O));
  const venceu=/^Você ganhou/.test(s);
  let m=Math.round((venceu?50:/^Empate/.test(s)?20:10)*MULT(modo));
  if(venceu&&ls("pv")!==hj){m+=25;ss("pv",hj)}
  ganhar(m,0).then(r=>{if(r&&r.m)$("status").textContent+=" · +🪙"+r.m});
},1000);
})();
