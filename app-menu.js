(()=>{"use strict";
const triggerSelector="[data-app-menu-trigger]";
if(document.documentElement.dataset.featureMenuReady==="true")return;
document.documentElement.dataset.featureMenuReady="true";
const backdrop=document.createElement("div");
backdrop.className="app-menu-backdrop";
backdrop.hidden=true;
backdrop.innerHTML='<nav class="app-menu-panel" role="dialog" aria-modal="true" aria-label="फीचर सूची"><div class="app-menu-head"><strong>फीचर</strong><button class="app-menu-close" type="button" aria-label="बंद करें">×</button></div><div class="app-menu-list"><a class="app-menu-link" href="./index.html">मुख्य कैलकुलेटर</a><a class="app-menu-link" href="./index.html">प्रतिशत (Percentage)</a><a class="app-menu-link" href="./index.html">समीकरण (Equation)</a><a class="app-menu-link" href="./index.html">घात / वर्गमूल (Power)</a><a class="app-menu-link" href="./lcm-hcf.html">LCM / HCF</a><a class="app-menu-link" href="./ratio-proportion.html">अनुपात / समानुपात</a></div></nav>';
document.body.append(backdrop);
let lastTrigger=null;
function setOpen(open){
 backdrop.hidden=!open;
 document.body.classList.toggle("app-menu-open",open);
 document.querySelectorAll(triggerSelector).forEach(button=>button.setAttribute("aria-expanded",String(open)));
 if(open)backdrop.querySelector(".app-menu-close").focus();
 else if(lastTrigger&&lastTrigger.isConnected)lastTrigger.focus();
}
document.addEventListener("click",event=>{
 const trigger=event.target.closest(triggerSelector);
 if(trigger){event.preventDefault();lastTrigger=trigger;setOpen(backdrop.hidden);return}
 if(event.target.closest(".app-menu-close")){setOpen(false);return}
 if(event.target===backdrop){setOpen(false);return}
 if(event.target.closest(".app-menu-link"))setOpen(false);
});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!backdrop.hidden)setOpen(false)});
})();