// ===== MENU JOGAR ONLINE MAIS LIMPO =====
(function(){
const $=id=>document.getElementById(id);
const j=$("jogar");if(!j||!$("bBuscar"))return;
const achar=t=>[...j.querySelectorAll("button")].find(b=>b.textContent.includes(t));
const bBuscar=$("bBuscar"),bCriar=$("bCriar"),bEntrar=$("bEntrar"),vJ=$("vJogar");
const bGrupo=$("bGrupo")||achar("Modo em grupo"),bFila=achar("Fila 2v2"),bVer=achar("Assistir");
const st=document.createElement("style");
st.textContent=".mais{display:none;flex-direction:column;gap:10px}.mais.on{display:flex}#jogar .peq{padding:14px;font-size:1.05rem}";
document.head.appendChild(st);
bBuscar.textContent="⚡ Jogar agora";bBuscar.className="grande";
const linha=document.createElement("div");linha.className="dupla";
bCriar.className="peq";bEntrar.className="peq sec";
bCriar.textContent="Criar sala";bEntrar.textContent="Entrar com código";
linha.append(bCriar,bEntrar);
const mais=document.createElement("div");mais.className="mais";
const tg=document.createElement("button");tg.className="sec peq";tg.textContent="➕ Mais opções";
const ext=[bGrupo,bFila,bVer].filter(Boolean);
ext.forEach(b=>{b.className="sec peq";mais.appendChild(b)});
j.insertBefore(bBuscar,vJ);j.insertBefore(linha,vJ);j.insertBefore(tg,vJ);j.insertBefore(mais,vJ);
tg.onclick=()=>{const o=mais.classList.toggle("on");tg.textContent=o?"➖ Menos opções":"➕ Mais opções"};
const modo=()=>!$("mRank").classList.contains("sec")?"rank":!$("mLiga").classList.contains("sec")?"liga":"casual";
function aplicar(){
  const c=modo()==="casual";
  [bGrupo,bFila].forEach(b=>{if(b)b.style.display=c?"":"none"});
  const vis=ext.filter(b=>b.style.display!=="none").length;
  tg.style.display=vis?"":"none";
  if(!vis)mais.classList.remove("on");
}
["mCasual","mRank","mLiga"].forEach(i=>new MutationObserver(aplicar).observe($(i),{attributes:true,attributeFilter:["class"]}));
aplicar();
})();

