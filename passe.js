(function(){
const $=id=>document.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent:""};
const menu=$("menu"),main=document.querySelector("main"),nav=$("nav");
if(!menu||!main||!nav||!$("cartao"))return;
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const toast=t=>{const d=document.createElement("div");d.className="mt";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2400)};
const BRd=()=>new Date(Date.now()-3*36e5);
const hoje=()=>BRd().toISOString().slice(0,10);
const D=()=>{try{return JSON.parse(ls("viciante")||"{}")}catch(e){return{}}};
const css=document.createElement("style");
css.textContent=`#pvRow{display:flex;gap:10px;width:88%}.pvc{flex:1;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:16px;border:2px solid #3a49c9;background:rgba(14,22,70,.85);color:#fff;text-align:left;min-height:56px;box-shadow:none;font-size:1.4rem}.pvc span{display:flex;flex-direction:column;min-width:0;font-size:.85rem}.pvc small{opacity:.85;font-size:.7rem}.lvr{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;border:2px solid #1e5f9e;background:rgba(14,34,64,.75)}.lvr.at{border-color:#ffb020;box-shadow:0 0 12px rgba(255,176,32,.5)}.lvr .n{width:34px;font-weight:800;text-align:center}.lvr .r{flex:1}.lvr button{padding:6px 12px;font-size:.9rem;min-height:40px}`;
document.head.appendChild(css);

// ===== PASSE DUELO (temporada = mês) =====
const T=()=>hoje().slice(0,7),XPN=60,NIV=20;
function base(){const k="pb_"+T();let b=ls(k);if(b===null){b=D().xp||0;ss(k,b)}return +b}
const prog=()=>Math.max(0,(D().xp||0)-base());
const lvl=()=>Math.min(NIV,Math.floor(prog()/XPN));
const rec=L=>({m:Math.min(150,40+8*L),d:L===20?3:L===15?2:(L===10||L===5)?1:0});
const cl=()=>{try{return JSON.parse(ls("pc_"+T())||"[]")}catch(e){return[]}};
async function pegar(L){
  const M=window.MOEDAS,W=M&&M.saldo();
  if(!W){toast("Aguarde um instante…");return}
  const r=rec(L),hj=BRd().toISOString().slice(0,10),g=W.dia===hj?W.g:0,gd=W.dia===hj?W.gd:0;
  if(r.m>1000-g||r.d>5-gd){toast("Limite diário de recompensas. Tente amanhã!");return}
  const x=await M.ganhar(r.m,r.d);
  if(x&&(x.m||x.d)){const a=cl();a.push(L);ss("pc_"+T(),JSON.stringify(a));render()}
}
const sec=document.createElement("section");sec.id="passe";sec.className="tela";
sec.innerHTML='<div class="hdr2"><button class="back" id="psB">←</button><b>👑 Passe Duelo</b><span style="width:44px"></span></div><p class="nota" id="psS"></p><div class="barra"><i id="psX"></i></div><p class="nota" id="psT"></p><div id="psL" style="display:flex;flex-direction:column;gap:8px"></div>';
main.appendChild(sec);
function render(){
  const L=lvl(),p=prog(),a=cl();
  $("psS").textContent="Nível "+L+" de "+NIV+" · cada nível = "+XPN+" XP";
  $("psX").style.width=(L>=NIV?100:Math.round((p%XPN)/XPN*100))+"%";
  $("psT").textContent=L>=NIV?"Passe completo! 🎉":(p%XPN)+" / "+XPN+" XP para o nível "+(L+1);
  $("psL").innerHTML=Array.from({length:NIV},(_,i)=>{
    const n=i+1,r=rec(n),ok=n<=L,got=a.includes(n);
    return '<div class="lvr'+(n===L?" at":"")+'"><span class="n">'+n+'</span><span class="r">🪙 '+r.m+(r.d?" + 💎 "+r.d:"")+"</span>"+(got?"<span>✔</span>":ok?'<button data-n="'+n+'" class="gold">Receber</button>':"<span>🔒</span>")+"</div>";
  }).join("");
  const s=$("pvPs");if(s)s.textContent=L+"/"+NIV;
}
$("psL").onclick=e=>{const b=e.target.closest("button");if(b)pegar(+b.dataset.n)};
function abrir(){
  document.querySelectorAll(".tela").forEach(t=>t.classList.toggle("on",t.id==="passe"));
  nav.style.display="none";history.pushState({t:"passe"},"");render();
}
$("psB").onclick=()=>history.back();
addEventListener("popstate",()=>{
  const t=document.querySelector(".tela.on");
  if(t&&t.id==="passe"){
    document.querySelectorAll(".tela").forEach(x=>x.classList.toggle("on",x.id==="menu"));
    nav.style.display="flex";nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.id==="nInicio"));
  }
});

