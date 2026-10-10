(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
const menu=$("menu");
if(!menu||!$("cartao"))return;
const D=()=>{try{return JSON.parse(localStorage.getItem("viciante")||"{}")}catch(e){return{}}};
const css=document.createElement("style");
css.textContent=`
@keyframes hmUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes hmGl{from{box-shadow:0 6px 0 #c25a00,0 0 18px rgba(255,150,30,.5),inset 0 3px 0 rgba(255,255,255,.45)}to{box-shadow:0 6px 0 #c25a00,0 0 32px rgba(255,170,40,.9),inset 0 3px 0 rgba(255,255,255,.45)}}
body:has(#menu.on){background:radial-gradient(120% 60% at 50% 25%,#2d1b80 0,#150f45 55%,#0a0824 100%) fixed}
main:has(#menu.on) h1{display:none}
body:has(#menu.on) #mus,body:has(#menu.on) #som,body:has(#menu.on) #chip{display:none!important}
#gm{display:none!important}
#hmChip,#hmT{position:fixed;top:calc(env(safe-area-inset-top) + 8px);z-index:6;display:none}
body:has(#menu.on) #hmChip,body:has(#menu.on) #hmT{display:flex}
#hmChip{left:12px;right:124px;max-width:300px;align-items:center;gap:10px;padding:5px 12px 5px 5px;border-radius:28px;border:2px solid #3a49c9;background:rgba(14,22,70,.88);color:#fff;text-align:left;box-shadow:none}
.hmAv{position:relative;flex-shrink:0}
#hmAv{width:48px;height:48px;font-size:1.3rem}
.hmCr{position:absolute;right:-4px;bottom:-4px;font-style:normal;font-size:.9rem}
.hmI{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.hmI b{font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hmI small{opacity:.85;font-size:.7rem}
.hmP{height:7px;border-radius:4px;background:#12204a;overflow:hidden}
.hmP u{display:block;height:100%;width:0;background:linear-gradient(90deg,#19b4ff,#7b5cff);text-decoration:none}
#hmT{right:12px;gap:8px}
.hmB{position:relative;width:48px;height:48px;padding:0;border-radius:14px;border:2px solid #3a49c9;background:rgba(14,22,70,.88);font-size:1.4rem;box-shadow:none}
.hmB em{position:absolute;right:-4px;top:-6px;font-style:normal;font-size:.65rem;font-weight:800;background:#ff7a00;border-radius:10px;padding:1px 5px}
#hmBody{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:14px;padding:4px 0}
.hmBg{position:absolute;inset:0;pointer-events:none}
.hmBg i{position:absolute;width:58px;height:82px;border-radius:12px;border:2px solid var(--c);background:linear-gradient(160deg,rgba(60,50,170,.5),rgba(20,15,70,.6));box-shadow:0 0 14px var(--c);transform:rotate(var(--r));opacity:.8}
#hmBody>*{position:relative}
.hmBody .x{}
.hmTag{margin:0;text-align:center;color:#b9b6ff;font-weight:600}
#hmJ{display:flex;align-items:center;gap:12px;width:88%;padding:16px 22px;border-radius:999px;font-size:2.1rem;font-weight:900;font-style:italic;color:#fff;background:linear-gradient(180deg,#ffd23f 0,#ff9a00 55%,#ff7a00 100%);border:3px solid #ffe08a;text-shadow:0 3px 0 rgba(150,60,0,.6);animation:hmGl 1.6s ease-in-out infinite alternate}
#hmJ .tx{flex:1;text-align:left}
#hmJ:active{transform:translateY(4px);filter:none}
.hmT3{position:relative;width:100%;height:150px}
.hmC{position:absolute;display:grid;place-items:center;width:44%;height:92px;border-radius:14px;border:3px solid #a266ff;background:linear-gradient(135deg,#3b1ea0,#1c0f5a);color:#9a78ff;font-size:2rem;font-style:normal;box-shadow:0 8px 0 #130a44,0 0 18px rgba(150,90,255,.55)}
#hmBody.ent>*{animation:hmUp .25s ease-out both}
#hmBody.ent>*:nth-child(3){animation-delay:.05s}#hmBody.ent>*:nth-child(4){animation-delay:.1s}#hmBody.ent>*:nth-child(5){animation-delay:.15s}
body.sem-anim #hmJ{animation:none}`;
document.head.appendChild(css);
const LOGO='<svg viewBox="0 0 360 215" style="width:100%;max-width:380px;display:block"><defs><linearGradient id="lgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9fc4ff"/></linearGradient><linearGradient id="lgB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff4fd8"/><stop offset="1" stop-color="#7b5cff"/></linearGradient><filter id="lgS" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter></defs>'
+'<rect x="52" y="22" width="72" height="94" rx="12" fill="#4b2fd0" stroke="#9a7bff" stroke-width="3" transform="rotate(-18 88 69)"/><rect x="236" y="18" width="72" height="94" rx="12" fill="#2a7bff" stroke="#7ac2ff" stroke-width="3" transform="rotate(16 272 65)"/>'
+'<g transform="translate(138 6) scale(1.4)"><path d="M4 36L8 10L22 22L32 4L42 22L56 10L60 36Z" fill="#ffc933" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/><rect x="4" y="33" width="56" height="7" rx="2" fill="#e0a800"/><circle cx="32" cy="22" r="3.2" fill="#7a3cff"/></g>'
+'<g filter="url(#lgS)" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-weight="900" font-style="italic" text-anchor="middle" stroke-linejoin="round" stroke="#1b1060" stroke-width="9" paint-order="stroke"><text x="180" y="118" font-size="62" fill="url(#lgA)" textLength="330" lengthAdjust="spacingAndGlyphs">MEMÓRIA</text><text x="180" y="180" font-size="66" fill="url(#lgB)" textLength="250" lengthAdjust="spacingAndGlyphs">DUELO</text></g></svg>';
const body=document.createElement("div");body.id="hmBody";
body.innerHTML='<div class="hmBg"><i style="--c:#3b8bff;--r:-22deg;left:-14px;top:4%"></i><i style="--c:#a24bff;--r:18deg;right:-12px;top:8%"></i><i style="--c:#3b8bff;--r:24deg;left:3%;top:50%;width:44px;height:62px"></i><i style="--c:#a24bff;--r:-16deg;right:4%;top:46%;width:44px;height:62px"></i></div>'
+'<div style="width:100%;display:flex;justify-content:center">'+LOGO+'</div><p class="hmTag">Encontre os pares e<br>desafie seus amigos!</p>'
+'<button id="hmJ"><span>⚔️</span><span class="tx">Jogar</span><span>›</span></button>'
+'<div class="hmT3"><i class="hmC" style="left:4%;top:34px;transform:perspective(500px) rotateX(52deg) rotateZ(-12deg)">♛</i><i class="hmC" style="left:30%;top:56px;transform:perspective(500px) rotateX(52deg) rotateZ(3deg);z-index:2">♛</i><i class="hmC" style="left:52%;top:30px;transform:perspective(500px) rotateX(52deg) rotateZ(14deg)">♛</i></div>';
menu.insertBefore(body,menu.firstChild);
if($("mcBar"))menu.insertBefore($("mcBar"),menu.firstChild);

const chip=document.createElement("button");chip.id="hmChip";
chip.innerHTML='<span class="hmAv"><span class="av2" id="hmAv">?</span><em class="hmCr" id="hmCr"></em></span><span class="hmI"><b id="hmN">—</b><small id="hmL"></small><span class="hmP"><u id="hmX"></u></span><small id="hmXt"></small></span>';
document.body.appendChild(chip);
const tl=document.createElement("div");tl.id="hmT";
tl.innerHTML='<button class="hmB" id="hmG">🎁<em id="hmGn">0/3</em></button><button class="hmB" id="hmS">🔊</button>';
document.body.appendChild(tl);

const ORD=["Bronze","Prata","Ouro","Platina","Diamante","Heroico","Mestre"];
function atualizar(){
  const t=txt("cartao").split(" · "),n=t.length,nome=t.slice(0,Math.max(1,n-2)).join(" · ").trim(),pat=(t[n-2]||"").trim();
  const d=D(),xp=d.xp||0,lv=Math.floor(Math.sqrt(xp/25))+1,l0=25*(lv-1)*(lv-1),l1=25*lv*lv;
  $("hmN").textContent=nome||"Jogador";
  $("hmL").textContent="Nv. "+lv+(pat?" · "+pat:"");
  $("hmX").style.width=Math.round((xp-l0)/(l1-l0)*100)+"%";
  $("hmXt").textContent=xp.toLocaleString("pt-BR")+" / "+l1.toLocaleString("pt-BR")+" XP";
  $("hmCr").textContent=ORD.indexOf(pat)>=2?"👑":"";
  const ini=(nome[0]||"?").toUpperCase(),av=$("hmAv");
  if(av.dataset.ini!==ini){av.dataset.ini=ini;delete av.dataset.avx;av.textContent=ini}
  $("hmGn").textContent=txt("msN")||"0/3";
  const off=somOff()&&musOff();$("hmS").textContent=off?"🔇":"🔊";
}
const somOff=()=>$("som")&&$("som").textContent.trim()==="🔇";
const musOff=()=>$("mus")&&$("mus").textContent.trim()==="🔕";
new MutationObserver(atualizar).observe($("cartao"),{childList:true,subtree:true,characterData:true});
setInterval(atualizar,2000);atualizar();

chip.onclick=()=>$("nPerfil")&&$("nPerfil").click();
$("hmG").onclick=()=>{const b=menu.querySelector("button.card:not(#cartao)");if(b)b.click()};
$("hmS").onclick=()=>{
  if(somOff()&&musOff()){if($("som"))$("som").click();if($("mus"))$("mus").click()}
  else{if(!somOff()&&$("som"))$("som").click();if(!musOff()&&$("mus"))$("mus").click()}
  setTimeout(atualizar,80);
};
$("hmJ").onclick=()=>{if($("gmM"))$("gmM").click();else{$("bJogar").click();$("bBuscar").click()}};
function ent(){body.classList.remove("ent");void body.offsetWidth;body.classList.add("ent");setTimeout(()=>body.classList.remove("ent"),700)}
new MutationObserver(()=>{if(menu.classList.contains("on"))ent()}).observe(menu,{attributes:true,attributeFilter:["class"]});
})();
