'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solveLcmHcf,UNSUPPORTED_MESSAGE}=require('../math/engine.js');
const reasons=JSON.parse(fs.readFileSync(path.join(__dirname,'..','reasons_hi.json'),'utf8'));
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'lcm-hcf-cases.json'),'utf8'));
test('LCM/HCF independent test bank: 40 hand-verified integer pairs',async(t)=>{
 for(const item of cases)await t.test(item.id+': '+item.a+', '+item.b,()=>{
  const r=solveLcmHcf(item.a,item.b,reasons);
  assert.equal(r.ok,true);assert.equal(r.verified,true);
  assert.equal(r.hcf,item.expectedHcf);assert.equal(r.lcm,item.expectedLcm);
  for(const s of r.steps){assert.ok(s.reason.trim());assert.ok(Object.hasOwn(reasons,s.rule));}
 });
});
test('decimal, malformed and oversized inputs are rejected',()=>{
 for(const [a,b] of [['1.5','3'],['abc','4'],['','1'],['1e3','2'],['1'.repeat(500),'2']]){
  const r=solveLcmHcf(a,b,reasons);assert.equal(r.ok,false);assert.equal(r.message,UNSUPPORTED_MESSAGE);assert.equal(r.verified,false);
 }
});
test('fixed Hindi explanations exist for both number theory rules',()=>{
 for(const k of ['hcf_euclidean','lcm_product'])assert.ok(typeof reasons[k]==='string'&&reasons[k].trim());
});
