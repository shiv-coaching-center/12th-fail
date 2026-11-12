'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');

test('browser loads local math engine before app controller',()=>{
 const engineAt=html.indexOf('./math/engine.js?v=0.1.0');
 const appAt=html.indexOf('./app.js?v=0.3.0');
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
 assert.match(sw,/12th-fail-shell-v6/);
});
