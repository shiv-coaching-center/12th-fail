(() => {
"use strict";
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const input=$("#expression-input"), answer=$("#answer-area"), toast=$("#toast"), sheet=$("#sheet-backdrop");
let subject="math", language="hi", activeSheet="symbols", historyItems=[], toastTimer;
const translations={
hi:{workspace:"YOUR STUDY WORKSPACE",headline:"आज क्या सीखेंगे?",subhead:"लिखो, समझो और अभ्यास करो।",math:"गणित",physics:"भौतिक",chemistry:"रसायन",inputLabel:"YOUR EXPRESSION",localOnly:"डिवाइस पर ही सुरक्षित",clear:"साफ़ करें",hint:"यहाँ अपना सवाल लिखें",keyboard:"कीबोर्ड",answer:"उत्तर",notReady:"यह सवाल अभी हल नहीं कर सकता",seeSteps:"हल के चरण देखें",quickTools:"Quick tools",subjectTools:"विषय के उपयोगी symbols",keypad:"कैलकुलेटर कीपैड",tapToInsert:"टैप करके जोड़ें",templates:"Templates",moreSymbols:"और Symbols",history:"History",footer:"100% Offline · आपका डेटा आपके डिवाइस पर",back:"वापस",verified:"VERIFIED SOLUTION",solutionPreview:"हल का पूर्वावलोकन",previewOnly:"यह केवल UI preview है। वास्तविक उत्तर अभी उपलब्ध नहीं हैं।",verifiedAnswer:"सत्यापित उत्तर",verifiedPlaceholder:"उत्तर इंजन जुड़ने पर यहाँ दिखेगा",steps:"हल के चरण",tapStep:"समझने के लिए चरण चुनें",stepOne:"प्रश्न को समझें",stepOneText:"यहाँ सत्यापित चरण का विवरण आएगा।",stepTwo:"सही नियम चुनें",stepTwoText:"यहाँ नियम और उसका उपयोग दिखेगा।",stepThree:"अंतिम जाँच",stepThreeText:"उत्तर की जाँच यहाँ दिखाई जाएगी।",listen:"सुनें",simpleText:"सरल टेक्स्ट",noFake:"यह स्क्रीन केवल डिज़ाइन जाँच के लिए है, इसे वास्तविक हल न समझें।"},
en:{workspace:"YOUR STUDY WORKSPACE",headline:"What will you learn today?",subhead:"Write, understand and practice.",math:"Maths",physics:"Physics",chemistry:"Chemistry",inputLabel:"YOUR EXPRESSION",localOnly:"Saved on this device only",clear:"Clear",hint:"Write your question here",keyboard:"Keyboard",answer:"Answer",notReady:"Solving is not included in this version yet. Your question has been saved.",seeSteps:"Preview solution steps",quickTools:"Quick tools",subjectTools:"Useful subject symbols",keypad:"Calculator keypad",tapToInsert:"Tap to insert",templates:"Templates",moreSymbols:"More symbols",history:"History",footer:"100% Offline · Your data stays on this device",back:"Back",verified:"VERIFIED SOLUTION",solutionPreview:"Solution preview",previewOnly:"This is only a UI preview. Real answers are not available yet.",verifiedAnswer:"Verified answer",verifiedPlaceholder:"The answer will appear here when the solver is added",steps:"Solution steps",tapStep:"Choose a step to explore",stepOne:"Understand the question",stepOneText:"Verified step details will appear here.",stepTwo:"Choose the right rule",stepTwoText:"The rule and its use will be shown here.",stepThree:"Final check",stepThreeText:"Answer verification will be shown here.",listen:"Listen",simpleText:"Simple text",noFake:"This screen is only for design review. Do not treat it as a real solution."}
};
const strips={
math:["√","π","∞","x²","x³","a/b","|x|","θ","sin","cos","tan","log","ln","Δ","∫","∑","≤","≥","≠"],
physics:["Δ","v₀","v²","F","m","a","g","λ","ν","f","h","c","μ","Ω","→","∝","±","°","J","W"],
chemistry:["H₂","O₂","H₂O","CO₂","NaCl","→","⇌","Δ","°C","mol","M","pH","↑","↓","(aq)","(s)","(g)","(l)"]
};
const sheetData={
symbols:{title:{hi:"Symbols",en:"Symbols"},tabs:["symbols","formulas"],items:{
math:[["√","Square root"],["π","Pi"],["∞","Infinity"],["x²","Square"],["x³","Cube"],["θ","Theta"],["∫","Integral"],["∑","Summation"],["Δ","Delta"],["≤","Less than or equal"],["≥","Greater than or equal"],["≠","Not equal"]],
physics:[["Δ","Change"],["v₀","Initial velocity"],["λ","Wavelength"],["ν","Frequency"],["Ω","Ohm"],["μ","Coefficient"],["→","Vector"],["∝","Proportional"],["±","Plus minus"],["°","Degree"],["g","Gravity"],["F","Force"]],
chemistry:[["→","Reaction"],["⇌","Equilibrium"],["↑","Gas released"],["↓","Precipitate"],["(aq)","Aqueous"],["(s)","Solid"],["(g)","Gas"],["(l)","Liquid"],["Δ","Heat"],["°C","Celsius"],["pH","pH"],["mol","Mole"]]
}},
formulas:{title:{hi:"Formula sheet",en:"Formula sheet"},tabs:["math","physics","chemistry"],items:{
math:[["a²+b²","Algebraic identity"],["(a+b)²","Square identity"],["πr²","Circle area"],["2πr","Circumference"],["½bh","Triangle area"],["l×b","Rectangle area"]],
physics:[["v = u + at","Equations of motion"],["F = ma","Newton's second law"],["W = Fs","Work"],["P = W/t","Power"],["V = IR","Ohm's law"],["p = mv","Momentum"]],
chemistry:[["n = m/M","Moles"],["pH = −log[H⁺]","pH"],["PV = nRT","Ideal gas"],["C₁V₁=C₂V₂","Dilution"],["H₂ + O₂","Reaction symbols"],["Na⁺ + Cl⁻","Ions"]]
}},
templates:{title:{hi:"Ready-made templates",en:"Ready-made templates"},tabs:["math","physics","chemistry"],items:{
math:[["x² + 5x + 6 = 0","Quadratic equation"],["(a+b)²","Algebraic identity"],["2 : 3 = 4 : x","Ratio / proportion"],["sin θ + cos θ","Trigonometry"]],
physics:[["v = u + at","Motion"],["F = ma","Force"],["V = IR","Electricity"],["W = Fs","Work and energy"]],
chemistry:[["H₂ + O₂ → H₂O","Chemical equation"],["pH = −log[H⁺]","Acids and bases"],["n = m/M","Mole concept"],["NaCl (aq)","Solution"]]
}},
more:{title:{hi:"More tools",en:"More tools"},tabs:["symbols","formulas","elements"],items:{
math:[["π","Pi"],["√","Root"],["∫","Integral"],["∑","Summation"]],
physics:[["Δ","Change"],["→","Vector"],["Ω","Ohm"],["λ","Wavelength"]],
chemistry:[["H","Hydrogen · 1"],["He","Helium · 2"],["C","Carbon · 6"],["N","Nitrogen · 7"],["O","Oxygen · 8"],["Na","Sodium · 11"],["Mg","Magnesium · 12"],["Cl","Chlorine · 17"],["Fe","Iron · 26"],["Cu","Copper · 29"],["Ag","Silver · 47"],["Au","Gold · 79"]]
}}
};
function tr(key){return translations[language][key]||key}
function renderLanguage(){document.documentElement.lang=language==="hi"?"hi":"en";$$("[data-i18n]").forEach(el=>el.textContent=tr(el.dataset.i18n));$("#language-toggle").textContent=language==="hi"?"EN":"हिं";}
function renderStrip(){const strip=$("#quick-strip");strip.innerHTML="";strips[subject].slice(0,9).forEach(symbol=>{const b=document.createElement("button");b.className="symbol-chip";b.type="button";b.textContent=symbol;b.dataset.insert=symbol;strip.append(b)})}
function setSubject(next){subject=next;$(".subject-tab").forEach(b=>{const active=b.dataset.subject===subject;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active))});$("#physics-fields").hidden=subject!=="physics";$("#expression-placeholder").textContent=subject==="math"?"x² + 5x + 6 = 0":subject==="physics"?"v = u + at":"2H₂ + O₂ →";input.placeholder=subject==="math"?"अपना सवाल यहाँ लिखें":subject==="physics"?"सूत्र या मान लिखें":"रासायनिक समीकरण लिखें";renderStrip();hideAnswer()}
function insertText(value){const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.setRangeText(value,start,end,"end");input.focus();input.dispatchEvent(new Event("input",{bubbles:true}))}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300)}
function hideAnswer(){answer.hidden=true}
function saveHistory(expression){if(!expression.trim())return;const item={expression:expression.trim(),subject,createdAt:Date.now(),status:language==="hi"?"हल उपलब्ध नहीं":"Solver not added"};historyItems=[item,...historyItems.filter(x=>x.expression!==item.expression||x.subject!==item.subject)].slice(0,20);try{localStorage.setItem("12thfail-history-v1",JSON.stringify(historyItems))}catch{}}
function loadHistory(){try{const parsed=JSON.parse(localStorage.getItem("12thfail-history-v1")||"[]");historyItems=Array.isArray(parsed)?parsed.slice(0,20):[]}catch{historyItems=[]}}
function submitExpression(){const value=input.value.trim();if(!value){showToast(language==="hi"?"पहले सवाल लिखें":"Enter a question first");input.focus();return}saveHistory(value);$("#answer-value").textContent="—";answer.hidden=false;$("#cannot-solve").hidden=false;$("#solution-preview-link").hidden=true;showToast(language==="hi"?"सवाल History में सुरक्षित है":"Question saved to History")}
function openSheet(type){activeSheet=type;renderSheet();sheet.hidden=false;document.body.style.overflow="hidden";$("#sheet-close").focus()}
function closeSheet(){sheet.hidden=true;document.body.style.overflow="";$("#more-open").focus()}
function renderSheet(){const data=sheetData[activeSheet];$("#sheet-title").textContent=activeSheet==="symbols"?"चिह्न और प्रतीक":activeSheet==="formulas"?"भौतिकी सूत्र":activeSheet==="templates"?"साँचे (Templates)":activeSheet==="more"&&subject==="chemistry"?"तत्व (Elements)":"और Tools";const tabs=$("#sheet-tabs");tabs.innerHTML="";data.tabs.forEach(tab=>{const b=document.createElement("button");b.className="sheet-tab"+((tab===subject||tab==="symbols"&&activeSheet==="symbols"||tab==="elements"&&activeSheet==="more"&&subject==="chemistry")?" active":"");b.type="button";b.textContent=tab==="symbols"?"चिह्न":tab==="formulas"?"सूत्र":tab==="elements"?"तत्व":tab==="math"?"गणित":tab==="physics"?"भौतिक":"रसायन";b.dataset.sheetTab=tab;tabs.append(b)});const list=(activeSheet==="more"&&subject==="chemistry"?[["H","Hydrogen · 1"],["He","Helium · 2"],["Li","Lithium · 3"],["Be","Beryllium · 4"],["B","Boron · 5"],["C","Carbon · 6"],["N","Nitrogen · 7"],["O","Oxygen · 8"],["F","Fluorine · 9"],["Ne","Neon · 10"],["Na","Sodium · 11"],["Mg","Magnesium · 12"],["Al","Aluminium · 13"],["Si","Silicon · 14"],["P","Phosphorus · 15"],["S","Sulfur · 16"],["Cl","Chlorine · 17"],["Ar","Argon · 18"]]:data.items[subject]||[]);const content=$("#sheet-content");content.classList.toggle("elements-grid",activeSheet==="more"&&subject==="chemistry");content.innerHTML="";list.forEach(([symbol,label])=>{const b=document.createElement("button");b.className="sheet-item";b.type="button";b.dataset.insert=symbol;b.innerHTML="<strong></strong><small></small>";$("strong",b).textContent=symbol;$("small",b).textContent=label;content.append(b)});const search=$("#sheet-search");search.value="";search.placeholder=activeSheet==="elements"?"तत्व खोजें...":"खोजें...";if(activeSheet==="history")renderHistory()}
function renderHistory(){const content=$("#sheet-content");content.innerHTML="";if(!historyItems.length){const p=document.createElement("p");p.className="history-empty";p.textContent=language==="hi"?"अभी कोई सवाल सेव नहीं है।":"No saved questions yet.";content.append(p);return}historyItems.forEach(item=>{const b=document.createElement("button");b.className="history-row";b.type="button";b.innerHTML="<span><strong></strong><small></small></span><em></em>";$("strong",b).textContent=item.expression;$("small",b).textContent=new Date(item.createdAt).toLocaleString(language==="hi"?"hi-IN":"en-IN");$("em",b).textContent=item.status;b.addEventListener("click",()=>{setSubject(item.subject);input.value=item.expression;closeSheet();hideAnswer();input.focus()});content.append(b)})}
function openHistory(){activeSheet="history";$("#sheet-title").textContent=language==="hi"?"आपकी History":"Your history";$("#sheet-tabs").innerHTML="";renderHistory();sheet.hidden=false;document.body.style.overflow="hidden"}
function switchSheetTab(tab){if(tab==="symbols"||tab==="formulas"||tab==="templates"||tab==="more"){activeSheet=tab;renderSheet();return}if(tab==="elements"){setSubject("chemistry");activeSheet="more";renderSheet();return}if(["math","physics","chemistry"].includes(tab)){setSubject(tab);renderSheet()}}
function showSolutionRoute(){const isPreview=location.hash==="#preview-solution";$("#main-screen").hidden=isPreview;$("#solution-screen").hidden=!isPreview;window.scrollTo(0,0)}
function showStep(index){const titles=[tr("stepOne"),tr("stepTwo"),tr("stepThree")];const detail=language==="hi"?"यह केवल layout preview है। वास्तविक गणना और सत्यापित विवरण solving engine जुड़ने के बाद आएँगे।":"Layout preview only. Verified working and calculations will be added with the solver.";$("#sheet-title").textContent=titles[index]||tr("steps");$("#sheet-tabs").innerHTML="";$("#sheet-content").innerHTML="";const p=document.createElement("p");p.className="history-empty";p.textContent=detail;$("#sheet-content").append(p);sheet.hidden=false;document.body.style.overflow="hidden"}
function speakSolution(){const text=language==="hi"?"यह हल स्क्रीन केवल डिज़ाइन पूर्वावलोकन है। वास्तविक हल अभी उपलब्ध नहीं है।":"This solution screen is a design preview. Real solutions are not available yet.";if(!("speechSynthesis"in window)){showToast(language==="hi"?"इस डिवाइस में Text to Speech उपलब्ध नहीं है":"Text to Speech is unavailable");return}const voices=speechSynthesis.getVoices();const local=voices.find(v=>v.localService&&(language==="hi"?v.lang.toLowerCase().startsWith("hi"):v.lang.toLowerCase().startsWith("en")));if(!local){showToast(language==="hi"?"ऑफलाइन आवाज़ उपलब्ध नहीं है":"No offline voice available");return}const utterance=new SpeechSynthesisUtterance(text);utterance.voice=local;utterance.lang=local.lang;speechSynthesis.cancel();speechSynthesis.speak(utterance)}
document.addEventListener("click",event=>{const key=event.target.closest("[data-key]");if(key){insertText(key.dataset.key);return}const insert=event.target.closest("[data-insert]");if(insert){insertText(insert.dataset.insert);if(activeSheet!=="history")closeSheet();return}const action=event.target.closest("[data-action]");if(action){if(action.dataset.action==="submit")submitExpression();if(action.dataset.action==="clear"){input.value="";hideAnswer();input.focus()}if(action.dataset.action==="backspace"){const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;if(start!==end)input.setRangeText("",start,end,"end");else if(start>0)input.setRangeText("",start-1,start,"end");input.focus()}return}const tab=event.target.closest("[data-sheet-tab]");if(tab){switchSheetTab(tab.dataset.sheetTab);return}const step=event.target.closest("[data-step]");if(step){showStep(Number(step.dataset.step));return}});
$$(".subject-tab").forEach(b=>b.addEventListener("click",()=>setSubject(b.dataset.subject)));
$("#clear-input")?.addEventListener("click",()=>{input.value="";hideAnswer();input.focus()});
$("#keyboard-toggle").addEventListener("click",()=>{input.focus();showToast(language==="hi"?"फोन का कीबोर्ड इस्तेमाल करें":"Use your phone keyboard")});
$("#language-toggle").addEventListener("click",()=>{language=language==="hi"?"en":"hi";renderLanguage();renderStrip();if(!sheet.hidden)activeSheet==="history"?openHistory():renderSheet()});
$("#more-open").addEventListener("click",()=>openSheet("symbols"));
$("#symbols-open").addEventListener("click",()=>openSheet("symbols"));
$("#more-tools-open").addEventListener("click",()=>openSheet(subject==="chemistry"?"more":"formulas"));
$("#templates-open").addEventListener("click",()=>openSheet("templates"));
$("#history-open").addEventListener("click",openHistory);
$("#history-open-bottom").addEventListener("click",openHistory);
$("#sheet-close").addEventListener("click",closeSheet);$("#sheet-search").addEventListener("input",e=>{$("#sheet-content .sheet-item").forEach(item=>{item.hidden=!item.textContent.toLowerCase().includes(e.target.value.toLowerCase())})});
sheet.addEventListener("click",e=>{if(e.target===sheet)closeSheet()});
$("#solution-back").addEventListener("click",()=>{location.hash="";showSolutionRoute()});
$("#solution-preview-link").addEventListener("click",()=>{location.hash="preview-solution"});
$("#speak-solution").addEventListener("click",speakSolution);
$("#simple-solution").addEventListener("click",()=>$("#solution-screen").classList.toggle("simple-reading"));
window.addEventListener("hashchange",showSolutionRoute);
function renderConnection(){const online=navigator.onLine;const controlled=Boolean(navigator.serviceWorker&&navigator.serviceWorker.controller);const label=online?(controlled?(language==="hi"?"ऑनलाइन · ऑफलाइन तैयार":"Online · offline ready"):(language==="hi"?"ऑनलाइन · सेटअप हो रहा है":"Online · setting up")):(controlled?(language==="hi"?"ऑफलाइन · ऐप उपलब्ध है":"Offline · app available"):(language==="hi"?"ऑफलाइन · पहली बार ऑनलाइन खोलें":"Offline · open online once"));$("#connection-status span").textContent=label}
window.addEventListener("online",renderConnection);
window.addEventListener("offline",renderConnection);
if("serviceWorker"in navigator)navigator.serviceWorker.addEventListener("controllerchange",renderConnection);
renderConnection();
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!sheet.hidden)closeSheet();if(e.key==="Enter"&&e.ctrlKey){e.preventDefault();submitExpression()}});
$("#physics-u").addEventListener("input",updatePhysicsPreview);$("#physics-a").addEventListener("input",updatePhysicsPreview);$("#physics-t").addEventListener("input",updatePhysicsPreview);function updatePhysicsPreview(){const u=Number($("#physics-u").value),a=Number($("#physics-a").value),t=Number($("#physics-t").value);$("#physics-v").textContent=[u,a,t].every(Number.isFinite)?String(u+a*t):"—"}loadHistory();renderLanguage();renderStrip();setSubject("math");updatePhysicsPreview();showSolutionRoute();
if("serviceWorker"in navigator){
 let refreshing=false,serviceRegistration=null;
 const updateBanner=$("#update-banner"),applyUpdate=$("#apply-update");
 function offerUpdate(worker){if(!worker)return;updateBanner.hidden=false;applyUpdate.onclick=()=>{applyUpdate.disabled=true;applyUpdate.textContent=language==="hi"?"अपडेट हो रहा है…":"Updating…";worker.postMessage({type:"SKIP_WAITING"})}}
 navigator.serviceWorker.addEventListener("controllerchange",()=>{if(refreshing)return;refreshing=true;location.reload()});
 navigator.serviceWorker.register("./sw.js").then(reg=>{
   serviceRegistration=reg;
   if(reg.waiting&&navigator.serviceWorker.controller)offerUpdate(reg.waiting);
   reg.addEventListener("updatefound",()=>{
     const installing=reg.installing;if(!installing)return;
     installing.addEventListener("statechange",()=>{
       if(installing.state==="installed"&&navigator.serviceWorker.controller)offerUpdate(reg.waiting||installing);
     });
   });
   window.addEventListener("load",()=>{if(serviceRegistration)serviceRegistration.update().catch(()=>{})});
 }).catch(()=>showToast(language==="hi"?"ऑफलाइन सेटअप पूरा नहीं हुआ":"Offline setup failed"));
}
})();