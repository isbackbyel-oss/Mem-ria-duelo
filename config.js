(function(){
const $=id=>document.getElementById(id);
const K="cfgMemoria";
const PADRAO={bg:"#2b1f4a",acc:"#ffb703",mus:true,vol:50,vib:true,reac:true,anim:true,grande:false,dif:"m",tema:"Animais"};
let C={...PADRAO};
try{C={...C,...JSON.parse(localStorage.getItem(K)||"{}")}}catch(e){}
const salvar=()=>{try{localStorage.setItem(K,JSON.stringify(C))}catch(e){}};
const BGS=["#2b1f4a","#14213d","#1b4332","#4a1f2b","#1f3a4a","#111111"];
const ACCS=["#ffb703","#3ddc97","#ff5d8f","#5ec8f2","#c77dff","#ff9f1c"];
const HEX=/^#[0-9a-f]{6}$/i;
const rgb=h=>{const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255]};
const lum=h=>{const[r,g,b]=rgb(h);return(.299*r+.587*g+.114*b)/255};
const esc=(h,f)=>"#"+rgb(h).map(v=>Math.round(v*f).toString(16).padStart(2,"0")).join("");
const efOn=()=>{try{return localStorage.getItem("mudo")!=="1"}catch(e){return true}};

const st=document.createElement("style");
st.textContent=`
#nav{background:var(--navbg,#1f1638)!important}
body.sem-reac #reac,body.sem-reac #reacao{display:none!important}
body.sem-anim .carta i,body.sem-anim .barra i{transition:none!important}
#mus{position:fixed;top:calc(env(safe-area-inset-top) + 8px);left:12px;padding:6px 10px;background:transparent;color:inherit;font-size:1.3rem;border:2px solid rgba(255,247,230,.4)}
.cores{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.cores button{width:42px;height:42px;padding:0;border-radius:50%;border:3px solid transparent}
.cores button.on{border-color:var(--txt)}
.lin{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:14px;background:rgba(255,247,230,.12)}
.lin button,.lin select{padding:8px 14px;font-size:1rem;min-width:110px}
.lin input[type=range]{padding:0;width:50%;background:transparent}
.lin input[type=color]{padding:0;width:56px;height:38px}`;
document.head.appendChild(st);

const sec=document.createElement("section");sec.id="config";sec.className="tela";
sec.innerHTML=`<p class="titulo">⚙️ Configurações</p>
<p class="nota">Conta (o nome é fixo)</p><div class="lin"><span id="cfgConta"></span></div>
<p class="nota">Aparência</p>
<div class="lin"><span>Cor de fundo</span></div><div class="cores" id="cBg"></div>
<div class="lin"><span>Fundo personalizado</span><input type="color" id="cBgX"></div>
<div class="lin"><span>Cor de destaque</span></div><div class="cores" id="cAcc"></div>
<div class="lin"><span>Texto grande</span><button id="oGrande" class="tog"></button></div>
<div class="lin"><span>Animações</span><button id="oAnim" class="tog"></button></div>
<p class="nota">Áudio</p>
<div class="lin"><span>Música</span><button id="oMus" class="tog"></button></div>
<div class="lin"><span>Volume</span><input type="range" id="oVol" min="0" max="100"></div>
<div class="lin"><span>Efeitos sonoros</span><button id="oEf" class="tog"></button></div>
<p class="nota">Jogo</p>
<div class="lin"><span>Reações rápidas</span><button id="oReac" class="tog"></button></div>
<div class="lin"><span>Vibrar ao acertar</span><button id="oVib" class="tog"></button></div>
<div class="lin"><span>Dificuldade padrão</span><select id="oDif"><option value="f">Fácil</option><option value="m">Médio</option><option value="d">Difícil</option></select></div>
<div class="lin"><span>Tema padrão</span><select id="oTema"></select></div>
<button id="oReset" class="sec">Restaurar padrões</button>`;
document.querySelector("main").appendChild(sec);

const nb=document.createElement("button");nb.id="nConfig";nb.innerHTML="<b>⚙️</b>Config";$("nav").appendChild(nb);
const bm=document.createElement("button");bm.id="mus";document.body.appendChild(bm);

function aplicar(){
  if(!HEX.test(C.bg))C.bg=PADRAO.bg;
  if(!HEX.test(C.acc))C.acc=PADRAO.acc;
  const r=document.documentElement.style;
  r.setProperty("--bg",C.bg);r.setProperty("--back",C.acc);
  r.setProperty("--txt",lum(C.bg)>.6?"#1b1230":"#fff7e6");
  r.setProperty("--navbg",esc(C.bg,.7));
  r.fontSize=C.grande?"18px":"";
  document.body.classList.toggle("sem-reac",!C.reac);
  document.body.classList.toggle("sem-anim",!C.anim);
  const m=document.querySelector("meta[name=theme-color]");if(m)m.content=C.bg;
}
const sw=(b,on)=>{b.textContent=on?"Ligado":"Desligado";b.classList.toggle("on",on)};
function cores(){
  [["cBg",BGS,"bg"],["cAcc",ACCS,"acc"]].forEach(([id,L,k])=>{
    $(id).innerHTML="";
    L.forEach(c=>{
      const b=document.createElement("button");
      b.style.background=c;b.className=C[k]===c?"on":"";b.setAttribute("aria-label",c);
      b.onclick=()=>{C[k]=c;salvar();aplicar();cores()};
      $(id).appendChild(b);
    });
  });
  $("cBgX").value=C.bg;
}
function padroes(){
  ["dif","difT"].forEach(i=>{if($(i))$(i).value=C.dif});
  ["tema","temaT"].forEach(i=>{if($(i))$(i).value=C.tema});
}
function sync(){
  sw($("oGrande"),C.grande);sw($("oAnim"),C.anim);sw($("oMus"),C.mus);
  sw($("oEf"),efOn());sw($("oReac"),C.reac);sw($("oVib"),C.vib);
  $("oVol").value=C.vol;$("oDif").value=C.dif;$("oTema").value=C.tema;cores();
}

// ---------- música (melodia original, gerada no código) ----------
let mc,mg,mt=null,passo=0,prox=0,gesto=false;
const NOTAS=[0,2,4,7,4,2,0,2,4,7,9,7,4,2,0,-3],BAIXO=[-12,-15,-19,-17];
const fr=n=>261.63*Math.pow(2,n/12);
function nota(f,t,d,tipo,v){
  const o=mc.createOscillator(),g=mc.createGain();
  o.type=tipo;o.frequency.value=f;o.connect(g);g.connect(mg);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.start(t);o.stop(t+d);
}
function agenda(){
  while(prox<mc.currentTime+.5){
    nota(fr(NOTAS[passo%16]),prox,.22,"triangle",.5);
    if(passo%4===0)nota(fr(BAIXO[(passo/4|0)%4]),prox,.9,"sine",.6);
    passo++;prox+=.25;
  }
}
function tocar(){
  if(mt)return;
  try{
    mc=mc||new(window.AudioContext||window.webkitAudioContext)();
    if(!mg){mg=mc.createGain();mg.connect(mc.destination)}
    mc.resume();mg.gain.value=C.vol/100*.18;prox=mc.currentTime+.05;mt=setInterval(agenda,120);
  }catch(e){}
}
function parar(){clearInterval(mt);mt=null;if(mg)mg.gain.value=0}
const TM=["menu","jogar","criar","entrar","buscar","treino","ranking","conquistas","perfil","config"];
function checar(){
  const t=document.querySelector(".tela.on");
  (C.mus&&gesto&&!document.hidden&&t&&TM.includes(t.id))?tocar():parar();
  bm.textContent=C.mus?"🎵":"🔕";
}
new MutationObserver(checar).observe(document.querySelector("main"),{subtree:true,attributes:true,attributeFilter:["class"]});
addEventListener("pointerdown",()=>{gesto=true;checar()},{once:true});
document.addEventListener("visibilitychange",checar);
bm.onclick=()=>{C.mus=!C.mus;salvar();checar();sync()};

// ---------- vibração ao acertar ----------
new MutationObserver(l=>l.forEach(m=>{
  if(C.vib&&navigator.vibrate&&m.target.classList.contains("par")&&!/par/.test(m.oldValue||""))navigator.vibrate(40);
})).observe($("grade"),{subtree:true,attributes:true,attributeFilter:["class"],attributeOldValue:true});

// ---------- navegação ----------
function abrir(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="config"));
  $("nav").style.display="flex";
  ["nInicio","nRank","nConq","nPerfil"].forEach(i=>$(i).classList.remove("on"));
  nb.classList.add("on");
  $("cfgConta").textContent=$("cartao").textContent;
  sync();history.pushState({t:"config"},"");
}
function paraInicio(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="menu"));
  nb.classList.remove("on");$("nInicio").classList.add("on");
}
nb.onclick=()=>{if(!sec.classList.contains("on"))abrir()};
$("nav").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b||b.id==="nConfig")return;
  if(sec.classList.contains("on")&&b.id==="nInicio"){e.stopPropagation();paraInicio();return}
  nb.classList.remove("on");
},true);
addEventListener("popstate",()=>{if(sec.classList.contains("on"))paraInicio()});

// ---------- opções ----------
const tg=(id,k)=>{$(id).onclick=()=>{C[k]=!C[k];salvar();aplicar();checar();sync();if(k==="vib"&&C.vib&&navigator.vibrate)navigator.vibrate(30)}};
tg("oGrande","grande");tg("oAnim","anim");tg("oMus","mus");tg("oReac","reac");tg("oVib","vib");
$("oEf").onclick=()=>{$("som").click();setTimeout(sync,60)};
$("oVol").oninput=e=>{C.vol=+e.target.value;salvar();if(mg&&mt)mg.gain.value=C.vol/100*.18};
$("cBgX").oninput=e=>{C.bg=e.target.value;salvar();aplicar();cores()};
$("oDif").onchange=e=>{C.dif=e.target.value;salvar();padroes()};
$("oTema").onchange=e=>{C.tema=e.target.value;salvar();padroes()};
$("oReset").onclick=()=>{C={...PADRAO};salvar();aplicar();padroes();checar();sync()};

// ---------- início ----------
aplicar();checar();
const esperar=setInterval(()=>{
  if($("tema")&&$("tema").options.length){
    clearInterval(esperar);
    $("oTema").innerHTML=$("tema").innerHTML;padroes();sync();
  }
},100);
})();
