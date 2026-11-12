'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solveEquation,UNSUPPORTED_MESSAGE}=require('../math/engine.js');
const reasons=JSON.parse(fs.readFileSync(path.join(__dirname,'..','reasons_hi.json'),'utf8'));
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'linear-equations-cases.json'),'utf8'));

test('Linear equation independent test bank: 37 hand-verified cases',async(t)=>{
 for(const item of cases)await t.test(item.id+': '+item.input,()=>{
  const result=solveEquation(item.input,reasons);
  if(item.expectedError){
   assert.equal(result.ok,false);assert.equal(result.message,UNSUPPORTED_MESSAGE);assert.equal(result.verified,false);
  }else{
   assert.equal(result.ok,true,result.message);assert.equal(result.answer,item.expected);assert.equal(result.verified,true);
   for(const step of result.steps){assert.equal(typeof step.reason,'string');assert.ok(step.reason.trim());assert.ok(Object.hasOwn(reasons,step.rule));}
  }
 });
});
test('equation solver verifies the original equation by exact substitution',()=>{
 for(const input of ['2x-5=11','2x+3=x+8','x/2+3=7','0.1x+0.2=0.5']){
  const result=solveEquation(input,reasons);assert.equal(result.ok,true,input);assert.equal(result.verified,true,input);
 }
});
test('no-solution and infinite-solution cases are distinguished',()=>{
 assert.equal(solveEquation('x+1=x+2',reasons).answer,'कोई हल नहीं');
 assert.equal(solveEquation('2x+5=2x+5',reasons).answer,'अनंत हल');
});
test('equation explanations are fixed teacher-reviewable Hindi text',()=>{
 for(const key of ['move_terms','combine_like_terms','divide_coefficient','simplify_division','no_solution','infinite_solutions']){
  assert.equal(typeof reasons[key],'string',key);assert.ok(reasons[key].trim().length>0,key);
 }
});
