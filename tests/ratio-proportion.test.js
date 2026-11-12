'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solveRatio,solveProportion,UNSUPPORTED_MESSAGE}=require('../math/engine.js');
const reasons=JSON.parse(fs.readFileSync(path.join(__dirname,'..','reasons_hi.json'),'utf8'));
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'ratio-proportion-cases.json'),'utf8'));
test('Ratio simplification: 40 hand-verified cases',async(t)=>{
 for(const item of cases.ratio)await t.test(item.id+': '+item.a+':'+item.b,()=>{
  const r=solveRatio(item.a,item.b,reasons);assert.equal(r.ok,true);assert.equal(r.ratio,item.expected);assert.equal(r.verified,true);
  for(const s of r.steps){assert.ok(s.reason.trim());assert.ok(Object.hasOwn(reasons,s.rule));}
 });
});
test('Proportion missing-term solver: 40 hand-verified cases',async(t)=>{
 for(const item of cases.proportion)await t.test(item.id+': '+item.a+':'+item.b+' = '+item.c+':x',()=>{
  const r=solveProportion(item.a,item.b,item.c,reasons);assert.equal(r.ok,true);assert.equal(r.answer,item.expected);assert.equal(r.verified,true);
  for(const s of r.steps){assert.ok(s.reason.trim());assert.ok(Object.hasOwn(reasons,s.rule));}
 });
});
test('Ratio and proportion reject malformed and unsafe inputs',()=>{
 for(const [a,b] of [['1.5','3'],['3','0'],['-2','4'],['abc','3'],['1'.repeat(101),'2']]){
  const r=solveRatio(a,b,reasons);assert.equal(r.ok,false);assert.equal(r.message,UNSUPPORTED_MESSAGE);
 }
 for(const [a,b,c] of [['0','3','4'],['2','0','4'],['2','3','0'],['1.5','3','4'],['-2','3','4'],['x','2','3']]){
  const r=solveProportion(a,b,c,reasons);assert.equal(r.ok,false);assert.equal(r.message,UNSUPPORTED_MESSAGE);
 }
});
test('ratio and proportion fixed Hindi reasons are present',()=>{
 for(const key of ['ratio_reduce','proportion_cross_multiply','proportion_divide'])assert.ok(typeof reasons[key]==='string'&&reasons[key].trim());
});
