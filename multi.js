(function(){
const $=id=>document.getElementById(id);
const TEMAS={
  "Animais":["🐶","🐱","🦊","🐸","🐼","🦁","🐙","🦄","🐵","🐯","🐰","🐧"],
  "Frutas":["🍎","🍌","🍇","🍓","🍍","🍉","🍒","🥝","🍑","🍋","🥥","🍐"],
  "Esportes":["⚽","🏀","🏈","🎾","🏐","🏓","🥊","🏊","🎱","⛳","🏹","🥋"],
  "Bandeiras":["🇧🇷","🇦🇷","🇺🇸","🇯🇵","🇫🇷","🇮🇹","🇩🇪","🇵🇹","🇪🇸","🇬🇧","🇨🇦","🇲🇽"]
};
const NIV={f:{n:"Fácil",p:6,col:3,t:20},m:{n:"Médio",p:8,col:4,t:15},d:{n:"Difícil",p:12,col:4,t:10}};
const COR=["#3ddc97","#ff5d8f","#5ec8f2","#ffc933"];
const LET="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const main=document.querySelector("main");
let peer,conns=[],hc=null,seat=0,N=3,md="1v1v1",nv="m",tm="Animais",nomes=[],deck=null,vez=0,vir=[],pares=0,trava=false,fim=true,pont=[],tmr=null,resta=0,cod="",lobbyOn=false;
const eq=()=>md==="2v2";
const idx=()=>eq()?vez%2:vez;
const meuNome=()=>{const c=$("cartao");return c?c.textContent.split(" · ")[0].trim().slice(0,12):""};

// ---------- som simples ----------
let ac;
const ef=()=>{try{return localStorage.getItem("mudo")!=="1"}catch(e){return true}};
function bip(f,t,d,tp){
  if(!ef())return;
  try{
    ac=ac||new(window.AudioContext||window.webkitAudioContext)();
    if(ac.state==="suspended")ac.resume();
    const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime+t;
    o.type=tp||"sine";o.frequency.value=f;o.connect(g);g.connect(ac.destination);
    g.gain.setValueAtTime(.15,s);g.gain.exponentialRampToValueAtTime(.001,s+d);
    o.start(s);o.stop(s+d);
  }catch(e){}
}

// ---------- telas novas ----------
function sec(id,html){const s=document.createElement("section");s.id=id;s.className="tela";s.innerHTML=html;main.appendChild(s)}
sec("mconf",'<p class="titulo">👥 Modo em grupo</p><div class="dupla"><button id="m3" class="tog on">1v1v1</button><button id="m4" class="tog">2v2</button></div><p class="nota" id="mdesc"></p><select id="mdif"><option value="f">Fácil · 12 cartas</option><option value="m" selected>Médio · 16 cartas</option><option value="d">Difícil · 24 cartas</option></select><select id="mtema"></select><button id="mcriar">Criar sala</button><input id="mcod" maxlength="4" placeholder="CÓDIGO" autocomplete="off"><button id="mentrar" class="sec">Entrar na sala</button><button id="mvoltar" class="sec">Voltar</button><p class="msg" id="mmsg"></p>');
sec("mlobby",'<p class="msg">Passe este código:</p><div class="codigo" id="mcodigo">----</div><p class="msg" id="minfo"></p><ul id="mlista" class="lis"></ul><button id="mzap">Enviar pelo WhatsApp</button><button id="msairL" class="sec">Voltar</button>');
sec("mjogo",'<p class="nota" id="mmodo"></p><ul id="mplac" class="lis"></ul><p class="msg" id="mstatus"></p><div id="mgrade" style="display:grid;gap:10px"></div><button id="magain" class="sec" style="display:none">Jogar de novo</button><button id="msair" class="sec">Sair</button>');
Object.keys(TEMAS).forEach(t=>{const o=document.createElement("option");o.value=o.textContent=t;$("mtema").appendChild(o)});
try{const c=JSON.parse(localStorage.getItem("cfgMemoria")||"{}");if(NIV[c.dif])$("mdif").value=c.dif;if(TEMAS[c.tema])$("mtema").value=c.tema}catch(e){}
const bj=document.createElement("button");bj.id="bGrupo";bj.className="grande sec";bj.textContent="👥 Modo em grupo";
$("jogar").insertBefore(bj,$("vJogar"));

function ir(id,push){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id===id));
  $("nav").style.display="none";
  if(push)history.pushState({t:id},"");
}
function goJogar(){document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="jogar"));$("nav").style.display="none"}
const bc=m=>conns.forEach(c=>{try{if(c.open)c.send(m)}catch(e){}});
const snd=m=>{try{if(hc&&hc.open)hc.send(m)}catch(e){}};
function novoDeck(){const e=TEMAS[tm].slice(0,NIV[nv].p),d=[...e,...e];for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d}

