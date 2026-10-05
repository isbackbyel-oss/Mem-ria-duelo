(function(){
const $=id=>document.getElementById(id);
const main=document.querySelector("main");
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const U="https://www.gstatic.com/firebasejs/10.12.2/",MAX=5;
let FB=null,busy=false,bp=null,bid="",on=false,subs=[],last="",pub=0,meuDoc=false,prox=0,ver=null;
const ok=()=>{try{return localStorage.getItem("espOk")!=="0"}catch(e){return true}};
const txt=id=>{const e=$(id);return e?e.textContent:""};
const nm=s=>s.replace(/\s*\d+🔥\s*$/,"").trim();
const uid=()=>FB&&FB.auth.currentUser&&FB.auth.currentUser.uid;
async function fb(){
  if(FB)return FB;
  const A=await import(U+"firebase-app.js"),F=await import(U+"firebase-firestore.js"),T=await import(U+"firebase-auth.js");
  const app=A.getApp();
  FB={F,db:F.getFirestore(app),auth:T.getAuth(app)};
  return FB;
}

// ---------- telas novas ----------
function sec(id,h){const s=document.createElement("section");s.id=id;s.className="tela";s.innerHTML=h;main.appendChild(s)}
sec("aovivo",'<p class="titulo">👁️ Partidas ao vivo</p><ul id="vlista" class="lis"></ul><button id="vatual">Atualizar</button><button id="vvoltar" class="sec">Voltar</button>');
sec("aoVer",'<p class="titulo">👁️ Assistindo</p><p class="nota" id="vmodo"></p><ul id="vplac" class="lis"></ul><p class="msg" id="vstatus">Conectando…</p><div id="vgrade" style="display:grid;gap:10px"></div><button id="vsair" class="sec">Sair</button>');
const bt=document.createElement("button");bt.className="grande sec";bt.textContent="👁️ Assistir partidas";
if($("jogar"))$("jogar").insertBefore(bt,$("vJogar"));
function ir(id,push){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id===id));
  $("nav").style.display="none";
  if(push)history.pushState({t:id},"");
}

// ---------- configuração ----------
const cfg=$("config");
if(cfg&&$("oReset")){
  const r=document.createElement("div");r.className="lin";
  r.innerHTML='<span>Permitir que assistam</span><button id="oEsp" class="tog"></button>';
  cfg.insertBefore(r,$("oReset"));
  const sy=()=>{const b=$("oEsp"),v=ok();b.textContent=v?"Ligado":"Desligado";b.classList.toggle("on",v)};
  sy();
  $("oEsp").onclick=()=>{try{localStorage.setItem("espOk",ok()?"0":"1")}catch(e){}sy()};
}

// ---------- quem joga: lê a tela e transmite ----------
function lerJogo(){
  const j=$("jogo");
  if(!j||!j.classList.contains("on"))return null;
  const g=$("grade").children;
  if(!g.length)return null;
  const modo=txt("modoTxt"),b=txt("n1");
  if(/Treino/.test(modo)||/Robô/.test(b))return null;
  const cs=[...g].map(c=>{
    const v=c.classList.contains("vira"),p=c.classList.contains("par");
    return{e:(v||p)?c.querySelector(".frente").textContent:"",v:+v,p:+p};
  });
  return{a:nm(txt("n0")),b:nm(b),pa:+txt("p0")||0,pb:+txt("p1")||0,
    vez:$("j0").classList.contains("vez")?0:$("j1").classList.contains("vez")?1:-1,
    modo,cs,fim:$("again").style.display==="block"||/saiu/.test(txt("status"))};
}
async function publicar(s,peer){
  await FB.F.setDoc(FB.F.doc(FB.db,"aovivo",uid()),{a:s.a.slice(0,12),b:s.b.slice(0,12),modo:s.modo.slice(0,30),peer:peer,t:Date.now()});
  pub=Date.now();meuDoc=true;
}
async function consente(s){
  const q=FB.F.query(FB.F.collection(FB.db,"aovivo"),FB.F.where("a","==",s.b));
  const r=await FB.F.getDocs(q);
  return r.docs.some(d=>{const x=d.data();return x.b===s.a&&Date.now()-x.t<120000});
}
function abrirPeer(){
  bp=new Peer();
  bp.on("open",id=>{bid=id;on=true;const s=lerJogo();if(s)publicar(s,id).catch(()=>{})});
  bp.on("connection",c=>{
    if(subs.length>=MAX){c.on("open",()=>c.close());return}
    subs.push(c);
    c.on("open",()=>{last=""});
    c.on("close",()=>{subs=subs.filter(x=>x!==c)});
  });
  bp.on("error",()=>{});
}
async function parar(){
  if(!bp&&!meuDoc)return;
  on=false;subs.forEach(c=>{try{c.close()}catch(e){}});subs=[];
  try{bp&&bp.destroy()}catch(e){}
  const tinha=meuDoc;bp=null;bid="";last="";meuDoc=false;prox=0;
  if(tinha&&FB&&uid()){try{await FB.F.deleteDoc(FB.F.doc(FB.db,"aovivo",uid()))}catch(e){}}
}
async function tick(){
  if(busy)return;busy=true;
  try{
    const s=lerJogo();
    if(!s||!ok()){await parar();return}
    await fb();
    if(!uid())return;
    if(!meuDoc||Date.now()-pub>25000)await publicar(s,bid);
    if(slug(s.a)<slug(s.b)){
      if(!bp){
        if(Date.now()>=prox){
          if(await consente(s))abrirPeer();else prox=Date.now()+5000;
        }
      }else if(on){
        const j=JSON.stringify(s);
        if(j!==last){last=j;subs.forEach(c=>{try{if(c.open)c.send(s)}catch(e){}})}
      }
    }
  }catch(e){}finally{busy=false}
}
setInterval(tick,1000);

