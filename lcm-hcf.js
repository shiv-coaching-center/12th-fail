(()=>{"use strict";
const $=s=>document.querySelector(s),values=[12,18,24],active={value:0},state={mode:"lcm",answer:null,steps:[]};
const tabs=[...document.querySelectorAll(".lcm-tab")],slots=$("#lcm-values"),result=$("#lcm-result"),label=$("#lcm-result-label"),number=$("#lcm-result-number"),steps=$("#lcm-steps"),note=$("#lcm-note");
function gcd(a,b){while(b!==0n){const r=a%b;a=b;b=r}return a}
function primeFactors(n){const f=[];let d=2,x=n;while(d*d<=x){let c=0;while(x%d===0){x/=d;c++}if(c)f.push([d,c]);d=d===1?2:d===2?3:d+2}if(x>1)f.push([x,1]);return f}
function powerText(f){return f.length?f.map(([p,e])=>e===1?String(p):p+"<sup>"+e+"</sup>").join(" × "):"1"}
function compute(){note.textContent="";if(values.some(v=>!Number.isSafeInteger(v)||v<1)){note.textContent="कृपया 1 या उससे बड़ी पूर्ण संख्या डालें";return}
 let h=BigInt(values[0]),l=h;for(const v of values.slice(1)){const b=BigInt(v),g=gcd(h,b);h=g;l=(l/g)*b}
 // Use the existing Level 3.2 solver for an independent exact check on each pair.
 const engine=window.TwelfthFailMath;if(!engine||typeof engine.solveLcmHcf!=="function"){note.textContent="गणित इंजन उपलब्ध नहीं है";return}
 let checkH=String(values[0]),checkL=String(values[0]);for(const v of values.slice(1)){const why={hcf_euclidean:"HCF की जाँच",lcm_product:"LCM की जाँच"};const a=engine.solveLcmHcf(checkH,String(v),why),b=engine.solveLcmHcf(checkL,String(v),why);if(!a.ok||!b.ok){note.textContent="इस सवाल का हल उपलब्ध नहीं";return}checkH=a.hcf;checkL=b.lcm}
 if(checkH!==String(h)||checkL!==String(l)){note.textContent="उत्तर की जाँच पूरी नहीं हुई";return}
 state.answer=state.mode==="lcm"?l.toString():h.toString();state.steps=[];
 const facts=values.map(v=>primeFactors(v));
 facts.forEach((f,i)=>state.steps.push({text:values[i]+" = "+powerText(f)}));
 const primes=[...new Set(facts.flatMap(f=>f.map(x=>x[0])))].sort((a,b)=>a-b);
 const chosen=primes.map(p=>{const counts=facts.map(f=>(f.find(x=>x[0]===p)||[p,0])[1]);const e=state.mode==="lcm"?Math.max(...counts):Math.min(...counts);return e?[p,e]:null}).filter(Boolean);
 state.steps.push({text:(state.mode==="lcm"?"ल.स.":"म.स.")+" = "+powerText(chosen)+" = "+state.answer});
 label.textContent=state.mode==="lcm"?"ल.स. (LCM) =":"म.स. (HCF) =";number.textContent=state.answer;renderSteps();result.classList.remove("lcm-hidden")
}
function renderSlots(){slots.replaceChildren();values.forEach((v,i)=>{const b=document.createElement("button");b.className="lcm-value"+(active.value===i?" selected":"");b.type="button";b.textContent=v;b.setAttribute("aria-label","संख्या "+(i+1)+" "+v);b.addEventListener("click",()=>{active.value=i;renderSlots()});slots.append(b)})}
function renderSteps(){steps.replaceChildren();state.steps.forEach((s,i)=>{const row=document.createElement("div");row.className="lcm-step";const n=document.createElement("span");n.className="lcm-step-num";n.textContent=i+1;const t=document.createElement("span");t.innerHTML=s.text;row.append(n,t);steps.append(row)})}
function setMode(mode){state.mode=mode;tabs.forEach(t=>{const on=t.dataset.mode===mode;t.classList.toggle("active",on);t.setAttribute("aria-pressed",String(on))});if(state.answer!==null)compute()}
tabs.forEach(t=>t.addEventListener("click",()=>setMode(t.dataset.mode)));
$("#lcm-add").addEventListener("click",()=>{if(values.length>=6){note.textContent="अधिकतम 6 संख्याएँ जोड़ सकते हैं";return}values.push(0);active.value=values.length-1;renderSlots();note.textContent="अब कीपैड से नई संख्या भरें"});
$("#lcm-keypad").addEventListener("click",e=>{const b=e.target.closest("button[data-key]");if(!b)return;let v=String(values[active.value]||"");if(b.dataset.key==="clear")v="";else if(b.dataset.key==="back")v=v.slice(0,-1);else if(b.dataset.key==="dot")return;else if(v.length<9)v+=b.dataset.key;values[active.value]=v===""?0:Number(v);renderSlots();state.answer=null;number.textContent="—";result.classList.add("lcm-hidden");note.textContent=""});
$("#lcm-equals").addEventListener("click",compute);$("#lcm-show").addEventListener("click",()=>{if(state.answer===null)compute();if(state.answer!==null)$("#lcm-solution").classList.toggle("lcm-hidden")});
renderSlots();setMode("lcm");
if("serviceWorker"in navigator&&location.protocol==="https:")navigator.serviceWorker.register("./sw.js?v=15",{scope:"./"}).catch(()=>{});
})();