// ---------- sala ----------
function lobby(){
  $("mcodigo").textContent=cod;
  $("minfo").textContent=(eq()?"2v2 · 4 jogadores":"1v1v1 · 3 jogadores")+" · "+NIV[nv].n;
  $("mlista").innerHTML=Array.from({length:N},(_,i)=>'<li style="border-left:8px solid '+COR[i]+'"><span>'+(nomes[i]?H(nomes[i]):"Aguardando…")+"</span>"+(i===seat&&nomes[i]?"<b>você</b>":"")+"</li>").join("");
}
function limpar(){
  clearInterval(tmr);lobbyOn=false;deck=null;fim=true;
  try{hc&&hc.close()}catch(e){}
  conns.forEach(c=>{try{c.close()}catch(e){}});
  try{peer&&peer.destroy()}catch(e){}
  peer=hc=null;conns=[];
}
function sairM(quiet){
  if(deck&&!fim&&!quiet&&!confirm("Sair da partida? Ela termina para todos."))return false;
  limpar();goJogar();return true;
}
function criar(){
  if(!meuNome()){$("mmsg").textContent="Aguarde o perfil carregar e tente de novo.";return}
  limpar();
  md=$("m4").classList.contains("on")?"2v2":"1v1v1";N=eq()?4:3;nv=$("mdif").value;tm=$("mtema").value;
  cod=Array.from({length:4},()=>LET[Math.floor(Math.random()*LET.length)]).join("");
  seat=0;nomes=[meuNome()];conns=[];
  peer=new Peer("memoriam-"+cod);
  peer.on("open",()=>{lobbyOn=true;lobby();ir("mlobby",true)});
  peer.on("error",e=>{if(e.type==="unavailable-id")criar();else $("mmsg").textContent="Erro de conexão. Tente de novo."});
  peer.on("connection",x=>{
    if(deck){x.close();return}
    x.on("data",m=>doHost(x,m));
    x.on("close",()=>{
      if(deck&&!fim&&conns.includes(x)){bc({t:"fim"});encerrar("Um jogador saiu.")}
      else if(!deck&&conns.includes(x)){conns=conns.filter(c=>c!==x);reseat()}
    });
  });
}
function reseat(){
    if(eq()&&conns.length===N-1){const A=conns.filter(c=>c.eq==="A"),B=conns.filter(c=>c.eq!=="A");if(A.length===1&&B.length===2)conns=[B[0],A[0],B[1]]}conns.forEach((c,i)=>{try{c.send({t:"seat",seat:i+1})}catch(e){}});
  nomes=[meuNome(),...conns.map(c=>c.nome)];
  bc({t:"lobby",nomes,N,md,nv});lobby();
}
function doHost(x,m){
  if(m.t==="hello"&&!deck&&!conns.includes(x)){
    if(conns.length>=N-1){x.close();return}
        x.nome=String(m.nome||"Jogador").slice(0,12);x.eq=String(m.eq||"").slice(0,1);conns.push(x);reseat();
    if(conns.length===N-1)setTimeout(comecar,1200);
  }else if(m.t==="flip"&&deck){
    const s=conns.indexOf(x)+1;
    if(s>0&&s===vez&&valido(m.i)){bc({t:"flip",i:m.i});aplicar(m.i)}
  }
}
function comecar(){
  if(deck||conns.length!==N-1)return;
  const d=novoDeck();iniciar(d);bc({t:"start",deck:d,nomes,md,nv});
}
function entrar(){
  const c=$("mcod").value.trim().toUpperCase();
  if(c.length!==4){$("mmsg").textContent="Digite o código de 4 letras.";return}
  if(!meuNome()){$("mmsg").textContent="Aguarde o perfil carregar e tente de novo.";return}
  limpar();cod=c;$("mmsg").textContent="Conectando…";
  peer=new Peer();
  peer.on("open",()=>{
    hc=peer.connect("memoriam-"+c);
        hc.on("open",()=>snd({t:"hello",nome:meuNome(),eq:window.__eq||""}));
    hc.on("data",doGuest);
    hc.on("close",()=>{
      if(deck&&!fim)encerrar("A sala foi encerrada.");
      else if(lobbyOn&&!deck)sairM(true);
      else if(!deck)$("mmsg").textContent="Sala cheia ou indisponível.";
    });
  });
  peer.on("error",()=>{$("mmsg").textContent="Sala não encontrada. Confira o código."});
  setTimeout(()=>{if(!(hc&&hc.open)&&$("mconf").classList.contains("on")){limpar();$("mmsg").textContent="Não conseguiu conectar. Tente de novo."}},15000);
}
function doGuest(m){
  if(m.t==="seat"&&Number.isInteger(m.seat))seat=m.seat;
  else if(m.t==="lobby"&&Array.isArray(m.nomes)){
    nomes=m.nomes.map(x=>String(x).slice(0,12));md=m.md==="2v2"?"2v2":"1v1v1";N=eq()?4:3;nv=NIV[m.nv]?m.nv:"m";
    lobbyOn=true;lobby();$("mmsg").textContent="";
    if(!deck&&!$("mlobby").classList.contains("on"))ir("mlobby",true);
  }
  else if(m.t==="start"&&Array.isArray(m.deck)&&Array.isArray(m.nomes)){
    nomes=m.nomes.map(x=>String(x).slice(0,12));md=m.md==="2v2"?"2v2":"1v1v1";N=eq()?4:3;nv=NIV[m.nv]?m.nv:"m";
    iniciar(m.deck.map(String));
  }
  else if(m.t==="flip"&&Number.isInteger(m.i))aplicar(m.i);
  else if(m.t==="skip")passar();
  else if(m.t==="fim")encerrar("Um jogador saiu.");
}