// ---------- quem assiste ----------
async function listar(){
  const L=$("vlista");L.innerHTML="<li>Carregando…</li>";
  try{
    await fb();
    const r=await FB.F.getDocs(FB.F.collection(FB.db,"aovivo"));
    const a=r.docs.map(d=>d.data()).filter(x=>x.peer&&Date.now()-x.t<120000);
    L.innerHTML=a.length?"":"<li>Nenhuma partida ao vivo agora.</li>";
    a.slice(0,20).forEach(x=>{
      const li=document.createElement("li");li.style.cursor="pointer";
      li.innerHTML="<span>"+H(x.a)+" × "+H(x.b)+"</span><b>"+H(x.modo)+"</b>";
      li.onclick=()=>assistir(x);L.appendChild(li);
    });
  }catch(e){L.innerHTML="<li>Não foi possível carregar a lista.</li>"}
}
function pararVer(){
  if(!ver)return;
  try{ver.c&&ver.c.close()}catch(e){}
  try{ver.p.destroy()}catch(e){}
  ver=null;
}
function assistir(d){
  pararVer();
  $("vstatus").textContent="Conectando…";$("vgrade").innerHTML="";$("vplac").innerHTML="";$("vmodo").textContent="";
  ir("aoVer",true);
  const p=new Peer();ver={p:p,c:null};
  p.on("open",()=>{
    const c=p.connect(String(d.peer));ver.c=c;
    c.on("data",desenhar);
    c.on("close",()=>{$("vstatus").textContent="A transmissão acabou."});
  });
  p.on("error",()=>{$("vstatus").textContent="Não foi possível conectar. Tente outra partida."});
  setTimeout(()=>{if(ver&&ver.p===p&&$("vstatus").textContent==="Conectando…")$("vstatus").textContent="Não foi possível conectar. Tente outra partida."},15000);
}
function desenhar(s){
  if(!s||!Array.isArray(s.cs)||s.cs.length>24||s.cs.length<2)return;
  const n=s.cs.length,g=$("vgrade"),a=String(s.a).slice(0,12),b=String(s.b).slice(0,12);
  if(g.children.length!==n){
    g.innerHTML="";
    for(let i=0;i<n;i++){const d=document.createElement("div");d.className="carta";d.innerHTML='<i class="costas">?</i><i class="frente"></i>';g.appendChild(d)}
  }
  g.style.gridTemplateColumns="repeat("+(n===12?3:4)+",1fr)";
  const zero=!s.pa&&!s.pb&&!s.cs.some(c=>c.v||c.p);
  s.cs.forEach((c,i)=>{
    const d=g.children[i];
    d.classList.toggle("vira",!!c.v);d.classList.toggle("par",!!c.p);
    const f=d.querySelector(".frente");
    if(c.e)f.textContent=String(c.e).slice(0,8);else if(zero)f.textContent="";
  });
  $("vmodo").textContent=String(s.modo).slice(0,30);
  $("vplac").innerHTML=[[a,s.pa,0],[b,s.pb,1]].map(x=>
    '<li'+(s.vez===x[2]&&!s.fim?' style="outline:3px solid var(--txt)"':"")+"><span>"+H(x[0])+"</span><b>"+(+x[1]||0)+"</b></li>").join("");
  let t="";
  if(s.fim)t=(s.pa+s.pb===n/2)?(s.pa>s.pb?a+" ganhou! 🎉":s.pb>s.pa?b+" ganhou! 🎉":"Empate!"):"Partida encerrada.";
  else if(s.vez>=0)t="Vez de "+(s.vez===0?a:b);
  $("vstatus").textContent=t;
}
bt.onclick=()=>{ir("aovivo",true);listar()};
$("vatual").onclick=listar;
$("vvoltar").onclick=()=>history.back();
$("vsair").onclick=()=>history.back();
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(!t)return;
  if(t.id==="aoVer"){pararVer();ir("aovivo")}
  else if(t.id==="aovivo")ir("jogar");
});
})();
