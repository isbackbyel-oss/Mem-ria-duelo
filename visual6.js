(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
if(!$("cartao"))return;
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
const avc=(n,cl)=>{n=(n||"?").trim();const h=hue(n);return '<span class="avc '+(cl||"")+'" style="background:linear-gradient(hsl('+h+',80%,55%),hsl('+((h+60)%360)+',80%,45%))">'+H((n[0]||"?").toUpperCase())+"</span>"};
const me=()=>{const t=txt("cartao").split(" · "),n=t.length;return{nome:t.slice(0,Math.max(1,n-2)).join(" · ").trim(),pat:(t[n-2]||"").trim()}};
const limpa=s=>s.replace(/\s*\d+🔥\s*$/,"").replace(/\s+/g," ").trim();
const css=document.createElement("style");
css.textContent=`
@keyframes rdr{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.5);opacity:0}}
@keyframes vsIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
.avc{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:1.4rem;color:#fff;border:3px solid #19b4ff;flex-shrink:0}
.avc.g{width:90px;height:90px;font-size:2.4rem}
.vsr{display:flex;align-items:center;justify-content:center;gap:10px}
.vsr .pc{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);text-align:center;min-width:0}
.vsr .pc.w{border-style:dashed;opacity:.85}
.vsr .pc b{font-size:1rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vsr .pc small{opacity:.8}
.vsr .vs{font-size:1.8rem;font-weight:900;font-style:italic;color:#19b4ff}
.row2{display:flex;gap:10px}.row2>button{flex:1}
.rdr{position:relative;width:170px;height:170px;margin:6px auto;display:grid;place-items:center}
.rdr i{position:absolute;inset:0;border-radius:50%;border:3px solid #19b4ff;animation:rdr 2s ease-out infinite}
.rdr i:nth-child(2){animation-delay:.66s}.rdr i:nth-child(3){animation-delay:1.33s}
.rdr span{font-size:3.4rem;width:96px;height:96px;border-radius:50%;display:grid;place-items:center;background:rgba(14,34,64,.9);border:3px solid #19b4ff;position:relative}
.ck{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}
.ck div{display:flex;align-items:center;gap:10px}.ck .o{opacity:.5}
#vsIntro{position:fixed;inset:0;z-index:80;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:radial-gradient(120% 70% at 50% 40%,rgba(30,20,110,.96),rgba(6,6,30,.97));pointer-events:none;transition:opacity .35s}
#vsIntro.on{display:flex;animation:vsIn .3s ease-out}
#vsIntro.sai{opacity:0}
#vsIntro .vsr{width:92%;max-width:420px}
#vsIntro .tip{max-width:320px;text-align:center;opacity:.85}
.tvx{display:flex;gap:10px;align-items:stretch}
.tvx .tm{flex:1;display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:16px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);min-width:0}
.tvx .tm.b{border-color:#a24bff}
.tvx .tm>small{text-align:center;font-weight:800;letter-spacing:.5px}
.tvx .sl{display:flex;align-items:center;gap:8px;min-width:0}
.tvx .sl b{font-size:.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tvx .sl.w{opacity:.55}.tvx .sl.w .avc{border-style:dashed;background:transparent!important}
#res{top:0!important;border-radius:0!important;justify-content:center;background:radial-gradient(120% 70% at 50% 25%,#2a1a7a,#0a0824)!important}
#res h2{font-size:2.6rem;letter-spacing:2px}
#res .rav{width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto;border:4px solid #ffc933;box-shadow:0 0 28px rgba(255,201,51,.7)}
#res .rav .avc{width:100%;height:100%;border:0;font-size:3rem}`;
document.head.appendChild(css);

// ===== SALA CRIADA (1v1) =====
try{
const es=$("espera");
if(es&&$("meuCod")&&$("voltarEspera")&&$("zap")&&!es.dataset.v6){
  es.dataset.v6="1";
  const hd=document.createElement("div");hd.className="hdr2";hd.style.order=0;
  hd.innerHTML='<button class="back">←</button><b>Sala criada</b><span style="width:44px"></span>';
  hd.querySelector("button").onclick=()=>$("voltarEspera").click();
  const sub=document.createElement("p");sub.className="nota";sub.style.order=1;sub.textContent="Sua sala está pronta! Compartilhe o código.";
  es.prepend(sub);es.prepend(hd);
  const ps=[...es.querySelectorAll("p.msg")].filter(p=>p.id!=="modoEspera"),cp=[...es.querySelectorAll("button")].find(b=>/Copiar/.test(b.textContent));
  if($("modoEspera"))$("modoEspera").style.order=2;
  if(ps[0])ps[0].style.order=3;
  $("meuCod").style.order=4;if(cp)cp.style.order=5;
  [...es.children].forEach(d=>{if(d.tagName==="DIV"&&d.querySelector(".sp"))d.style.display="none"});
  const m=me(),vs=document.createElement("div");vs.className="vsr";vs.style.order=6;
  vs.innerHTML='<div class="pc">'+avc(m.nome,"g")+"<b>"+H(m.nome)+"</b><small>"+H(m.pat)+'</small></div><span class="vs">VS</span><div class="pc w"><span class="avc g" style="background:transparent;border-style:dashed">👤</span><b>Aguardando</b><small>oponente…</small></div>';
  es.appendChild(vs);
  const row=document.createElement("div");row.className="row2";row.style.order=8;
  const v=$("voltarEspera"),z=$("zap");v.style.order="";z.style.order="";
  z.className="opc";z.innerHTML='<span class="tx"><b>💬 Convidar</b></span>';
  row.append(v,z);es.appendChild(row);
}
}catch(e){}

// ===== PROCURANDO OPONENTE =====
try{
const bd=$("buscando");
if(bd&&$("cancelar")&&!bd.dataset.v6){
  bd.dataset.v6="1";
  [...bd.children].forEach(e=>{if(e.id!=="cancelar"&&e.id!=="infoBusca")e.style.display="none"});
  const mk=(t,h,c)=>{const e=document.createElement(t);if(c)e.className=c;e.innerHTML=h;bd.insertBefore(e,$("infoBusca"));return e};
  const hd=mk("div",'<button class="back">←</button><b>Procurar oponente</b><span style="width:44px"></span>',"hdr2");
  hd.querySelector("button").onclick=()=>$("cancelar").click();
  mk("p","Buscando um oponente para sua partida…","nota");
  mk("div","<i></i><i></i><i></i><span>🔍</span>","rdr");
  mk("p","<b>Encontrando oponente…</b>","msg");
  mk("p",'<span id="bsT">⏱ 00:00</span>',"msg");
  mk("div","","ck").id="ckL";
  $("cancelar").className="danger";$("cancelar").textContent="✕ Cancelar";
  let t0=0;
  setInterval(()=>{
    if(!bd.classList.contains("on")){t0=0;return}
    if(!t0)t0=Date.now();
    const s=(Date.now()-t0)/1000;
    $("bsT").textContent="⏱ "+String(Math.floor(s/60)).padStart(2,"0")+":"+String(Math.floor(s%60)).padStart(2,"0");
    $("ckL").innerHTML=[["Buscando jogadores online…",1.5],["Verificando compatibilidade…",4],["Preparando partida…",1e9]].map(x=>'<div class="'+(s>=x[1]?"":"o")+'"><span>'+(s>=x[1]?"✅":"⏳")+"</span>"+x[0]+"</div>").join("");
  },500);
}
}catch(e){}

// ===== ABERTURA VS DA PARTIDA =====
try{
const vi=document.createElement("div");vi.id="vsIntro";document.body.appendChild(vi);
let visto=false;
function mostraVS(){
  const a=$("j0")&&$("j0").querySelector(".avg"),b=$("j1")&&$("j1").querySelector(".avg"),n0=limpa(txt("n0")),n1=limpa(txt("n1"));
  const card=(av,n,tag)=>'<div class="pc">'+(av?'<div class="avg" style="width:90px;height:90px">'+av.innerHTML+"</div>":avc(n,"g"))+"<b>"+H(n)+"</b><small>"+H(tag)+"</small></div>";
  vi.innerHTML='<b style="font-size:1.5rem">Prepare-se!</b><div class="vsr">'+card(a,n0,me().pat)+'<span class="vs">VS</span>'+card(b,n1,/Robô/.test(n1)?"Treino":"Oponente")+'</div><div class="tip">💡 Dica: memorize bem as cartas e observe os padrões do seu oponente!</div>';
  vi.className="on";
  setTimeout(()=>vi.classList.add("sai"),1100);
  setTimeout(()=>{vi.className=""},1500);
}
setInterval(()=>{
  const j=$("jogo"),ag=$("again"),on=!!(j&&j.classList.contains("on")),fim=on&&ag&&ag.style.display==="block";
  if(!on||fim){visto=false;return}
  if(!visto){visto=true;mostraVS()}
},300);
}catch(e){}

// ===== RESULTADO EM TELA CHEIA =====
try{
const rs=$("res");
if(rs)new MutationObserver(()=>{
  if(!rs.querySelector(".rav")){
    const a=$("j0")&&$("j0").querySelector(".avg"),d=document.createElement("div");d.className="rav";
    d.innerHTML=a?a.innerHTML:avc(me().nome,"g");rs.prepend(d);
  }
  const m=$("rsM");
  if(m&&m.textContent.trim()!=="Continuar")m.innerHTML='<span class="tx"><b>Continuar</b></span>';
  if(m&&!$("rsE")){
    const e=document.createElement("button");e.id="rsE";e.className="sec";e.textContent="📊 Ver estatísticas";
    e.onclick=()=>{m.click();setTimeout(()=>{const p=$("nPerfil");if(p)p.click()},350)};rs.appendChild(e);
  }
}).observe(rs,{childList:true});
}catch(e){}

// ===== SALA 2v2 / 1v1v1 COM TIMES =====
try{
const ml=$("mlobby"),mlist=$("mlista");
if(ml&&mlist&&$("minfo")){
  const tv=document.createElement("div");tv.className="tvx";mlist.before(tv);mlist.style.display="none";
  const rt=()=>{
    const L=[...mlist.children].map(li=>{const sp=li.querySelector("span"),n=sp?sp.textContent.trim():"";return{n:n,w:!n||/Aguardando/.test(n),eu:!!li.querySelector("b")}});
    const sl=x=>'<div class="sl'+(x.w?" w":"")+'">'+(x.w?'<span class="avc">👤</span>':avc(x.n))+"<b>"+H(x.w?"Aguardando…":x.n+(x.eu?" (você)":""))+"</b></div>";
    if(/2v2/.test(txt("minfo"))&&L.length>=4){
      const A=[L[0],L[2]],B=[L[1],L[3]],minha=A.some(x=>x.eu)||!B.some(x=>x.eu),ta=minha?A:B,tb=minha?B:A;
      tv.innerHTML='<div class="tm"><small>SUA EQUIPE</small>'+ta.map(sl).join("")+'</div><span style="align-self:center;font-weight:900;font-style:italic;color:#19b4ff;font-size:1.5rem">VS</span><div class="tm b"><small>EQUIPE ADVERSÁRIA</small>'+tb.map(sl).join("")+"</div>";
    }else tv.innerHTML='<div class="tm">'+L.map(sl).join("")+"</div>";
  };
  new MutationObserver(rt).observe(mlist,{childList:true,subtree:true});rt();
}
}catch(e){}
})();
