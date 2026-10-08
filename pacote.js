(function(){
const L=["config.js","multi.js","espectar.js","social.js","dupla.js","extras.js","home.js","visual.js","visual2.js","avatares.js","visual3.js"];
const t=Math.floor(Date.now()/60000),falhas=[];
const ja=n=>[...document.scripts].some(s=>(s.getAttribute("src")||"").split("?")[0]===n);
let i=0;
function prox(){
  if(i>=L.length){
    if(falhas.length){
      const d=document.createElement("div");
      d.style.cssText="position:fixed;left:8px;right:8px;bottom:84px;z-index:99;background:#7a1c1c;color:#fff;padding:8px;border-radius:10px;font-size:.8rem";
      d.textContent="Arquivos que não carregaram: "+falhas.join(", ")+" (toque para fechar)";
      d.onclick=()=>d.remove();document.body.appendChild(d);
    }
    return;
  }
  const n=L[i++];
  if(ja(n)){prox();return}
  const s=document.createElement("script");
  s.src=n+"?t="+t;
  s.onload=prox;
  s.onerror=()=>{falhas.push(n);prox()};
  document.body.appendChild(s);
}
prox();
})();
