(function(){
const $=id=>document.getElementById(id);
const main=document.querySelector("main"),nav=$("nav");
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const U="https://www.gstatic.com/firebasejs/10.12.2/";
const PAT=[[1400,"Mestre","#e5383b","c"],[1000,"Heroico","#2ecc71","w"],[700,"Diamante","#9b5de5","g"],[450,"Platina","#5ec8f2","w"],[250,"Ouro","#ffc933","s"],[100,"Prata","#c9d1d9",""],[0,"Bronze","#cd7f32",""]];
const pat=p=>PAT.find(x=>p>=x[0]);
const SH="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z",HL="M12 2 4 5v6c0 5 3.5 9 8 11z";
const STAR='<path d="M12 7.5l1.4 3 3.3.4-2.4 2.3.6 3.2L12 14.8l-2.9 1.6.6-3.2-2.4-2.3 3.3-.4z" fill="#fff"/>';
const SIM={s:STAR,g:'<path d="M12 8l3.2 3.6L12 16.5 8.8 11.6z" fill="#fff" opacity=".9"/>',w:'<path d="M4.2 7.5.8 6l1.2 5 2.5 1zM19.8 7.5 23.2 6 22 11l-2.5 1z" fill="#fff" opacity=".85"/>'+STAR,c:'<path d="M8 9.5l1.8 2.2L12 8.5l2.2 3.2L16 9.5V15H8z" fill="#fff"/>'};
const sh=p=>{const x=pat(p);return '<svg class="esc" viewBox="0 0 24 24"><path d="'+SH+'" fill="'+x[2]+'" stroke="rgba(0,0,0,.45)"/><path d="'+HL+'" fill="#fff" opacity=".2"/>'+(SIM[x[3]]||"")+"</svg>"};
const txt=id=>{const e=$(id);return e?e.textContent:""};
const nm=s=>s.replace(/\s*\d+🔥\s*$/,"").trim();
let FB=null,eu=null,meuNome="";

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

// ================= FILTRO DE NOMES =================
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
  .replace(/[@4]/g,"a").replace(/3/g,"e").replace(/[1!]/g,"i").replace(/0/g,"o").replace(/[5$]/g,"s").replace(/7/g,"t")
  .replace(/[^a-z]/g,"").replace(/(.)\1+/g,"$1");
const CONTEM=["caralho","buceta","arrombado","punheta","cacete","vagabunda","vagabundo","nazista","hitler","estupro","estuprador","pedofilo","pedofilia","filhodaputa","fodase","foder","piroca","xoxota","cuzao","cuzinho","crioulo","viadinho"].map(norm);
const EXATO=["puta","porra","merda","viado","bicha","cu","fdp","pqp","vsf","tnc","vadia","putaria"].map(norm);
document.addEventListener("click",e=>{
  if(!e.target||e.target.id!=="btnNome")return;
  const n=norm(($("nome")||{value:""}).value);
  if(n&&(EXATO.includes(n)||CONTEM.some(w=>n.includes(w)))){
    e.stopPropagation();e.preventDefault();
    $("msgNome").textContent="Esse nome não é permitido. Escolha outro.";
  }
},true);

// ================= DENÚNCIAS =================
async function denunciar(nome){
  const r=prompt("Motivo da denúncia de "+nome+":\n1 = Nome ofensivo\n2 = Trapaça\n3 = Comportamento ofensivo");
  const M={"1":"Nome ofensivo","2":"Trapaça","3":"Comportamento ofensivo"}[(r||"").trim()];
  if(!M)return;
  try{
    await fb();const{F,db}=FB;
    const s=await F.getDoc(F.doc(db,"nomes",slug(nome)));
    if(!s.exists()){alert("Jogador não encontrado.");return}
    const c=s.data().uid;
    if(c===eu){alert("Esse é você.");return}
    await F.setDoc(F.doc(db,"denuncias",eu+"_"+c),{de:eu,contra:c,nome:nome.slice(0,12),motivo:M,t:Date.now()});
    alert("Denúncia enviada. Obrigado!");
  }catch(e){alert("Não foi possível enviar (ou você já denunciou esse jogador).")}
}
const lista=$("lista");
if(lista)new MutationObserver(()=>{
  lista.querySelectorAll("li").forEach(li=>{
    if(li.classList.contains("eu")||li.querySelector(".flag")||!li.querySelector("span"))return;
    const nome=li.querySelector("span").textContent.replace(/^\S+\s+/,"").replace(/\s+/g," ").trim();
    if(!nome||/Carregando|Ninguém|Não foi/.test(nome))return;
    const b=document.createElement("button");
    b.className="flag sec";b.textContent="🚩";b.style.cssText="padding:2px 8px;font-size:.9rem";
    b.onclick=()=>denunciar(nome);li.appendChild(b);
  });
}).observe(lista,{childList:true});
const bd=document.createElement("button");
bd.className="sec";bd.textContent="🚩 Denunciar adversário";bd.style.display="none";
if($("sair"))$("sair").before(bd);
bd.onclick=()=>denunciar(nm(txt("n1")));

// ================= AMIGOS =================
const sec=document.createElement("section");sec.id="amigos";sec.className="tela";
sec.innerHTML='<p class="titulo">👥 Amigos</p><button id="aAdd">➕ Adicionar amigo</button><div id="aForm" style="display:none;flex-direction:column;gap:10px"><input id="aNome" maxlength="12" placeholder="Nome do jogador" autocomplete="off"><button id="aEnviar">Enviar pedido</button></div><p class="msg" id="aMsg"></p><p class="nota">📨 Pedidos recebidos</p><ul id="aPed" class="lis"></ul><p class="nota">Meus amigos</p><ul id="aLista" class="lis"></ul>';
main.appendChild(sec);
const nb=document.createElement("button");nb.id="nAmigos";nb.innerHTML="<b>👥</b>Amigos";
if($("nConq")){nav.insertBefore(nb,$("nConq"));$("nConq").style.display="none"}else nav.appendChild(nb);
if($("perfil")){
  const bq=document.createElement("button");bq.className="sec";bq.textContent="🎖️ Ver conquistas";
  bq.onclick=()=>{if($("nConq"))$("nConq").click()};$("perfil").appendChild(bq);
}
function badge(n){nb.innerHTML="<b>👥</b>Amigos"+(n?" ("+n+")":"")}
function abrir(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="amigos"));
  nav.style.display="flex";
  nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===nb));
  history.pushState({t:"amigos"},"");carregar();
}
function paraInicio(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="menu"));
  nav.style.display="flex";
  nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.id==="nInicio"));
}
nb.onclick=()=>{if(!sec.classList.contains("on"))abrir()};
nav.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b!==nb)nb.classList.remove("on")},true);
addEventListener("popstate",()=>{const t=document.querySelector(".tela.on");if(t&&t.id==="amigos")paraInicio()});

