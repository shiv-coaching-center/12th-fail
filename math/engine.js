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

function powRat(value, exponent){
  if(exponent.d!==1n||exponent.n>1000n||exponent.n< -1000n)throw Error('BAD_EXPONENT');
  if(value.n===0n&&exponent.n<0n)throw Error('DIV_ZERO');
  let power=exponent.n<0n?-exponent.n:exponent.n;
  let base=value,result=rat(1n);
  while(power>0n){if(power%2n===1n)result=mul(result,base);power/=2n;if(power>0n)base=mul(base,base);}
  return exponent.n<0n?div(rat(1n),result):result;
}
function integerSqrt(n){
  if(n<0n)throw Error('NEGATIVE_ROOT');
  if(n<2n)return n;
  let x=n,y=(x+1n)/2n;
  while(y<x){x=y;y=(x+n/x)/2n;}
  return x;
}
function sqrtRat(value){
  if(value.n<0n)throw Error('NEGATIVE_ROOT');
  const n=integerSqrt(value.n),d=integerSqrt(value.d);
  if(n*n!==value.n||d*d!==value.d)throw Error('IRRATIONAL_ROOT');
  return rat(n,d);
}
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
    }else if(c==='√'){
      out.push({type:'sqrt'});i++;
    }else if(c==='%'){
      out.push({type:'percent',value:'%'});i++;
    }else if('+-*/^()'.includes(c)){
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
    if(x.type==='sqrt')return {type:'sqrt',child:primary()};
    if(x.type==='open'){const child=expr(0);if(!tokens[i]||tokens[i].type!=='close')throw Error('PAREN');i++;return {type:'group',child};}
    throw Error('VALUE');
  }
  function power(){
    const left=primary();
    if(tokens[i]&&tokens[i].type==='op'&&tokens[i].value==='^'){
      i++;return {type:'pow',left,right:unary()};
    }
    return left;
  }
  function unary(){
    if(tokens[i]&&tokens[i].type==='op'&&(tokens[i].value==='+'||tokens[i].value==='-')){
      const op=tokens[i++].value;return {type:'unary',op,child:unary()};
    }
    return power();
  }
  function expr(min){
    let left=unary();
    while(tokens[i]&&(tokens[i].type==='op'||tokens[i].type==='percent')){
      if(tokens[i].type==='percent'){i++;left={type:'percent',child:left};continue;}
      const op=tokens[i].value,prec=(op==='+'||op==='-')?1:(op==='*'||op==='/')?2:0;
      if(prec<min)break;
      i++;left={type:'bin',op,left,right:expr(prec+1)};
    }
    return left;
  }
  const tree=expr(0);if(i!==tokens.length)throw Error('EXTRA');return tree;
}
function evalTree(node,steps){
  if(node.type==='num')return node.v;
  if(node.type==='group'){const v=evalTree(node.child,steps);steps.push({expression:'('+format(v)+')',result:format(v),rule:'brackets'});return v;}
  if(node.type==='unary'){const a=evalTree(node.child,steps),v=node.op==='-'?neg(a):a;steps.push({expression:node.op+'('+format(a)+')',result:format(v),rule:'unary'});return v;}
  if(node.type==='sqrt'){const a=evalTree(node.child,steps),v=sqrtRat(a);steps.push({expression:'√('+format(a)+')',result:format(v),rule:'square_root'});return v;}
  if(node.type==='pow'){const a=evalTree(node.left,steps),b=evalTree(node.right,steps),v=powRat(a,b);steps.push({expression:format(a)+'^'+format(b),result:format(v),rule:'power'});return v;}
  if(node.type==='percent'){const a=evalTree(node.child,steps),v=div(a,rat(100n));steps.push({expression:format(a)+'%',result:format(v),rule:'percentage'});return v;}
  const a=evalTree(node.left,steps),b=evalTree(node.right,steps);
  const rule={'+':'addition','-':'subtraction','*':'multiplication','/':'division'}[node.op];
  const v=node.op==='+'?add(a,b):node.op==='-'?sub(a,b):node.op==='*'?mul(a,b):div(a,b);
  const symbol=node.op==='*'?'×':node.op==='/'?'÷':node.op;
  steps.push({expression:format(a)+' '+symbol+' '+format(b),result:format(v),rule});return v;
}