// ---------- partida ----------
function iniciar(d){
  deck=d;vez=0;vir=[];pares=0;trava=false;fim=false;pont=eq()?[0,0]:nomes.map(()=>0);
  const g=$("mgrade");g.innerHTML="";g.style.gridTemplateColumns="repeat("+NIV[nv].col+",1fr)";
  d.forEach((e,i)=>{
    const b=document.createElement("button");b.className="carta";b.id="mc"+i;
    b.innerHTML='<i class="costas">?</i><i class="frente">'+H(e)+"</i>";
    b.onclick=()=>clicar(i);g.appendChild(b);
  });
  $("magain").style.display="none";$("msair").textContent="Sair";
  $("mmodo").textContent=(eq()?"🤝 2v2":"👥 1v1v1")+" · "+NIV[nv].n+" · Casual";
  ir("mjogo",!$("mjogo").classList.contains("on"));
  tempo();plac();
}
function valido(i){return deck&&!fim&&!trava&&Number.isInteger(i)&&i>=0&&i<deck.length&&!vir.includes(i)&&!$("mc"+i).classList.contains("par")}
function clicar(i){
  if(vez!==seat||!valido(i))return;
  if(seat===0){bc({t:"flip",i});aplicar(i)}else snd({t:"flip",i});
}
function aplicar(i){
  if(!deck||fim||i<0||i>=deck.length||vir.includes(i))return;
  $("mc"+i).classList.add("vira");vir.push(i);
  if(vir.length===2){trava=true;setTimeout(confere,900)}
}
function confere(){
  if(!deck||fim)return;
  const[a,b]=vir;
  if(deck[a]===deck[b]){
    [a,b].forEach(i=>$("mc"+i).classList.add("par"));
    pont[idx()]++;pares++;bip(660,0,.12);bip(880,.12,.18);
  }else{
    [a,b].forEach(i=>$("mc"+i).classList.remove("vira"));
    vez=(vez+1)%N;bip(180,0,.3,"square");
  }
  vir=[];trava=false;
  if(pares===deck.length/2)terminar();else tempo();
  plac();
}
function passar(){
  if(!deck||fim)return;
  vir.forEach(i=>$("mc"+i).classList.remove("vira"));
  vir=[];trava=false;vez=(vez+1)%N;bip(180,0,.3,"square");tempo();plac();
}
function tempo(){
  clearInterval(tmr);resta=NIV[nv].t;
  tmr=setInterval(()=>{
    resta--;
    if(resta<=0){clearInterval(tmr);if(seat===0&&!fim&&!trava){bc({t:"skip"});passar()}}
    plac();
  },1000);
}
function terminar(){
  fim=true;clearInterval(tmr);
  const mx=Math.max(...pont),w=pont.map((p,i)=>p===mx?i:-1).filter(i=>i>=0);
  const mi=eq()?seat%2:seat,nm=i=>eq()?"Equipe "+"AB"[i]:nomes[i];
  let t;
  if(w.includes(mi))t=w.length>1?"Empate! 🤝":(eq()?"Sua equipe ganhou! 🎉":"Você ganhou! 🎉");
  else t=w.length>1?"Empate entre "+w.map(nm).join(" e "):nm(w[0])+" ganhou.";
  $("mstatus").textContent=t;
  if(w.includes(mi)&&w.length===1)[523,659,784,1047].forEach((f,i)=>bip(f,i*.12,.2));
  if(seat===0)$("magain").style.display="block";
  $("msair").textContent="Voltar";plac();
}
function encerrar(msg){
  fim=true;clearInterval(tmr);
  $("mstatus").textContent=msg;$("magain").style.display="none";$("msair").textContent="Voltar";
}
function plac(){
  if(!deck)return;
  const it=eq()
    ?[0,1].map(t=>({x:"Equipe "+"AB"[t]+": "+nomes.filter((_,i)=>i%2===t).map(H).join(" + "),c:COR[t],p:pont[t],a:vez%2===t}))
    :nomes.map((n,i)=>({x:H(n)+(i===seat?" (você)":""),c:COR[i],p:pont[i],a:vez===i}));
  $("mplac").innerHTML=it.map(o=>'<li style="border-left:8px solid '+o.c+(o.a&&!fim?";outline:3px solid var(--txt)":"")+'"><span>'+o.x+"</span><b>"+o.p+"</b></li>").join("");
  if(!fim)$("mstatus").textContent=(vez===seat?"Sua vez":"Vez de "+nomes[vez])+" · "+Math.max(resta,0)+"s";
}