async function lerAmigos(){
  await fb();const{F,db}=FB;
  const[a1,a2]=await Promise.all([
    F.getDocs(F.query(F.collection(db,"amizades"),F.where("u1","==",eu))),
    F.getDocs(F.query(F.collection(db,"amizades"),F.where("u2","==",eu)))
  ]);
  const ids=[...a1.docs,...a2.docs].map(d=>{
    const x=d.data(),m1=x.u1===eu;
    return{aid:d.id,o:m1?x.u2:x.u1,campo:m1?"v1":"v2",meus:m1?(x.v1||0):(x.v2||0),deles:m1?(x.v2||0):(x.v1||0)};
  });
  const inf=await Promise.all(ids.map(async a=>{
    try{
      const[s,p]=await Promise.all([F.getDoc(F.doc(db,"jogadores",a.o)),F.getDoc(F.doc(db,"presenca",a.o))]);
      if(!s.exists())return null;
      const t=p.exists()?p.data().t:0,est=p.exists()?p.data().e:"m";
      return{...a,...s.data(),on:Date.now()-t<110000,est};
    }catch(e){return null}
  }));
  return inf.filter(Boolean);
}
function linha(a){
  const li=document.createElement("li"),sp=document.createElement("span"),bx=document.createElement("span");
  const st=a.on?'<span style="color:#3ddc97">online'+(a.est==="j"?" · jogando":"")+"</span>":'<span style="color:#ff5d5d">offline</span>';
  sp.innerHTML=sh(a.pontos)+" "+H(a.nome)+((a.sequencia||0)>0?" "+a.sequencia+"🔥":"")+"<br>"+st+'<br><small style="opacity:.75">Você '+a.meus+" × "+a.deles+"</small>";
  bx.style.cssText="display:flex;gap:6px;flex-shrink:0";
  if(a.on&&a.est!=="j"){
    const d=document.createElement("button");d.textContent="⚔️ Desafiar";d.style.cssText="padding:6px 10px;font-size:.9rem";
    d.onclick=()=>desafiar(a);bx.appendChild(d);
  }
  const x=document.createElement("button");x.textContent="✖";x.className="sec";x.style.cssText="padding:4px 10px;font-size:1rem";
  x.onclick=()=>remover(a.aid,a.nome);bx.appendChild(x);
  li.append(sp,bx);return li;
}
async function carregar(){
  const P=$("aPed"),L=$("aLista");
  P.innerHTML=L.innerHTML="<li>Carregando…</li>";
  try{
    await fb();const{F,db}=FB;
    const[pr,am]=await Promise.all([F.getDocs(F.query(F.collection(db,"pedidos"),F.where("para","==",eu))),lerAmigos()]);
    P.innerHTML=pr.docs.length?"":"<li>Nenhum pedido.</li>";
    pr.docs.forEach(d=>{
      const x=d.data(),li=document.createElement("li"),sp=document.createElement("span"),bx=document.createElement("span");
      sp.textContent=String(x.deNome).slice(0,12);
      const ok=document.createElement("button"),no=document.createElement("button");
      ok.textContent="✅";no.textContent="❌";
      [ok,no].forEach(b=>b.style.cssText="padding:4px 10px;font-size:1rem;margin-left:6px");
      ok.onclick=()=>aceitar(x.de);no.onclick=()=>recusar(x.de);
      bx.append(ok,no);li.append(sp,bx);P.appendChild(li);
    });
    am.sort((a,b)=>(b.on-a.on)||(b.pontos-a.pontos));
    L.innerHTML=am.length?"":"<li>Você ainda não tem amigos. Toque em ➕ para adicionar.</li>";
    am.forEach(a=>L.appendChild(linha(a)));
    badge(pr.docs.length);
  }catch(e){P.innerHTML="";L.innerHTML="<li>Não foi possível carregar. Confira a internet.</li>"}
}
async function enviar(){
  const n=$("aNome").value.trim(),id=slug(n),m=$("aMsg");
  if(id.length<2){m.textContent="Digite o nome do jogador.";return}
  m.textContent="Procurando…";
  try{
    await fb();const{F,db}=FB;
    if(!meuNome){m.textContent="Seu perfil ainda não carregou. Tente de novo.";return}
    const s=await F.getDoc(F.doc(db,"nomes",id));
    if(!s.exists()){m.textContent="Jogador não encontrado.";return}
    const o=s.data().uid;
    if(o===eu){m.textContent="Esse é você! 😄";return}
    const[u1,u2]=[eu,o].sort(),aid=u1+"_"+u2;
    if((await F.getDoc(F.doc(db,"amizades",aid))).exists()){m.textContent="Vocês já são amigos.";return}
    if((await F.getDoc(F.doc(db,"pedidos",eu+"_"+o))).exists()){m.textContent="Pedido já enviado. Aguarde a resposta.";return}
    if((await F.getDoc(F.doc(db,"pedidos",o+"_"+eu))).exists()){
      await F.setDoc(F.doc(db,"amizades",aid),{u1,u2,t:Date.now()});
      await F.deleteDoc(F.doc(db,"pedidos",o+"_"+eu));
      m.textContent="Vocês agora são amigos! 🎉";$("aNome").value="";carregar();return;
    }
    await F.setDoc(F.doc(db,"pedidos",eu+"_"+o),{de:eu,para:o,deNome:meuNome.slice(0,12),t:Date.now()});
    m.textContent="Pedido enviado! 📨";$("aNome").value="";
  }catch(e){m.textContent="Não foi possível enviar. Tente de novo."}
}
async function aceitar(de){
  try{
    await fb();const{F,db}=FB;const[u1,u2]=[eu,de].sort();
    await F.setDoc(F.doc(db,"amizades",u1+"_"+u2),{u1,u2,t:Date.now()});
    await F.deleteDoc(F.doc(db,"pedidos",de+"_"+eu));
  }catch(e){$("aMsg").textContent="Não foi possível aceitar. Tente de novo."}
  carregar();
}
async function recusar(de){
  try{await fb();await FB.F.deleteDoc(FB.F.doc(FB.db,"pedidos",de+"_"+eu))}catch(e){}
  carregar();
}
async function remover(aid,nome){
  if(!confirm("Remover "+nome+" dos amigos?"))return;
  try{await fb();await FB.F.deleteDoc(FB.F.doc(FB.db,"amizades",aid))}catch(e){$("aMsg").textContent="Não foi possível remover."}
  carregar();
}
async function contarPedidos(){
  try{
    await fb();const{F,db}=FB;
    const r=await F.getDocs(F.query(F.collection(db,"pedidos"),F.where("para","==",eu)));
    badge(r.docs.length);
  }catch(e){}
}
$("aAdd").onclick=()=>{const f=$("aForm");f.style.display=f.style.display==="none"?"flex":"none"};
$("aEnviar").onclick=enviar;