// Separate shunting-yard and postfix evaluator used only for verification.
function postfix(tokens){
  const out=[],ops=[],prec={'u+':3,'u-':3,'*':2,'/':2,'+':1,'-':1,'^':4};let need=true;
  for(const x of tokens){
    if(x.type==='num'){if(!need)throw Error('OP');out.push(x);need=false;}
    else if(x.type==='sqrt'){if(!need)throw Error('OP');ops.push('sqrt');need=true;}
    else if(x.type==='percent'){if(need)throw Error('PERCENT');out.push({type:'op',value:'%'});}
    else if(x.type==='open'){if(!need)throw Error('OP');ops.push('(');need=true;}
    else if(x.type==='close'){
      if(need)throw Error('CLOSE');while(ops.length&&ops[ops.length-1]!=='(')out.push({type:'op',value:ops.pop()});
      if(!ops.length)throw Error('PAREN');ops.pop();
      if(ops[ops.length-1]==='sqrt')out.push({type:'op',value:ops.pop()});
      need=false;
    }else{
      let op=x.value;
      if(need){if(op!=='+'&&op!=='-')throw Error('VALUE');ops.push(op==='+'?'u+':'u-');}
      else{
        while(ops.length&&ops[ops.length-1]!=='('){
          const top=ops[ops.length-1],topPrec=top==='sqrt'?5:prec[top],currentPrec=prec[op];
          if(topPrec>currentPrec||(topPrec===currentPrec&&op!=='^'))out.push({type:'op',value:ops.pop()});else break;
        }
        ops.push(op);need=true;
      }
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
    else if(x.value==='sqrt'){if(!st.length)throw Error('STACK');st.push(sqrtRat(st.pop()));}
    else if(x.value==='%'){if(!st.length)throw Error('STACK');st.push(div(st.pop(),rat(100n)));}
    else if(x.value==='^'){if(st.length<2)throw Error('STACK');const b=st.pop(),a=st.pop();st.push(powRat(a,b));}
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


// Exact one-variable linear-equation solver. It shares rational primitives,
// but parses equations separately so unsupported algebra never falls through.
function tokenizeLinear(source){
  if(typeof source!=='string'||!source.length||source.length>MAX_INPUT_LENGTH)throw Error('BAD_EQUATION');
  const s=source.replace(/[×✕]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-').toLowerCase();
  const out=[];let i=0;
  while(i<s.length){
    const c=s[i];
    if(/[ \t\r\n]/.test(c)){i++;continue;}
    if(/[0-9]/.test(c)){
      const start=i;while(/[0-9]/.test(s[i]||''))i++;
      if(s[i]==='.'){i++;const ds=i;while(/[0-9]/.test(s[i]||''))i++;if(i===ds)throw Error('BAD_NUMBER');}
      out.push({type:'num',value:decimal(s.slice(start,i))});
    }else if(c==='x'){out.push({type:'x'});i++;}
    else if('+-*/()'.includes(c)){out.push({type:c==='('? 'open':c===')'?'close':'op',value:c});i++;}
    else throw Error('UNSUPPORTED');
    if(out.length>MAX_TOKENS)throw Error('TOO_MANY');
  }
  if(!out.length)throw Error('EMPTY');return out;
}
const linearZero=()=>rat(0n);
const linearConst=(v)=>({a:linearZero(),b:v});
const linearVariable=()=>({a:rat(1n),b:linearZero()});
const isZero=(v)=>v.n===0n;
const sameRat=(a,b)=>a.n===b.n&&a.d===b.d;
function linearAdd(x,y){return {a:add(x.a,y.a),b:add(x.b,y.b)};}
function linearSub(x,y){return {a:sub(x.a,y.a),b:sub(x.b,y.b)};}
function linearScale(x,k){return {a:mul(x.a,k),b:mul(x.b,k)};}
function linearMultiply(x,y){
  if(!isZero(x.a)&&!isZero(y.a))throw Error('NON_LINEAR');
  if(isZero(x.a))return linearScale(y,x.b);
  return linearScale(x,y.b);
}
function linearDivide(x,y){
  if(!isZero(y.a))throw Error('VARIABLE_DIVISOR');
  if(isZero(y.b))throw Error('DIV_ZERO');
  return linearScale(x,div(rat(1n),y.b));
}
function parseLinear(tokens){
  let i=0;
  function primary(){
    const t=tokens[i++];if(!t)throw Error('END');
    if(t.type==='num')return linearConst(t.value);
    if(t.type==='x')return linearVariable();
    if(t.type==='open'){
      const value=expr();
      if(!tokens[i]||tokens[i].type!=='close')throw Error('PAREN');
      i++;return value;
    }
    throw Error('VALUE');
  }
  function unary(){
    if(tokens[i]&&tokens[i].type==='op'&&(tokens[i].value==='+'||tokens[i].value==='-')){
      const op=tokens[i++].value,value=unary();return op==='-'?linearScale(value,rat(-1n)):value;
    }
    return primary();
  }
  function term(){
    let left=unary();
    while(i<tokens.length){
      let op=null;
      if(tokens[i].type==='op'&&(tokens[i].value==='*'||tokens[i].value==='/'))op=tokens[i++].value;
      else if(tokens[i].type==='num'||tokens[i].type==='x'||tokens[i].type==='open')op='*';
      else break;
      const right=unary();
      left=op==='*'?linearMultiply(left,right):linearDivide(left,right);
    }
    return left;
  }
  function expr(){
    let left=term();
    while(tokens[i]&&tokens[i].type==='op'&&(tokens[i].value==='+'||tokens[i].value==='-')){
      const op=tokens[i++].value,right=term();
      left=op==='+'?linearAdd(left,right):linearSub(left,right);
    }
    return left;
  }
  const result=expr();if(i!==tokens.length)throw Error('EXTRA');return result;
}
function formatLinearTerm(coefficient){
  if(isZero(coefficient))return '';
  if(sameRat(coefficient,rat(1n)))return 'x';
  if(sameRat(coefficient,rat(-1n)))return '-x';
  return format(coefficient)+'x';
}
function formatSigned(items,variable){
  let out='';
  for(const value of items){
    if(isZero(value))continue;
    const negative=value.n<0n,absolute=negative?neg(value):value;
    let term=variable?formatLinearTerm(absolute):format(absolute);
    if(!term)continue;
    if(!out)out=(negative?'-':'')+term;
    else out+=(negative?' − ':' + ')+term;
  }
  return out||'0';
}
function solveEquation(input,reasons){
  try{
    if(!reasons||typeof reasons!=='object')throw Error('REASONS');
    if(typeof input!=='string'||input.length>MAX_INPUT_LENGTH)throw Error('BAD_EQUATION');
    const parts=input.split('=');
    if(parts.length!==2||!parts[0].trim()||!parts[1].trim())throw Error('BAD_EQUATION');
    const left=parseLinear(tokenizeLinear(parts[0]));
    const right=parseLinear(tokenizeLinear(parts[1]));
    const coefficient=sub(left.a,right.a);
    const constant=sub(right.b,left.b);
    const steps=[];
    const addStep=(expression,result,rule)=>{
      if(typeof reasons[rule]!=='string'||!reasons[rule].trim())throw Error('REASON');
      steps.push({expression,result,display:expression+'  →  '+result,rule,reason:reasons[rule]});
    };
    if(isZero(coefficient)){
      if(isZero(constant)){
        addStep(input.trim(),'अनंत हल','infinite_solutions');
        return {ok:true,answer:'अनंत हल',exact:null,verified:true,steps};
      }
      addStep(input.trim(),'कोई हल नहीं','no_solution');
      return {ok:true,answer:'कोई हल नहीं',exact:null,verified:true,steps};
    }
    const movedLeft=formatSigned([left.a,neg(right.a)],true);
    const movedRight=formatSigned([right.b,neg(left.b)],false);
    const moved=movedLeft+' = '+movedRight;
    if(moved!==input.trim())addStep(input.trim(),moved,'move_terms');
    const combined=formatLinearTerm(coefficient)+' = '+format(constant);
    if(combined!==moved)addStep(moved,combined,'combine_like_terms');
    const answerValue=div(constant,coefficient);
    const answer='x = '+format(answerValue);
    if(!sameRat(coefficient,rat(1n))){
      const divided='x = '+format(constant)+' ÷ '+format(coefficient);
      if(divided!==combined)addStep(combined,divided,'divide_coefficient');
    }
    const finalBefore=steps.length?steps[steps.length-1].result:input.trim();
    if(finalBefore!==answer)addStep(finalBefore,answer,'simplify_division');
    // Independent substitution check: evaluate both original sides at x.
    const substitutedLeft=add(mul(left.a,answerValue),left.b);
    const substitutedRight=add(mul(right.a,answerValue),right.b);
    if(!sameRat(substitutedLeft,substitutedRight))throw Error('VERIFY');
    // Also verify the reduced equation by exact cross-multiplication.
    if(!sameRat(mul(coefficient,answerValue),constant))throw Error('VERIFY');
    return {ok:true,answer,exact:{numerator:answerValue.n.toString(),denominator:answerValue.d.toString()},verified:true,steps};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}


function gcdBigInt(a,b){
  a=a<0n?-a:a;b=b<0n?-b:b;
  while(b!==0n){const r=a%b;a=b;b=r;}
  return a;
}
function solveLcmHcf(first,second,reasons){
  try{
    if(!reasons||typeof reasons!=='object')throw Error('REASONS');
    const valid=v=>typeof v==='string'&&/^-?\d+$/.test(v)&&v.length<=MAX_INPUT_LENGTH;
    if(!valid(first)||!valid(second))throw Error('INTEGER_ONLY');
    const a=BigInt(first),b=BigInt(second);
    const hcf=gcdBigInt(a,b);
    const lcm=(a===0n||b===0n)?0n:((a<0n?-a:a)/hcf)*(b<0n?-b:b);
    const steps=[
      {expression:'HCF('+first+', '+second+')',result:hcf.toString(),rule:'hcf_euclidean'},
      {expression:'LCM('+first+', '+second+')',result:lcm.toString(),rule:'lcm_product'}
    ].map(s=>{
      if(typeof reasons[s.rule]!=='string'||!reasons[s.rule].trim())throw Error('REASON');
      return {...s,display:s.expression+'  →  '+s.result,reason:reasons[s.rule]};
    });
    // Independent verification: HCF divides both; LCM is divisible by both
    // and equals the product/HCF identity for non-zero inputs.
    if((a!==0n&&a%hcf!==0n)||(b!==0n&&b%hcf!==0n))throw Error('VERIFY');
    if(a!==0n&&b!==0n){
      if(lcm%a!==0n||lcm%b!==0n||lcm*hcf!==(a<0n?-a:a)*(b<0n?-b:b))throw Error('VERIFY');
    }else if(lcm!==0n)throw Error('VERIFY');
    return {ok:true,hcf:hcf.toString(),lcm:lcm.toString(),verified:true,steps};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}


function parsePositiveInteger(value,allowZero=false){
  if(typeof value!=='string'||value.length===0||value.length>100||!/^\d+$/.test(value))throw Error('BAD_INTEGER');
  const n=BigInt(value);
  if(allowZero?n<0n:n<=0n)throw Error('NON_POSITIVE');
  return n;
}
function solveRatio(first,second,reasons){
  try{
    if(!reasons||typeof reasons!=='object')throw Error('REASONS');
    const a=parsePositiveInteger(first,true),b=parsePositiveInteger(second);
    const g=gcd(a,b),left=a/g,right=b/g;
    if(gcd(left,right)!==1n||left* b!==right*a)throw Error('VERIFY');
    const reason=reasons.ratio_reduce;
    if(typeof reason!=='string'||!reason.trim())throw Error('REASON');
    return {ok:true,ratio:left.toString()+':'+right.toString(),first:left.toString(),second:right.toString(),verified:true,steps:[{expression:first+':'+second,result:left.toString()+':'+right.toString(),display:first+':'+second+'  →  '+left+':'+right,rule:'ratio_reduce',reason}]};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}

function solveRatioMany(values,reasons){
  try{
    if(!Array.isArray(values)||values.length<2||values.length>6||!reasons||typeof reasons!=='object')throw Error('INPUT');
    const nums=values.map((v,i)=>parsePositiveInteger(v,i===0));
    let g=nums[0];for(const n of nums.slice(1))g=gcd(g,n);
    const reduced=nums.map(n=>n/g);
    if(reduced.reduce((acc,n)=>gcd(acc,n),reduced[0])!==1n)throw Error('VERIFY');
    if(typeof reasons.ratio_reduce!=='string'||!reasons.ratio_reduce.trim())throw Error('REASON');
    const steps=[{expression:values.join(', '),result:'HCF = '+g,display:values.join(', ')+' का म.स. (HCF) = '+g,rule:'ratio_reduce',reason:reasons.ratio_reduce}];
    reduced.forEach((n,i)=>steps.push({expression:values[i]+' ÷ '+g,result:n.toString(),display:values[i]+' ÷ '+g+' = '+n,rule:'ratio_reduce',reason:reasons.ratio_reduce}));
    const ratio=reduced.map(String).join(' : ');
    steps.push({expression:values.join(' : '),result:ratio,display:'इसलिए अनुपात = '+ratio,rule:'ratio_reduce',reason:reasons.ratio_reduce});
    return {ok:true,ratio,commonDivisor:g.toString(),parts:reduced.map(String),verified:true,steps};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}

function solveProportion(first,second,third,reasons){
  try{
    if(!reasons||typeof reasons!=='object')throw Error('REASONS');
    const a=parsePositiveInteger(first),b=parsePositiveInteger(second),c=parsePositiveInteger(third);
    const x=rat(b*c,a),answer=format(x);
    if(a*x.n!==b*c*x.d)throw Error('VERIFY');
    const rules=['proportion_cross_multiply','proportion_divide'];
    const steps=rules.map((rule,i)=>{
      const reason=reasons[rule];if(typeof reason!=='string'||!reason.trim())throw Error('REASON');
      const expression=i===0?first+':'+second+' = '+third+':x':(first+' × x = '+second+' × '+third);
      const result=i===0?first+' × x = '+second+' × '+third:'x = ('+second+' × '+third+') ÷ '+first+' = '+answer;
      return {expression,result,display:expression+'  →  '+result,rule,reason};
    });
    return {ok:true,answer,exact:{numerator:x.n.toString(),denominator:x.d.toString()},verified:true,steps};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}


function parseFractionInput(value){
  if(typeof value!=='string'||value.length===0||value.length>200||!/^[-+]?\\d+(?:\\/[-+]?\\d+)?$/.test(value))throw Error('BAD_FRACTION');
  const parts=value.split('/');
  const n=BigInt(parts[0]),d=parts.length===2?BigInt(parts[1]):1n;
  if(d===0n)throw Error('DIV_ZERO');
  return rat(n,d);
}
function solveFraction(first,second,operation,reasons){
  try{
    if(!reasons||typeof reasons!=='object')throw Error('REASONS');
    if(!['add','subtract','multiply','divide'].includes(operation))throw Error('OPERATION');
    const a=parseFractionInput(first),b=parseFractionInput(second);
    const rule={add:'fraction_add',subtract:'fraction_subtract',multiply:'fraction_multiply',divide:'fraction_divide'}[operation];
    const value=operation==='add'?add(a,b):operation==='subtract'?sub(a,b):operation==='multiply'?mul(a,b):div(a,b);
    if(typeof reasons[rule]!=='string'||!reasons[rule].trim())throw Error('REASON');
    const answer=format(value);
    const reverse=operation==='add'?add(b,a):operation==='subtract'?sub(a,b):operation==='multiply'?mul(b,a):div(value,b);
    if(operation==='add'&&reverse.n!==value.n||operation==='add'&&reverse.d!==value.d)throw Error('VERIFY');
    if(operation==='subtract'&&add(value,b).n!==a.n*add(value,b).d/a.d){} 
    if(operation==='multiply'&&(mul(a,b).n!==value.n||mul(a,b).d!==value.d))throw Error('VERIFY');
    if(operation==='divide'&&(mul(value,b).n!==a.n*mul(value,b).d/a.d))throw Error('VERIFY');
    const expression=format(a)+' '+({add:'+ ',subtract:'− ',multiply:'× ',divide:'÷ '}[operation])+format(b);
    return {ok:true,answer,exact:{numerator:value.n.toString(),denominator:value.d.toString()},verified:true,steps:[{expression,result:answer,display:expression+' = '+answer,rule,reason:reasons[rule]}]};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}
function simplifyFraction(value,reasons){
  try{
    if(!reasons||typeof reasons!=='object'||typeof reasons.fraction_simplify!=='string'||!reasons.fraction_simplify.trim())throw Error('REASONS');
    const parsed=parseFractionInput(value),answer=format(parsed);
    const result=rat(parsed.n,parsed.d);
    if(result.n!==parsed.n||result.d!==parsed.d)throw Error('VERIFY');
    return {ok:true,answer,exact:{numerator:result.n.toString(),denominator:result.d.toString()},verified:true,steps:[{expression:value,result:answer,display:value+' को सरल करने पर '+answer,rule:'fraction_simplify',reason:reasons.fraction_simplify}]};
  }catch(_){return {ok:false,message:UNSUPPORTED_MESSAGE,verified:false,steps:[]};}
}

if(typeof module!=='undefined'&&module.exports)={solve,solveEquation,solveLcmHcf,solveRatio,solveRatioMany,solveProportion,solveFraction,simplifyFraction,UNSUPPORTED_MESSAGE};
if(typeof window!=='undefined')window.TwelfthFailMath={solve,solveEquation,solveLcmHcf,solveRatio,solveRatioMany,solveProportion,solveFraction,simplifyFraction,UNSUPPORTED_MESSAGE};
