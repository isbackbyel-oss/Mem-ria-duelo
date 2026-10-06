(function(){
const $=id=>document.getElementById(id);
const main=document.querySelector("main");
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const U="https://www.gstatic.com/firebasejs/10.12.2/";
const txt=id=>{const e=$(id);return e?e.textContent:""};
const esp=(f,ms)=>new Promise(r=>{const t0=Date.now(),i=setInterval(()=>{const v=f();if(v||Date.now()-t0>ms){clearInterval(i);r(v)}},200)});
let FB=null,eu=null,meuNome="",dupla=null,papel=null,busca=null,emSala=false;

async function fb(){
  if(!FB){
    const A=await import(U+"firebase-app.js"),F=await import(U+"firebase-firestore.js"),T=await import(U+"firebase-auth.js");
    const app=A.getApp();
    FB={F,db:F.getFirestore(app),auth:T.getAuth(app)};
  }
  if(!FB.auth.currentUser){
    await new Promise(r=>{let n=0;const t=setInterval(()=>{if(FB.auth.currentUser||++n>40){clearInterval(t);r()}},250)});
  }
  if(!FB.auth.currentUser)throw new Error("sem conta");
  eu=FB.auth.currentUser.uid;
  if(!meuNome){
    const s=await FB.F.getDoc(FB.F.doc(FB.db,"jogadores",eu));
    if(s.exists())meuNome=s.data().nome;
  }
  return FB;
}

// ---------- tela ----------
const sec=document.createElement("section");sec.id="dupla2";sec.className="tela";
sec.innerHTML='<p class="titulo">🤝 2v2 em dupla</p><p class="msg" id="dpInfo"></p><p class="nota" id="dpSub"></p><button id="dpBusca">🔎 Procurar 2v2</button><button id="dpCancel" class="sec">Cancelar busca</button><button id="dpDesf" class="sec"></button><p class="nota" id="dpTit">Chamar um amigo para o meu time</p><ul id="dpAm" class="lis"></ul><button id="dpVolta" class="sec">Voltar</button>';
main.appendChild(sec);
const bt=document.createElement("button");bt.className="grande sec";bt.textContent="🤝 Fila 2v2";
if($("jogar")&&$("vJogar"))$("jogar").insertBefore(bt,$("vJogar"));
function ir(id){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id===id));
  $("nav").style.display="none";
}
const box=document.createElement("div");
box.style.cssText="position:fixed;left:12px;right:12px;top:calc(env(safe-area-inset-top) + 130px);z-index:60;display:none;flex-direction:column;gap:8px;padding:14px;border-radius:14px;background:var(--back);color:#2b1f4a;font-weight:700;text-align:center";
box.innerHTML='<span id="dbTxt"></span><div id="dbBtn" style="display:flex;gap:8px"></div>';
document.body.appendChild(box);
function mostra(t,bs){
  $("dbTxt").textContent=t;const c=$("dbBtn");c.innerHTML="";
  bs.forEach(([l,f])=>{const b=document.createElement("button");b.textContent=l;b.style.cssText="flex:1;padding:10px;background:#2b1f4a;color:var(--back)";b.onclick=f;c.appendChild(b)});
  box.style.display="flex";
}
const esconde=()=>{box.style.display="none"};

function render(){
  const lider=papel==="L",ativa=!!(dupla&&dupla.e==="a");
  $("dpInfo").textContent=!dupla?"Você está sem dupla.":ativa?"🤝 Dupla com "+(lider?dupla.an:dupla.ln):(lider?"Convite enviado para "+dupla.an+"…":"Convite recebido");
  $("dpSub").textContent=busca?(busca.criando?"Montando a sala…":"Procurando 2v2… ("+busca.membros.length+" no seu time)"):!dupla?"Procure 2v2 sozinho ou chame um amigo para o seu time.":(ativa&&lider)?"Toque em Procurar 2v2.":ativa?"Aguarde o líder procurar a partida.":"";
  $("dpBusca").style.display=(!busca&&(!dupla||(ativa&&lider)))?"":"none";
  $("dpCancel").style.display=busca?"":"none";
  $("dpDesf").style.display=(dupla&&!busca)?"":"none";
  $("dpDesf").textContent=lider?(ativa?"Desfazer dupla":"Cancelar convite"):"Sair da dupla";
  const livre=!dupla&&!busca;
  $("dpTit").style.display=livre?"":"none";$("dpAm").style.display=livre?"":"none";
}