// ===== EVENTO DO DIA =====
const EV=[
["Domingo em dobro","Vença uma partida online",(m,v)=>v,40],
["Segunda Fácil","Vença no Fácil",(m,v)=>v&&/Fácil/.test(m),30],
["Terça Ranqueada","Jogue na Ranqueada",m=>/Ranqueada/.test(m),30],
["Quarta Médio","Vença no Médio",(m,v)=>v&&/Médio/.test(m),30],
["Quinta Difícil","Vença no Difícil",(m,v)=>v&&/Difícil/.test(m),50],
["Sexta da Liga","Jogue na Liga",m=>/Liga/.test(m),50],
["Sábado de duelos","Jogue online",()=>true,20]];
const ev=()=>EV[BRd().getUTCDay()];
const evN=()=>+ls("ev_"+hoje())||0;
function pinta(){const e=ev();$("pvEt").textContent=e[0];$("pvEs").textContent=e[1]+" · +🪙"+e[3]+" ("+evN()+"/3)"}

// ===== cartões na tela inicial =====
const row=document.createElement("div");row.id="pvRow";
row.innerHTML='<button class="pvc" id="pvE">🎯<span><b id="pvEt">Evento</b><small id="pvEs"></small></span></button><button class="pvc" id="pvP">👑<span><b>Passe Duelo</b><small id="pvPs">0/20</small></span></button>';
const j=$("hmJ");
if(j){j.after(row);row.style.alignSelf="center"}else menu.appendChild(row);
$("pvE").onclick=()=>{const e=ev();toast("🎯 "+e[0]+": "+e[1].toLowerCase()+" e ganhe +🪙"+e[3]+" (até 3x)")};
$("pvP").onclick=abrir;
pinta();render();
setInterval(()=>{pinta();const s=$("pvPs");if(s)s.textContent=lvl()+"/"+NIV},3000);

// ===== bônus do evento no fim da partida =====
let ini=null,feito=false;
setInterval(()=>{
  const jg=$("jogo"),ag=$("again"),on=!!(jg&&jg.classList.contains("on")),fim=on&&ag&&ag.style.display==="block";
  if(!on){ini=null;feito=false;return}
  if(!fim){if(ini===null)ini=Date.now();feito=false;return}
  if(feito)return;
  feito=true;
  const dur=ini?(Date.now()-ini)/1000:0;ini=null;
  const modo=txt("modoTxt"),s=txt("status");
  if(/Treino/.test(modo)||/Robô/.test(txt("n1"))||dur<20)return;
  const e=ev(),n=evN();
  if(n>=3||!e[2](modo,/^Você ganhou/.test(s)))return;
  const M=window.MOEDAS;if(!M)return;
  M.ganhar(e[3],0).then(r=>{if(r&&r.m){ss("ev_"+hoje(),n+1);pinta();toast("🎯 Evento: +🪙"+r.m)}});
},1000);

// ===== AMIGOS: Assistir (em partida) e Convidar (offline) =====
const al=$("aLista");
if(al)new MutationObserver(()=>{
  [...al.children].forEach(li=>{
    if(li.dataset.px||li.children.length<2)return;
    li.dataset.px="1";
    const bx=li.children[li.children.length-1],t=li.textContent;
    if(!bx||bx.tagName!=="SPAN")return;
    const b=document.createElement("button");b.className="sq";b.style.cssText="padding:6px 10px;font-size:1.2rem;border-radius:12px;min-height:40px";
    if(/jogando/.test(t)){
      b.textContent="👁";b.setAttribute("aria-label","Assistir");
      b.onclick=()=>{const x=[...document.querySelectorAll("#jogar button")].find(y=>/Assistir/.test(y.textContent));if(x)x.click()};
      bx.prepend(b);
    }else if(/offline/.test(t)){
      b.textContent="📨";b.setAttribute("aria-label","Convidar");
      b.onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent("Vem jogar Memória Duelo comigo! 🧠\n"+location.origin+location.pathname.replace(/[^/]*$/,"")),"_blank");
      bx.prepend(b);
    }
  });
}).observe(al,{childList:true});
})();
