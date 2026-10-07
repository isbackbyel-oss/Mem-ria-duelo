(function(){
const $=id=>document.getElementById(id);
const menu=$("menu");
if(!menu||!$("cartao")||!$("bJogar")||!$("bTreino"))return;
const TH={Bronze:0,Prata:100,Ouro:250,Platina:450,Diamante:700,Heroico:1000,Mestre:1400},ORD=Object.keys(TH);
const hoje=()=>new Date().toLocaleDateString("sv-SE");
const ontem=()=>new Date(Date.now()-864e5).toLocaleDateString("sv-SE");
const D=()=>{try{return JSON.parse(localStorage.getItem("viciante")||"{}")}catch(e){return{}}};
const MISS=[["Jogue 3 partidas online","jogos",3],["Ganhe 1 partida online","vit",1],["Acerte 10 pares","pares",10]];

// tema azul (só se você não escolheu outras cores em Config)
let C={};try{C=JSON.parse(localStorage.getItem("cfgMemoria")||"{}")}catch(e){}
if((!C.bg||C.bg==="#2b1f4a")&&(!C.acc||C.acc==="#ffb703")){
  const r=document.documentElement.style;
  r.setProperty("--bg","#0a1424");r.setProperty("--back","#1ea0ff");r.setProperty("--txt","#eef6ff");r.setProperty("--navbg","#081020");
  const m=document.querySelector("meta[name=theme-color]");if(m)m.content="#0a1424";
}
const st=document.createElement("style");
st.textContent=`
body{background:radial-gradient(120% 55% at 50% 0,#12305a 0,var(--bg) 62%) fixed}
main{padding-top:76px!important}
main:has(#jogo.on) h1{display:none}
h1{font-size:1.6rem;font-style:italic;letter-spacing:-.5px}
h1 b{color:#19b4ff}
button{color:#fff;background:linear-gradient(180deg,#2aa8ff,#0b6fd8);box-shadow:0 3px 12px rgba(30,160,255,.3)}
button.sec{background:rgba(255,255,255,.04);box-shadow:none;border-color:#1e6fb5}
.tog.on,.lis li.eu,#nav button.on{color:#fff}
.carta .costas{color:#fff}
#nav{background:var(--navbg)!important;border-top:1px solid #12335e}
#nav button{color:#a9c4e4}
#nav button.on{background:linear-gradient(180deg,#2aa8ff,#0b6fd8)}
#som,#mus{background:#0e2240!important;border:2px solid #1e5f9e!important;border-radius:14px;color:#fff}
#som{right:108px!important}
#menu>.card,#menu>.barra,#menu>.nota{display:none!important}
.blk{display:flex;align-items:center;gap:12px;padding:12px;border-radius:18px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);color:var(--txt);cursor:pointer}
.blk small{opacity:.8}
#rkEsc svg{width:62px;height:62px}
#rk .mid{flex:1;min-width:0}
#rk .mid b{font-size:1.5rem;letter-spacing:1px;display:block}
#rkSeg{display:flex;gap:3px;margin-top:6px}
#rkSeg i{flex:1;height:10px;border-radius:3px;background:#1a2f4f}
#rkSeg i.on{background:#19b4ff}
#rk .dir{text-align:center;border-left:1px solid #1e4f80;padding-left:10px;color:#19b4ff;font-weight:800}
#rk .dir small{display:block;color:var(--txt)}
#ms{flex-direction:column;align-items:stretch;gap:8px}
#ms .top{display:flex;justify-content:space-between;font-weight:800;letter-spacing:.5px}
.mr{padding:8px 10px;border-radius:12px;border:1px solid #1e4f80;background:rgba(10,30,60,.6)}
.mr .t{display:flex;justify-content:space-between;font-size:.95rem}
.mr .pb{height:6px;border-radius:4px;background:#1a2f4f;margin-top:6px;overflow:hidden}
.mr .pb u{display:block;height:100%;background:#19b4ff;text-decoration:none}
#msSeq{padding:8px 10px;border-radius:12px;border:1px solid #1e4f80;display:flex;justify-content:space-between}
#bJogar{font-size:1.5rem;letter-spacing:1px;padding:22px;border-radius:18px}
#bTreino{display:flex;align-items:center;gap:12px;text-align:left;border-radius:18px;padding:14px;font-size:1.2rem;border:2px solid #1e6fb5;background:rgba(14,34,64,.6)}
#bTreino b{display:block;letter-spacing:1px}#bTreino small{opacity:.8;font-weight:400}
#chip{position:fixed;top:calc(env(safe-area-inset-top) + 8px);right:12px;z-index:5;display:flex;align-items:center;gap:6px;padding:4px 8px 4px 4px;border-radius:14px;border:2px solid #1e5f9e;background:#0e2240;color:#fff;font-size:.8rem;cursor:pointer}
#chAv{width:30px;height:30px;border-radius:50%;background:linear-gradient(#2aa8ff,#7b5cff);display:grid;place-items:center;font-weight:800}
#chip i{display:block;width:44px;height:6px;border-radius:4px;background:#1a2f4f;overflow:hidden;margin-top:3px}
#chip u{display:block;height:100%;background:#19b4ff;text-decoration:none}`;
document.head.appendChild(st);

// logo
const h1=document.querySelector("h1");if(h1)h1.innerHTML="🧠 Memória <b>Duelo</b>";

// cartão da patente
const rk=document.createElement("div");rk.id="rk";rk.className="blk";
rk.innerHTML='<span id="rkEsc"></span><div class="mid"><b id="rkNome"></b><span id="rkPts"></span><small id="rkTit" style="display:block"></small><div id="rkSeg">'+"<i></i>".repeat(10)+'</div></div><div class="dir"><span>👑</span><div id="rkFal"></div><small id="rkProx"></small></div>';
// missões do dia
const ms=document.createElement("div");ms.id="ms";ms.className="blk";
ms.innerHTML='<div class="top"><span>🎯 MISSÕES DO DIA</span><span id="msN">0/3</span></div>'
  +MISS.map((m,i)=>'<div class="mr"><div class="t"><span>'+m[0]+'</span><span id="mt'+i+'"></span></div><div class="pb"><u id="mb'+i+'"></u></div></div>').join("")
  +'<div id="msSeq"><span>🔥 Sequência: <b id="msD">0 dias</b></span><span>›</span></div>';
menu.insertBefore(ms,menu.firstChild);menu.insertBefore(rk,menu.firstChild);

// botões principais
$("bJogar").textContent="▶ JOGAR ONLINE";
$("bTreino").innerHTML='<span style="font-size:2rem">🤖</span><span style="flex:1"><b>TREINO</b><small>Pratique sem perder pontos</small></span><span>›</span>';

// chip de nível (canto superior direito)
const chip=document.createElement("div");chip.id="chip";
chip.innerHTML='<span id="chAv">?</span><div><b id="chNv">Nv 1</b><i><u id="chBar"></u></i></div>';
document.body.appendChild(chip);

rk.onclick=()=>$("cartao").click();
chip.onclick=()=>$("cartao").click();
ms.onclick=()=>{const b=[...menu.children].find(e=>e.tagName==="BUTTON"&&e.classList.contains("card")&&e.id!=="cartao");if(b)b.click()};

function atualizar(){
  const t=$("cartao").textContent.split(" · "),n=t.length;
  const pat=(t[n-2]||"Bronze").trim(),pts=parseInt(t[n-1])||0,nome=t.slice(0,n-2).join(" · ").trim();
  const i=ORD.indexOf(pat),nx=ORD[i+1],a=TH[pat]||0,b=nx?TH[nx]:a;
  const sv=$("cartao").querySelector("svg");
  $("rkEsc").innerHTML=sv?sv.outerHTML:"";
  $("rkNome").textContent=pat.toUpperCase();
  $("rkPts").textContent=nx?pts+" / "+b+" pts":pts+" pts · máxima";
  const f=nx?Math.round((pts-a)/(b-a)*10):10;
  [...$("rkSeg").children].forEach((e,k)=>e.classList.toggle("on",k<f));
  $("rkFal").textContent=nx?(b-pts)+" pts":"🏆";
  $("rkProx").textContent=nx?"para "+nx:"patente máxima";
  const d=D(),p=d.dia===hoje()?(d.p||{}):{},xp=d.xp||0;
  $("rkTit").textContent=d.eq?"“"+d.eq+"”":"";
  let feitas=0;
  MISS.forEach((m,k)=>{
    const v=Math.min(p[m[1]]||0,m[2]);if(v>=m[2])feitas++;
    $("mt"+k).textContent=v+"/"+m[2];$("mb"+k).style.width=Math.round(v/m[2]*100)+"%";
  });
  $("msN").textContent=feitas+"/3";
  const s=(d.ult===hoje()||d.ult===ontem())?(d.n||0):0;
  $("msD").textContent=s+" dia"+(s===1?"":"s");
  const lv=Math.floor(Math.sqrt(xp/25))+1,l0=25*(lv-1)*(lv-1),l1=25*lv*lv;
  $("chNv").textContent="Nv "+lv;$("chBar").style.width=Math.round((xp-l0)/(l1-l0)*100)+"%";
  $("chAv").textContent=(nome[0]||"?").toUpperCase();
}
new MutationObserver(atualizar).observe($("cartao"),{childList:true,subtree:true,characterData:true});
setInterval(atualizar,2500);
atualizar();
})();
