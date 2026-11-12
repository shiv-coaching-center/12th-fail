(()=>{"use strict";
const $=s=>document.querySelector(s),tabs=[...document.querySelectorAll(".rp-tab")],values=["12","18","24"],state={mode:"ratio",active:0,answer:null,steps:[]};
const slots=$("#rp-values"),result=$("#rp-result"),label=$("#rp-result-label"),number=$("#rp-result-number"),solution=$("#rp-solution"),steps=$("#rp-steps"),note=$("#rp-note"),add=$("#rp-add");
let reasons=null;
fetch("./reasons_hi.json?v=0.4.0",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(r=>{reasons=r}).catch(()=>{note.textContent="हल अभी उपलब्ध नहीं है"});
function render(){
 slots.replaceChildren();
 values.forEach((v,i)=>{
  const slot=document.createElement("div");slot.className="rp-slot";
  const b=document.createElement("button");b.type="button";b.className="rp-value"+(state.active===i?" selected":"");b.textContent=v||"—";b.setAttribute("aria-label","संख्या "+(i+1)+" "+v);b.addEventListener("click",()=>{state.active=i;render()});slot.append(b);
  if(i<values.length-1){const sep=document.createElement("span");sep.className="rp-separator";sep.textContent=state.mode==="proportion"&&i===1?" = ":" : ";slot.append(sep)}
  slots.append(slot);
 });
 if(state.mode==="proportion"){
  slots.insertAdjacentHTML("beforeend",'<span class="rp-separator"> : </span><span class="rp-separator">x</span>');
 }
 add.classList.toggle("rp-hidden",state.mode!=="ratio");
}
function clearResult(){state.answer=null;state.steps=[];result.classList.add("rp-hidden");solution.classList.add("rp-hidden");number.textContent="—";note.textContent=""}
function compute(){
 if(!reasons){note.textContent="हल अभी उपलब्ध नहीं है";return}
 let r;
 if(state.mode==="ratio")r=window.TwelfthFailMath.solveRatioMany(values,reasons);
 else r=window.TwelfthFailMath.solveProportion(values[0],values[1],values[2],reasons);
 if(!r||!r.ok||r.verified!==true){note.textContent="कृपया सही पूर्ण संख्याएँ भरें";return}
 state.answer=state.mode==="ratio"?r.ratio:r.answer;state.steps=r.steps;
 label.textContent=state.mode==="ratio"?"सरलतम अनुपात =":"x का मान =";
 number.textContent=state.answer;result.classList.remove("rp-hidden");note.textContent="उत्तर सत्यापित है";renderSteps();
}
function renderSteps(){
 steps.replaceChildren();state.steps.forEach((s,i)=>{const row=document.createElement("div");row.className="rp-step";const n=document.createElement("span");n.className="rp-step-num";n.textContent=String(i+1);const t=document.createElement("span");t.textContent=s.display||s.result;row.append(n,t);steps.append(row)});
}
tabs.forEach(t=>t.addEventListener("click",()=>{state.mode=t.dataset.mode;tabs.forEach(x=>{const on=x===t;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on))});values.splice(0,values.length,...(state.mode==="ratio"?["12","18","24"]:["2","3","4"]));state.active=0;clearResult();render()}));
add.addEventListener("click",()=>{if(values.length>=6){note.textContent="अधिकतम 6 संख्याएँ जोड़ सकते हैं";return}values.push("");state.active=values.length-1;clearResult();render();note.textContent="नई संख्या भरें"});
$("#rp-keypad").addEventListener("click",e=>{const b=e.target.closest("button[data-key]");if(!b)return;let v=values[state.active]||"";if(b.dataset.key==="clear")v="";else if(b.dataset.key==="back")v=v.slice(0,-1);else if(b.dataset.key==="dot")return;else if(v.length<12)v+=b.dataset.key;values[state.active]=v;clearResult();render()});
$("#rp-equals").addEventListener("click",compute);
$("#rp-show").addEventListener("click",()=>{if(state.answer===null)compute();if(state.answer!==null)solution.classList.toggle("rp-hidden")});
render();
if("serviceWorker"in navigator&&location.protocol==="https:")navigator.serviceWorker.register("./sw.js?v=16",{scope:"./"}).catch(()=>{});
})();