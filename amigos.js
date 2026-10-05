(function(){
const $=id=>document.getElementById(id);
const main=document.querySelector("main");
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const U="https://www.gstatic.com/firebasejs/10.12.2/";
const PAT=[[1400,"Mestre","#e5383b","c"],[1000,"Heroico","#2ecc71","w"],[700,"Diamante","#9b5de5","g"],[450,"Platina","#5ec8f2","w"],[250,"Ouro","#ffc933","s"],[100,"Prata","#c9d1d9",""],[0,"Bronze","#cd7f32",""]];
const pat=p=>PAT.find(x=>p>=x[0]);
const SH="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z",HL="M12 2 4 5v6c0 5 3.5 9 8 11z";
const STAR='<path d="M12 7.5l1.4 3 3.3.4-2.4 2.3.6 3.2L12 14.8l-2.9 1.6.6-3.2-2.4-2.3 3.3-.4z" fill="#fff"/>';
const SIM={s:STAR,g:'<path d="M12 8l3.2 3.6L12 16.5 8.8 11.6z" fill="#fff" opacity=".9"/>',w:'<path d="M4.2 7.5.8 6l1.2 5 2.5 1zM19.8 7.5 23.2 6 22 11l-2.5 1z" fill="#fff" opacity=".85"/>'+STAR,c:'<path d="M8 9.5l1.8 2.2L12 8.5l2.2 3.2L16 9.5V15H8z" fill="#fff"/>'};
const sh=p=>{const x=pat(p);return '<svg class="esc" viewBox="0 0 24 24"><path d="'+SH+'" fill="'+x[2]+'" stroke="rgba(0,0,0,.45)"/><path d="'+HL+'" fill="#fff" opacity=".2"/>'+(SIM[x[3]]||"")+"</svg>"};
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

// ---------- tela ----------
const st=document.createElement("style");
st.textContent=".lis li button{padding:4px 10px;font-size:1rem;margin-left:6px}.lis li span{overflow:hidden;text-overflow:ellipsis}";
document.head.appendChild(st);
const sec=document.createElement("section");sec.id="amigos";sec.className="tela";
sec.innerHTML='<p class="titulo">👥 Amigos</p><input id="aNome" maxlength="12" placeholder="Nome do jogador" autocomplete="off"><button id="aEnviar">Enviar pedido</button><p class="msg" id="aMsg"></p><p class="nota">Pedidos recebidos</p><ul id="aPed" class="lis"></ul><p class="nota">Meus amigos</p><ul id="aLista" class="lis"></ul><button id="aVoltar" class="sec">Voltar</button>';
main.appendChild(sec);
const bt=document.createElement("button");bt.className="grande sec";bt.textContent="👥 Amigos";
if($("bTreino"))$("bTreino").after(bt);
function ir(id,push){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id===id));
  $("nav").style.display="none";
  if(push)history.pushState({t:id},"");
}
function paraMenu(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="menu"));
  $("nav").style.display="flex";
  ["nRank","nConq","nPerfil","nConfig"].forEach(i=>{if($(i))$(i).classList.remove("on")});
  $("nInicio").classList.add("on");
  contar();
}

// ---------- ações ----------
async function carregar(){
  const P=$("aPed"),L=$("aLista");
  P.innerHTML="<li>Carregando…</li>";L.innerHTML="<li>Carregando…</li>";
  try{
    await fb();const{F,db}=FB;
    const[pr,a1,a2]=await Promise.all([
      F.getDocs(F.query(F.collection(db,"pedidos"),F.where("para","==",eu))),
      F.getDocs(F.query(F.collection(db,"amizades"),F.where("u1","==",eu))),
      F.getDocs(F.query(F.collection(db,"amizades"),F.where("u2","==",eu)))
    ]);
    P.innerHTML=pr.docs.length?"":"<li>Nenhum pedido.</li>";
    pr.docs.forEach(d=>{
      const x=d.data(),li=document.createElement("li"),sp=document.createElement("span"),bx=document.createElement("span");
      sp.textContent=String(x.deNome).slice(0,12);
      const ok=document.createElement("button"),no=document.createElement("button");
      ok.textContent="✅";no.textContent="❌";
      ok.onclick=()=>aceitar(x.de);no.onclick=()=>recusar(x.de);
      bx.append(ok,no);li.append(sp,bx);P.appendChild(li);
    });
    const ids=[...a1.docs,...a2.docs].map(d=>{const x=d.data();return{id:d.id,o:x.u1===eu?x.u2:x.u1}});
    const inf=await Promise.all(ids.map(async a=>{
      try{const s=await F.getDoc(F.doc(db,"jogadores",a.o));return s.exists()?{...a,...s.data()}:null}catch(e){return null}
    }));
    const am=inf.filter(Boolean).sort((a,b)=>b.pontos-a.pontos);
    L.innerHTML=am.length?"":"<li>Você ainda não tem amigos. Envie um pedido!</li>";
    am.forEach(a=>{
      const li=document.createElement("li"),sp=document.createElement("span"),b=document.createElement("b"),x=document.createElement("button");
      sp.innerHTML=sh(a.pontos)+" "+H(a.nome);
      b.textContent=pat(a.pontos)[1]+((a.sequencia||0)>0?" · "+a.sequencia+"🔥":"");
      x.textContent="✖";x.className="sec";
      x.onclick=()=>remover(a.id,a.nome);
      const bx=document.createElement("span");bx.append(b,x);
      li.append(sp,bx);L.appendChild(li);
    });
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
async function contar(){
  try{
    await fb();const{F,db}=FB;
    const r=await F.getDocs(F.query(F.collection(db,"pedidos"),F.where("para","==",eu)));
    bt.textContent=r.docs.length?"👥 Amigos ("+r.docs.length+")":"👥 Amigos";
  }catch(e){}
}

bt.onclick=()=>{$("aMsg").textContent="";ir("amigos",true);carregar()};
$("aEnviar").onclick=enviar;
$("aVoltar").onclick=()=>history.back();
addEventListener("popstate",()=>{const t=document.querySelector(".tela.on");if(t&&t.id==="amigos")paraMenu()});
setTimeout(contar,4000);
setInterval(()=>{if($("menu").classList.contains("on"))contar()},60000);
})();
