(function(){
const $=id=>document.getElementById(id);
const nav=$("nav"),main=document.querySelector("main");
if(!nav||!main||!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const fmt=n=>(n||0).toLocaleString("pt-BR");
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};
const IT=[
["c_padrao","c","Padrão",0,"#0f63d6","#0a3d92","🧠"],["c_fogo","c","Fogo",800,"#e8481c","#7a1608","🔥"],["c_gelo","c","Gelo",800,"#3ec6ff","#0a4a7a","❄️"],
["c_epica","c","Épica",1500,"#9b4dff","#3a0f7a","🔮"],["c_lendaria","c","Lendária",3000,"#ffc933","#8a5a00","👑"],["c_cyber","c","Cibernética",5000,"#19e0b0","#064a44","⚡"],
["m_neon","m","Neon",600,"#19b4ff","",""],["m_ouro","m","Ouro",1200,"#ffc933","",""],["m_sombria","m","Sombria",1200,"#b04bff","",""],
["f_brilho","f","Brilho dourado",500,"#ffc933","",""],["f_esmeralda","f","Esmeralda",1000,"#19e676","",""],["f_rosa","f","Rosa choque",2000,"#ff4fd8","",""]];
let FB=null,INV=null,CMP=null,inv={i:[],e:{c:"c_padrao",m:"",f:""}},S=0,aba="c",pronto=false,carregando=false;
try{const x=JSON.parse(ls("eqv")||"null");if(x)inv.e=Object.assign(inv.e,x)}catch(e){}
const css=document.createElement("style");
css.textContent=`#nPerfil{display:none!important}.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.li2{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}.li2 button{width:100%;padding:8px 4px;font-size:.9rem}.lp{width:64px;height:84px;border-radius:12px;border:3px solid #19b4ff;display:grid;place-items:center;font-size:1.8rem}.lp.r{width:72px;height:72px;border-radius:50%}button.gold{background:linear-gradient(180deg,#ffd23f,#ff9a00)!important;color:#3a2000!important;border:0}`;
document.head.appendChild(css);
const st=document.createElement("style");document.head.appendChild(st);
function aplicar(){
  const g=id=>IT.find(x=>x[0]===id),c=g(inv.e.c),m=g(inv.e.m),f=g(inv.e.f);let s="";
  if(c&&c[0]!=="c_padrao")s+=".carta .costas{background:linear-gradient(160deg,"+c[4]+","+c[5]+")!important;border-color:"+c[4]+"!important;box-shadow:0 0 12px "+c[4]+"!important}.carta .costas::after{content:'"+c[6]+"'!important;filter:none!important}";
  if(m)s+="#pv .av2.big,#hmAv,#j0 .avg{border-color:"+m[4]+"!important;box-shadow:0 0 14px "+m[4]+"!important}";
  if(f)s+=".carta.par .frente{background:"+f[4]+"!important;box-shadow:0 0 16px "+f[4]+"!important}";
  st.textContent=s;
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
  if(pronto||carregando)return;carregando=true;
  try{
    await fb();const{F,db,auth}=FB,u=auth.currentUser.uid;
    INV=F.doc(db,"inventario",u);CMP=F.doc(db,"compras",u);
    const[a,b]=await Promise.all([F.getDoc(INV),F.getDoc(CMP)]);
    if(a.exists()){const x=a.data();inv={i:x.i||[],e:Object.assign({c:"c_padrao",m:"",f:""},x.e||{})}}
    else{inv={i:[],e:inv.e};await F.setDoc(INV,{i:[],e:inv.e})}
    if(b.exists())S=b.data().s||0;else{S=0;await F.setDoc(CMP,{s:0})}
    pronto=true;ss("eqv",JSON.stringify(inv.e));aplicar();render();
  }catch(e){toast("Não foi possível abrir o inventário")}
  carregando=false;
}
const wal=()=>window.MOEDAS&&window.MOEDAS.saldo();
const saldo=()=>(wal()?wal().m:0)-S;
function render(){
  const w=wal();
  $("ljS").textContent="🪙 "+fmt(saldo())+"    💎 "+fmt(w?w.d:0);
  ["c","m","f"].forEach(k=>$("lt"+k).classList.toggle("on",aba===k));
  $("lj").innerHTML=IT.filter(x=>x[1]===aba).map(x=>{
    const dono=x[3]===0||inv.i.includes(x[0]),eq=inv.e[x[1]]===x[0];
    const pv=x[1]==="c"?'<div class="lp" style="background:linear-gradient(160deg,'+x[4]+","+x[5]+");border-color:"+x[4]+'">'+x[6]+"</div>":x[1]==="m"?'<div class="lp" style="border-radius:50%;border-color:'+x[4]+";box-shadow:0 0 12px "+x[4]+'">🙂</div>':'<div class="lp" style="background:'+x[4]+'">✨</div>';
    const bt=dono?(eq?(x[1]==="c"?"✔ Equipado":"✔ Equipado · tirar"):"Equipar"):"🪙 "+fmt(x[3]);
    return '<div class="li2">'+pv+"<b>"+x[2]+'</b><button data-id="'+x[0]+'" class="'+(eq?"sec":dono?"":"gold")+'">'+bt+"</button></div>";
  }).join("");
}
async function salvarEq(){
  ss("eqv",JSON.stringify(inv.e));aplicar();render();
  try{await FB.F.updateDoc(INV,{i:inv.i,e:inv.e})}catch(e){}
}
async function comprar(x){
  if(!pronto){toast("Aguarde um instante…");iniciar();return}
  if(saldo()<x[3]){toast("Moedas insuficientes");return}
  try{
    const b=FB.F.writeBatch(FB.db);
    b.update(CMP,{s:S+x[3]});b.update(INV,{i:[...inv.i,x[0]],e:inv.e});
    await b.commit();
    S+=x[3];inv.i.push(x[0]);inv.e[x[1]]=x[0];
    toast("✅ "+x[2]+" é seu!");await salvarEq();
  }catch(e){toast("Não foi possível comprar")}
}
const sec=document.createElement("section");sec.id="loja";sec.className="tela";
sec.innerHTML='<div class="hdr2"><button class="back" id="ljB">←</button><b>🎒 Inventário</b><span style="width:44px"></span></div><p class="msg" id="ljS"></p><div class="tabs2"><button id="ltc">Cartas</button><button id="ltm">Molduras</button><button id="ltf">Efeitos</button></div><div id="lj" class="lgrid"></div><p class="nota">Os itens só mudam o visual. Moedas não dão vantagem na partida.</p>';
main.appendChild(sec);
$("lj").onclick=async e=>{
  const b=e.target.closest("button");if(!b)return;
  const x=IT.find(y=>y[0]===b.dataset.id);if(!x)return;
  if(x[3]===0||inv.i.includes(x[0])){
    inv.e[x[1]]=(inv.e[x[1]]===x[0]&&x[1]!=="c")?"":x[0];
    await salvarEq();
  }else await comprar(x);
};
[["c","ltc"],["m","ltm"],["f","ltf"]].forEach(([k,i])=>$(i).onclick=()=>{aba=k;render()});
const nb=document.createElement("button");nb.id="nInv";nb.innerHTML="<b>🎒</b>Inventário";
nav.insertBefore(nb,$("nConfig")||null);
function abrir(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="loja"));
  nav.style.display="flex";nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===nb));
  history.pushState({t:"loja"},"");iniciar();render();
}
nb.onclick=()=>{if(!sec.classList.contains("on"))abrir()};
nav.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b!==nb)nb.classList.remove("on")},true);
$("ljB").onclick=()=>history.back();
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(t&&t.id==="loja"){
    document.querySelectorAll(".tela").forEach(x=>x.classList.toggle("on",x.id==="menu"));
    nav.style.display="flex";nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.id==="nInicio"));
  }
});
["mcM","mcD"].forEach(i=>{const b=$(i);if(b)b.onclick=abrir});
const mv=$("mcMv");
if(mv)new MutationObserver(()=>{const v=fmt(saldo());if(mv.textContent!==v)mv.textContent=v}).observe(mv,{childList:true,characterData:true,subtree:true});
setTimeout(iniciar,3500);
})();
