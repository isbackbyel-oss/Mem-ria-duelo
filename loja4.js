(function(){
const $=id=>document.getElementById(id);
const nav=$("nav"),main=document.querySelector("main");
if(!nav||!main||!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const fmt=n=>(n||0).toLocaleString("pt-BR");
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};
const R=["Comum","Raro","Épico","Lendário","Supremo"],RC=["#9fb0c8","#4aa0ff","#b04bff","#ffc933","#19e6c8"];
const TX={c:["Cartas","Minhas cartas","São a base de tudo. Cada carta tem um estilo único!"],m:["Molduras","Molduras","Deixe seu avatar ainda mais único!"],f:["Efeitos","Efeitos","Dê mais vida às suas partidas!"]};
const DEF={c:"c_padrao",m:"m_neon",f:"f_brilho"};
const N=7,RW=3;
// [id,tipo,nome,preço,raridade,coluna,linha,descrição,cor]
const IT=[
["c_padrao","c","Clássica",0,0,0,0,"","#19b4ff"],["c_natureza","c","Natureza",800,1,1,0,"","#19e676"],["c_mistica","c","Mística",1500,2,2,0,"","#b04bff"],
["c_fogo","c","Fogo",1200,1,3,0,"","#ff5a1f"],["c_real","c","Real",3000,3,4,0,"","#ffc933"],["c_gelo","c","Gelo",1200,1,5,0,"","#3ec6ff"],["c_cyber","c","Cyber",5000,4,6,0,"","#8a6bff"],
["m_neon","m","Neon",0,0,-1,1,"","#19b4ff"],["m_ouro","m","Fogo",800,1,2,1,"","#ff4b1f"],["m_epica","m","Épica",1500,2,1,1,"","#b04bff"],["m_lendaria","m","Ouro",3000,3,0,1,"","#ffc933"],["m_cyber","m","Cyber",5000,4,3,1,"","#8a6bff"],
["f_brilho","f","Brilho básico",0,0,0,2,"","#19b4ff"],["f_esmeralda","f","Esmeralda",800,1,1,2,"","#19e676"],["f_rosa","f","Rosa choque",1500,2,2,2,"","#ff4fd8"],["f_dourado","f","Dourado",3000,3,3,2,"","#ffc933"],["f_cosmico","f","Cósmico",5000,4,4,2,"","#5aa0ff"]];
const item=id=>IT.find(x=>x[0]===id);
const limpa=e=>{const o=Object.assign({},DEF);["c","m","f"].forEach(k=>{const x=item(e&&e[k]);if(x&&x[1]===k)o[k]=x[0]});return o};
let FB=null,INV=null,CMP=null,inv={i:[],e:Object.assign({},DEF)},S=0,aba="c",fr=-1,pronto=false,carregando=false;
try{const x=JSON.parse(ls("eqv")||"null");if(x)inv.e=limpa(x)}catch(e){}
const owned=x=>x[3]===0||inv.i.includes(x[0]);
const wal=()=>window.MOEDAS&&window.MOEDAS.saldo();
const saldo=()=>(wal()?wal().m:0)-S-(window.__S2||0);
const myAv=()=>{const h=$("hmAv");if(h&&h.querySelector("svg"))return h.innerHTML;return "<b>"+(($("cartao").textContent.trim()[0]||"?").toUpperCase())+"</b>"};
const spr=(c,r)=>"background-image:url(inv.png);background-repeat:no-repeat;background-size:"+N*100+"% "+RW*100+"%;background-position:"+(c/(N-1)*100)+"% "+(r/(RW-1)*100)+"%";
const css=document.createElement("style");
css.textContent=`#nPerfil{display:none!important}.invw{display:flex;gap:10px;align-items:flex-start}#ljR{display:flex;flex-direction:column;gap:8px;width:68px;flex-shrink:0}.rb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:64px;padding:4px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.8);color:#fff;font-size:.68rem;box-shadow:none}.rb b{font-size:1.4rem}.rb.on{background:linear-gradient(180deg,#2aa8ff,#0b6fd8)}#lj,#lj2{flex:1;min-width:0}#ljS{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.bnr{display:flex;align-items:center;gap:8px;padding:12px;border-radius:16px;border:2px solid #1e5f9e;background:linear-gradient(135deg,rgba(30,60,160,.7),rgba(60,20,120,.7));overflow:hidden}.bnr>div:first-child{flex:1;min-width:0}.bnr b{font-size:1.4rem;display:block}.bnr small{opacity:.9}.bart{display:flex;margin-right:-8px}.bart .sa{margin-left:-26px}.chips2{display:flex;gap:6px;overflow-x:auto;padding:2px}.ch2{flex:0 0 auto;padding:6px 14px;min-height:38px;border-radius:18px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);font-size:.85rem;box-shadow:none;color:#fff}.ch2.on{background:linear-gradient(180deg,#2aa8ff,#0b6fd8)}.sa{display:block;flex-shrink:0}.lgrid3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.it{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 4px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);min-width:0}.it.eq{border-color:#19e6c8;box-shadow:0 0 12px rgba(25,230,200,.5)}.it.lk{justify-content:center;opacity:.6;text-align:center;min-height:150px;font-size:.75rem}.it b{font-size:.85rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rt{font-size:.65rem;font-weight:800;padding:1px 8px;border-radius:10px;border:1px solid;background:rgba(0,0,0,.3)}.ib{width:94%;padding:6px 2px;min-height:36px;font-size:.8rem;border-radius:10px;background:linear-gradient(180deg,#2aa8ff,#0b6fd8);color:#fff;box-shadow:none}.ib.eqb{background:rgba(25,230,150,.18);border:1px solid #19e6a0;color:#7dffd0}.ib.buy{background:linear-gradient(180deg,#ffd23f,#ff9a00);color:#3a2000}.ib.no{background:#1a2f4f;color:#9fb0c8}.fr{position:relative}.fr .sa{position:absolute;inset:0;width:100%;height:100%}.fa2{position:absolute;inset:21%;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#0a1030;font-size:1.3rem}.nr{position:absolute;inset:14%;border-radius:50%;border:4px solid #19b4ff;box-shadow:0 0 12px #19b4ff,inset 0 0 8px #19b4ff}.pbar2{display:flex;align-items:center;gap:8px;padding:10px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}.pbar2 span{flex:1;font-size:.8rem}.pbar2 button{padding:8px 12px;min-height:40px;font-size:.85rem}`;
document.head.appendChild(css);
const st=document.createElement("style");document.head.appendChild(st);
function aplicar(){
  const c=item(inv.e.c),m=item(inv.e.m),f=item(inv.e.f);let s="";
  if(c&&c[0]!=="c_padrao"){
    const z=1.55,px=(0.5-(c[5]+.5)*z)/(1-N*z)*100,py=(0.5-(c[6]+.5)*z)/(1-RW*z)*100;
    s+=".carta .costas{background-color:#0a1030!important;background-image:url(inv.png)!important;background-repeat:no-repeat!important;background-size:"+N*z*100+"% "+RW*z*100+"%!important;background-position:"+px+"% "+py+"%!important;font-size:0!important;border-color:"+c[8]+"!important;box-shadow:0 0 12px "+c[8]+"!important}.carta .costas::after{content:none!important}";
  }
  if(m&&m[0]!=="m_neon")s+="#pv .av2.big,#hmAv,#j0 .avg{border-color:"+m[8]+"!important;box-shadow:0 0 14px "+m[8]+"!important}";
  if(f&&f[0]!=="f_brilho")s+=".carta.par .frente{background:"+f[8]+"!important;box-shadow:0 0 16px "+f[8]+"!important}";
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
    pronto=true;ss("eqv",JSON.stringify(inv.e));aplicar();render();
  }catch(e){toast("Não foi possível abrir o inventário")}
  carregando=false;
}
function arte(x,s){
  if(x[1]==="m"){
    const ring=x[5]<0?'<i class="nr"></i>':'<div class="sa" style="'+spr(x[5],x[6])+'"></div>';
    return '<div class="fr" style="width:'+s+"px;height:"+s+'px"><span class="fa2">'+myAv()+"</span>"+ring+"</div>";
  }
  return '<div class="sa" style="width:'+s+"px;height:"+s+"px;"+spr(x[5],x[6])+'"></div>';
}
function render(){
  const w=wal(),pk=$("loja").classList.contains("pk");
  let xp=0;try{xp=JSON.parse(ls("viciante")||"{}").xp||0}catch(e){}
  const lv=Math.floor(Math.sqrt(xp/25))+1;
  $("ljS").innerHTML='<span class="mc">⭐ Nv '+lv+'</span><span class="mc">🪙 <b>'+fmt(saldo())+'</b></span><span class="mc">💎 <b>'+fmt((w?w.d:0)-(window.__SD||0))+"</b></span>";
  [["c","🃏","Cartas"],["m","🖼️","Molduras"],["f","✨","Efeitos"],["p","🎁","Pacotes"]].forEach(()=>{});
  $("ljR").innerHTML=[["c","🃏","Cartas"],["m","🖼️","Molduras"],["f","✨","Efeitos"],["p","🎁","Pacotes"]].map(r=>'<button class="rb'+((r[0]==="p"?pk:(!pk&&aba===r[0]))?" on":"")+'" data-k="'+r[0]+'"><b>'+r[1]+"</b>"+r[2]+"</button>").join("");
  const L=IT.filter(x=>x[1]===aba),V=L.filter(x=>fr<0||x[4]===fr),t=TX[aba];
  const ban=aba==="c"?[[5,0,-12],[3,0,0],[2,0,12]]:aba==="m"?[[0,1,0],[1,1,0],[3,1,0]]:[[0,2,0],[2,2,0],[4,2,0]];
  $("ljB2").innerHTML='<div><b>'+t[0]+"</b><small>"+t[2]+'</small></div><div class="bart">'+ban.map(b=>'<div class="sa" style="width:74px;height:74px;transform:rotate('+b[2]+"deg);"+spr(b[0],b[1])+'"></div>').join("")+"</div>";
  $("ljF").innerHTML=["Todos"].concat(R).map((n,i)=>'<button class="ch2'+(fr===i-1?" on":"")+'" data-f="'+(i-1)+'">'+(i?"◆ ":"")+n+"</button>").join("");
  $("ljH").innerHTML="<span>"+t[1]+"</span><b>"+L.filter(owned).length+"/"+L.length+"</b>";
  $("ljG").innerHTML=V.map(x=>{
    const eq=inv.e[x[1]]===x[0],dono=owned(x),p=saldo();
    const bt=eq?'<button class="ib eqb" disabled>✔ Equipado</button>':dono?'<button class="ib" data-id="'+x[0]+'">Equipar</button>':'<button class="ib '+(p>=x[3]?"buy":"no")+'" data-id="'+x[0]+'">🪙 '+fmt(x[3])+"</button>";
    return '<div class="it'+(eq?" eq":"")+'">'+arte(x,86)+'<span class="rt" style="color:'+RC[x[4]]+'">◆ '+R[x[4]]+"</span><b>"+x[2]+"</b>"+bt+"</div>";
  }).join("")+(fr<0?'<div class="it lk"><span style="font-size:2rem">🔒</span>Desbloqueie mais no jogo!</div>':"");
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
sec.innerHTML='<div class="hdr2"><button class="back" id="ljBk">←</button><span style="flex:1;padding-left:8px"><b style="display:block;font-size:1.4rem">🎒 Inventário</b><small style="opacity:.85">Colecione e mostre seu estilo no Memória Duelo!</small></span></div><div id="ljS"></div><div class="tabs2" style="display:none"><button id="ltc"></button><button id="ltm"></button><button id="ltf"></button></div><div class="invw"><div id="ljR"></div><div id="lj" style="display:flex;flex-direction:column;gap:10px"><div class="bnr" id="ljB2"></div><div class="chips2" id="ljF"></div><div class="sh2" id="ljH"></div><div id="ljG" class="lgrid3"></div><div class="pbar2"><span>🎁 <b>Pacotes especiais</b><br>Abra pacotes e tenha chance de ganhar itens raros!</span><button id="ljPk" class="opc big" style="padding:8px 12px">Ver pacotes ›</button></div><p class="nota">Os itens só mudam o visual. Moedas não dão vantagem na partida.</p></div></div>';
main.appendChild(sec);
$("lj").onclick=async e=>{
  const f=e.target.closest(".ch2");if(f){fr=+f.dataset.f;render();return}
  if(e.target.closest("#ljPk")){const p=$("ltp");if(p)p.click();else toast("Pacotes indisponíveis");return}
  const b=e.target.closest(".ib");if(!b||b.disabled)return;
  const x=item(b.dataset.id);if(!x)return;
  if(owned(x)){inv.e[x[1]]=x[0];await salvarEq()}else await comprar(x);
};
$("ljR").onclick=e=>{
  const b=e.target.closest(".rb");if(!b)return;
  if(b.dataset.k==="p"){const p=$("ltp");if(p)p.click();else toast("Pacotes indisponíveis")}
  else $("lt"+b.dataset.k).click();
};
[["c","ltc"],["m","ltm"],["f","ltf"]].forEach(([k,i])=>$(i).onclick=()=>{aba=k;fr=-1;render()});
new MutationObserver(render).observe(sec,{attributes:true,attributeFilter:["class"]});
const nb=document.createElement("button");nb.id="nInv";nb.innerHTML="<b>🎒</b>Inventário";
nav.insertBefore(nb,$("nConfig")||null);
function abrir(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="loja"));
  nav.style.display="flex";nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===nb));
  history.pushState({t:"loja"},"");iniciar();render();
}
nb.onclick=()=>{if(!sec.classList.contains("on"))abrir()};
nav.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b!==nb)nb.classList.remove("on")},true);
$("ljBk").onclick=()=>history.back();
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
