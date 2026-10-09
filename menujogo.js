(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
const menu=$("menu");
if(!menu||!$("cartao")||!$("bJogar")||!$("bBuscar"))return;
const css=document.createElement("style");
css.textContent=`
@keyframes gmIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes gmGl{from{box-shadow:0 0 12px rgba(255,150,30,.4)}to{box-shadow:0 0 24px rgba(255,170,40,.8)}}
main:has(#menu.on) h1{font-size:2.3rem;margin:0 0 4px}
body:has(#menu.on) #chip{display:none}
#menu>#rk,#menu>#ms,#menu>#bJogar,#menu>#bTreino{display:none!important}
#gm,#mdL{display:flex;flex-direction:column;gap:12px}
.ent>*{animation:gmIn .22s ease-out both}
.ent>*:nth-child(2){animation-delay:.04s}.ent>*:nth-child(3){animation-delay:.08s}
.ent>*:nth-child(4){animation-delay:.12s}.ent>*:nth-child(5){animation-delay:.16s}
.ent>*:nth-child(6){animation-delay:.2s}
.gmb{transition:transform .08s ease,filter .12s ease}
.gmb:active{transform:scale(.96);filter:brightness(1.25)}
.gmb .ch{opacity:.8;font-size:1.4rem}
.pbar{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;border:2px solid #3a49c9;background:rgba(14,22,70,.8);box-shadow:none;text-align:left;color:#fff}
.pbar .av2{width:52px;height:52px;font-size:1.4rem}
.pbar .pi{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.pbar .pi b{font-size:1.15rem}.pbar small{opacity:.85}
.pgb{display:block;height:8px;border-radius:5px;background:#12204a;overflow:hidden}
.pgb u{display:block;height:100%;width:0;background:linear-gradient(90deg,#19b4ff,#7b5cff);text-decoration:none;transition:width .4s}
.gmj{display:flex;align-items:center;gap:14px;padding:20px 22px;border-radius:20px;font-size:2rem;font-weight:900;font-style:italic;color:#fff;background:linear-gradient(180deg,#ffbf2f,#ff7a00);border:2px solid #ffd36b;text-shadow:0 2px 0 rgba(120,50,0,.5);animation:gmGl 1.6s ease-in-out infinite alternate}
.gmj .tx{flex:1;text-align:left}
.gmc{display:flex;align-items:center;gap:12px;padding:12px;border-radius:16px;border:2px solid #3a49c9;background:linear-gradient(135deg,rgba(40,50,150,.65),rgba(20,20,70,.7));text-align:left;color:#fff;box-shadow:none}
.gmc .ic{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-size:1.6rem;background:rgba(10,20,70,.7);border:2px solid #4a5adb;flex-shrink:0}
.gmc .tx{flex:1;min-width:0}.gmc .tx b{display:block;font-size:1.1rem}.gmc small{display:block;opacity:.8;font-weight:400}
.bdg{padding:2px 10px;border-radius:12px;background:#ff7a00;font-weight:800;font-size:.85rem}
.mdc{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;border:2px solid var(--b);background:linear-gradient(135deg,var(--a),#0a0f2a);text-align:left;color:#fff;box-shadow:0 0 12px var(--b)}
.mdc .ic{font-size:2.4rem;width:56px;text-align:center;flex-shrink:0}
.mdc .tx{flex:1;min-width:0}.mdc b{display:block;font-size:1.35rem}.mdc small{display:block;opacity:.9;font-weight:400}
.mdc .tg{margin-top:4px;font-size:.8rem;opacity:.85}
body.sem-anim .gmj{animation:none}
@media (prefers-reduced-motion:reduce){.gmj{animation:none}}`;
document.head.appendChild(css);

// ===== tela inicial =====
const gm=document.createElement("div");gm.id="gm";
gm.innerHTML='<button class="gmb pbar" id="gmP"><span class="av2" id="gmAv">?</span><span class="pi"><b id="gmN">—</b><small id="gmS"></small><span class="pgb"><u id="gmX"></u></span></span><span class="ch">›</span></button>'
+'<button class="gmb gmj" id="gmJ"><span>⚔️</span><span class="tx">Jogar</span><span>›</span></button>'
+'<button class="gmb gmc" id="gmM"><span class="ic">🎮</span><span class="tx"><b>Modos de jogo</b><small>Escolha como quer jogar</small></span><span class="ch">›</span></button>'
+'<button class="gmb gmc" id="gmPf"><span class="ic">👤</span><span class="tx"><b>Perfil</b><small>Veja seu progresso e personalize</small></span><span class="ch">›</span></button>'
+'<button class="gmb gmc" id="gmB"><span class="ic">🎁</span><span class="tx"><b>Bônus diário</b><small>Missões e baú do dia</small></span><span class="bdg" id="gmBd">0/3</span><span class="ch">›</span></button>'
+'<button class="gmb gmc" id="gmC"><span class="ic">⚙️</span><span class="tx"><b>Configurações</b><small>Som, cores e ajustes</small></span><span class="ch">›</span></button>';
menu.insertBefore(gm,menu.firstChild);

const D=()=>{try{return JSON.parse(localStorage.getItem("viciante")||"{}")}catch(e){return{}}};
function atualizar(){
  const t=txt("cartao").split(" · "),n=t.length,nome=t.slice(0,Math.max(1,n-2)).join(" · ").trim(),pat=(t[n-2]||"").trim();
  const d=D(),xp=d.xp||0,lv=Math.floor(Math.sqrt(xp/25))+1,l0=25*(lv-1)*(lv-1),l1=25*lv*lv;
  $("gmN").textContent=nome||"Jogador";
  $("gmS").textContent=(pat?pat+" · ":"")+"Nv "+lv+" · "+xp+"/"+l1+" XP";
  $("gmX").style.width=Math.round((xp-l0)/(l1-l0)*100)+"%";
  const ini=(nome[0]||"?").toUpperCase(),av=$("gmAv");
  if(av.dataset.ini!==ini){av.dataset.ini=ini;delete av.dataset.avx;av.textContent=ini}
  $("gmBd").textContent=txt("msN")||"0/3";
}
new MutationObserver(atualizar).observe($("cartao"),{childList:true,subtree:true,characterData:true});
setInterval(atualizar,2500);
atualizar();

// ===== atalhos =====
$("gmP").onclick=()=>$("nPerfil").click();
$("gmJ").onclick=()=>{$("bJogar").click();$("bBuscar").click()};
$("gmPf").onclick=()=>$("nPerfil").click();
$("gmB").onclick=()=>{const b=menu.querySelector("button.card:not(#cartao)");if(b)b.click()};
$("gmC").onclick=()=>{const b=$("nConfig");if(b)b.click()};

// ===== animação curta ao abrir =====
function ent(el){el.classList.remove("ent");void el.offsetWidth;el.classList.add("ent");setTimeout(()=>el.classList.remove("ent"),700)}
new MutationObserver(()=>{if(menu.classList.contains("on"))ent(gm)}).observe(menu,{attributes:true,attributeFilter:["class"]});

// ===== escolha do modo de jogo =====
const sec=document.createElement("section");sec.id="modos";sec.className="tela";
sec.innerHTML='<div class="hdr2"><button class="back" id="mdB">←</button><b>Modos de jogo</b><span style="width:44px"></span></div><p class="nota">Escolha como quer jogar.</p><div id="mdL"></div>';
document.querySelector("main").appendChild(sec);
function ir(id){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id===id));
  $("nav").style.display="none";
}
function irJogar(modo){
  $(modo==="liga"?"mLiga":modo==="rank"?"mRank":"mCasual").click();
  $("bJogar").click();
}
function achar(t){return [...$("jogar").querySelectorAll("button")].find(b=>b.textContent.includes(t))}
const M=[
 ["⚔️","1v1","Enfrente um jogador em uma batalha direta.","👤 1 jogador","#2f7bff","#0f3a8c",()=>irJogar("casual")],
 ["👥","2v2","Jogue em dupla com seu amigo ou com um aliado aleatório.","👥 2 jogadores","#a24bff","#3a1590",()=>{irJogar("casual");const b=achar("Fila 2v2");if(b)b.click();else alert("A fila 2v2 não está disponível.")}],
 ["🎯","Modo Ranqueado","Mostre suas habilidades e suba no ranking.","1v1 · vale pontos","#19c9b0","#0a5a5e",()=>irJogar("rank")],
 ["🏅","Liga","Só para Ouro ou mais. Vale mais pontos!","1v1","#e0a020","#6a4208",()=>irJogar("liga")],
 ["🧑‍🤝‍🧑","1v1v1","Três jogadores, cada um por si.","3 jogadores","#4aa0d8","#123a5c",()=>{irJogar("casual");const b=$("bGrupo");if(b)b.click();else alert("O modo em grupo não está disponível.")}],
 ["🤖","Treino","Pratique contra o robô, sem perder pontos.","Solo","#7a8bb0","#222c48",()=>$("bTreino").click()]
];
function montar(){
  const lock=/🔒/.test(txt("mLiga"));
  $("mdL").innerHTML=M.map((m,i)=>'<button class="gmb mdc" data-i="'+i+'" style="--b:'+m[4]+";--a:"+m[5]+'"><span class="ic">'+m[0]+'</span><span class="tx"><b>'+m[1]+"</b><small>"+m[2]+'</small><div class="tg">'+(m[1]==="Liga"&&lock?"🔒 Chegue ao Ouro para liberar":m[3])+'</div></span><span class="ch">›</span></button>').join("");
}
$("mdL").addEventListener("click",e=>{const b=e.target.closest(".mdc");if(b)M[+b.dataset.i][6]()});
$("gmM").onclick=()=>{montar();ir("modos");history.pushState({t:"modos"},"");ent($("mdL"))};
$("mdB").onclick=()=>history.back();
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(t&&t.id==="modos"){
    document.querySelectorAll(".tela").forEach(x=>x.classList.toggle("on",x.id==="menu"));
    $("nav").style.display="flex";
    document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on",b.id==="nInicio"));
  }
});
})();
