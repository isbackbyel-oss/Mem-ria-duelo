(function(){
const $=id=>document.getElementById(id);
const nav=$("nav"),main=document.querySelector("main");
if(!nav||!main||!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const fmt=n=>(n||0).toLocaleString("pt-BR");
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};
const R=["Comum","Raro","Épico","Lendário","Especial"],RC=["#9fb0c8","#4aa0ff","#b04bff","#ffc933","#19e6a0"];
const NOME={c:"Cartas",m:"Molduras",f:"Efeitos"},DESC={c:"Troque o visual das cartas do jogo.",m:"Deixe seu avatar ainda mais único!",f:"Dê mais vida às suas partidas!"};
const DEF={c:"c_padrao",m:"m_neon",f:"f_brilho"};
const IT=[
["c_padrao","c","Clássica",0,0,"#0f63d6","#0a3d92","🧠","O visual clássico e atemporal do Memória Duelo."],
["c_natureza","c","Natureza",800,1,"#19c28a","#075a45","🌿","Folhas e energia da floresta."],
["c_mistica","c","Mística",1500,2,"#9b4dff","#3a0f7a","👁","Um olhar que enxerga todos os pares."],
["c_fogo","c","Fogo",1200,1,"#e8481c","#7a1608","🔥","Quente como uma sequência de acertos."],
["c_real","c","Real",3000,3,"#ffc933","#7a5200","👑","Para quem joga como realeza."],
["c_gelo","c","Gelo",1200,1,"#3ec6ff","#0a4a7a","❄️","Cabeça fria, mãos rápidas."],
["c_cyber","c","Cibernética",5000,4,"#19e0b0","#064a44","⚡","Circuitos de outro mundo."],
["m_neon","m","Neon",0,0,"#19b4ff","#7b5cff","💠","O brilho azul clássico."],
["m_ouro","m","Ouro",800,1,"#ffc933","#b8860b","🏅","Moldura dourada."],
["m_epica","m","Épica",1500,2,"#b04bff","#4a1590","💎","Cristais roxos."],
["m_lendaria","m","Lendária",3000,3,"#ff6a2a","#ffc933","🔥","Chamas lendárias."],
["m_cyber","m","Cibernética",5000,4,"#19e6a0","#0a5a4a","⚙️","Hexágonos verdes."],
["f_brilho","f","Brilho básico",0,0,"#19b4ff","#7b5cff","✨","Brilho azul ao acertar."],
["f_esmeralda","f","Esmeralda",800,1,"#19e676","#0a6a3a","🍃","Folhas verdes ao redor."],
["f_rosa","f","Rosa choque",1500,2,"#ff4fd8","#7a1a9a","🔮","Faíscas rosa."],
["f_dourado","f","Dourado",3000,3,"#ffc933","#a8730f","⭐","Chuva dourada."],
["f_cosmico","f","Cósmico",5000,4,"#5aa0ff","#7b3cff","🌌","Poeira de estrelas."]];
const item=id=>IT.find(x=>x[0]===id);
const limpa=e=>{const o=Object.assign({},DEF);["c","m","f"].forEach(k=>{const x=item(e&&e[k]);if(x&&x[1]===k)o[k]=x[0]});return o};
let FB=null,INV=null,CMP=null,inv={i:[],e:Object.assign({},DEF)},S=0,aba="c",fr=-1,sel={},pronto=false,carregando=false;
try{const x=JSON.parse(ls("eqv")||"null");if(x)inv.e=limpa(x)}catch(e){}
sel=Object.assign({},inv.e);
const owned=x=>x[3]===0||inv.i.includes(x[0]);
const wal=()=>window.MOEDAS&&window.MOEDAS.saldo();
const saldo=()=>(wal()?wal().m:0)-S-(window.__S2||0);
const myAv=()=>{const h=$("hmAv");if(h&&h.querySelector("svg"))return h.innerHTML;return "<b>"+(($("cartao").textContent.trim()[0]||"?").toUpperCase())+"</b>"};
const css=document.createElement("style");
css.textContent=`#nPerfil{display:none!important}.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}#ljS{display:flex;gap:10px;justify-content:center}.chips2{display:flex;gap:6px;overflow-x:auto;padding:2px}.ch2{flex:0 0 auto;padding:6px 14px;min-height:36px;border-radius:18px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);font-size:.85rem;box-shadow:none;color:#fff}.ch2.on{background:linear-gradient(180deg,#2aa8ff,#0b6fd8)}.ca{display:grid;place-items:center;border-radius:12px;border:3px solid #19b4ff;font-style:normal}.li3{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 6px;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);cursor:pointer;min-width:0}.li3.sel{border-color:#19b4ff;box-shadow:0 0 12px rgba(25,180,255,.6)}.li3.eq{background:rgba(25,120,255,.25)}.rt{display:inline-block;padding:2px 10px;border-radius:10px;font-size:.7rem;font-weight:800;border:1px solid;background:rgba(0,0,0,.25)}.li3 small{font-weight:700}.prev{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 14px;border-radius:18px;border:2px solid #19b4ff;background:radial-gradient(circle at 50% 30%,rgba(30,120,255,.35),rgba(10,20,60,.9));text-align:center}.prev .pt{position:absolute;right:10px;top:10px;font-size:.7rem;padding:2px 10px;border-radius:10px;border:1px solid #19b4ff}.prev h3{margin:0;font-size:1.4rem}.prev p{margin:0;opacity:.85}.ma{position:relative;border-radius:50%;padding:5px;background:conic-gradient(var(--a),var(--b),var(--a));box-shadow:0 0 14px var(--a);display:grid;place-items:center;flex-shrink:0}.ma .mi{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#0a1030;display:grid;place-items:center;font-size:1.6rem}.ma i{position:absolute;top:-12px;left:50%;transform:translateX(-50%);font-style:normal;font-size:1.3rem}.fa{position:relative;display:grid;place-items:center;background:radial-gradient(circle,color-mix(in srgb,var(--a) 55%,transparent) 0,transparent 66%)}.fa i{position:absolute;font-style:normal;font-size:1rem}button.gold{background:linear-gradient(180deg,#ffd23f,#ff9a00)!important;color:#3a2000!important;border:0}`;
document.head.appendChild(css);
const st=document.createElement("style");document.head.appendChild(st);
function aplicar(){
  const c=item(inv.e.c),m=item(inv.e.m),f=item(inv.e.f);let s="";
  if(c&&c[0]!=="c_padrao")s+=".carta .costas{background:linear-gradient(160deg,"+c[5]+","+c[6]+")!important;border-color:"+c[5]+"!important;box-shadow:0 0 12px "+c[5]+"!important}.carta .costas::after{content:'"+c[7]+"'!important;filter:none!important}";
  if(m&&m[0]!=="m_neon")s+="#pv .av2.big,#hmAv,#j0 .avg{border-color:"+m[5]+"!important;box-shadow:0 0 14px "+m[5]+"!important}";
  if(f&&f[0]!=="f_brilho")s+=".carta.par .frente{background:"+f[5]+"!important;box-shadow:0 0 16px "+f[5]+"!important}";
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
    if(a.exists()){const x=a.data();inv={i:x.i||[],e:limpa(x.e)}}
    else{inv={i:[],e:inv.e};await F.setDoc(INV,{i:[],e:inv.e})}
    if(b.exists())S=b.data().s||0;else{S=0;await F.setDoc(CMP,{s:0})}
    pronto=true;sel=Object.assign({},inv.e);ss("eqv",JSON.stringify(inv.e));aplicar();render();
  }catch(e){toast("Não foi possível abrir o inventário")}
  carregando=false;
}
function arte(x,g){
  const c1=x[5],c2=x[6],s=g?1.6:1;
  if(x[1]==="c")return '<div class="ca" style="width:'+56*s+"px;height:"+76*s+"px;background:linear-gradient(160deg,"+c1+","+c2+");border-color:"+c1+";box-shadow:0 0 14px "+c1+";font-size:"+1.6*s+'rem">'+x[7]+"</div>";
  if(x[1]==="m")return '<div class="ma" style="--a:'+c1+";--b:"+c2+";width:"+80*s+"px;height:"+80*s+'px"><span class="mi">'+myAv()+"</span><i>"+x[7]+"</i></div>";
  return '<div class="fa" style="--a:'+c1+";width:"+80*s+"px;height:"+80*s+'px"><span class="ca" style="width:'+34*s+"px;height:"+48*s+"px;background:linear-gradient(160deg,#0f63d6,#0a3d92);border-color:"+c1+";font-size:"+s+'rem">🧠</span><i style="left:2px;top:4px">'+x[7]+'</i><i style="right:2px;top:10px">'+x[7]+'</i><i style="left:8px;bottom:2px">'+x[7]+'</i><i style="right:6px;bottom:6px">'+x[7]+"</i></div>";
}
function render(){
  const w=wal();
  $("ljS").innerHTML='<span class="mc">🪙 <b>'+fmt(saldo())+'</b></span><span class="mc">💎 <b>'+fmt((w?w.d:0)-(window.__SD||0))+"</b></span>";
  ["c","m","f"].forEach(k=>{const b=$("lt"+k);if(b)b.classList.toggle("on",aba===k)});
  const L=IT.filter(x=>x[1]===aba),V=L.filter(x=>fr<0||x[4]===fr);
  $("ljF").innerHTML=["Todos"].concat(R).map((n,i)=>'<button class="ch2'+(fr===i-1?" on":"")+'" data-f="'+(i-1)+'">'+n+"</button>").join("");
  $("ljH").innerHTML="<span>"+NOME[aba]+"</span><b>"+L.filter(owned).length+"/"+L.length+"</b>";
  $("ljG").innerHTML=V.map(x=>{
    const eq=inv.e[x[1]]===x[0],sl=sel[aba]===x[0];
    return '<div class="li3'+(sl?" sel":"")+(eq?" eq":"")+'" data-id="'+x[0]+'">'+arte(x,0)+"<b>"+x[2]+'</b><span class="rt" style="color:'+RC[x[4]]+'">'+R[x[4]]+"</span><small>"+(eq?"✔ Equipado":owned(x)?"Seu":"🪙 "+fmt(x[3]))+"</small></div>";
  }).join("")||'<p class="nota">Nenhum item nesta raridade.</p>';
  const x=item(sel[aba])||item(inv.e[aba]);
  if(x){
    const dono=owned(x),eq=inv.e[x[1]]===x[0],p=saldo();
    $("ljP").innerHTML='<span class="pt">Prévia</span>'+arte(x,1)+"<h3>"+x[2]+'</h3><span class="rt" style="color:'+RC[x[4]]+'">'+R[x[4]]+"</span><p>"+x[8]+"</p>"
      +(eq?'<button class="sec" disabled>✔ Equipado</button>':dono?'<button class="opc big" id="ljA"><span class="tx"><b>👕 Equipar</b></span></button>':p>=x[3]?'<button class="opc big" id="ljA"><span class="tx"><b>🪙 Comprar '+fmt(x[3])+"</b></span></button>":'<button class="sec" disabled>Faltam 🪙 '+fmt(x[3]-p)+"</button>");
  }
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
    S+=x[3];inv.i.push(x[0]);inv.e[x[1]]=x[0];sel[x[1]]=x[0];
    toast("✅ "+x[2]+" é seu!");await salvarEq();
  }catch(e){toast("Não foi possível comprar")}
}
const sec=document.createElement("section");sec.id="loja";sec.className="tela";
sec.innerHTML='<div class="hdr2"><button class="back" id="ljB">←</button><span style="flex:1;padding-left:8px"><b style="display:block;font-size:1.4rem">🎒 Inventário</b><small style="opacity:.85">Personalize sua experiência no Memória Duelo!</small></span></div><div id="ljS"></div><div class="tabs2"><button id="ltc">Cartas</button><button id="ltm">Molduras</button><button id="ltf">Efeitos</button></div><div id="lj" style="display:flex;flex-direction:column;gap:12px"><div class="chips2" id="ljF"></div><div class="sh2" id="ljH"></div><div id="ljG" class="lgrid"></div><div id="ljP" class="prev"></div><p class="nota">💡 Toque em um item para ver a prévia antes de equipar. Os itens só mudam o visual.</p></div>';
main.appendChild(sec);
$("lj").onclick=async e=>{
  const f=e.target.closest(".ch2");if(f){fr=+f.dataset.f;render();return}
  const c=e.target.closest(".li3");if(c){sel[aba]=c.dataset.id;render();return}
  if(e.target.closest("#ljA")){
    const x=item(sel[aba]);if(!x)return;
    if(owned(x)){inv.e[x[1]]=x[0];await salvarEq()}else await comprar(x);
  }
};
[["c","ltc"],["m","ltm"],["f","ltf"]].forEach(([k,i])=>$(i).onclick=()=>{aba=k;fr=-1;render()});
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
render();
setTimeout(iniciar,3500);
})();
