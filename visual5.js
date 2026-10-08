(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
if(!$("cartao"))return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const css=document.createElement("style");
css.textContent=`
@keyframes entra{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes pop{0%{transform:scale(.9);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes gira{to{transform:rotate(360deg)}}
@keyframes sobe{from{transform:translateY(100%)}to{transform:none}}
@keyframes flut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-34px)}}
.tela.on{animation:entra .2s ease-out}
#jogo.on .placar{animation:pop .35s ease-out}
button:not(.carta){min-height:44px;transition:transform .08s,filter .15s}
button:active{transform:scale(.96);filter:brightness(1.15)}
.carta:active{transform:scale(.95)}
#nav button{min-height:56px}
input,select{font-size:16px!important;min-height:48px}
body.sem-anim *{animation:none!important}
main:not(:has(#menu.on,#boas.on,#carregando.on)) h1{display:none}
body:has(#config.on) #mus,body:has(#config.on) #som{display:none!important}
#vJogar,#vBuscar,#vTreino,#vvoltar,#dpVolta,#mvVolta,#mvoltar{display:none!important}
.titulo{position:relative;min-height:44px;display:flex;align-items:center;justify-content:center}
.bk{position:absolute;left:0;top:0;width:44px;height:44px;padding:0;border-radius:12px;font-size:1.4rem;background:rgba(14,34,64,.8);border:2px solid #1e5f9e;box-shadow:none}
.sp{width:44px;height:44px;border:4px solid #1a2f4f;border-top-color:#19b4ff;border-radius:50%;animation:gira 1s linear infinite;align-self:center;flex-shrink:0}
.danger{background:transparent!important;border:2px solid #b3414b!important;color:#ff8a93!important;box-shadow:none!important}
#meuCod{padding:14px;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}
#jogo .fl,.jog .fl{position:absolute;right:10px;top:-8px;font-weight:900;font-size:1.3rem;color:#3ddc97;animation:flut .9s ease-out forwards;pointer-events:none}
#jogo.fim #reac,#jogo.fim #again,#jogo.fim #sair{display:none!important}
#res{position:fixed;left:0;right:0;bottom:0;z-index:70;display:none;flex-direction:column;gap:10px;padding:18px 16px calc(18px + env(safe-area-inset-bottom));text-align:center;background:linear-gradient(#0e2240,#081020);border-top:2px solid #19b4ff;border-radius:22px 22px 0 0;animation:sobe .3s ease-out}
#res h2{margin:0;font-size:1.8rem}
#res .chips span{display:inline-block;margin:2px;padding:4px 10px;border-radius:12px;background:rgba(30,160,255,.2);font-size:.9rem}
.toast{position:fixed;top:calc(env(safe-area-inset-top) + 72px);left:50%;transform:translateX(-50%);z-index:95;padding:10px 18px;border-radius:14px;background:#0b6fd8;color:#fff;font-weight:800;animation:pop .3s ease-out;white-space:nowrap}`;
document.head.appendChild(css);

// ===== seta de voltar no topo (no lugar do botão de baixo) =====
[["jogar","vJogar"],["buscar","vBuscar"],["treino","vTreino"],["aovivo","vvoltar"],["dupla2","dpVolta"],["missoes","mvVolta"],["mconf","mvoltar"]].forEach(([s,b])=>{
  const sc=$(s),bt=$(b),t=sc&&sc.querySelector(".titulo");
  if(!sc||!bt||!t||t.querySelector(".bk"))return;
  const k=document.createElement("button");k.className="bk";k.textContent="←";k.setAttribute("aria-label","Voltar");
  k.onclick=()=>bt.click();t.prepend(k);
});

// ===== duplicados e textos repetidos =====
const bs=$("buscar");
if(bs)[...bs.querySelectorAll("button")].forEach(b=>{if(/Entrar com código/.test(b.textContent))b.style.display="none"});
const jg=$("jogar");
if(jg)[...jg.querySelectorAll(".nota")].forEach(p=>{if(/mostre seu talento/.test(p.textContent))p.style.display="none"});
const rst=$("oReset");if(rst)rst.classList.add("danger");

// ===== círculos de carregamento =====
const sp=()=>{const d=document.createElement("div");d.className="sp";return d};
const car=$("carregando");if(car&&!car.querySelector(".sp"))car.prepend(sp());
const bd=$("buscando");if(bd&&!bd.querySelector(".sp"))bd.prepend(sp());

// ===== sala de espera =====
const es=$("espera");
if(es&&$("meuCod")&&$("zap")&&$("voltarEspera")&&!es.dataset.v5){
  es.dataset.v5="1";
  const ps=[...es.querySelectorAll("p.msg")],instr=ps[0],aguard=ps[ps.length-1];
  const cp=document.createElement("button");cp.className="sec";cp.textContent="📋 Copiar código";
  cp.onclick=async()=>{
    const c=txt("meuCod").trim();
    try{await navigator.clipboard.writeText(c);cp.textContent="✅ Copiado!"}catch(e){prompt("Copie o código:",c)}
    setTimeout(()=>{cp.textContent="📋 Copiar código"},1500);
  };
  $("meuCod").after(cp);
  const sw=document.createElement("div");
  sw.style.cssText="display:flex;align-items:center;justify-content:center;gap:10px";
  sw.append(sp(),document.createTextNode("Aguardando o outro jogador…"));
  aguard.replaceWith(sw);
  const z=$("zap");z.className="opc big";z.innerHTML='<span class="tx"><b>💬 Enviar pelo WhatsApp</b></span>';
  const v=$("voltarEspera");v.className="danger";v.textContent="Cancelar sala";
  [[$("modoEspera"),1],[instr,2],[$("meuCod"),3],[cp,4],[z,5],[sw,6],[v,7]].forEach(([e,o])=>{if(e)e.style.order=o});
}
const ml=$("msairL");if(ml){ml.className="danger";ml.textContent="Cancelar sala"}

// ===== aviso rápido =====
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

// ===== resultado da partida =====
const rs=document.createElement("div");rs.id="res";document.body.appendChild(rs);
let last="";
function resultado(){
  const j=$("jogo"),on=!!(j&&j.classList.contains("on")),ag=$("again"),s=txt("status");
  const fim=on&&((ag&&ag.style.display==="block")||/saiu da partida/.test(s));
  if(j)j.classList.toggle("fim",fim);
  if(!fim){rs.style.display="none";last="";return}
  if(last===s&&rs.style.display==="flex")return;
  last=s;
  const partes=s.split(" · "),h=partes[0],ex=partes.slice(1),de=ag&&ag.style.display==="block";
  let ic="😔",tt="Derrota",cl="#ff8a93",sub=h;
  if(/^Você ganhou/.test(h)){ic="🎉";tt="Vitória!";cl="#3ddc97";sub=""}
  else if(/^Empate/.test(h)){ic="🤝";tt="Empate";cl="#ffc933";sub=""}
  else if(/saiu da partida/.test(h)){ic="🚪";tt="Partida encerrada";cl="#ffc933"}
  rs.innerHTML='<div style="font-size:2.6rem">'+ic+'</div><h2 style="color:'+cl+'">'+tt+"</h2>"
    +(sub?"<div>"+esc(sub)+"</div>":"")
    +(ex.length?'<div class="chips">'+ex.map(x=>"<span>"+esc(x)+"</span>").join("")+"</div>":"")
    +(de?'<button id="rsA" class="opc big"><span class="tx"><b>Jogar de novo</b></span></button>':"")
    +'<button id="rsM" class="opc"><span class="tx"><b>Voltar ao menu</b></span></button>';
  rs.style.display="flex";
  const a=$("rsA");if(a)a.onclick=()=>{rs.style.display="none";ag.click()};
  $("rsM").onclick=()=>{rs.style.display="none";$("sair").click()};
}

// ===== +1 flutuante e missão concluída =====
let u0=0,u1=0,mN=null;
function pontos(){
  const j=$("jogo");
  if(!j||!j.classList.contains("on")){u0=u1=0;return}
  [["p0","j0"],["p1","j1"]].forEach(([p,c],k)=>{
    const v=+txt(p)||0,u=k?u1:u0;
    if(v>u&&$(c)){const f=document.createElement("span");f.className="fl";f.textContent="+"+(v-u);$(c).appendChild(f);setTimeout(()=>f.remove(),1000)}
    if(k)u1=v;else u0=v;
  });
}
function missao(){
  const e=$("msN");if(!e)return;
  const n=parseInt(e.textContent)||0;
  if(mN!==null&&n>mN)toast("🎯 Missão concluída!"+(n===3?" Abra o baú!":""));
  mN=n;
}
function perigo(){
  ["sair","msair"].forEach(i=>{const b=$(i);if(b)b.classList.toggle("danger",/^Sair/.test(b.textContent.trim()))});
}
setInterval(()=>{resultado();pontos();missao();perigo()},300);
})();
