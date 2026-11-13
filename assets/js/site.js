(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// mobile menu
const tg=$('.menu-toggle'),nav=$('#nav');
tg.addEventListener('click',()=>{const o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');tg.setAttribute('aria-expanded',false)}));
// hero video
const v=$('#heroVid'),vb=$('#vidToggle');
if(v&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause()}
if(v&&vb)vb.addEventListener('click',()=>{if(v.paused){v.play();vb.textContent='❚❚ Pause video';vb.setAttribute('aria-pressed','false')}else{v.pause();vb.textContent='▶ Play video';vb.setAttribute('aria-pressed','true')}});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
$$('.rv').forEach(el=>io.observe(el));
// service details
function showSvc(k,scroll){
  $$('.svc-detail').forEach(p=>p.classList.toggle('open',p.dataset.panel===k));
  $$('.svc-tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.svc===k));
  if(scroll&&$('#svc-detail'))$('#svc-detail').scrollIntoView({behavior:'smooth',block:'center'});
}
$$('[data-svc]:not(input)').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showSvc(el.dataset.svc,el.tagName==='A')}));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>showSvc(null)));
// process tabs
$$('[data-proc]').forEach(b=>b.addEventListener('click',()=>{
  $$('[data-proc]').forEach(x=>x.setAttribute('aria-selected',x===b));
  $$('[data-proc-panel]').forEach(p=>p.hidden=p.dataset.procPanel!==b.dataset.proc);
}));
// map hover
$$('.map .st').forEach(p=>{p.addEventListener('mouseenter',()=>p.classList.add('hl'));p.addEventListener('mouseleave',()=>p.classList.remove('hl'))});
// portal walkthrough tabs
$$('[data-wt]').forEach(b=>b.addEventListener('click',()=>{
  $$('[data-wt]').forEach(x=>x.setAttribute('aria-selected',x===b));
  $$('[data-wt-panel]').forEach(p=>p.hidden=p.dataset.wtPanel!==b.dataset.wt);
}));
// request form (preview only; posts nowhere). Lives on the home page only.
const f=$('#reqForm');if(!f)return;
{const q=new URLSearchParams(location.search),sv=q.get('service'),ur=q.get('priority');
 if(sv){const i=f.querySelector(`input[name=svc][value="${CSS.escape(sv)}"]`);if(i)i.checked=true}
 if(ur){const i=f.querySelector(`input[name=urg][value="${CSS.escape(ur)}"]`);if(i)i.checked=true}}
const steps=$$('fieldset',f),prog=$$('.req-prog span',f),prev=$('#prevBtn'),next=$('#nextBtn'),lbl=$('#stepLbl');
let cur=0;const files=[];
function render(){
  steps.forEach((s,i)=>s.hidden=i!==cur);
  prog.forEach((p,i)=>{p.className=i===cur?'on':i<cur?'done':''});
  prev.style.visibility=cur?'visible':'hidden';
  next.textContent=cur===steps.length-1?'Submit request (preview)':'Continue →';
  lbl.textContent=`Step ${cur+1} of ${steps.length}`;
  if(cur===3)buildReview();
}
function valid(){
  const req=$$('[required]',steps[cur]);let ok=true;
  req.forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.style.borderColor=bad?'#842e37':'';if(bad&&ok){i.focus();ok=false}});
  return ok;
}
function buildReview(){
  const d=new FormData(f),rows=[['Requester',`${d.get('name')||'—'} · ${d.get('role')}`],['Property',d.get('address')||'—'],['Type',`${d.get('ptype')} · ${d.get('occ')}`],['Service',d.get('svc')],['Priority',d.get('urg')],['Budget',d.get('budget')],['Timing',d.get('timing')],['Files',files.length?files.length+' attached':'None yet']];
  $('#review').innerHTML=rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${String(v).replace(/</g,'&lt;')}</dd></div>`).join('');
}
next.addEventListener('click',()=>{
  if(!valid())return;
  if(cur<steps.length-1){cur++;render();f.scrollIntoView({behavior:'smooth',block:'start'});return}
  steps.forEach(s=>s.hidden=true);$('#formNav').hidden=true;$('.req-prog',f).hidden=true;$('#doneMsg').hidden=false;
  $('#refNo').textContent='Preview reference: IVO-'+Date.now().toString(36).toUpperCase().slice(-6);
});
prev.addEventListener('click',()=>{if(cur){cur--;render()}});
$('#resetForm').addEventListener('click',()=>{f.reset();files.length=0;$('#files').innerHTML='';cur=0;$('#doneMsg').hidden=true;$('#formNav').hidden=false;$('.req-prog',f).hidden=false;render();emChk()});
// emergency alert
function emChk(){const e=f.querySelector('input[name=urg]:checked')?.value==='Emergency'||f.querySelector('input[name=svc]:checked')?.value==='Emergency response';$('#emAlert').classList.toggle('show',e)}
$$('input[name=urg],input[name=svc]',f).forEach(i=>i.addEventListener('change',emChk));
// files
const drop=$('#drop'),fin=$('#fileIn'),list=$('#files');
function add(fl){[...fl].forEach(file=>{files.push(file);const d=document.createElement('div');
  if(file.type.startsWith('image/')){const im=new Image();im.src=URL.createObjectURL(file);d.appendChild(im)}else{const x=document.createElement('span');x.className='doc';x.textContent=(file.name.split('.').pop()||'FILE').toUpperCase().slice(0,4);d.appendChild(x)}
  const n=document.createElement('span');n.textContent=file.name;d.appendChild(n);list.appendChild(d)});buildReview()}
drop.addEventListener('click',()=>fin.click());drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fin.click()}});
fin.addEventListener('change',()=>add(fin.files));
['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>add(e.dataTransfer.files));
f.addEventListener('submit',e=>e.preventDefault());
render();emChk();
})();
