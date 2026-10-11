(function(){
const $=id=>document.getElementById(id);
const sec=$("loja"),tabs=sec&&sec.querySelector(".tabs2"),lj=$("lj");
if(!sec||!tabs||!lj||!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const fmt=n=>(n||0).toLocaleString("pt-BR");
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};
const BG=[["b_galaxia","Galáxia",0,"#1a1055","#5b2bd0","🌌"],["b_floresta","Floresta",0,"#0b3d2a","#1f9d57","🌲"],["b_oceano","Oceano",0,"#04304f","#0a7bd0","🌊"],["b_arena","Arena de fogo",1,"#4a0f08","#e8481c","🔥"],["b_neon","Cidade neon",1,"#12063a","#e04bff","🌆"],["b_castelo","Castelo",2,"#1a0f2e","#ffc933","🏰"]];
const COR=["#9fb8d8","#4aa0ff","#ffc933"],NOM=["Comum","Raro","Épico"];
const PK=[{n:"Pacote Comum",s:500,sd:0,ic:"🎁",ok:[0,1],w:[70,30],p:"🪙 500"},{n:"Pacote Raro",s:1500,sd:0,ic:"🎁",ok:[1,2],w:[70,30],p:"🪙 1.500"},{n:"Pacote Épico",s:0,sd:10,ic:"💎",ok:[2],w:[100],p:"💎 10"}];
let FB=null,I2=null,C2=null,C1=null,inv2={i:[],e:""},c2={s:0,sd:0},pronto=false,ocupado=false;
inv2.e=ls("bgv")||"";
const css=document.createElement("style");
css.textContent=`@keyframes shk{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg) scale(1.1)}75%{transform:rotate(12deg) scale(1.1)}}#loja.pk #lj{display:none}#loja.pk .tabs2 button:not(#ltp){background:transparent!important}#lj2{display:none;flex-direction:column;gap:12px}#loja.pk #lj2{display:flex}.pkc{display:flex;align-items:center;gap:12px;padding:12px;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}.pkc .ic{font-size:2.2rem;width:52px;text-align:center}.pkc .tx{flex:1}.pkc button{padding:8px 14px}.rev{position:fixed;inset:0;z-index:97;background:rgba(4,10,22,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center}.rev .big{font-size:5rem;animation:shk .6s ease-in-out}.rev .it{animation:pop .35s ease-out}`;
document.head.appendChild(css);
const st=document.createElement("style");document.head.appendChild(st);
function aplicar(){
  const b=BG.find(x=>x[0]===inv2.e);
  st.textContent=b?"body:has(#jogo.on),body:has(#mjogo.on){background:linear-gradient(160deg,"+b[3]+","+b[4]+") fixed!important}":"";
}
aplicar();
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
async function iniciar(){
  if(pronto)return true;
  try{
    await fb();const{F,db,auth}=FB,u=auth.currentUser.uid;
    I2=F.doc(db,"inventario2",u);C2=F.doc(db,"compras2",u);C1=F.doc(db,"compras",u);
    const[a,b,c]=await Promise.all([F.getDoc(I2),F.getDoc(C2),F.getDoc(C1)]);
    if(a.exists()){inv2={i:a.data().i||[],e:a.data().e||""}}else{inv2={i:[],e:""};await F.setDoc(I2,inv2)}
    if(b.exists()){c2={s:b.data().s||0,sd:b.data().sd||0}}else{c2={s:0,sd:0};await F.setDoc(C2,c2)}
    if(!c.exists())await F.setDoc(C1,{s:0});
    window.__S2=c2.s;window.__SD=c2.sd;
    pronto=true;ss("bgv",inv2.e);aplicar();fixD();render();return true;
  }catch(e){return false}
}
// aba Pacotes
const tp=document.createElement("button");tp.id="ltp";tp.textContent="🎁 Pacotes";tabs.appendChild(tp);
const l2=document.createElement("div");l2.id="lj2";lj.after(l2);
tp.onclick=()=>{sec.classList.add("pk");tp.classList.add("on");iniciar().then(render)};
["ltc","ltm","ltf"].forEach(i=>{const b=$(i);if(b)b.addEventListener("click",()=>{sec.classList.remove("pk");tp.classList.remove("on")})});
function render(){
  const w=window.MOEDAS&&window.MOEDAS.saldo();
  l2.innerHTML='<p class="nota">Abra um pacote e ganhe um fundo de partida surpresa!</p>'
   +PK.map((p,i)=>'<div class="pkc"><span class="ic">'+p.ic+'</span><span class="tx"><b>'+p.n+"</b><br><small>"+p.ok.map(r=>NOM[r]).join(" ou ")+'</small></span><button data-p="'+i+'" class="gold">'+p.p+"</button></div>").join("")
   +'<p class="nota" style="margin-top:6px">Meus fundos</p><div class="lgrid">'+(inv2.i.length?inv2.i.map(id=>{const b=BG.find(x=>x[0]===id);if(!b)return"";const eq=inv2.e===id;
     return '<div class="li2"><div class="lp" style="background:linear-gradient(160deg,'+b[3]+","+b[4]+");border-color:"+COR[b[2]]+'">'+b[5]+"</div><b>"+b[1]+'</b><small style="color:'+COR[b[2]]+'">'+NOM[b[2]]+'</small><button data-e="'+id+'" class="'+(eq?"sec":"")+'">'+(eq?"✔ Em uso · tirar":"Usar")+"</button></div>"}).join(""):'<p class="nota">Nenhum ainda.</p>')+"</div>";
}
function sorteia(p){
  const livres=r=>BG.filter(x=>x[2]===r&&!inv2.i.includes(x[0]));
  const tiers=p.ok.filter(r=>livres(r).length);
  if(!tiers.length)return null;
  let k=Math.random()*100,r=tiers[tiers.length-1];
  for(let j=0;j<p.ok.length;j++){k-=p.w[j];if(k<=0&&tiers.includes(p.ok[j])){r=p.ok[j];break}}
  const L=livres(r);return L[Math.floor(Math.random()*L.length)];
}
function revela(it){
  const o=document.createElement("div");o.className="rev";
  o.innerHTML='<div class="big">🎁</div>';document.body.appendChild(o);
  setTimeout(()=>{
    o.innerHTML='<div class="it" style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="lp" style="width:110px;height:140px;font-size:3rem;background:linear-gradient(160deg,'+it[3]+","+it[4]+");border-color:"+COR[it[2]]+'">'+it[5]+'</div><b style="font-size:1.5rem">'+it[1]+'</b><span style="color:'+COR[it[2]]+'">'+NOM[it[2]]+'</span><button class="opc big" id="rvOk"><span class="tx"><b>Legal!</b></span></button></div>';
    $("rvOk").onclick=()=>o.remove();
  },700);
}
async function abrir(p){
  if(ocupado)return;ocupado=true;
  try{
    if(!await iniciar()){toast("Não foi possível abrir");return}
    const w=window.MOEDAS&&window.MOEDAS.saldo();if(!w){toast("Aguarde um instante…");return}
    const{F}=FB,s1=((await F.getDoc(C1)).data()||{}).s||0;
    if(p.s&&w.m-s1-c2.s<p.s){toast("Moedas insuficientes");return}
    if(p.sd&&w.d-c2.sd<p.sd){toast("Diamantes insuficientes");return}
    const it=sorteia(p);if(!it){toast("Você já tem todos desse tipo!");return}
    const b=F.writeBatch(FB.db);
    b.update(C2,{s:c2.s+p.s,sd:c2.sd+p.sd});b.update(I2,{i:[...inv2.i,it[0]],e:inv2.e});
    await b.commit();
    c2={s:c2.s+p.s,sd:c2.sd+p.sd};inv2.i.push(it[0]);window.__S2=c2.s;window.__SD=c2.sd;
    fixD();revela(it);render();
  }catch(e){toast("Não foi possível comprar")}
  finally{ocupado=false}
}
l2.onclick=async e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.p!==undefined)return abrir(PK[+b.dataset.p]);
  if(b.dataset.e){
    const novo=inv2.e===b.dataset.e?"":b.dataset.e;
    try{await FB.F.updateDoc(I2,{i:inv2.i,e:novo});inv2.e=novo;ss("bgv",novo);aplicar();render()}catch(x){toast("Não foi possível equipar")}
  }
};
const dv=$("mcDv");
function fixD(){
  const w=window.MOEDAS&&window.MOEDAS.saldo();if(!w||!dv)return;
  const v=fmt(w.d-c2.sd);if(dv.textContent!==v)dv.textContent=v;
  const mv=$("mcMv");if(mv){const m=fmt(w.m-c2.s);void m}
}
if(dv)new MutationObserver(fixD).observe(dv,{childList:true,characterData:true,subtree:true});
setTimeout(iniciar,4500);
})();
