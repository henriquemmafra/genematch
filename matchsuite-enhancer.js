(function(){
'use strict';
if(window.__matchSuiteEnhanced)return;window.__matchSuiteEnhanced=true;
const APPS=[['pharmamatch','PharmaMatch'],['genematch','GeneMatch'],['cellmatch','CellMatch'],['biochematch','BiochemMatch']];
const current=(location.pathname.split('/').filter(Boolean)[0]||'').toLowerCase();
function css(){
  if(document.getElementById('ms-style'))return;
  const s=document.createElement('style');s.id='ms-style';
  s.textContent=`
  .ms-picker{margin:10px 0 14px;font:inherit;color:inherit}
  .ms-picker details{border:1px solid rgba(127,127,127,.28);border-radius:12px;background:rgba(127,127,127,.06);overflow:hidden}
  .ms-picker summary{list-style:none;cursor:pointer;min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;font-weight:700}
  .ms-picker summary::-webkit-details-marker{display:none}
  .ms-picker summary:after{content:'▾';opacity:.65}.ms-picker details[open] summary:after{content:'▴'}
  .ms-body{border-top:1px solid rgba(127,127,127,.2);padding:10px 12px 12px}
  .ms-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:9px}
  .ms-actions button{min-height:40px;border:1px solid rgba(127,127,127,.32);border-radius:10px;padding:7px 12px;background:transparent;color:inherit;font:inherit;font-weight:650}
  .ms-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:7px 10px}
  .ms-opt{display:flex;align-items:center;gap:8px;min-height:40px;cursor:pointer}.ms-opt input{width:19px;height:19px}
  .ms-status{min-height:18px;margin-top:8px;font-size:.84em;opacity:.72}
  body{padding-bottom:calc(74px + env(safe-area-inset-bottom,0px))!important}
  .ms-footer{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:2147483647!important;box-sizing:border-box!important;width:100%!important;margin:0!important;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px))!important;border-top:1px solid rgba(127,127,127,.30)!important;background:rgba(255,255,255,.96)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);text-align:center!important;font:600 13px/1.35 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;color:#202124!important;box-shadow:0 -2px 12px rgba(0,0,0,.08)!important;display:block!important;visibility:visible!important;opacity:1!important;transform:none!important}
  @media(prefers-color-scheme:dark){.ms-footer{background:rgba(24,24,26,.96)!important;color:#f5f5f7!important;border-top-color:rgba(255,255,255,.18)!important}}
  .ms-footer-label{display:block;margin-bottom:3px;opacity:.58;font-size:10px;text-transform:uppercase;letter-spacing:.07em}
  .ms-links{display:flex;justify-content:center;align-items:center;gap:4px 8px;flex-wrap:wrap}
  .ms-footer a,.ms-footer a:visited{color:inherit!important;text-decoration:underline!important;text-underline-offset:3px;min-height:30px;display:inline-flex!important;align-items:center;padding:0 3px;pointer-events:auto!important}
  .ms-current{font-weight:800!important}
  .ms-sep{opacity:.28}
  @media(max-width:420px){.ms-list{grid-template-columns:1fr}.ms-footer{font-size:12px!important}.ms-links{gap:2px 6px}}
  `;
  document.head.appendChild(s);
}
function footer(){
  if(!document.body)return;
  let f=document.getElementById('ms-footer');
  if(f)return;
  f=document.createElement('footer');f.id='ms-footer';f.className='ms-footer';f.setAttribute('aria-label','Match Suite navigation');
  f.innerHTML='<span class="ms-footer-label">More Match games</span>';
  const d=document.createElement('nav');d.className='ms-links';
  APPS.forEach((a,i)=>{
    if(i){const sep=document.createElement('span');sep.className='ms-sep';sep.textContent='·';sep.setAttribute('aria-hidden','true');d.appendChild(sep)}
    const x=document.createElement('a');x.href='https://henriquemmafra.github.io/'+a[0]+'/';x.textContent=a[1];x.rel='noopener';
    if(a[0]===current){x.className='ms-current';x.setAttribute('aria-current','page')}
    d.appendChild(x);
  });
  f.appendChild(d);document.body.appendChild(f);
}
function allOpt(o){const t=((o.value||'')+' '+(o.textContent||'')).toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();return /\b(all topics|all subjects|all systems|all categories|todos os assuntos|todas as mat[eé]rias)\b/.test(t)||t==='all all'||t==='all'}
function score(s){if(s.disabled||s.options.length<3)return-Infinity;const labels=Array.from(s.labels||[]).map(x=>x.textContent||'').join(' ');const p=s.parentElement?(s.parentElement.textContent||'').slice(0,220):'';const m=[s.id,s.name,s.className,s.getAttribute('aria-label'),s.title,labels,p].filter(Boolean).join(' ').toLowerCase();let n=0;if(/topic|subject|system|category|organ|module|deck|assunto|mat[eé]ria|tema/.test(m))n+=10;if(/difficulty|level|mode|question count|language|sort/.test(m))n-=8;if(Array.from(s.options).some(allOpt))n+=6;return n}
function find(){return Array.from(document.querySelectorAll('select')).map(s=>[s,score(s)]).sort((a,b)=>b[1]-a[1]).find(x=>x[1]>=6)?.[0]||null}
function picker(sel){
  if(!sel||sel.dataset.msMulti)return;
  const opts=Array.from(sel.options),ao=opts.find(allOpt)||null,choices=opts.filter(o=>!o.disabled&&o.value!==''&&o!==ao);if(choices.length<2)return;
  sel.dataset.msMulti='1';sel.style.display='none';
  const w=document.createElement('div');w.className='ms-picker';w.dataset.matchsuiteUi='1';w.innerHTML='<details><summary><span>Topics</span><span class="ms-count"></span></summary><div class="ms-body"><div class="ms-actions"><button type="button" data-act="all">Select all</button><button type="button" data-act="clear">Clear</button></div><div class="ms-list"></div><div class="ms-status" aria-live="polite"></div></div></details>';
  const list=w.querySelector('.ms-list'),cnt=w.querySelector('.ms-count'),status=w.querySelector('.ms-status'),set=new Set(),isAll=ao&&sel.value===ao.value;
  choices.forEach(o=>{const on=isAll||o.selected;if(on)set.add(o.value);const l=document.createElement('label');l.className='ms-opt';const b=document.createElement('input');b.type='checkbox';b.value=o.value;b.checked=on;const sp=document.createElement('span');sp.textContent=o.textContent.trim();l.append(b,sp);list.appendChild(l)});
  if(!set.size){const v=choices.some(o=>o.value===sel.value)?sel.value:choices[0].value;set.add(v);list.querySelectorAll('input').forEach(b=>b.checked=set.has(b.value))}
  function count(){cnt.textContent=set.size===1?'1 selected':set.size+' selected';status.textContent=set.size?'':'Select at least one topic to continue.'}
  function native(v,fire){sel.value=v;if(fire)sel.dispatchEvent(new Event('change',{bubbles:true}))}
  function prime(random,fire){if(!set.size)return false;if(ao&&set.size===choices.length){native(ao.value,fire);return true}const v=Array.from(set);native((random||!set.has(sel.value))?v[Math.floor(Math.random()*v.length)]:sel.value,fire);return true}
  list.querySelectorAll('input').forEach(b=>b.addEventListener('change',()=>{b.checked?set.add(b.value):set.delete(b.value);count();prime(false,true)}));
  w.querySelector('[data-act="all"]').addEventListener('click',()=>{set.clear();choices.forEach(o=>set.add(o.value));list.querySelectorAll('input').forEach(b=>b.checked=true);count();prime(false,true)});
  w.querySelector('[data-act="clear"]').addEventListener('click',()=>{set.clear();list.querySelectorAll('input').forEach(b=>b.checked=false);count()});
  const re=/\b(start|begin|play|next|new|again|continue|shuffle|restart|generate|deal|draw|question|card|round|pr[oó]xim|novo|nova|come[cç]|jogar|continuar)\b/i;
  function action(t){const c=t.closest&&t.closest('button,input[type="button"],input[type="submit"],[role="button"],[onclick]');if(!c||c.closest('[data-matchsuite-ui="1"]'))return false;return re.test([c.textContent,c.value,c.id,c.className,c.getAttribute('aria-label'),c.title].filter(Boolean).join(' '))}
  document.addEventListener('click',e=>{if(!action(e.target))return;if(!set.size){e.preventDefault();e.stopImmediatePropagation();w.querySelector('details').open=true;status.textContent='Select at least one topic to continue.';return}prime(true,false)},true);
  document.addEventListener('submit',e=>{if(!set.size){e.preventDefault();e.stopImmediatePropagation();w.querySelector('details').open=true;return}prime(true,false)},true);
  sel.insertAdjacentElement('afterend',w);count();prime(false,false);
}
function init(){css();footer();picker(find())}
function keepFooter(){footer()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
const observer=new MutationObserver(()=>{if(!document.getElementById('ms-footer'))keepFooter()});
observer.observe(document.documentElement,{childList:true,subtree:true});
}());
