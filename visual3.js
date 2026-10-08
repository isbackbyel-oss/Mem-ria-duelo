(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
if(!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const H=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const css=document.createElement("style");
css.textContent=`
.hdr2{display:flex;align-items:center;justify-content:space-between;gap:8px}
.hdr2 b{font-size:1.5rem}
.hdr2 .back{width:44px;height:44px;padding:0;border-radius:12px;font-size:1.4rem;background:rgba(14,34,64,.8);border:2px solid #1e5f9e;box-shadow:none}
#cbx{display:flex;gap:10px;justify-content:center;margin:6px 0}
#cbx input{width:62px;height:70px;padding:0;text-align:center;font-size:1.9rem;font-weight:800;border-radius:14px;border:2px solid #1e6fb5;background:rgba(14,34,64,.8);color:#fff;text-transform:uppercase}
#cbx input:focus{outline:none;border-color:#19b4ff;box-shadow:0 0 12px rgba(25,180,255,.6)}
#perfil>.titulo{display:none}
#pv .av2.big{width:84px;height:84px;font-size:2.2rem;border-width:3px}
.pn{font-size:1.5rem}
.nvl{display:flex;align-items:center;gap:6px;font-weight:700}
.stb{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#19b4ff;color:#fff;font-size:.8rem}
.tiles3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.tiles3 .tile{font-size:.85rem;padding:10px 2px}.tiles3 .tile b{font-size:1.5rem}
.cardx.col{flex-direction:column;align-items:stretch;gap:0}
.rw2{display:flex;justify-content:space-between;padding:6px 0}
details.cardx{display:block}details.cardx summary{font-weight:800;cursor:pointer}`;
document.head.appendChild(css);

// ===== ENTRAR COM CÓDIGO =====
const en=$("entrar"),cod=$("cod");
if(en&&cod&&$("entrarSala")&&$("vEntrar")){
  cod.style.display="none";
  const t=en.querySelector(".titulo");if(t)t.style.display="none";
  const hd=document.createElement("div");hd.className="hdr2";
  hd.innerHTML='<button class="back">←</button><b>Entrar com código</b><span style="width:44px"></span>';
  en.insertBefore(hd,en.firstChild);
  hd.querySelector("button").onclick=()=>$("vEntrar").click();
  const sub=document.createElement("p");sub.className="nota";
  sub.textContent="Digite o código da sala para entrar e jogar com seus amigos!";hd.after(sub);
  const cb=document.createElement("div");cb.id="cbx";
  cb.innerHTML=Array(4).fill('<input maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false">').join("");
  sub.after(cb);
  const I=[...cb.children];
  const sync=()=>{cod.value=I.map(i=>i.value).join("")};
  const mostra=s=>{const c=(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4);I.forEach((i,k)=>i.value=c[k]||"");return c};
  I.forEach((el,k)=>{
    el.addEventListener("input",()=>{el.value=el.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(-1);sync();if(el.value&&k<3)I[k+1].focus()});
    el.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!el.value&&k>0){I[k-1].focus();I[k-1].value="";sync()}});
    el.addEventListener("paste",e=>{e.preventDefault();const c=mostra((e.clipboardData||window.clipboardData).getData("text"));sync();I[Math.min(c.length,3)].focus()});
  });
  const colar=document.createElement("button");colar.className="sec";colar.textContent="📋 Colar código";
  cb.after(colar);
  colar.onclick=async()=>{
    let s="";
    try{s=await navigator.clipboard.readText()}catch(e){s=prompt("Cole o código aqui:")||""}
    const c=mostra(s);sync();I[Math.min(c.length,3)].focus();
  };
  const es=$("entrarSala");es.className="opc big";es.innerHTML='<span class="tx"><b>Entrar na sala</b></span>';
  const vo=$("vEntrar");vo.className="opc";vo.innerHTML='<span class="ic">←</span><span class="tx"><b>Voltar</b></span>';
  es.addEventListener("click",()=>setTimeout(()=>{mostra("");cod.value=""},800));
  new MutationObserver(()=>{if(en.classList.contains("on")&&cod.value)mostra(cod.value)}).observe(en,{attributes:true,attributeFilter:["class"]});
}