// ---------- botões ----------
const desc=()=>{$("mdesc").textContent=$("m4").classList.contains("on")?"2v2: 4 jogadores. Os pontos da dupla somam.":"1v1v1: 3 jogadores, cada um por si."};
desc();
$("m3").onclick=()=>{$("m3").classList.add("on");$("m4").classList.remove("on");desc()};
$("m4").onclick=()=>{$("m4").classList.add("on");$("m3").classList.remove("on");desc()};
bj.onclick=()=>{$("mmsg").textContent="";ir("mconf",true)};
$("mcriar").onclick=criar;
$("mentrar").onclick=entrar;
["mvoltar","msairL","msair"].forEach(id=>$(id).onclick=()=>history.back());
$("magain").onclick=()=>{
  if(seat!==0||conns.length!==N-1)return;
  const d=novoDeck();iniciar(d);bc({t:"start",deck:d,nomes,md,nv});
};
$("mzap").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent("Vem jogar em grupo no Memória Duelo! 🧠\nCódigo da sala: "+cod+"\n"+location.origin+location.pathname),"_blank");
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(!t)return;
  if(t.id==="mconf")goJogar();
  else if(t.id==="mlobby")sairM(true);
  else if(t.id==="mjogo"){if(!sairM(false))history.pushState({t:"mjogo"},"")}
});
})();
