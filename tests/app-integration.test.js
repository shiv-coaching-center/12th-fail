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
 assert.match(sw,/12th-fail-shell-v17/);
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
 assert.match(sw,/12th-fail-shell-v17/);
 assert.match(sw,/app\.js\?v=0\.4\.4/);
});


test('number-theory engine exports a verified LCM/HCF solver',()=>{
 const engine=require('../math/engine.js');
 assert.equal(typeof engine.solveLcmHcf,'function');
});