// ===== MELHOR TEMPO (vitórias contra humanos ou robô, medido neste aparelho) =====
let ini=null,reg=false;
setInterval(()=>{
  const j=$("jogo"),on=!!(j&&j.classList.contains("on")),ag=$("again"),fim=on&&ag&&ag.style.display==="block";
  if(!on){ini=null;reg=false;return}
  if(!fim){if(ini===null)ini=Date.now();reg=false;return}
  if(reg||ini===null)return;
  reg=true;
  if(/^Você ganhou/.test(txt("status"))&&!/Treino/.test(txt("modoTxt"))){
    const s=Math.round((Date.now()-ini)/1000),b=+ls("melhorTempo")||0;
    if(!b||s<b){try{localStorage.setItem("melhorTempo",s)}catch(e){}}
  }
  ini=null;
},1000);

// ===== PERFIL =====
const st=$("stats"),pv=$("pv");
if(st&&pv&&$("listaPat")){
  const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
  const render=()=>{
    const t=txt("cartao").split(" · "),n=t.length,nome=t.slice(0,Math.max(1,n-2)).join(" · ").trim();
    let d={};try{d=JSON.parse(ls("viciante")||"{}")}catch(e){}
    const xp=d.xp||0,lv=Math.floor(Math.sqrt(xp/25))+1,l0=25*(lv-1)*(lv-1),l1=25*lv*lv;
    const S={};[...st.children].forEach(li=>{if(li.children.length>1)S[li.children[0].textContent.trim()]=li.children[1].textContent.trim()});
    const bt=+ls("melhorTempo")||0,tempo=bt?Math.floor(bt/60)+":"+String(bt%60).padStart(2,"0"):"—";
    const ms=Math.max(parseInt(S["Melhor sequência"])||0,parseInt(S["Sequência atual"])||0);
    const h=hue(nome||"?");
    const P=[...$("listaPat").children].map(li=>{
      const sp=li.children[0],sv=sp.querySelector("svg"),at=li.classList.contains("eu"),lk=li.classList.contains("off");
      return '<div class="'+(at?"at":"")+'">'+(sv?sv.outerHTML:"")+"<b>"+H(sp.textContent.trim())+"</b><div>"+H(li.children[1].textContent)+"</div>"+(at?'<span class="bd">Atual</span>':lk?"🔒":"✔")+"</div>";
    }).join("");
    pv.innerHTML='<div class="hdr2"><button class="back" id="pfB">←</button><b>Perfil</b><span style="width:44px"></span></div>'
      +'<div class="cardx"><span class="av2 big" style="background:linear-gradient(hsl('+h+',80%,55%),hsl('+((h+60)%360)+',80%,45%))">'+H((nome[0]||"?").toUpperCase())+'</span><div style="flex:1;min-width:0"><b class="pn">'+H(nome)+'</b><div class="nvl"><span class="stb">★</span> Nv '+lv+'</div><div class="pg"><u style="width:'+Math.round((xp-l0)/(l1-l0)*100)+'%"></u></div><small>'+xp+"/"+l1+" XP</small></div></div>"
      +'<div class="tiles3"><div class="tile">Vitórias<b>'+H(S["Vitórias"]||"0")+'</b></div><div class="tile">Derrotas<b>'+H(S["Derrotas"]||"0")+'</b></div><div class="tile">Taxa de vitória<b>'+H(S["Taxa de vitória"]||"—")+"</b></div></div>"
      +'<div class="cardx"><span style="font-size:2rem">🛡️</span><div><small>Título atual</small><b style="display:block;font-size:1.3rem">'+H(d.eq||"Iniciante")+"</b></div></div>"
      +'<div class="cardx col"><div class="rw2"><span>🔥 Melhor sequência</span><b>'+ms+'</b></div><div class="rw2"><span>⏱️ Melhor tempo</span><b>'+tempo+"</b></div></div>"
      +'<button class="opc" id="pfC"><span class="ic">🎖️</span><span class="tx"><b>Ver conquistas</b></span><span class="ch">›</span></button>'
      +'<details class="cardx"><summary>🛡️ Patentes</summary><div class="hs" style="margin-top:8px">'+P+"</div></details>";
    $("pfB").onclick=()=>history.back();
    $("pfC").onclick=()=>{if($("nConq"))$("nConq").click()};
  };
  new MutationObserver(render).observe(st,{childList:true});
  render();
}
})();