// ---------- dupla (líder + amigo) ----------
async function ouvir(){
  try{
    await fb();const{F,db}=FB;
    F.onSnapshot(F.doc(db,"dupla",eu),s=>{
      if(s.exists()){dupla={...s.data(),id:s.id};papel="L"}
      else if(papel==="L"){dupla=null;papel=null;if(busca)cancelarBusca()}
      render();
    },()=>{});
    F.onSnapshot(F.query(F.collection(db,"dupla"),F.where("a","==",eu)),snap=>{
      if(papel==="L")return;
      const d=snap.docs[0];
      if(d){
        dupla={...d.data(),id:d.id};papel="P";
        if(dupla.e==="c")mostra("🤝 "+dupla.ln+" chamou você para o time dele no 2v2!",[["Aceitar",aceitarDupla],["Recusar",desfazer]]);
        else esconde();
      }else if(papel==="P"){dupla=null;papel=null;esconde()}
      render();
    },()=>{});
  }catch(e){}
}
async function chamar(a){
  if(dupla){alert("Você já tem uma dupla ou um convite. Desfaça primeiro.");return}
  try{
    await fb();const{F,db}=FB;
    await F.setDoc(F.doc(db,"dupla",eu),{l:eu,a:a.o,ln:meuNome.slice(0,12),an:a.nome.slice(0,12),e:"c",t:Date.now()});
  }catch(e){alert("Não foi possível chamar. Confira se vocês são amigos e se as regras foram publicadas.")}
}
async function aceitarDupla(){
  esconde();
  try{await FB.F.updateDoc(FB.F.doc(FB.db,"dupla",dupla.id),{e:"a"})}catch(e){alert("Não foi possível aceitar.")}
}
async function desfazer(){
  esconde();
  if(busca)cancelarBusca();
  if(!dupla)return;
  try{await FB.F.deleteDoc(FB.F.doc(FB.db,"dupla",dupla.id))}catch(e){}
}
async function carregarAm(){
  const L=$("dpAm");L.innerHTML="<li>Carregando…</li>";
  try{
    await fb();const{F,db}=FB;
    const[a1,a2]=await Promise.all([
      F.getDocs(F.query(F.collection(db,"amizades"),F.where("u1","==",eu))),
      F.getDocs(F.query(F.collection(db,"amizades"),F.where("u2","==",eu)))
    ]);
    const ids=[...a1.docs,...a2.docs].map(d=>{const x=d.data();return x.u1===eu?x.u2:x.u1});
    const am=(await Promise.all(ids.map(async o=>{
      try{
        const[s,p]=await Promise.all([F.getDoc(F.doc(db,"jogadores",o)),F.getDoc(F.doc(db,"presenca",o))]);
        return s.exists()?{o,nome:s.data().nome,on:p.exists()&&Date.now()-p.data().t<110000&&p.data().e!=="j"}:null;
      }catch(e){return null}
    }))).filter(x=>x&&x.on);
    L.innerHTML=am.length?"":"<li>Nenhum amigo online agora.</li>";
    am.forEach(a=>{
      const li=document.createElement("li"),sp=document.createElement("span"),b=document.createElement("button");
      sp.textContent="🟢 "+a.nome;b.textContent="🤝 Chamar";b.style.cssText="padding:6px 10px;font-size:.9rem";
      b.onclick=()=>chamar(a);li.append(sp,b);L.appendChild(li);
    });
  }catch(e){L.innerHTML="<li>Não foi possível carregar.</li>"}
}

