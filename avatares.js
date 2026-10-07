(function(){
const $=id=>document.getElementById(id);
if(!$("cartao"))return;
const txt=id=>{const e=$(id);return e?e.textContent:""};
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const A=[
["#1b6fd8",`<path d="M6 64Q8 46 32 46Q56 46 58 64Z" fill="#f5a623"/><circle cx="32" cy="30" r="16" fill="#16233f"/><ellipse cx="32" cy="31" rx="11" ry="8" fill="#0a0f1e"/><ellipse cx="27" cy="31" rx="3" ry="3.5" fill="#fff"/><ellipse cx="37" cy="31" rx="3" ry="3.5" fill="#fff"/><path d="M15 30Q15 11 32 11Q49 11 49 30" fill="none" stroke="#19b4ff" stroke-width="3"/><rect x="12" y="27" width="6" height="10" rx="3" fill="#19b4ff"/><rect x="46" y="27" width="6" height="10" rx="3" fill="#19b4ff"/>`],
["#4a6fa5",`<rect x="16" y="20" width="32" height="28" rx="7" fill="#d7e0ee"/><rect x="29" y="10" width="6" height="10" fill="#9fb0c8"/><circle cx="32" cy="9" r="4" fill="#ff5d5d"/><circle cx="25" cy="33" r="5" fill="#19b4ff"/><circle cx="39" cy="33" r="5" fill="#19b4ff"/><rect x="25" y="42" width="14" height="3" rx="1.5" fill="#6b7a90"/><rect x="11" y="28" width="5" height="10" rx="2" fill="#9fb0c8"/><rect x="48" y="28" width="5" height="10" rx="2" fill="#9fb0c8"/>`],
["#7a5cff",`<path d="M16 26L18 8L31 19Z" fill="#f2a65a"/><path d="M48 26L46 8L33 19Z" fill="#f2a65a"/><circle cx="32" cy="36" r="18" fill="#f2a65a"/><ellipse cx="25" cy="33" rx="3" ry="4" fill="#222"/><ellipse cx="39" cy="33" rx="3" ry="4" fill="#222"/><path d="M29 40L35 40L32 44Z" fill="#ff8aa8"/><path d="M12 38L24 40M12 44L24 43M52 38L40 40M52 44L40 43" stroke="#fff" stroke-width="1.2"/>`],
["#2aa87a",`<path d="M14 28L16 8L30 20Z" fill="#e8702a"/><path d="M50 28L48 8L34 20Z" fill="#e8702a"/><circle cx="32" cy="35" r="18" fill="#e8702a"/><path d="M16 38Q32 56 48 38Q32 32 16 38Z" fill="#fff"/><circle cx="25" cy="32" r="3" fill="#222"/><circle cx="39" cy="32" r="3" fill="#222"/><circle cx="32" cy="42" r="3" fill="#222"/>`],
["#5bb0ff",`<circle cx="18" cy="16" r="7" fill="#222"/><circle cx="46" cy="16" r="7" fill="#222"/><circle cx="32" cy="35" r="19" fill="#fff"/><ellipse cx="24" cy="32" rx="5" ry="7" fill="#222" transform="rotate(20 24 32)"/><ellipse cx="40" cy="32" rx="5" ry="7" fill="#222" transform="rotate(-20 40 32)"/><circle cx="25" cy="31" r="2" fill="#fff"/><circle cx="39" cy="31" r="2" fill="#fff"/><ellipse cx="32" cy="42" rx="4" ry="3" fill="#222"/>`],
["#12203a",`<circle cx="32" cy="34" r="22" fill="#e8eef7"/><ellipse cx="32" cy="34" rx="15" ry="12" fill="#10203d"/><ellipse cx="26" cy="30" rx="5" ry="3" fill="#4cc2ff" opacity=".6"/><rect x="12" y="30" width="5" height="10" rx="2" fill="#ff5d5d"/><rect x="47" y="30" width="5" height="10" rx="2" fill="#ff5d5d"/>`],
["#7a3cff",`<ellipse cx="32" cy="34" rx="17" ry="21" fill="#5ad66f"/><ellipse cx="24" cy="32" rx="6" ry="8" fill="#0a0f1e" transform="rotate(20 24 32)"/><ellipse cx="40" cy="32" rx="6" ry="8" fill="#0a0f1e" transform="rotate(-20 40 32)"/><circle cx="23" cy="30" r="1.8" fill="#fff"/><circle cx="39" cy="30" r="1.8" fill="#fff"/><path d="M27 47Q32 50 37 47" stroke="#0a0f1e" stroke-width="2" fill="none"/>`],
["#1c5da8",`<circle cx="32" cy="35" r="18" fill="#f0c4a0"/><path d="M12 24Q32 8 52 24L50 30Q32 18 14 30Z" fill="#e63946"/><ellipse cx="25" cy="33" rx="5" ry="4.5" fill="#111"/><circle cx="39" cy="33" r="3" fill="#222"/><path d="M14 33L48 30" stroke="#111" stroke-width="1.5"/><path d="M26 44Q32 49 38 44" stroke="#8a3b2a" stroke-width="2" fill="none"/>`],
["#8a5cf5",`<path d="M16 22L14 8L28 16Z" fill="#8a5a33"/><path d="M48 22L50 8L36 16Z" fill="#8a5a33"/><circle cx="32" cy="35" r="19" fill="#a87244"/><circle cx="24" cy="31" r="7" fill="#fff"/><circle cx="40" cy="31" r="7" fill="#fff"/><circle cx="24" cy="31" r="3.5" fill="#222"/><circle cx="40" cy="31" r="3.5" fill="#222"/><path d="M28 38L36 38L32 46Z" fill="#f5a623"/>`],
["#1f7a5c",`<path d="M18 22L14 6L28 16Z" fill="#f4e3b0"/><path d="M46 22L50 6L36 16Z" fill="#f4e3b0"/><circle cx="32" cy="36" r="18" fill="#3fbf6a"/><ellipse cx="32" cy="45" rx="11" ry="7" fill="#7ee09a"/><circle cx="28" cy="45" r="1.5" fill="#1d6b3a"/><circle cx="36" cy="45" r="1.5" fill="#1d6b3a"/><ellipse cx="24" cy="32" rx="3.5" ry="4" fill="#ffd23f"/><ellipse cx="40" cy="32" rx="3.5" ry="4" fill="#ffd23f"/><rect x="23" y="29" width="2" height="6" fill="#222"/><rect x="39" y="29" width="2" height="6" fill="#222"/>`],
["#4a2f9b",`<path d="M6 64Q8 46 32 46Q56 46 58 64Z" fill="#6c3de0"/><circle cx="32" cy="30" r="17" fill="#2a1b55"/><ellipse cx="32" cy="32" rx="11" ry="10" fill="#0a0f1e"/><rect x="19" y="28" width="26" height="8" rx="4" fill="#19e0ff"/><rect x="21" y="30" width="9" height="3" rx="1.5" fill="#fff" opacity=".7"/>`],
["#c28a1a",`<circle cx="32" cy="38" r="17" fill="#f0c4a0"/><path d="M14 24L18 8L26 18L32 6L38 18L46 8L50 24Z" fill="#ffd23f" stroke="#a8730f" stroke-width="1.5"/><circle cx="25" cy="38" r="2.5" fill="#222"/><circle cx="39" cy="38" r="2.5" fill="#222"/><path d="M26 46Q32 51 38 46" stroke="#8a3b2a" stroke-width="2" fill="none"/>`],
["#2a3f6e",`<path d="M14 54L14 30Q14 10 32 10Q50 10 50 30L50 54L43 48L36 54L29 48L22 54Z" fill="#f4f8ff"/><ellipse cx="25" cy="30" rx="3.5" ry="5" fill="#222"/><ellipse cx="39" cy="30" rx="3.5" ry="5" fill="#222"/><ellipse cx="32" cy="41" rx="3" ry="4" fill="#222"/>`],
["#d9822b",`<circle cx="32" cy="35" r="24" fill="#c0601c"/><circle cx="32" cy="37" r="15" fill="#f4b95a"/><circle cx="25" cy="33" r="2.5" fill="#222"/><circle cx="39" cy="33" r="2.5" fill="#222"/><ellipse cx="32" cy="41" rx="4" ry="3" fill="#7a3a12"/><path d="M32 44L32 48M28 49Q32 52 36 49" stroke="#7a3a12" stroke-width="1.5" fill="none"/>`],
["#3b2f8f",`<path d="M10 28L32 2L54 28Z" fill="#5a3fd1"/><circle cx="32" cy="14" r="2.5" fill="#ffd23f"/><ellipse cx="32" cy="28" rx="24" ry="4" fill="#4a30b8"/><circle cx="32" cy="38" r="14" fill="#f0c4a0"/><path d="M20 42Q32 62 44 42Q32 48 20 42Z" fill="#f4f4f4"/><circle cx="26" cy="36" r="2" fill="#222"/><circle cx="38" cy="36" r="2" fill="#222"/>`],
["#2d4a3a",`<circle cx="32" cy="35" r="18" fill="#9ccf7a"/><circle cx="25" cy="32" r="5" fill="#fff"/><circle cx="40" cy="32" r="3.5" fill="#fff"/><circle cx="25" cy="32" r="2" fill="#222"/><circle cx="40" cy="32" r="1.8" fill="#222"/><path d="M24 45L40 45" stroke="#222" stroke-width="2"/><path d="M27 43L27 47M32 43L32 47M37 43L37 47" stroke="#222" stroke-width="1.5"/><path d="M44 18L50 24M47 17L51 21" stroke="#6b4f2a" stroke-width="2"/>`]
];
const svg=i=>'<svg viewBox="0 0 64 64" style="width:100%;height:100%;display:block"><rect width="64" height="64" fill="'+A[i][0]+'"/>'+A[i][1]+"</svg>";
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%997;return h};
const MAP={};let mapT=0,FB=null;
const meuNome=()=>{const t=$("cartao").textContent.split(" · ");return t.slice(0,Math.max(1,t.length-2)).join(" · ").trim()};
const limpa=s=>s.replace(/\(você\)/,"").replace(/\s*\d+🔥\s*$/,"").replace(/\s+/g," ").trim();
const salvo=()=>{try{const v=localStorage.getItem("avSel");return v===null?null:+v}catch(e){return null}};
function idDe(n){
  if(!n)return 0;
  if(/Robô/.test(n))return 1;
  const s=slug(n),sv=salvo();
  if(sv!==null&&s===slug(meuNome())&&sv>=0&&sv<A.length)return sv;
  if(MAP[s]!==undefined)return MAP[s];
  return hash(s)%A.length;
}
function nomeDe(el){
  let r=el.closest(".jog");
  if(r){const n=r.querySelector("[id^=n]");return limpa(n?n.textContent:"")}
  r=el.closest(".rw");
  if(r){const b=r.querySelector(".m b");return limpa(b?b.textContent:"")}
  r=el.closest("#aLista li");
  if(r&&r.children[1]){const t=[...r.children[1].childNodes].find(x=>x.nodeType===3&&x.textContent.trim());return limpa(t?t.textContent:"")}
  r=el.closest(".cardx");
  if(r){const b=r.querySelector("b");return limpa(b?b.textContent:"")}
  return meuNome();
}
const css=document.createElement("style");
css.textContent="#chAv,.jog .av{display:none!important}.avg{width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid #19b4ff;flex-shrink:0;display:block}#chip .avg{width:30px;height:30px}";
document.head.appendChild(css);
function ponha(host,id,pre){
  let g=host.querySelector(":scope>.avg");
  if(!g){g=document.createElement("span");g.className="avg";host.insertBefore(g,host.firstChild)}
  if(g.dataset.avx!==String(id)){g.dataset.avx=id;g.innerHTML=svg(id)}
}
function aplicar(){
  document.querySelectorAll(".av2").forEach(el=>{
    const id=idDe(nomeDe(el));
    if(el.dataset.avx===String(id))return;
    el.dataset.avx=id;el.innerHTML=svg(id);
    el.style.cssText="background:none;padding:0;overflow:hidden;border:2px solid #19b4ff";
  });
  [["j0","n0"],["j1","n1"]].forEach(([j,n])=>{const e=$(j);if(e)ponha(e,idDe(limpa(txt(n))))});
  const ch=$("chip");if(ch)ponha(ch,idDe(meuNome()));
}
let pend=false;
new MutationObserver(()=>{if(pend)return;pend=true;requestAnimationFrame(()=>{pend=false;aplicar()})}).observe(document.body,{subtree:true,childList:true});

// ----- nuvem: o avatar escolhido aparece para os outros jogadores -----
async function fb(){
  if(!FB){
    const U="https://www.gstatic.com/firebasejs/10.12.2/";
    const P=await import(U+"firebase-app.js"),F=await import(U+"firebase-firestore.js"),T=await import(U+"firebase-auth.js");
    const app=P.getApp();FB={F,db:F.getFirestore(app),auth:T.getAuth(app)};
  }
  if(!FB.auth.currentUser)await new Promise(r=>{let n=0;const t=setInterval(()=>{if(FB.auth.currentUser||++n>40){clearInterval(t);r()}},250)});
  if(!FB.auth.currentUser)throw new Error("sem conta");
  return FB;
}
async function mapa(){
  if(Date.now()-mapT<300000)return;
  mapT=Date.now();
  try{
    await fb();const{F,db}=FB;
    const s=await F.getDocs(F.query(F.collection(db,"perfis"),F.limit(200)));
    s.docs.forEach(d=>{const x=d.data();if(x&&typeof x.n==="string"&&Number.isInteger(x.av)&&x.av>=0&&x.av<A.length)MAP[slug(x.n)]=x.av});
    aplicar();
  }catch(e){mapT=Date.now()-240000}
}
async function salvar(i){
  try{localStorage.setItem("avSel",i)}catch(e){}
  MAP[slug(meuNome())]=i;aplicar();
  try{
    await fb();const{F,db,auth}=FB;
    await F.setDoc(F.doc(db,"perfis",auth.currentUser.uid),{n:meuNome(),av:i});
  }catch(e){}
}
setInterval(()=>{
  const t=document.querySelector(".tela.on");
  if(t&&["ranking","amigos","perfil","jogo","menu"].includes(t.id))mapa();
  aplicar();
},2000);

// ----- escolher avatar -----
const ov=document.createElement("div");
ov.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(4,10,22,.94);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px";
ov.innerHTML='<b style="font-size:1.3rem">Escolha seu avatar</b><div id="avGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px"></div><button id="avFecha" class="sec">Fechar</button>';
document.body.appendChild(ov);
function abrir(){
  const cur=idDe(meuNome());
  $("avGrid").innerHTML=A.map((a,i)=>'<button data-i="'+i+'" style="padding:0;width:70px;height:70px;border-radius:50%;overflow:hidden;border:3px solid '+(i===cur?"#19b4ff":"transparent")+';background:none">'+svg(i)+"</button>").join("");
  ov.style.display="flex";
}
$("avGrid").onclick=e=>{const b=e.target.closest("button");if(!b)return;salvar(+b.dataset.i);ov.style.display="none"};
$("avFecha").onclick=()=>{ov.style.display="none"};
document.addEventListener("click",e=>{
  const a=e.target.closest("#pv .av2"),pv=$("pv");
  if(a&&pv&&a===pv.querySelector(".av2"))abrir();
});
const cf=$("config");
if(cf){
  const t=cf.querySelector(".titulo"),r=document.createElement("div");
  r.className="lin";
  r.innerHTML='<span>🧑‍🎤 Meu avatar</span><button id="avBtn" class="sec" style="padding:8px 14px;font-size:1rem">Escolher</button>';
  if(t)t.after(r);else cf.prepend(r);
  $("avBtn").onclick=abrir;
}
aplicar();
})();
