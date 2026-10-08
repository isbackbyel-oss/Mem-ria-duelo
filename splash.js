(function(){
try{
if(document.getElementById("splash"))return;
let anim=true;
try{const c=JSON.parse(localStorage.getItem("cfgMemoria")||"{}");if(c.anim===false)anim=false}catch(e){}
const css=document.createElement("style");
css.textContent=`
html{background:#070d1c}
#splash{position:fixed;inset:0;z-index:9999;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(120% 70% at 50% 25%,#1a2f6e 0,#0c1330 45%,#05060f 100%);color:#fff;font-family:ui-rounded,"Segoe UI",system-ui,sans-serif;transition:opacity .5s ease,transform .5s ease}
#splash.sai{opacity:0;transform:scale(1.06);pointer-events:none}
#splash.calmo *{animation:none!important}
@keyframes spF{from{transform:translateY(0) rotate(var(--r))}to{transform:translateY(-18px) rotate(calc(var(--r) + 4deg))}}
@keyframes spL{0%{opacity:0;transform:scale(.55)}65%{transform:scale(1.07)}100%{opacity:1;transform:scale(1)}}
@keyframes spG{from{filter:drop-shadow(0 0 10px rgba(120,100,255,.5))}to{filter:drop-shadow(0 0 24px rgba(190,90,255,.9))}}
@keyframes spS{from{background-position:0 0,0 0}to{background-position:40px 0,0 0}}
@keyframes spU{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.sp-c{position:absolute;border-radius:14px;border:2px solid var(--c);box-shadow:0 0 22px var(--c),inset 0 0 18px rgba(255,255,255,.08);background:linear-gradient(160deg,rgba(20,30,80,.85),rgba(10,10,40,.9));display:grid;place-items:center;color:var(--c);font-size:2rem;opacity:.85;transform:rotate(var(--r));animation:spF 5s ease-in-out infinite alternate}
.sp-pl{position:absolute;left:50%;bottom:21%;width:130%;height:150px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at center,rgba(120,70,220,.45),rgba(20,20,60,0) 68%);border-top:2px solid rgba(255,190,70,.45)}
.sp-ring{position:absolute;left:50%;bottom:calc(21% + 22px);width:62%;height:96px;transform:translateX(-50%);border:2px solid rgba(255,190,70,.5);border-radius:50%;display:grid;place-items:center;color:rgba(255,200,90,.7);font-size:2rem}
.sp-tag{position:absolute;top:calc(env(safe-area-inset-top) + 14px);right:16px;font-size:.68rem;letter-spacing:2px;opacity:.7;line-height:1.5}
.sp-hand{position:absolute;left:18px;bottom:calc(env(safe-area-inset-bottom) + 8px);font-style:italic;font-size:.8rem;opacity:.6;transform:rotate(-6deg)}
.sp-logo{position:relative;display:flex;flex-direction:column;align-items:center;margin-top:-10vh;animation:spL .9s cubic-bezier(.2,.9,.3,1.2) both,spG 1.8s ease-in-out .9s infinite alternate}
.sp-t1{font-size:clamp(2.4rem,13vw,3.6rem);font-weight:900;font-style:italic;letter-spacing:-1px;line-height:1;text-shadow:0 4px 0 #1b2a6b,0 0 26px rgba(90,140,255,.9)}
.sp-t2{font-size:clamp(2.2rem,12vw,3.4rem);font-weight:900;font-style:italic;line-height:1.05;background:linear-gradient(90deg,#e04bff,#5a8bff);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.sp-bot{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom) + 34px);padding:0 22px;display:flex;flex-direction:column;align-items:center;gap:12px;animation:spU .7s .4s both}
#spMsg{font-weight:700;font-size:1.05rem}
.sp-row{display:flex;align-items:center;gap:10px;width:100%;max-width:420px}
.sp-bar{flex:1;height:16px;border-radius:10px;border:2px solid #2a3f9a;background:#070b20;overflow:hidden}
#spFill{height:100%;width:0;border-radius:8px;background:repeating-linear-gradient(115deg,rgba(255,255,255,.18) 0 10px,transparent 10px 20px),linear-gradient(90deg,#19b4ff,#a24bff);background-size:40px 100%,100% 100%;box-shadow:0 0 12px #6a6bff;animation:spS .8s linear infinite}
#spPct{width:44px;text-align:right;font-weight:700;font-size:.9rem}
.sp-steps{display:flex;gap:6px;width:100%;max-width:440px;justify-content:space-between;margin-top:6px}
.sp-st{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:.62rem;text-align:center;opacity:.45;transition:opacity .3s}
.sp-st i{font-style:normal;font-size:1.5rem}
.sp-st.on{opacity:1}
.sp-st.ok{opacity:.85}
.sp-st.ok i::after{content:" ✓";font-size:.7rem;color:#3ddc97}`;
document.head.appendChild(css);

const cartas=[["#3b8bff",-18,90,128,"-18px","12%",-1],["#a24bff",16,84,120,"auto","16%",-2],["#ffb347",-10,60,86,"8%","58%",-3],["#19b4ff",14,56,80,"auto","52%",-4],["#a24bff",-22,70,100,"auto","6%",-2.5],["#3b8bff",20,60,86,"6%","4%",-1.5]];
const st=cartas.map((c,i)=>'<div class="sp-c" style="--c:'+c[0]+";--r:"+c[1]+"deg;width:"+c[2]+"px;height:"+c[3]+"px;"+(c[4]==="auto"?"right:"+(i===1?"-14px":"10%"):"left:"+c[4])+";top:"+c[5]+";animation-delay:"+c[6]+'s">♛</div>').join("");
const el=document.createElement("div");el.id="splash";if(!anim)el.className="calmo";
el.setAttribute("role","img");el.setAttribute("aria-label","Memória Duelo, carregando");
el.innerHTML=st+'<div class="sp-pl"></div><div class="sp-ring">♛</div>'
 +'<div class="sp-tag">ESTRATÉGIA<br>FOCO<br>VITÓRIA<br>—</div>'
 +'<div class="sp-logo"><svg viewBox="0 0 64 40" width="92" style="margin-bottom:-6px"><path d="M4 36L8 10L22 22L32 4L42 22L56 10L60 36Z" fill="#ffc933" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/><rect x="4" y="33" width="56" height="7" rx="2" fill="#e0a800"/><circle cx="32" cy="22" r="3.2" fill="#7a3cff"/></svg><div class="sp-t1">MEMÓRIA</div><div class="sp-t2">DUELO</div></div>'
 +'<div class="sp-hand">Grandes duelos começam aqui!</div>'
 +'<div class="sp-bot"><div id="spMsg">Preparando o jogo…</div><div class="sp-row"><div class="sp-bar"><div id="spFill"></div></div><span id="spPct">0%</span></div>'
 +'<div class="sp-steps"><div class="sp-st"><i>🃏</i>Organizando<br>as cartas…</div><div class="sp-st"><i>⚙️</i>Configurando<br>o jogo…</div><div class="sp-st"><i>👥</i>Carregando<br>os jogadores…</div><div class="sp-st"><i>🛡️</i>Preparando<br>a partida…</div></div></div>';
document.documentElement.appendChild(el);

const T0=Date.now(),MIN=1200,MAX=6500;
const MSG=["Preparando o jogo…","Organizando as cartas…","Configurando o jogo…","Carregando os jogadores…","Preparando a partida…"];
let prog=0,fim=false,saindo=false;
const pronto=()=>{const c=document.getElementById("carregando");return !!c&&!c.classList.contains("on")};
function sair(){
  el.classList.add("sai");
  setTimeout(()=>{el.remove();css.remove()},600);
}
const iv=setInterval(()=>{
  try{
    const t=Date.now()-T0;
    if(!fim){
      if((pronto()&&t>=MIN)||t>=MAX)fim=true;
      prog+=(90*(1-Math.exp(-t/1400))-prog)*0.15;
    }else{prog+=(100-prog)*0.35;if(prog>99.5)prog=100}
    const f=document.getElementById("spFill");
    if(!f){clearInterval(iv);return}
    f.style.width=prog+"%";
    document.getElementById("spPct").textContent=Math.round(prog)+"%";
    const k=prog<8?0:prog<30?1:prog<55?2:prog<80?3:4;
    document.getElementById("spMsg").textContent=MSG[k];
    [...el.querySelectorAll(".sp-st")].forEach((s,i)=>{s.classList.toggle("on",i+1===k);s.classList.toggle("ok",i+1<k||(k===4&&prog>=100))});
    if(fim&&prog>=100&&!saindo){saindo=true;clearInterval(iv);setTimeout(sair,250)}
  }catch(e){clearInterval(iv);el.remove()}
},50);
}catch(e){}
})();