// ---------- fila 2v2 ----------
async function criarSalaGrupo(){
  $("bJogar").click();$("bGrupo").click();$("m4").click();
  $("mdif").value="m";
  const o=$("mtema").options;$("mtema").selectedIndex=Math.floor(Math.random()*o.length);
  $("mcodigo").textContent="----";
  $("mcriar").click();
  return await esp(()=>{const c=txt("mcodigo").trim();return /^[A-Z0-9]{4}$/.test(c)&&$("mlobby").classList.contains("on")?c:null},12000);
}
async function pararBusca(){
  if(busca)clearTimeout(busca.tm);
  busca=null;render();
  try{await FB.F.deleteDoc(FB.F.doc(FB.db,"fila2",eu))}catch(e){}
}
async function cancelarBusca(){await pararBusca()}
async function entrarPartida(p){
  if(emSala)return;emSala=true;
  await pararBusca();
  window.__eq=(p.ea||[]).includes(eu)?"A":"B";
  $("bJogar").click();$("bGrupo").click();
  $("mcod").value=String(p.cod).toUpperCase();$("mentrar").click();
  setTimeout(()=>{window.__eq=""},40000);
}
async function buscar(){
  if(busca)return;
  if(!$("bGrupo")||!$("mcriar")){alert("O modo em grupo não está disponível.");return}
  try{await fb()}catch(e){alert("Sem conexão com o servidor.");return}
  const lider=papel==="L"&&dupla&&dupla.e==="a";
  busca={membros:lider?[eu,dupla.a]:[eu],nm:lider?[meuNome,dupla.an]:[meuNome],t0:Date.now(),tm:null,criando:false};
  render();ciclo();
}
async function ciclo(){
  if(!busca)return;
  try{
    const{F,db}=FB;
    await F.setDoc(F.doc(db,"fila2",eu),{u:busca.membros,n:busca.membros.length,nm:busca.nm.map(x=>String(x).slice(0,12)),t:Date.now()});
    const[fs,ps]=await Promise.all([F.getDocs(F.collection(db,"fila2")),F.getDocs(F.collection(db,"partidas"))]);
    const agora=Date.now(),part=ps.docs.map(d=>({id:d.id,...d.data()})).filter(p=>agora-p.t<60000);
    const meu=part.find(p=>(p.alvos||[]).includes(eu));
    if(meu){await entrarPartida(meu);return}
    const usados=new Set();part.forEach(p=>{usados.add(p.id);(p.alvos||[]).forEach(u=>usados.add(u))});
    const fila=fs.docs.map(d=>({id:d.id,...d.data()})).filter(x=>agora-x.t<20000&&!x.u.some(u=>usados.has(u)))
      .sort((a,b)=>(a.t-b.t)||(a.id<b.id?-1:1));
    const grupos=[];let at=[],soma=0;
    for(const e of fila){if(soma+e.n<=4){at.push(e);soma+=e.n;if(soma===4){grupos.push(at);at=[];soma=0}}}
    const g=grupos.find(gr=>gr.some(e=>e.id===eu));
    if(g&&g.map(e=>e.id).sort()[0]===eu&&!busca.criando){await hospedar(g);return}
  }catch(e){}
  if(busca&&Date.now()-busca.t0>300000){await pararBusca();alert("Ninguém encontrado. Tente de novo mais tarde.");return}
  if(busca)busca.tm=setTimeout(ciclo,3500);
}
async function hospedar(g){
  busca.criando=true;render();
  const meuE=g.find(e=>e.id===eu),outros=g.filter(e=>e.id!==eu);
  let ea;
  if(meuE.n===2)ea=meuE.u[1];
  else{const duo=outros.find(e=>e.n===2);ea=duo?outros.find(e=>e.n===1).u[0]:outros[0].u[0]}
  const alvos=outros.flatMap(e=>e.u);
  const cod=await criarSalaGrupo();
  if(!cod){if(busca){busca.criando=false;render();busca.tm=setTimeout(ciclo,3500)}return}
  try{
    await FB.F.setDoc(FB.F.doc(FB.db,"partidas",eu),{cod:cod,alvos:alvos,ea:[ea],t:Date.now()});
    setTimeout(()=>{FB.F.deleteDoc(FB.F.doc(FB.db,"partidas",eu)).catch(()=>{})},45000);
  }catch(e){}
  emSala=true;
  await pararBusca();
}
// o amigo da dupla (que não é líder) espera o convite da partida
setInterval(async()=>{
  const sala=["mconf","mlobby","mjogo"].some(i=>$(i)&&$(i).classList.contains("on"));
  if(emSala&&!sala){emSala=false}
  if(papel!=="P"||!dupla||dupla.e!=="a"||emSala||document.hidden)return;
  try{
    const{F,db}=FB;
    const r=await F.getDocs(F.query(F.collection(db,"partidas"),F.where("alvos","array-contains",eu)));
    const p=r.docs.map(d=>d.data()).find(x=>Date.now()-x.t<60000);
    if(p)await entrarPartida(p);
  }catch(e){}
},4000);

// ---------- botões ----------
bt.onclick=()=>{ir("dupla2");history.pushState({t:"dupla2"},"");render();carregarAm()};
$("dpBusca").onclick=buscar;
$("dpCancel").onclick=cancelarBusca;
$("dpDesf").onclick=desfazer;
$("dpVolta").onclick=()=>history.back();
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(t&&t.id==="dupla2"){if(busca)cancelarBusca();ir("jogar")}
});
setTimeout(ouvir,5000);
})();
