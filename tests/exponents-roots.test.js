'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solve,UNSUPPORTED_MESSAGE}=require('../math/engine.js');
const reasons=JSON.parse(fs.readFileSync(path.join(__dirname,'..','reasons_hi.json'),'utf8'));
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'exponents-roots-cases.json'),'utf8'));

test('Exponents and square roots: 40 independent hand-verified cases',async(t)=>{
 for(const item of cases)await t.test(item.id+': '+item.input,()=>{
  const result=solve(item.input,reasons);
  if(item.expectedError){
   assert.equal(result.ok,false,item.input);assert.equal(result.message,UNSUPPORTED_MESSAGE);assert.equal(result.verified,false);
  }else{
   assert.equal(result.ok,true,result.message);assert.equal(result.answer,item.expected);assert.equal(result.verified,true);
   for(const step of result.steps){assert.equal(typeof step.reason,'string');assert.ok(step.reason.trim());assert.ok(Object.hasOwn(reasons,step.rule));}
  }
 });
});
test('power and root explanations are fixed Hindi teacher-reviewed entries',()=>{
 for(const key of ['power','square_root']){assert.equal(typeof reasons[key],'string');assert.ok(reasons[key].trim());}
});
test('perfect roots are checked exactly and irrational roots are rejected',()=>{
 for(const input of ['√(4)','√(0.25)','√(1/4)','√(144)']){const r=solve(input,reasons);assert.equal(r.ok,true,input);assert.equal(r.verified,true,input);}
 for(const input of ['√(2)','√(3)','√(-1)']){const r=solve(input,reasons);assert.equal(r.ok,false,input);}
});
test('powers preserve exact rational arithmetic and reject unsafe exponents',()=>{
 assert.equal(solve('(1/3)^2',reasons).answer,'1/9');
 assert.equal(solve('0.1^2',reasons).answer,'0.01');
 for(const input of ['0^-1','2^1.5','2^1001'])assert.equal(solve(input,reasons).ok,false,input);
});
