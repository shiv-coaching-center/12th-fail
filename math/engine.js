'use strict';

const UNSUPPORTED_MESSAGE = 'यह सवाल अभी हल नहीं कर सकता';
const MAX_INPUT_LENGTH = 200, MAX_TOKENS = 120, MAX_DIGITS = 100;

function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b!==0n)[a,b]=[b,a%b];return a||1n;}
function rat(n,d=1n){if(d===0n)throw Error('DIV_ZERO');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
const add=(a,b)=>rat(a.n*b.d+b.n*a.d,a.d*b.d);
const sub=(a,b)=>rat(a.n*b.d-b.n*a.d,a.d*b.d);
const mul=(a,b)=>rat(a.n*b.n,a.d*b.d);
function div(a,b){if(b.n===0n)throw Error('DIV_ZERO');return rat(a.n*b.d,a.d*b.n);}
const neg=a=>rat(-a.n,a.d);

function decimal(s){
  if(s.length>MAX_DIGITS||!/^[0-9]+(?:[.][0-9]+)?$/.test(s))throw Error('BAD_NUMBER');
  const p=s.split('.');
  if(p.length===1)return rat(BigInt(p[0]));
  const scale=10n**BigInt(p[1].length);
  return rat(BigInt(p[0])*scale+BigInt(p[1]),scale);
}
function format(v){
  if(v.d===1n)return v.n.toString();
  let d=v.d,t=0,f=0;
  while(d%2n===0n){d/=2n;t++;}
  while(d%5n===0n){d/=5n;f++;}
  if(d!==1n)return v.n.toString()+'/'+v.d.toString();
  const places=Math.max(t,f),scaled=v.n*(10n**BigInt(places))/v.d;
  const negative=scaled<0n,digits=(negative?-scaled:scaled).toString().padStart(places+1,'0');
  const whole=places?digits.slice(0,-places):digits;
  const fraction=places?digits.slice(-places).replace(/0+$/,''):'';
  return (negative?'-':'')+whole+(fraction?'.'+fraction:'');
}
function tokenize(input){
  if(typeof input!=='string'||!input.length||input.length>MAX_INPUT_LENGTH)throw Error('BAD_INPUT');
  const s=input.replace(/[×✕]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-'),out=[];
  let i=0;
  while(i<s.length){
    const c=s[i];if(/[ \t\r\n]/.test(c)){i++;continue;}
    if(/[0-9]/.test(c)){
      const start=i;while(/[0-9]/.test(s[i]||''))i++;
      if(s[i]==='.'){i++;const ds=i;while(/[0-9]/.test(s[i]||''))i++;if(i===ds)throw Error('BAD_NUMBER');}
      const raw=s.slice(start,i);out.push({type:'num',value:decimal(raw)});
    }else if('+-*/()'.includes(c)){
      out.push({type:c==='('? 'open':c===')'?'close':'op',value:c});i++;
    }else throw Error('UNSUPPORTED');
    if(out.length>MAX_TOKENS)throw Error('TOO_MANY');
  }
  if(!out.length)throw Error('EMPTY');return out;
}

function parse(tokens){
  let i=0;
  function primary(){
    const x=tokens[i++];if(!x)throw Error('END');
    if(x.type==='num')return {type:'num',v:x.value};
    if(x.type==='open'){const child=expr(0);if(!tokens[i]||tokens[i].type!=='close')throw Error('PAREN');i++;return {type:'group',child};}
    if(x.type==='op'&&(x.value==='+'||x.value==='-'))return {type:'unary',op:x.value,child:primary()};
    throw Error('VALUE');
  }
  function expr(min){
    let left=primary();
    while(tokens[i]&&tokens[i].type==='op'){
      const op=tokens[i].value,prec=(op==='+'||op==='-')?1:2;
      if(prec<min)break;i++;left={type:'bin',op,left,right:expr(prec+1)};
    }
    return left;
  }
  const tree=expr(0);if(i!==tokens.length)throw Error('EXTRA');return tree;
}
function evalTree(node,steps){
  if(node.type==='num')return node.v;
  if(node.type==='group'){const v=evalTree(node.child,steps);steps.push({expression:'('+format(v)+')',result:format(v),rule:'brackets'});return v;}
  if(node.type==='unary'){const a=evalTree(node.child,steps),v=node.op==='-'?neg(a):a;steps.push({expression:node.op+'('+format(a)+')',result:format(v),rule:'unary'});return v;}
  const a=evalTree(node.left,steps),b=evalTree(node.right,steps);
  const rule={'+':'addition','-':'subtraction','*':'multiplication','/':'division'}[node.op];
  const v=node.op==='+'?add(a,b):node.op==='-'?sub(a,b):node.op==='*'?mul(a,b):div(a,b);
  const symbol=node.op==='*'?'×':node.op==='/'?'÷':node.op;
  steps.push({expression:format(a)+' '+symbol+' '+format(b),result:format(v),rule});return v;
}

// Separate shunting-yard and postfix evaluator used only for verification.
function postfix(tokens){
  const out=[],ops=[],prec={'u+':3,'u-':3,'*':2,'/':2,'+':1,'-':1};let need=true;
  for(const x of tokens){
    if(x.type==='num'){if(!need)throw Error('OP');out.push(x);need=false;}
    else if(x.type==='open'){if(!need)throw Error('OP');ops.push('(');need=true;}
    else if(x.type==='close'){
      if(need)throw Error('CLOSE');while(ops.length&&ops[ops.length-1]!=='(')out.push({type:'op',value:ops.pop()});
      if(!ops.length)throw Error('PAREN');ops.pop();need=false;
    }else{
      let op=x.value;
      if(need){if(op!=='+'&&op!=='-')throw Error('VALUE');ops.push(op==='+'?'u+':'u-');}
      else{while(ops.length&&ops[ops.length-1]!=='('&&prec[ops[ops.length-1]]>=prec[op])out.push({type:'op',value:ops.pop()});ops.push(op);need=true;}
    }
  }
  if(need)throw Error('INCOMPLETE');
  while(ops.length){const op=ops.pop();if(op==='(')throw Error('PAREN');out.push({type:'op',value:op});}
  return out;
}
function evalPostfix(list){
  const st=[];
  for(const x of list){
    if(x.type==='num')st.push(x.value);
    else if(x.value==='u+'||x.value==='u-'){if(!st.length)throw Error('STACK');const a=st.pop();st.push(x.value==='u-'?neg(a):a);}
    else{if(st.length<2)throw Error('STACK');const b=st.pop(),a=st.pop();st.push(x.value==='+'?add(a,b):x.value==='-'?sub(a,b):x.value==='*'?mul(a,b):div(a,b));}
  }
  if(st.length!==1)throw Error('STACK');return st[0];
}
function solve(input,reasons){
  try{
    if(!reasons||typeof reasons!=='object')throw Error('REASONS');
    const tokens=tokenize(input),tree=parse(tokens),steps=[],primary=evalTree(tree,steps),check=evalPostfix(postfix(tokens));
    if(primary.n!==check.n||primary.d!==check.d)throw Error('VERIFY');
    const answer=format(primary);
    const safe=steps.map(s=>{if(typeof reasons[s.rule]!=='string'||!reasons[s.rule].trim())throw Error('REASON');return {...s,reason:reasons[s.rule]};});
    return {ok:true,answer,exact:{numerator:primary.n.toString(),denominator:primary.d.toString()},verified:true,steps:safe};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}
if(typeof module!=='undefined'&&module.exports)module.exports={solve,UNSUPPORTED_MESSAGE};
if(typeof window!=='undefined')window.TwelfthFailMath={solve,UNSUPPORTED_MESSAGE};
