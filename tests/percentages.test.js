'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solve,UNSUPPORTED_MESSAGE}=require('../math/engine.js');
const reasons=JSON.parse(fs.readFileSync(path.join(__dirname,'..','reasons_hi.json'),'utf8'));
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'percentages-cases.json'),'utf8'));

test('Percentage independent test bank: 30 hand-verified cases',async(t)=>{
 for(const item of cases)await t.test(item.id+': '+item.input,()=>{
  const result=solve(item.input,reasons);
  if(item.expectedError){assert.equal(result.ok,false);assert.equal(result.message,UNSUPPORTED_MESSAGE);assert.equal(result.verified,false);}
  else{assert.equal(result.ok,true,result.message);assert.equal(result.answer,item.expected);assert.equal(result.verified,true);assert.ok(result.steps.some(step=>step.rule==='percentage'));assert.equal(result.steps.find(step=>step.rule==='percentage').reason,reasons.percentage);}
 });
});
test('percentage rule is fixed and available in Hindi',()=>{
 assert.equal(typeof reasons.percentage,'string');
 assert.ok(reasons.percentage.trim().length>0);
});
test('percentages remain exact and are verified by both evaluators',()=>{
 for(const input of ['0.1%','12.5%','1/3%','999999999999999999%']){
  const result=solve(input,reasons);assert.equal(result.ok,true,input);assert.equal(result.verified,true,input);
 }
});
