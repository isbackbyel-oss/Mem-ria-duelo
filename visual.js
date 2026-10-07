(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
const j=$("jogar"),jg=$("jogo");
if(!j||!jg||!$("bBuscar"))return;
const css=document.createElement("style");
css.textContent=`
button.opc{display:flex;align-items:center;gap:12px;text-align:left;padding:14px;border-radius:16px;font-size:1.05rem;border:2px solid #1e6fb5;background:rgba(14,34,64,.7);box-shadow:none;color:#fff}
button.opc .ic{font-size:1.7rem;width:2rem;text-align:center}
button.opc .tx{flex:1}button.opc .tx b{display:block}
button.opc small,.tog.dif small{display:block;opacity:.8;font-weight:400;font-size:.8rem}
button.opc .ch{opacity:.8;font-size:1.4rem}
button.opc.big{background:linear-gradient(180deg,#2aa8ff,#0b6fd8);padding:20px;font-size:1.4rem;border-color:#4cc2ff;justify-content:center}
button.opc.big .tx{flex:0}
#jogar .dupla .opc{flex:1;padding:10px;font-size:.95rem}
#jogar .dupla .opc .ch{display:none}
#jogar .dupla .opc .ic{font-size:1.3rem;width:auto}
#jogar .tres button{display:flex;justify-content:center;align-items:center;gap:6px;padding:12px 4px;font-size:.95rem}
.oculto{display:none!important}
.sub2{margin:4px 0 0;font-weight:700;color:#19b4ff}
.tog.dif{display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 4px;border-radius:16px}
.tog.dif .ic{font-size:1.6rem}
.lis li.vazio{flex-direction:column;text-align:center;padding:28px 14px;gap:6px}
.placar{align-items:center;gap:6px}
.jog{position:relative;overflow:visible!important;display:flex;align-items:center;gap:8px;text-align:left;padding:14px 10px;border-radius:16px;font-size:.85rem;background:rgba(10,36,70,.9)!important;color:#fff!important}
#j0{border-color:#19b4ff;box-shadow:0 0 14px rgba(25,180,255,.45)}
#j1{border-color:#ff4fd8;box-shadow:0 0 14px rgba(255,79,216,.45)}
.jog b{margin-left:auto;font-size:2rem;font-style:italic}
.jog .av{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-weight:800;background:linear-gradient(#2aa8ff,#7b5cff);flex-shrink:0}
#j1 .av{background:linear-gradient(#ff4fd8,#7b5cff)}
.jog .tag{position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:.7rem;font-style:normal;font-weight:800;background:#0b6fd8;border:1px solid #19b4ff;border-radius:10px;padding:1px 10px}
.vs{font-style:italic;font-weight:900;color:#19b4ff;font-size:1.2rem}
#tr2{display:flex;gap:10px}
#tr2>div{display:flex;align-items:center;gap:8px;padding:10px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}
#tr2 .tm{flex:1}#tr2 .sq{border-color:#c98a1b}
#tr2 .ic{font-size:1.6rem}
#tr2 small{display:block;font-size:.7rem;letter-spacing:1px;opacity:.85}
#tr2 b{font-size:1.4rem}
#tr2 i{flex:1;height:10px;border-radius:6px;background:#12294a;overflow:hidden;min-width:40px}
#tr2 u{display:block;height:100%;background:#19b4ff;text-decoration:none;transition:width .25s}
.carta .costas{font-size:0;background:linear-gradient(160deg,#0f63d6,#0a3d92);border:2px solid #19b4ff;box-shadow:0 0 12px rgba(25,180,255,.5),inset 0 0 14px rgba(25,180,255,.25)}
.carta .costas::after{content:"🧠";font-size:1.5rem;filter:grayscale(1) brightness(1.6) sepia(1) hue-rotate(165deg) saturate(4)}
.carta .frente{border:2px solid #19b4ff}`;
document.head.appendChild(css);
const mk=(b,ic,t,s,c)=>{if(!b)return;b.className=c||"opc";b.innerHTML='<span class="ic">'+ic+'</span><span class="tx"><b>'+t+"</b>"+(s?"<small>"+s+"</small>":"")+'</span><span class="ch">›</span>'};
const achar=(r,t)=>[...r.querySelectorAll("button")].find(b=>b.textContent.includes(t));

// ===== JOGAR ONLINE =====
const bFila=achar(j,"Fila 2v2"),bVer=achar(j,"Assistir"),tg=achar(j,"opções"),bGrupo=$("bGrupo")||achar(j,"Modo em grupo");
mk($("bBuscar"),"⚡","Jogar agora","","opc big");
mk($("bCriar"),"👥","Criar sala","Convide seus amigos");
mk($("bEntrar"),"🔑","Entrar com código","Junte-se a uma sala");
mk(bGrupo,"👥","Modo em grupo","Jogue com seus amigos");
mk(bFila,"🤝","Fila 2v2","Enfrente duplas em tempo real");
mk(bVer,"👁️","Assistir partidas","Veja partidas ao vivo");
mk($("vJogar"),"↩️","Voltar","Retorne ao menu principal");
if(tg)tg.classList.add("oculto");
const mais=j.querySelector(".mais");
if(mais){mais.classList.add("on");const lb=document.createElement("p");lb.className="sub2";lb.textContent="⚙️ Mais opções";j.insertBefore(lb,mais)}
const tt=j.querySelector(".titulo");
if(tt){const s=document.createElement("p");s.className="nota";s.textContent="Jogue online e mostre seu talento!";tt.after(s)}
$("mCasual").innerHTML="👤 Casual";$("mRank").innerHTML="🏆 Ranqueada";
const ln=$("ligaNota"),dm=document.createElement("p");dm.className="msg";ln.after(dm);ln.style.display="none";
const modo=()=>!$("mRank").classList.contains("sec")?"rank":!$("mLiga").classList.contains("sec")?"liga":"casual";
function modos(){
  const lock=/Chegue ao Ouro/.test(ln.textContent);
  $("mLiga").innerHTML="🏅 Liga"+(lock?" 🔒":"");
  dm.textContent=ln.textContent.trim()||{casual:"Jogue sem pressão e divirta-se!",rank:"Dispute pontos e suba de patente!",liga:""}[modo()];
}
new MutationObserver(modos).observe(ln,{childList:true,characterData:true,subtree:true});
["mCasual","mRank","mLiga"].forEach(i=>new MutationObserver(modos).observe($(i),{attributes:true,attributeFilter:["class"]}));
modos();

// ===== BUSCAR OPONENTE =====
const bs=$("buscar");
if(bs){
  const t=bs.querySelector(".titulo");if(t)t.textContent="⚔️ Buscar oponente";
  const n=bs.querySelector(".nota");if(n)n.textContent="Escolha de 1 a 3 dificuldades e encontre alguém para desafiar suas habilidades!";
  [["tf","⚡","Fácil","Para iniciantes"],["tm","📶","Médio","Boa dificuldade"],["td","⭐","Difícil","Para os mais fortes"]].forEach(([i,ic,a,b])=>{
    const e=$(i);e.classList.add("dif");e.innerHTML='<span class="ic">'+ic+"</span><b>"+a+"</b><small>"+b+"</small>";
  });
  mk($("procurar"),"👥","Procurar oponente","","opc big");
  const ec=document.createElement("button");mk(ec,"🔑","Entrar com código","");
  ec.onclick=()=>$("bEntrar").click();$("procurar").after(ec);
  mk($("vBuscar"),"↩️","Voltar","");
}

// ===== PARTIDAS AO VIVO =====
const av=$("aovivo");
if(av&&$("vlista")){
  mk($("vatual"),"🔄","Atualizar","","opc big");mk($("vvoltar"),"↩️","Voltar","");
  const L=$("vlista");
  new MutationObserver(()=>{
    const li=L.children;
    if(li.length===1&&!li[0].classList.contains("vazio")&&/Nenhuma partida/.test(li[0].textContent))
      L.innerHTML='<li class="vazio"><span style="font-size:3rem">👁️</span><b>Nenhuma partida ao vivo agora.</b><small>Quando houver uma partida, ela aparecerá aqui.</small></li>';
  }).observe(L,{childList:true});
}

// ===== PARTIDA =====
[["j0","VOCÊ"],["j1",""]].forEach(([id,tag])=>{
  const e=$(id),a=document.createElement("span");a.className="av";e.prepend(a);
  if(tag){const t=document.createElement("em");t.className="tag";t.textContent=tag;e.appendChild(t)}
});
const vs=document.createElement("span");vs.className="vs";vs.textContent="VS";$("j1").before(vs);
const ini=s=>{s=s.replace(/\s*\d+🔥\s*$/,"").trim();return s.startsWith("🤖")?"🤖":(s[0]||"?").toUpperCase()};
const row=document.createElement("div");row.id="tr2";
row.innerHTML='<div class="tm"><span class="ic">⏱️</span><div><small id="tmL">SUA VEZ</small><b id="tmV">—</b></div><i><u id="tmB"></u></i></div><div class="sq"><span class="ic">🔥</span><div><small>Sequência</small><b id="sqV">0x</b></div></div>';
$("status").after(row);
const tag2=document.createElement("p");tag2.className="msg";tag2.textContent="🧠 Memorize, encontre, vença!";
$("again").before(tag2);
const TOT=[["Fácil",20],["Médio",15],["Difícil",10]];
let seq=0,ult=0;
setInterval(()=>{
  if(!jg.classList.contains("on"))return;
  $("j0").querySelector(".av").textContent=ini(txt("n0"));
  $("j1").querySelector(".av").textContent=ini(txt("n1"));
  const s=txt("status"),m=s.match(/^(Sua vez|Vez de .+?)(?: · (\d+)s)?$/);
  $("status").style.display=m?"none":"";
  row.style.display=m?"flex":"none";
  if(m){
    $("tmL").textContent=m[1].toUpperCase();
    const sec=m[2]!==undefined?+m[2]:null,tot=TOT.find(x=>txt("modoTxt").includes(x[0]));
    $("tmV").textContent=sec===null?"…":sec+"s";
    $("tmB").style.width=(sec===null||!tot)?"100%":Math.min(100,sec/tot[1]*100)+"%";
  }
  const p=+txt("p0")||0,minha=$("j0").classList.contains("vez");
  if(p<ult)seq=0;else if(p>ult)seq++;
  if(!minha)seq=0;
  ult=p;$("sqV").textContent=seq+"x";
},250);
})();
