'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');

test('browser loads local math engine before app controller',()=>{
 const engineAt=html.indexOf('./math/engine.js?v=0.2.0');
 const appAt=html.indexOf('./app.js?v=0.3.1');
 assert.ok(engineAt>=0 && appAt>engineAt);
});
test('solution screen has dynamic answer and step containers',()=>{
 assert.match(html,/id="solution-answer"/);
 assert.match(html,/id="step-list"/);
 assert.match(html,/id="steps-heading"/);
 assert.match(app,/stepList\.replaceChildren\(\)/);
});
test('equals and view steps both call verified engine',()=>{
 assert.match(app,/button\.dataset\.action === "equals"\) calculate\(\)/);
 assert.match(app,/currentResult \|\| await calculate\(\)/);
 assert.match(app,/result\.verified !== true/);
});
test('step explanations come from the fixed reasons file',()=>{
 assert.match(app,/fetch\("\.\/reasons_hi\.json"/);
 assert.match(app,/selectedStep\.reason/);
});
test('offline shell pre-caches engine and fixed reasons',()=>{
 assert.match(sw,/\.\/math\/engine\.js\?v=0\.1\.0/);
 assert.match(sw,/\.\/reasons_hi\.json/);
 assert.match(sw,/12th-fail-shell-v9/);
});

test('unsupported input uses a compact message and compact visual state',()=>{
 assert.match(app,/answerPreview\.textContent = "हल उपलब्ध नहीं"/);
 assert.match(app,/answerPreview\.classList\.add\("is-message"\)/);
 assert.match(app,/answer-result"\)\?\.classList\.add\("has-message"\)/);
 const css=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
 assert.match(css,/\.answer-preview\.is-message\s*\{[^}]*font-size:\s*clamp\(18px, 5vw, 23px\)/s);
 assert.match(css,/\.answer-result\.has-message/);
});

test('updated page and service worker force-refresh the compact message assets',()=>{
 assert.match(html,/style\.css\?v=0\.4\.1/);
 assert.match(html,/app\.js\?v=0\.3\.1/);
 assert.match(app,/sw\.js\?v=7/);
 assert.match(sw,/12th-fail-shell-v9/);
 assert.match(sw,/app\.js\?v=0\.3\.1/);
});
