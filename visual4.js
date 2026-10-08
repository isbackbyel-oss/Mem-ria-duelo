(function(){
const $=id=>document.getElementById(id);
if(!$("cartao"))return;
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const css=document.createElement("style");
css.textContent=`
.hdr2{display:flex;align-items:center;justify-content:space-between;gap:8px}
.hdr2 b{font-size:1.5rem}
.hdr2 .back{width:44px;height:44px;padding:0;border-radius:12px;font-size:1.4rem;background:rgba(14,34,64,.8);border:2px solid #1e5f9e;box-shadow:none}
.crb{display:flex;flex-direction:column;gap:8px;padding:8px;border-radius:18px;border:2px solid #1e5f9e;background:rgba(14,34,64,.5)}
.crb .sh{font-weight:800;padding:4px 6px}
.crow{display:flex;align-items:center;gap:12px;padding:10px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75);cursor:pointer}
.crow.fix{cursor:default}
.crow .ic{width:48px;height:48px;border-radius:12px;border:2px solid #1e6fb5;background:rgba(10,30,60,.8);display:grid;place-items:center;font-size:1.6rem;flex-shrink:0}
.crow .tx{flex:1;min-width:0}
.crow small{display:block;opacity:.8;font-size:.8rem}
.crow b{display:block;font-size:1.15rem}
.crow .pv2{font-size:1.8rem}
.crow .ch{opacity:.8;font-size:1.4rem}
.pick{position:fixed;inset:0;z-index:90;background:rgba(4,10,22,.92);display:none;flex-direction:column;justify-content:center;gap:10px;padding:20px}
.pick .opc{width:100%}
.srch{display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}
.srch input{flex:1;background:transparent;color:#fff;border:0;text-align:left;padding:14px 4px;font-size:1rem}
.srch input:focus{outline:none}
.sort{display:flex;justify-content:space-between;align-items:center;font-weight:800}
.sort small{font-weight:400;opacity:.85}
#aLista li button.sq{padding:6px 10px;font-size:1.3rem;border-radius:12px;border:2px solid #1e6fb5;background:rgba(14,34,64,.8);box-shadow:none}
.lis li.vazio small{opacity:.8}`;
document.head.appendChild(css);

// ===== janela para escolher uma opção =====
const pk=document.createElement("div");pk.className="pick";document.body.appendChild(pk);
function escolher(titulo,itens,atual,cb){
  pk.innerHTML='<b style="font-size:1.3rem;text-align:center">'+H(titulo)+"</b>";
  itens.forEach(it=>{
    const b=document.createElement("button");b.className="opc"+(it.v===atual?" big":"");
    b.innerHTML='<span class="ic">'+(it.i||"")+'</span><span class="tx"><b>'+H(it.t)+"</b>"+(it.s?"<small>"+H(it.s)+"</small>":"")+"</span>";
    b.onclick=()=>{pk.style.display="none";cb(it.v)};pk.appendChild(b);
  });
  const c=document.createElement("button");c.className="sec";c.textContent="Cancelar";
  c.onclick=()=>{pk.style.display="none"};pk.appendChild(c);
  pk.style.display="flex";
}

// ===== CRIAR SALA =====
try{
const cr=$("criar");
if(cr&&$("dif")&&$("tema")&&$("criarSala")&&$("vCriar")&&$("mRank")&&$("mLiga")){
  const DIF=[{v:"f",t:"Fácil",s:"Para iniciantes",i:"⚡"},{v:"m",t:"Médio",s:"Boa dificuldade",i:"📶"},{v:"d",t:"Difícil",s:"Mais desafio, mais emoção!",i:"⭐"}];
  const TEM=[{v:"Animais",t:"Animais",s:"Bichinhos fofos",i:"🐶"},{v:"Frutas",t:"Frutas",s:"Frutas coloridas",i:"🍎"},{v:"Esportes",t:"Esportes",s:"Bolas e esportes",i:"⚽"},{v:"Bandeiras",t:"Bandeiras",s:"Países do mundo em jogo!",i:"🇧🇷"}];
  const JOG=[{v:2,t:"2 jogadores (1v1)",s:"Duelo clássico",i:"👥"},{v:3,t:"3 jogadores (1v1v1)",s:"Cada um por si",i:"👥"},{v:4,t:"4 jogadores (2v2)",s:"Em duplas",i:"🤝"}];
  let jog=2;
  const casual=()=>$("mRank").classList.contains("sec")&&$("mLiga").classList.contains("sec");
  const modoTxt=()=>!$("mRank").classList.contains("sec")?"🏆 Ranqueada":!$("mLiga").classList.contains("sec")?"🏅 Liga":"Casual";
  $("dif").style.display="none";$("tema").style.display="none";
  const tt=cr.querySelector(".titulo");if(tt)tt.style.display="none";
  const hd=document.createElement("div");hd.className="hdr2";
  hd.innerHTML='<button class="back">←</button><b>👥 Criar sala</b><span style="width:44px"></span>';
  cr.insertBefore(hd,cr.firstChild);hd.querySelector("button").onclick=()=>$("vCriar").click();
  const sub=document.createElement("p");sub.className="nota";hd.after(sub);
  const box=document.createElement("div");box.className="crb";sub.after(box);
  const box2=document.createElement("div");box2.className="crb";box.after(box2);
  const lin=(id,ic,lab,val,sb,pv,fix)=>'<div class="crow'+(fix?" fix":"")+'" id="'+id+'"><span class="ic">'+ic+'</span><span class="tx"><small>'+lab+"</small><b>"+H(val)+"</b><small>"+H(sb)+"</small></span>"+(pv?'<span class="pv2">'+pv+"</span>":"")+(fix?"":'<span class="ch">›</span>')+"</div>";
  function pinta(){
    if(!casual())jog=2;
    const d=DIF.find(x=>x.v===$("dif").value)||DIF[1],t=TEM.find(x=>x.v===$("tema").value)||TEM[0],j=JOG.find(x=>x.v===jog);
    sub.textContent="Modo: "+modoTxt()+" · escolha as configurações da sua sala";
    box.innerHTML=lin("cr1","🎮","Modo de jogo","Memória Clássica","Encontre os pares de cartas.","",1)
      +lin("cr2","🃏","Dificuldade",d.t,d.s,"")
      +lin("cr3","🖼️","Tema das cartas",t.t,t.s,t.i);
    box2.innerHTML='<div class="sh">⚙️ Configurações da sala</div>'
      +lin("cr4","🔒","Sala privada","Só com o código","Quem não tiver o código não entra.","",1)
      +lin("cr5","👥","Número de jogadores",j.t,casual()?j.s:"Só 1v1 neste modo","",!casual());
  }
  cr.addEventListener("click",e=>{
    const r=e.target.closest(".crow");if(!r||r.classList.contains("fix"))return;
    if(r.id==="cr2")escolher("Dificuldade",DIF,$("dif").value,v=>{$("dif").value=v;pinta()});
    else if(r.id==="cr3")escolher("Tema das cartas",TEM,$("tema").value,v=>{$("tema").value=v;pinta()});
    else if(r.id==="cr5")escolher("Número de jogadores",JOG,jog,v=>{jog=v;pinta()});
  });
  const es=$("criarSala");es.className="opc big";es.innerHTML='<span class="ic">▶</span><span class="tx"><b>Criar sala</b></span>';
  const vo=$("vCriar");vo.className="opc";vo.innerHTML='<span class="ic">←</span><span class="tx"><b>Voltar</b></span>';
  // com 3 ou 4 jogadores, usa o modo em grupo
  document.addEventListener("click",e=>{
    if(!e.target.closest||!e.target.closest("#criarSala")||jog===2)return;
    e.stopPropagation();e.preventDefault();
    const bg=$("bGrupo");
    if(!bg||!$("mcriar")){alert("O modo em grupo não está disponível.");return}
    bg.click();
    $("mdif").value=$("dif").value;$("mtema").value=$("tema").value;
    $(jog===4?"m4":"m3").click();
    $("mcriar").click();
  },true);
  new MutationObserver(pinta).observe(cr,{attributes:true,attributeFilter:["class"]});
  ["mCasual","mRank","mLiga"].forEach(i=>new MutationObserver(pinta).observe($(i),{attributes:true,attributeFilter:["class"]}));
  pinta();
}
}catch(e){}

// ===== AMIGOS =====
try{
const am=$("amigos");
if(am&&!am.dataset.v4&&$("aLista")&&$("aAdd")&&$("aPed")&&$("aMsg")){
  am.dataset.v4="1";
  const limpa=s=>s.replace(/\s*\d+🔥\s*$/,"").replace(/\s+/g," ").trim();
  const nomeLi=li=>{
    const sp=[...li.children].find(c=>c.querySelector&&c.querySelector("br"));
    if(!sp)return"";
    const t=[...sp.childNodes].find(x=>x.nodeType===3&&x.textContent.trim());
    return limpa(t?t.textContent:"");
  };
  const tt=am.querySelector(".titulo");
  if(tt){const s=document.createElement("p");s.className="nota";s.textContent="Jogue, desafie e compartilhe a diversão!";tt.after(s)}
  am.querySelectorAll(".tabs2").forEach(x=>x.style.display="none");
  const sr=document.createElement("div");sr.className="srch";
  sr.innerHTML='<span>🔍</span><input id="v4q" placeholder="Buscar amigo..." autocomplete="off">';
  const tb=document.createElement("div");tb.className="tabs2";
  tb.innerHTML='<button id="v4t" class="on">Todos (0)</button><button id="v4o">Online (0)</button><button id="v4f">Offline (0)</button>';
  const so=document.createElement("div");so.className="sort";
  so.innerHTML='<span>👥 Amigos</span><small>↕ Online primeiro</small>';
  $("aMsg").after(sr);sr.after(tb);tb.after(so);so.after($("aLista"));
  const pedH=[...am.children].find(e=>e.tagName==="P"&&/Pedidos recebidos/.test(e.textContent));
  if(pedH){pedH.className="sh2";pedH.textContent="📨 Pedidos de amizade";$("aLista").after(pedH);pedH.after($("aPed"))}
  let aba="t",q="";
  function filtra(){
    const rows=[...$("aLista").children].filter(li=>li.children.length>1);
    let on=0;
    rows.forEach(li=>{
      const isOn=/online/.test(li.textContent);if(isOn)on++;
      const ok=(aba==="t"||(aba==="o"&&isOn)||(aba==="f"&&!isOn))&&(!q||nomeLi(li).toLowerCase().includes(q));
      li.style.display=ok?"":"none";
      const d=[...li.querySelectorAll("button")].find(b=>/Desafiar/.test(b.textContent));
      if(d){d.textContent="⚔️";d.className="sq";d.setAttribute("aria-label","Desafiar")}
    });
    $("v4t").textContent="Todos ("+rows.length+")";
    $("v4o").textContent="Online ("+on+")";
    $("v4f").textContent="Offline ("+(rows.length-on)+")";
  }
  const aba_=a=>{aba=a;[["t","v4t"],["o","v4o"],["f","v4f"]].forEach(([k,i])=>$(i).classList.toggle("on",k===a));filtra()};
  $("v4t").onclick=()=>aba_("t");$("v4o").onclick=()=>aba_("o");$("v4f").onclick=()=>aba_("f");
  $("v4q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();filtra()});
  new MutationObserver(filtra).observe($("aLista"),{childList:true});
  new MutationObserver(()=>{
    const li=$("aPed").children;
    if(li.length===1&&!li[0].classList.contains("vazio")&&/Nenhum pedido/.test(li[0].textContent))
      $("aPed").innerHTML='<li class="vazio"><div style="text-align:center"><div style="font-size:2.2rem">🙋</div><b>Nenhum pedido no momento.</b><br><small>Adicione amigos para jogar junto!</small></div></li>';
  }).observe($("aPed"),{childList:true});
  filtra();
}
}catch(e){}
})();
