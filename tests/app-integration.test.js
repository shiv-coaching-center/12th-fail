'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');

test('browser loads local equation-enabled math engine before app controller',()=>{
 const engineAt=html.indexOf('./math/engine.js?v=0.4.0');
 const appAt=html.indexOf('./app.js?v=0.4.4');
 assert.ok(engineAt>=0 && appAt>engineAt);
});
test('solution screen has dynamic answer and step containers',()=>{
 assert.match(html,/id="solution-answer"/);
 assert.match(html,/id="step-list"/);
 assert.match(html,/id="steps-heading"/);
 assert.match(app,/stepList\.replaceChildren\(\)/);
});
test('calculator has a dedicated equation separator key distinct from variable x and multiplication',()=>{
 assert.match(html,/<button class="key extra" data-key="x"[^>]*>x<\/button>/);
 assert.match(html,/<button class="key extra" data-key="="[^>]*>x =<\/button>/);
 assert.match(html,/<button class="key operator" data-key="×"[^>]*>×<\/button>/);
});
test('keypad exposes square, square-root and equation-separator controls',()=>{
 assert.match(html,/<button class="key extra" data-key="\^2"[^>]*>x²<\/button>/);
 assert.match(html,/<button class="key extra" data-key="√\("[^>]*>√<\/button>/);
 assert.match(html,/<button class="key extra" data-key="="[^>]*>x =<\/button>/);
});
test('calculator routes equations to the verified equation solver',()=>{
 assert.ok(app.includes('const isEquation = currentExpression.includes("=");'));
 assert.ok(app.includes('const solver = isEquation ? math?.solveEquation : math?.solve;'));
 assert.match(html,/<button class="key extra" data-key="="[^>]*>x =<\/button>/);
 assert.match(app,/button\.dataset\.action === "equals"\) calculate\(\)/);
 assert.match(app,/result\.verified !== true/);
});
test('equation steps display transformation arrows and fixed Hindi reasons',()=>{
 assert.ok(app.includes('step.display || (step.expression + " = " + step.result)'));
 assert.ok(app.includes('selectedStep.display || (selectedStep.expression + " = " + selectedStep.result)'));
 assert.match(app,/selectedStep\.reason/);
});
test('step explanations load from the versioned local reasons file',()=>{
 assert.match(app,/fetch\("\.\/reasons_hi\.json\?v=0\.4\.0"/);
});
test('HTML navigation is network-first with an offline cache fallback',()=>{
 assert.match(sw,/request\.mode === "navigate"/);
 assert.match(sw,/fetch\(request\)\.then\(\(response\)/);
 assert.match(sw,/caches\.match\("\.\/index\.html"\)/);
});
test('offline shell pre-caches the equation engine and fixed reasons',()=>{
 assert.match(sw,/\.\/math\/engine\.js\?v=0\.4\.0/);
 assert.match(sw,/\.\/reasons_hi\.json\?v=0\.4\.0/);
 assert.match(sw,/12th-fail-shell-v26/);
});
test('unsupported input keeps the compact unavailable state',()=>{
 assert.match(app,/answerPreview\.textContent = "हल उपलब्ध नहीं"/);
 assert.match(app,/answerPreview\.classList\.add\("is-message"\)/);
 const css=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
 assert.match(css,/\.answer-preview\.is-message\s*\{[^}]*font-size:\s*clamp\(18px, 5vw, 23px\)/s);
 assert.match(css,/\.answer-result\.has-message/);
});
test('page and service worker force-refresh the equation app assets',()=>{
 assert.match(html,/style\.css\?v=0\.4\.1/);
 assert.match(html,/app\.js\?v=0\.4\.4/);
 assert.match(app,/sw\.js\?v=14/);
 assert.match(sw,/12th-fail-shell-v26/);
 assert.match(sw,/app\.js\?v=0\.4\.4/);
});


test('number-theory engine exports a verified LCM/HCF solver',()=>{
 const engine=require('../math/engine.js');
 assert.equal(typeof engine.solveLcmHcf,'function');
});


test('standalone LCM/HCF page is linked without replacing the original calculator',()=>{
 const page=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.html'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.css'),'utf8');
 const js=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.js'),'utf8');
 assert.match(html,/href="\.\/lcm-hcf\.html"/);
 assert.match(page,/LCM \(ल\.स\.\)/);assert.match(page,/HCF \(म\.स\.\)/);
 assert.match(page,/id="lcm-keypad"/);assert.match(page,/id="lcm-solution"/);
 assert.match(js,/verifyH=values\.reduce/);assert.match(js,/l%BigInt\(v\)/);assert.match(js,/primeFactors/);
 assert.match(css,/--green-dark:#075B35/);
});


test('LCM/HCF keypad uses a compact key height while preserving its button style',()=>{
 const css=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.css'),'utf8');
 const page=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.html'),'utf8');
 assert.match(css,/\.lcm-key\{[^}]*min-height:48px/);
 assert.match(css,/\.lcm-key\.equals\{[^}]*min-height:52px/);
 assert.match(page,/lcm-hcf\.css\?v=1\.0\.3/);
});


test('multi-number LCM accumulates using gcd of the running LCM and next value',()=>{
 const js=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.js'),'utf8');
 assert.match(js,/verifyL=\(verifyL\/gcd\(verifyL,b\)\)\*b/);
});


test('LCM/HCF verifies that every input is divisible by the calculated HCF',()=>{
 const js=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.js'),'utf8');
 assert.match(js,/BigInt\(v\)%h!==0n/);
 assert.match(js,/l%BigInt\(v\)!==0n/);
});


test('Ratio Proportion page is linked from calculator and LCM/HCF page',()=>{
 const page=fs.readFileSync(path.join(__dirname,'..','ratio-proportion.html'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'..','ratio-proportion.css'),'utf8');
 const js=fs.readFileSync(path.join(__dirname,'..','ratio-proportion.js'),'utf8');
 const lcm=fs.readFileSync(path.join(__dirname,'..','lcm-hcf.html'),'utf8');
 assert.match(html,/href="\.\/ratio-proportion\.html"/);
 assert.match(lcm,/href="\.\/ratio-proportion\.html"/);
 assert.match(page,/अनुपात \(Ratio\)/);assert.match(page,/समानुपात \(Proportion\)/);
 assert.match(page,/id="rp-keypad"/);assert.match(js,/solveRatioMany/);assert.match(js,/solveProportion/);
 assert.match(js,/i===1\?" = ":" : "/);
 assert.match(css,/--dark:#075B35/);
});
test('Ratio Proportion page assets are included in offline shell cache',()=>{
 assert.match(sw,/12th-fail-shell-v26/);
 assert.match(sw,/\.\/ratio-proportion\.html/);
 assert.match(sw,/\.\/ratio-proportion\.css\?v=1\.0\.0/);
 assert.match(sw,/\.\/ratio-proportion\.js\?v=1\.0\.2/);
});