// ================= DESAFIOS (x1) =================
const box=document.createElement("div");
box.style.cssText="position:fixed;left:12px;right:12px;top:calc(env(safe-area-inset-top) + 56px);z-index:60;display:none;flex-direction:column;gap:8px;padding:14px;border-radius:14px;background:var(--back);color:#2b1f4a;font-weight:700;text-align:center";
box.innerHTML='<span id="cbTxt"></span><div id="cbBtn" style="display:flex;gap:8px"></div>';
document.body.appendChild(box);
function mostra(t,bt){
  $("cbTxt").textContent=t;const c=$("cbBtn");c.innerHTML="";
  (bt||[]).forEach(([l,f])=>{const b=document.createElement("button");b.textContent=l;b.style.cssText="flex:1;padding:10px;background:#2b1f4a;color:var(--back)";b.onclick=f;c.appendChild(b)});
  box.style.display="flex";
}
const esconde=()=>{box.style.display="none"};
const noJogo=()=>{const j=$("jogo");return !!(j&&j.classList.contains("on"))};
const espera=(f,ms)=>new Promise(r=>{const t0=Date.now(),i=setInterval(()=>{const v=f();if(v||Date.now()-t0>ms){clearInterval(i);r(v)}},200)});
let meuConv=null,recebido=null;
async function apagaConv(id){try{await FB.F.deleteDoc(FB.F.doc(FB.db,"convites",id))}catch(e){}}
async function desafiar(a){
  if(noJogo()||meuConv){alert("Termine a partida ou o convite atual antes.");return}
  try{
    await fb();const{F,db}=FB;
    $("bJogar").click();$("mCasual").click();$("bCriar").click();
    $("meuCod").textContent="----";
    $("criarSala").click();
    const cod=await espera(()=>{const c=txt("meuCod").trim();return c.length===4&&c!=="----"&&$("espera").classList.contains("on")?c:null},12000);
    if(!cod){alert("Não foi possível criar a sala. Tente de novo.");return}
    const id=eu+"_"+a.o;
    await F.setDoc(F.doc(db,"convites",id),{de:eu,para:a.o,deNome:meuNome.slice(0,12),cod:cod,t:Date.now()});
    meuConv={id:id,nome:a.nome,t:Date.now()};
    mostra("⚔️ Convite enviado para "+a.nome+". Aguardando…",[["Cancelar",cancelarConv]]);
  }catch(e){alert("Não foi possível enviar o convite.")}
}
async function cancelarConv(){
  if(!meuConv)return;
  const id=meuConv.id;meuConv=null;esconde();
  await apagaConv(id);
  if($("espera").classList.contains("on"))$("voltarEspera").click();
}
async function aceitarConv(v){
  esconde();recebido=null;
  try{
    const s=await FB.F.getDoc(FB.F.doc(FB.db,"convites",v.id));
    if(!s.exists()||Date.now()-s.data().t>90000){alert("O convite expirou.");return}
    $("bJogar").click();$("bEntrar").click();
    $("cod").value=String(v.cod).toUpperCase();
    $("entrarSala").click();
  }catch(e){alert("Não foi possível entrar na sala.")}
}
async function recusarConv(v){esconde();recebido=null;await apagaConv(v.id)}
async function ouvir(){
  try{
    await fb();const{F,db}=FB;
    F.onSnapshot(F.query(F.collection(db,"convites"),F.where("para","==",eu)),snap=>{
      const v=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>Date.now()-x.t<90000).sort((a,b)=>b.t-a.t)[0];
      if(!v){if(recebido&&!meuConv){recebido=null;esconde()}return}
      if(noJogo()||meuConv)return;
      recebido=v;
      mostra("⚔️ "+v.deNome+" te desafiou para um x1!",[["Aceitar",()=>aceitarConv(v)],["Recusar",()=>recusarConv(v)]]);
    },()=>{});
  }catch(e){}
}
setInterval(async()=>{
  if(recebido&&Date.now()-recebido.t>90000){recebido=null;if(!meuConv)esconde()}
  if(!meuConv)return;
  if(noJogo()||!$("espera").classList.contains("on")){const id=meuConv.id;meuConv=null;esconde();await apagaConv(id);return}
  if(Date.now()-meuConv.t>60000){await cancelarConv();alert("Sem resposta ao convite.");return}
  try{
    const s=await FB.F.getDoc(FB.F.doc(FB.db,"convites",meuConv.id));
    if(!s.exists()){const n=meuConv.nome;meuConv=null;esconde();$("voltarEspera").click();alert(n+" recusou o convite.")}
  }catch(e){}
},2500);

