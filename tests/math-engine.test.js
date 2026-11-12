'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solve,UNSUPPORTED_MESSAGE}=require('../math/engine.js');
const reasons=JSON.parse(fs.readFileSync(path.join(__dirname,'..','reasons_hi.json'),'utf8'));
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'bodmas-cases.json'),'utf8'));

test('BODMAS independent test bank: 40 hand-verified cases',async(t)=>{
 for(const item of cases)await t.test(item.id+': '+item.input,()=>{
  const result=solve(item.input,reasons);
  if(item.expectedError){assert.equal(result.ok,false);assert.equal(result.message,UNSUPPORTED_MESSAGE);assert.equal(result.verified,false);}
  else{assert.equal(result.ok,true,result.message);assert.equal(result.answer,item.expected);assert.equal(result.verified,true);for(const step of result.steps){assert.equal(typeof step.reason,'string');assert.ok(step.reason.length>0);assert.ok(Object.hasOwn(reasons,step.rule));}}
 });
});
test('unsupported tokens never produce an answer',()=>{
 for(const input of ['2^3','5%','3x+2','abc','','1..2','.5+1','5/']){const r=solve(input,reasons);assert.equal(r.ok,false,input);assert.equal(r.message,UNSUPPORTED_MESSAGE,input);}
});
test('every supported rule has a fixed Hindi reason',()=>{
 for(const key of ['addition','subtraction','multiplication','division','brackets','unary']){assert.equal(typeof reasons[key],'string');assert.ok(reasons[key].trim().length>0);}
});
test('finite decimals stay exact',()=>{
 const r=solve('0.1+0.2',reasons);assert.equal(r.answer,'0.3');assert.equal(r.exact.numerator,'3');assert.equal(r.exact.denominator,'10');
});
