(function(){
const $=id=>document.getElementById(id);
const menu=$("menu");
if(!menu)return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const css=document.createElement("style");
css.textContent=`#tut{position:fixed;inset:0;z-index:90;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;background:radial-gradient(120% 70% at 50% 30%,#241a70,#070a24)}#tut.on{display:flex;animation:pop .3s ease-out}#tut .ic{font-size:5rem}#tut h2{margin:0;font-size:1.7rem}#tut p{margin:0;max-width:320px;line-height:1.5;opacity:.92}#tut .dots{display:flex;gap:8px}#tut .dots i{width:10px;height:10px;border-radius:50%;background:#2a3f9a}#tut .dots i.on{background:#19b4ff}#tut .bt{display:flex;gap:10px;width:100%;max-width:340px}#tut .bt button{flex:1}#upd{position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:88;display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#0b6fd8;color:#fff;font-weight:700;box-shadow:0 4px 18px rgba(0,0,0,.4)}#upd.on{display:flex}#upd span{flex:1}#upd button{padding:8px 14px;min-height:40px;background:#fff;color:#0b6fd8}`;
document.head.appendChild(css);

// ===== COMO JOGAR =====
const P=[
["🃏","Encontre os pares","Vire duas cartas por vez. Se forem iguais, você marca ponto e joga de novo. Se errar, a vez passa para o adversário."],
["⏱️","O tempo é curto","Cada jogada tem tempo: 20 s no Fácil, 15 s no Médio e 10 s no Difícil. Se o tempo acabar, você perde a vez."],
["🎮","Escolha como jogar","Casual é para se divertir. Ranqueada sobe sua patente. Liga é para Ouro ou mais. Dá para jogar em dupla (2v2) com amigos."],
["🪙","Ganhe e personalize","Jogar rende moedas, XP e missões. Use na Loja para mudar o visual das cartas. Moeda não dá vantagem na partida."]];
const t=document.createElement("div");t.id="tut";document.body.appendChild(t);
let i=0;
function pinta(){
  const p=P[i],u=i===P.length-1;
  t.innerHTML='<div class="ic">'+p[0]+"</div><h2>"+p[1]+"</h2><p>"+p[2]+'</p><div class="dots">'+P.map((_,k)=>'<i class="'+(k===i?"on":"")+'"></i>').join("")+'</div><div class="bt">'+(u?"":'<button class="sec" id="tutP">Pular</button>')+'<button class="opc big" id="tutN"><span class="tx"><b>'+(u?"Começar!":"Próximo")+"</b></span></button></div>";
  $("tutN").onclick=()=>{if(u)fecha();else{i++;pinta()}};
  const p2=$("tutP");if(p2)p2.onclick=fecha;
}
function abre(){i=0;pinta();t.classList.add("on")}
function fecha(){t.classList.remove("on");ss("tut","1")}
setInterval(()=>{
  if(ls("tut"))return;
  const c=$("cartao");
  if(menu.classList.contains("on")&&c&&c.textContent.trim().length>3&&!t.classList.contains("on"))abre();
},1500);
const cf=$("config");
if(cf){
  const r=document.createElement("div");r.className="lin";
  r.innerHTML='<span>❓ Como jogar</span><button id="tutV" class="sec" style="padding:8px 14px;font-size:1rem">Ver</button>';
  const ref=$("oReset");
  if(ref)cf.insertBefore(r,ref);else cf.appendChild(r);
  $("tutV").onclick=abre;
}

// ===== AVISO DE NOVA VERSÃO =====
const B=document.createElement("div");B.id="upd";
B.innerHTML='<span>🔄 Nova versão do jogo disponível!</span><button id="updB">Atualizar</button>';
document.body.appendChild(B);
$("updB").onclick=()=>location.reload();
const arqs=()=>{
  const u=new Set([location.pathname]);
  [...document.scripts].forEach(s=>{if(s.src&&s.src.indexOf(location.origin)===0)u.add(new URL(s.src).pathname)});
  return [...u];
};
async function hash(u){
  try{
    const r=await fetch(u+"?c="+Date.now(),{cache:"no-store"});if(!r.ok)return null;
    const x=await r.text();let h=0;for(let k=0;k<x.length;k++)h=(h*31+x.charCodeAt(k))|0;
    return h+":"+x.length;
  }catch(e){return null}
}
let base=null,achou=false;
async function checa(){
  if(achou){mostra();return}
  const L=arqs(),h=await Promise.all(L.map(hash));
  if(h.includes(null))return;
  const s=L.map((x,k)=>x+"="+h[k]).join("|");
  if(base===null){base=s;return}
  if(s!==base){achou=true;mostra()}
}
function mostra(){
  const j=$("jogo"),m=$("mjogo");
  const jogando=(j&&j.classList.contains("on"))||(m&&m.classList.contains("on"));
  B.classList.toggle("on",achou&&!jogando);
}
setTimeout(checa,8000);
setInterval(checa,300000);
})();