// ================= ONLINE / OFFLINE =================
const vis=()=>{try{return localStorage.getItem("invisivel")!=="1"}catch(e){return true}};
async function ping(){
  if(document.hidden||!vis())return;
  try{
    await fb();
    const j=$("jogo");
    await FB.F.setDoc(FB.F.doc(FB.db,"presenca",eu),{t:Date.now(),e:j&&j.classList.contains("on")?"j":"m"});
  }catch(e){}
}
setInterval(ping,45000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)ping()});
setTimeout(()=>{ping();contarPedidos();ouvir()},4000);
setInterval(()=>{if(!document.hidden)contarPedidos()},60000);
const cfg=$("config");
if(cfg&&$("oReset")){
  const r=document.createElement("div");r.className="lin";
  r.innerHTML='<span>Aparecer offline</span><button id="oInv" class="tog"></button>';
  cfg.insertBefore(r,$("oReset"));
  const sy=()=>{const b=$("oInv"),v=!vis();b.textContent=v?"Ligado":"Desligado";b.classList.toggle("on",v)};
  sy();
  $("oInv").onclick=()=>{try{localStorage.setItem("invisivel",vis()?"1":"0")}catch(e){}sy()};
}

// ================= PLACAR ENTRE AMIGOS =================
let contado=false;
async function contar(nome){
  try{
    const am=await lerAmigos(),a=am.find(x=>slug(x.nome)===slug(nome));
    if(!a)return;
    await FB.F.updateDoc(FB.F.doc(FB.db,"amizades",a.aid),{[a.campo]:a.meus+1});
  }catch(e){}
}
setInterval(()=>{
  const j=$("jogo"),ag=$("again");
  const fim=!!(j&&j.classList.contains("on")&&ag&&ag.style.display==="block");
  const humano=!/Treino/.test(txt("modoTxt"))&&!/Robô/.test(txt("n1"));
  bd.style.display=fim&&humano?"block":"none";
  if(!fim){contado=false;return}
  if(contado||!humano||!/^Você ganhou/.test(txt("status")))return;
  contado=true;contar(nm(txt("n1")));
},1500);
})();