// ===== MISSÕES, XP, SEQUÊNCIA E BAÚ =====
(function(){
const $=id=>document.getElementById(id);
const main=document.querySelector("main"),menu=$("menu");
if(!main||!menu||!$("bJogar"))return;
const K="viciante";
const txt=id=>{const e=$(id);return e?e.textContent:""};
const hoje=()=>new Date().toLocaleDateString("sv-SE");
const ontem=()=>new Date(Date.now()-864e5).toLocaleDateString("sv-SE");
const TIT=["Memória de Elefante","Olho de Águia","Mestre dos Pares","Relâmpago","Estrategista","Invicto","Caçador de Pares","Mente Brilhante","Lenda Viva","Sem Piscar","Cérebro Turbo","Rei da Memória"];
const MISS=[["Jogue 3 partidas online","jogos",3],["Ganhe 1 partida online","vit",1],["Acerte 10 pares","pares",10]];
let D={dia:"",p:{jogos:0,vit:0,pares:0},xp:0,ult:"",n:0,tit:[],eq:"",bau:false};
try{D={...D,...JSON.parse(localStorage.getItem(K)||"{}")}}catch(e){}
const salvar=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
function dia(){if(D.dia!==hoje()){D.dia=hoje();D.p={jogos:0,vit:0,pares:0};D.bau=false;salvar()}}
const nivel=xp=>Math.floor(Math.sqrt(xp/25))+1;
const feitas=()=>MISS.filter(m=>D.p[m[1]]>=m[2]).length;
const seqDias=()=>D.ult===hoje()||D.ult===ontem()?D.n:0;

const card=document.createElement("button");card.className="card";
const tEq=document.createElement("p");tEq.className="nota";
menu.insertBefore(tEq,$("bJogar"));menu.insertBefore(card,$("bJogar"));
function cartao(){
  dia();
  card.textContent="🎯 Missões "+feitas()+"/3 · 🔥 "+seqDias()+" dias · Nv "+nivel(D.xp);
  tEq.textContent=D.eq?"“"+D.eq+"”":"";
}

const sec=document.createElement("section");sec.id="missoes";sec.className="tela";
sec.innerHTML='<p class="titulo">🎯 Missões de hoje</p><p class="nota" id="mvNiv"></p><div class="barra"><i id="mvBar"></i></div><p class="nota" id="mvSeq"></p><ul id="mvLista" class="lis"></ul><button id="mvBau" style="display:none">🎁 Abrir baú do dia</button><p class="msg" id="mvMsg"></p><p class="nota">Meus títulos (toque para usar)</p><ul id="mvTit" class="lis"></ul><button id="mvVolta" class="sec">Voltar</button>';
main.appendChild(sec);
function render(){
  dia();
  const n=nivel(D.xp),a=25*(n-1)*(n-1),b=25*n*n,s=seqDias();
  $("mvNiv").textContent="Nível "+n+" · "+D.xp+" XP (próximo nível: "+b+")";
  $("mvBar").style.width=Math.round((D.xp-a)/(b-a)*100)+"%";
  $("mvSeq").textContent="🔥 "+s+" dia"+(s===1?"":"s")+" seguidos jogando"+(D.ult===hoje()?"":" · jogue hoje para manter!");
  $("mvLista").innerHTML=MISS.map(m=>{const v=Math.min(D.p[m[1]],m[2]);return '<li class="'+(v>=m[2]?"eu":"")+'"><span>'+(v>=m[2]?"✅ ":"")+m[0]+"</span><b>"+v+"/"+m[2]+"</b></li>"}).join("");
  $("mvBau").style.display=feitas()===3&&!D.bau?"":"none";
  const L=$("mvTit");L.innerHTML=D.tit.length?"":"<li>Complete as 3 missões e abra o baú para ganhar títulos.</li>";
  D.tit.forEach(t=>{
    const li=document.createElement("li");li.className=t===D.eq?"eu":"";li.style.cursor="pointer";
    li.innerHTML="<span>"+t+"</span><b>"+(t===D.eq?"em uso":"")+"</b>";
    li.onclick=()=>{D.eq=t===D.eq?"":t;salvar();render();cartao()};
    L.appendChild(li);
  });
}
$("mvBau").onclick=()=>{
  dia();if(feitas()<3||D.bau)return;
  D.bau=true;
  const livres=TIT.filter(t=>!D.tit.includes(t));
  let m;
  if(livres.length){const t=livres[Math.floor(Math.random()*livres.length)];D.tit.push(t);if(!D.eq)D.eq=t;m="🎁 Novo título: "+t+"!"}
  else{D.xp+=50;m="🎁 Você já tem todos os títulos! +50 XP"}
  salvar();render();cartao();$("mvMsg").textContent=m;
};
function abrir(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="missoes"));
  $("nav").style.display="none";history.pushState({t:"missoes"},"");$("mvMsg").textContent="";render();
}
card.onclick=abrir;
$("mvVolta").onclick=()=>history.back();
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(t&&t.id==="missoes"){
    document.querySelectorAll(".tela").forEach(x=>x.classList.toggle("on",x.id==="menu"));
    $("nav").style.display="flex";
    document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on",b.id==="nInicio"));
  }
});

// conta a partida quando ela termina (só online com humano)
let contado=false;
setInterval(()=>{
  const jg=$("jogo"),ag=$("again");
  const fim=!!(jg&&jg.classList.contains("on")&&ag&&ag.style.display==="block");
  if(!fim){contado=false;return}
  if(contado)return;
  contado=true;
  if(/Treino/.test(txt("modoTxt"))||/Robô/.test(txt("n1")))return;
  const s=txt("status"),v=/^Você ganhou/.test(s),e=/^Empate/.test(s),pares=+txt("p0")||0;
  dia();
  const antes=feitas();
  D.p.jogos++;if(v)D.p.vit++;D.p.pares+=pares;
  const xp=10+(v?10:e?5:0)+pares;D.xp+=xp;
  if(D.ult!==hoje()){D.n=D.ult===ontem()?D.n+1:1;D.ult=hoje()}
  salvar();cartao();
  $("status").textContent+=" · +"+xp+" XP"+(antes<3&&feitas()===3?" · 🎯 Missões completas! Abra o baú":"");
},1000);
cartao();
})();
