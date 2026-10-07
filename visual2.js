(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
if(!$("cartao"))return;
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const PAT=[["Bronze",0],["Prata",100],["Ouro",250],["Platina",450],["Diamante",700],["Heroico",1000],["Mestre",1400]];
function info(p){let i=PAT.length-1;while(i>0&&p<PAT[i][1])i--;const a=PAT[i][1],b=PAT[i+1]?PAT[i+1][1]:null;let t="";if(b)t=["III","II","I"][Math.min(2,Math.floor((p-a)/((b-a)/3)))];return{n:PAT[i][0],t:t,a:a,b:b}}
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
const av=n=>{n=(n||"?").trim();const h=hue(n[0]||"?");return '<span class="av2" style="background:linear-gradient(hsl('+h+',80%,55%),hsl('+((h+60)%360)+',80%,45%))">'+H((n[0]||"?").toUpperCase())+"</span>"};
const eu=()=>{const t=txt("cartao").split(" · "),n=t.length;return{nome:t.slice(0,n-2).join(" · ").trim(),pts:parseInt(t[n-1])||0}};
const D=()=>{try{return JSON.parse(localStorage.getItem("viciante")||"{}")}catch(e){return{}}};
const css=document.createElement("style");
css.textContent=`
.av2{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#fff;flex-shrink:0;border:2px solid #19b4ff}
.cardx{display:flex;align-items:center;gap:12px;padding:12px;border-radius:18px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}
.tiles{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.tile{padding:8px 2px;border-radius:12px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);text-align:center;font-size:.62rem}
.tile b{display:block;font-size:1.1rem;margin-top:2px}
.hs{display:flex;gap:8px;overflow-x:auto;padding:4px 2px}
.hs>div{min-width:84px;padding:8px 4px;border-radius:14px;border:2px solid #1e4f80;background:rgba(10,30,60,.6);text-align:center;font-size:.75rem}
.hs>div.at{border-color:#19b4ff;box-shadow:0 0 10px rgba(25,180,255,.5)}
.hs svg.esc{width:42px;height:42px}
.hs .bd{display:inline-block;margin-top:4px;padding:2px 10px;border-radius:10px;background:#0b6fd8;font-weight:700}
.sh2{display:flex;justify-content:space-between;align-items:center;font-weight:800;letter-spacing:.5px}
.sh2 a{color:#19b4ff;font-weight:600;cursor:pointer}
.pg{height:6px;border-radius:4px;background:#1a2f4f;overflow:hidden;margin-top:4px}
.pg u{display:block;height:100%;background:#19b4ff;text-decoration:none}
.tabs2{display:flex;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);overflow:hidden}
.tabs2 button{flex:1;border-radius:0;background:transparent;box-shadow:none;padding:12px 4px;font-size:.95rem}
.tabs2 button.on{background:linear-gradient(180deg,#2aa8ff,#0b6fd8)}
.rw{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid #12335e}
.rw.me{background:rgba(30,160,255,.25);border-radius:12px}
.rw .n{width:26px;text-align:center;font-weight:800}
.rw .m{flex:1;min-width:0}.rw .m small{display:block;opacity:.8}
.rw .p{font-weight:800}
.rw .fl{padding:2px 8px;font-size:.8rem;background:transparent;box-shadow:none;border:1px solid #1e5f9e}
#perfil>*:not(#pv):not(:first-child),#ranking>*:not(#rv):not(:first-child){display:none!important}
#aLista.so-on>li:not(.is-on){display:none}
#aLista li>span:nth-child(2){flex:1}
.sech{display:flex;align-items:center;gap:10px;margin-top:6px}
.sech .ic{font-size:1.6rem}.sech small{display:block;opacity:.8;font-size:.8rem;font-weight:400}
.cbox{border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);overflow:hidden}
.cbox .lin{background:transparent;border-bottom:1px solid #12335e;border-radius:0}
.cbox .cores{padding:6px 12px 10px}
.cbox .tog{font-size:0;width:52px;height:30px;padding:0;border-radius:15px;position:relative;background:#1a2f4f;border:0;min-width:0}
.cbox .tog::after{content:"";position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#9fb8d8;transition:left .2s}
.cbox .tog.on{background:#0b8cff}.cbox .tog.on::after{left:25px;background:#fff}`;
document.head.appendChild(css);

// ===== PERFIL =====
try{
const pf=$("perfil"),st=$("stats");
if(pf&&st){
  const pv=document.createElement("div");pv.id="pv";pv.style.cssText="display:flex;flex-direction:column;gap:12px";pf.appendChild(pv);
  const perfil=()=>{
    const m=eu(),f=info(m.pts),d=D(),lv=Math.floor(Math.sqrt((d.xp||0)/25))+1,S={};
    [...st.children].forEach(li=>{if(li.children.length>1)S[li.children[0].textContent.trim()]=li.children[1].textContent.trim()});
    const v=parseInt(S["Vitórias"])||0,mb=parseInt(S["Melhor sequência"])||0;
    const T=[["🏆","Vitórias",S["Vitórias"]],["❌","Derrotas",S["Derrotas"]],["🎯","Seq. atual",S["Sequência atual"]],["🎯","Melhor seq.",S["Melhor sequência"]],["📈","Taxa",S["Taxa de vitória"]]];
    const C=[["🏆","Primeira vitória",v,1],["🔥","Sequência de 5",mb,5],["🎯","10 vitórias",v,10],["⭐","Chegou ao Ouro",m.pts,250],["👑","Rumo ao Mestre",m.pts,1400]];
    const P=[...$("listaPat").children].map(li=>{
      const sp=li.children[0],sv=sp.querySelector("svg"),at=li.classList.contains("eu"),lk=li.classList.contains("off");
      return '<div class="'+(at?"at":"")+'">'+(sv?sv.outerHTML:"")+"<b>"+H(sp.textContent.trim())+"</b><div>"+H(li.children[1].textContent)+"</div>"+(at?'<span class="bd">Atual</span>':lk?"🔒":"✔")+"</div>";
    }).join("");
    pv.innerHTML='<div class="cardx">'+av(m.nome)+'<div style="flex:1"><b style="font-size:1.4rem">'+H(m.nome)+"</b><div>Nv "+lv+" · "+f.n+(f.t?" "+f.t:"")+"</div><small>"+(d.eq?"“"+H(d.eq)+"”":"Sem título")+"</small></div></div>"
      +($("rk")?$("rk").outerHTML.replace(/ id="[^"]*"/g,""):"")
      +'<div class="tiles">'+T.map(t=>'<div class="tile">'+t[0]+"<div>"+t[1]+"</div><b>"+H(t[2]||"—")+"</b></div>").join("")+"</div>"
      +'<div class="sh2"><span>🛡️ PATENTES</span></div><div class="hs">'+P+"</div>"
      +'<div class="sh2"><span>🎖️ CONQUISTAS</span><a id="vtc">Ver todas ›</a></div><div class="hs">'
      +C.map(c=>{const ok=c[2]>=c[3];return '<div><div style="font-size:1.8rem">'+c[0]+"</div><b>"+c[1]+"</b>"+(ok?"<div>✔ Concluída</div>":'<div class="pg"><u style="width:'+Math.round(c[2]/c[3]*100)+'%"></u></div><small>'+c[2]+"/"+c[3]+"</small>")+"</div>"}).join("")+"</div>";
    const vt=$("vtc");if(vt)vt.onclick=()=>{if($("nConq"))$("nConq").click()};
  };
  new MutationObserver(perfil).observe(st,{childList:true});
}
}catch(e){}

// ===== RANKING =====
let FB=null;
async function fb(){
  if(!FB){
    const U="https://www.gstatic.com/firebasejs/10.12.2/";
    const A=await import(U+"firebase-app.js"),F=await import(U+"firebase-firestore.js"),T=await import(U+"firebase-auth.js");
    const app=A.getApp();FB={F,db:F.getFirestore(app),auth:T.getAuth(app)};
  }
  if(!FB.auth.currentUser)await new Promise(r=>{let n=0;const t=setInterval(()=>{if(FB.auth.currentUser||++n>40){clearInterval(t);r()}},250)});
  if(!FB.auth.currentUser)throw new Error("sem conta");
  return FB;
}
async function amigosRank(){
  await fb();const{F,db,auth}=FB,u=auth.currentUser.uid;
  const[a1,a2]=await Promise.all([
    F.getDocs(F.query(F.collection(db,"amizades"),F.where("u1","==",u))),
    F.getDocs(F.query(F.collection(db,"amizades"),F.where("u2","==",u)))
  ]);
  const ids=[...a1.docs,...a2.docs].map(d=>{const x=d.data();return x.u1===u?x.u2:x.u1});
  const L=(await Promise.all(ids.map(async o=>{
    try{const s=await F.getDoc(F.doc(db,"jogadores",o));return s.exists()?{nome:s.data().nome,pts:s.data().pontos||0}:null}catch(e){return null}
  }))).filter(Boolean);
  const m=eu();L.push({nome:m.nome,pts:m.pts,me:true});
  return L.sort((a,b)=>b.pts-a.pts);
}
try{
const rs=$("ranking"),ls=$("lista");
if(rs&&ls){
  const rv=document.createElement("div");rv.id="rv";rv.style.cssText="display:flex;flex-direction:column;gap:10px";
  rv.innerHTML='<div class="cardx" id="rvH"></div><div class="tabs2"><button id="rtG" class="on">🌐 Global</button><button id="rtA">👥 Amigos</button></div><div id="rvL"></div>';
  rs.appendChild(rv);
  let aba="g";
  const G=()=>[...ls.children].filter(li=>li.querySelector("span")&&li.querySelector("b")&&!/Carregando|Ninguém|Não foi/.test(li.textContent)).map(li=>({
    nome:li.querySelector("span").textContent.replace(/^\S+\s+/,"").replace(/\s*\(você\)\s*$/,"").replace(/\s+/g," ").trim(),
    pts:parseInt(li.querySelector("b").textContent)||0,me:li.classList.contains("eu")}));
  const linhas=(L,fl)=>L.map((r,i)=>{const f=info(r.pts);
    return '<div class="rw'+(r.me?" me":"")+'"><span class="n">'+(i===0?"👑":i+1)+"</span>"+av(r.nome)+'<span class="m"><b>'+H(r.nome)+(r.me?" (você)":"")+"</b><small>"+f.n+(f.t?" "+f.t:"")+'</small></span><span class="p">'+r.pts+" pts</span>"+(fl&&!r.me?'<button class="fl" data-i="'+i+'">🚩</button>':"")+"</div>"}).join("")||'<div class="rw">Ninguém no ranking ainda.</div>';
  async function render(){
    const m=eu(),f=info(m.pts),g=G(),k=g.findIndex(r=>r.me);
    const pos=k>=0?k+1:((txt("minhaRank").match(/#(\d+)/)||[])[1]||"—");
    const pr=f.b?Math.round((m.pts-f.a)/(f.b-f.a)*100):100;
    $("rvH").innerHTML='<div><small>Seu ranking</small><div style="font-size:2rem;font-weight:800">#'+pos+"</div><div>⭐ "+m.pts+' pts</div></div><div style="flex:1"><small>Seu rank</small><b style="display:block;font-size:1.2rem">'+f.n+(f.t?" "+f.t:"")+'</b><div class="pg"><u style="width:'+pr+'%"></u></div><small>'+(f.b?m.pts+" / "+f.b+" pts":"patente máxima")+"</small></div>";
    if(aba==="g")$("rvL").innerHTML=linhas(g,true);
    else{
      $("rvL").innerHTML='<div class="rw">Carregando…</div>';
      try{const L=await amigosRank();if(aba==="a")$("rvL").innerHTML=linhas(L,false)}catch(e){$("rvL").innerHTML='<div class="rw">Não foi possível carregar.</div>'}
    }
  }
  const tabs=()=>{$("rtG").classList.toggle("on",aba==="g");$("rtA").classList.toggle("on",aba==="a")};
  $("rtG").onclick=()=>{aba="g";tabs();render()};
  $("rtA").onclick=()=>{aba="a";tabs();render()};
  $("rvL").onclick=e=>{const b=e.target.closest(".fl");if(!b)return;const li=ls.children[+b.dataset.i],f=li&&li.querySelector(".flag");if(f)f.click()};
  new MutationObserver(render).observe(ls,{childList:true});
}
}catch(e){}

// ===== AMIGOS =====
try{
const am=$("amigos");
if(am&&$("aLista")&&$("aAdd")){
  const bA=$("aAdd");bA.className="opc big";
  bA.innerHTML='<span class="ic">➕</span><span class="tx"><b>Adicionar amigo</b><small>Encontre e convide jogadores</small></span>';
  const hd=document.createElement("div");hd.className="cardx";hd.id="ah";am.querySelector(".titulo").after(hd);
  const tb=document.createElement("div");tb.className="tabs2";tb.innerHTML='<button id="atA" class="on">Meus amigos</button><button id="atO">🟢 Online</button>';
  $("aLista").before(tb);
  if(tb.previousElementSibling)tb.previousElementSibling.style.display="none";
  const ui=()=>{
    const rows=[...$("aLista").children].filter(li=>li.children.length>1);
    rows.forEach(li=>{
      if(!li.querySelector(".av2"))li.insertAdjacentHTML("afterbegin",av(li.children[0].textContent));
      li.classList.toggle("is-on",/online/.test(li.textContent));
    });
    const on=rows.filter(li=>li.classList.contains("is-on")).length,pd=[...$("aPed").children].filter(li=>li.children.length>1).length,m=eu();
    hd.innerHTML=av(m.nome)+'<div style="flex:1"><b style="font-size:1.3rem">'+H(m.nome)+'</b><div style="color:#3ddc97">● Online</div></div><div>👥 Amigos <b>'+rows.length+"</b><br>📨 Pedidos <b>"+pd+"</b></div>";
    $("atA").textContent="Meus amigos ("+rows.length+")";$("atO").textContent="🟢 Online ("+on+")";
  };
  new MutationObserver(ui).observe($("aLista"),{childList:true});
  new MutationObserver(ui).observe($("aPed"),{childList:true});
  $("atA").onclick=()=>{$("aLista").classList.remove("so-on");$("atA").classList.add("on");$("atO").classList.remove("on")};
  $("atO").onclick=()=>{$("aLista").classList.add("so-on");$("atO").classList.add("on");$("atA").classList.remove("on")};
  ui();
}
}catch(e){}

// ===== CONFIGURAÇÕES =====
try{
const cf=$("config");
if(cf&&!cf.dataset.v2){
  cf.dataset.v2="1";
  const SEC={"Conta":["👤","Conta","Seu perfil de jogador"],"Aparência":["🎨","Aparência","Deixe o jogo com a sua cara"],"Áudio":["🔊","Áudio","Ajuste o som do jogo"],"Jogo":["🎮","Jogo","Configure sua experiência"]};
  const IC={"Cor de fundo":"🎨","Fundo personalizado":"🖼️","Cor de destaque":"💧","Texto grande":"🔠","Animações":"✨","Música":"🎵","Volume":"🔉","Efeitos sonoros":"🔊","Reações rápidas":"⚡","Vibrar ao acertar":"📳","Dificuldade padrão":"🎯","Tema padrão":"🎭","Permitir que assistam":"👥","Aparecer offline":"🙈"};
  const frag=document.createDocumentFragment();let box=null;
  [...cf.children].forEach(e=>{
    if(e.classList.contains("titulo")){frag.appendChild(e);return}
    if(e.classList.contains("nota")){
      const k=Object.keys(SEC).find(s=>e.textContent.startsWith(s))||"Jogo",s=SEC[k];
      e.className="sech";e.innerHTML='<span class="ic">'+s[0]+"</span><div><b>"+s[1]+"</b><small>"+s[2]+"</small></div>";
      frag.appendChild(e);box=document.createElement("div");box.className="cbox";frag.appendChild(box);return;
    }
    if(e.id==="oReset"){frag.appendChild(e);return}
    if(e.classList.contains("lin")){const sp=e.querySelector("span"),t=sp&&sp.textContent.trim();if(t&&IC[t])sp.textContent=IC[t]+" "+t}
    (box||frag).appendChild(e);
  });
  cf.appendChild(frag);
  if($("cfgConta")&&$("cfgConta").parentElement)$("cfgConta").parentElement.classList.add("cardx");
}
}catch(e){}
})();
