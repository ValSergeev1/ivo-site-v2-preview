(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// mobile menu (header + bottom-sheet)
const tg=$('.menu-toggle'),nav=$('#nav');
function setMenu(open){
  if(!nav)return;
  nav.classList.toggle('open',open);
  document.body.classList.toggle('menu-open',open);
  if(tg)tg.setAttribute('aria-expanded',open?'true':'false');
  $$('[data-open-menu]').forEach(b=>b.setAttribute('aria-expanded',open?'true':'false'));
  if(open){nav.scrollTop=0}
}
if(tg)tg.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
$$('[data-open-menu]').forEach(b=>b.addEventListener('click',()=>setMenu(!nav.classList.contains('open'))));
const scrim=$('.menu-scrim');
if(scrim)scrim.addEventListener('click',()=>setMenu(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
// sticky header hairline
const hdr=$('header.site');
if(hdr){
  const onScroll=()=>hdr.classList.toggle('is-scrolled',window.scrollY>8);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
}
// hero video: play on all screen sizes unless the user prefers less motion
const v=$('#heroVid'),vb=$('#vidToggle');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function syncVidBtn(){
  if(!vb)return;
  if(v.paused){vb.textContent='▶ Play video';vb.setAttribute('aria-pressed','true')}
  else{vb.textContent='❚❚ Pause video';vb.setAttribute('aria-pressed','false')}
}
function playHero(){return v.play().then(syncVidBtn,syncVidBtn)}
if(v){
  if(reduce){syncVidBtn()}
  else{
    const start=()=>{if(v.paused)playHero()};
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        v.preload='auto';
        if(v.readyState>=3)start();
        else v.addEventListener('canplay',start,{once:true});
        const idle=window.requestIdleCallback||(cb=>setTimeout(cb,1));
        idle(start);
      });
    });
  }
}
if(v&&vb)vb.addEventListener('click',()=>{if(v.paused)playHero();else{v.pause();syncVidBtn()}});
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
// lazy posters for below-fold videos
if('IntersectionObserver' in window){
  const po=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(!e.isIntersecting)return;
      const v=e.target, src=v.getAttribute('data-poster');
      if(src && !v.getAttribute('poster')) v.setAttribute('poster', src);
      po.unobserve(v);
    });
  },{rootMargin:'240px'});
  $$('video[data-poster]').forEach(v=>po.observe(v));
}else{
  $$('video[data-poster]').forEach(v=>{if(!v.getAttribute('poster')) v.setAttribute('poster', v.getAttribute('data-poster'));});
}
// request form. Lives on the home page only.
// Sending: the IVO platform (assets/js/ivo-api.js, IVO_API_BASE) when configured and reachable; otherwise
// window.IVO_FORM_ENDPOINT, a handler URL or a mailto: address (the fallback).
const f=$('#reqForm');if(!f)return;
{const q=new URLSearchParams(location.search),sv=q.get('service'),ur=q.get('priority');
 if(sv){const i=f.querySelector(`input[name=svc][value="${CSS.escape(sv)}"]`);if(i)i.checked=true}
 if(ur){const i=f.querySelector(`input[name=urg][value="${CSS.escape(ur)}"]`);if(i)i.checked=true}}
const steps=$$('fieldset',f),prog=$$('.req-prog span',f),prev=$('#prevBtn'),next=$('#nextBtn'),lbl=$('#stepLbl');
const doneMsg=$('#doneMsg'),doneTitle=$('#doneTitle'),doneBody=$('#doneBody'),formAlert=$('#formAlert'),formNav=$('#formNav');
let cur=0;const files=[];let sending=false;let apiKey=null;
function formEndpoint(){return String(window.IVO_FORM_ENDPOINT||"").trim()}
function hideAlert(){if(formAlert){formAlert.hidden=true;formAlert.textContent=""}}
function showAlert(msg){
  if(!formAlert)return;
  formAlert.hidden=false;
  formAlert.textContent=msg;
  formAlert.scrollIntoView({behavior:'smooth',block:'center'});
}
function showDone(title,body){
  hideAlert();
  steps.forEach(s=>s.hidden=true);
  if(formNav)formNav.hidden=true;
  const bar=$('.req-prog',f);if(bar)bar.hidden=true;
  if(doneTitle)doneTitle.textContent=title;
  if(doneBody)doneBody.textContent=body;
  if(doneMsg)doneMsg.hidden=false;
  if(doneMsg)doneMsg.scrollIntoView({behavior:'smooth',block:'start'});
}
function render(){
  steps.forEach((s,i)=>s.hidden=i!==cur);
  prog.forEach((p,i)=>{p.className=i===cur?'on':i<cur?'done':''});
  prev.style.visibility=cur?'visible':'hidden';
  next.disabled=sending;
  next.textContent=sending?'Sending…':(cur===steps.length-1?'Submit request':'Continue →');
  lbl.textContent=`Step ${cur+1} of ${steps.length}`;
  if(cur===3)buildReview();
}
function valid(){
  const req=$$('[required]',steps[cur]);let ok=true;
  req.forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.style.borderColor=bad?'#842e37':'';if(bad&&ok){i.focus();ok=false}});
  return ok;
}
function buildReview(){
  const d=new FormData(f),rows=[['Requester',`${d.get('name')||'—'} · ${d.get('role')}`],['Property',[d.get('address'),d.get('city'),d.get('state')].filter(Boolean).join(', ')||'—'],['Type',`${d.get('ptype')} · ${d.get('occ')}`],['Service',d.get('svc')],['Priority',d.get('urg')],['Budget',d.get('budget')],['Timing',d.get('timing')],['Files',files.length?files.length+' attached':'None yet']];
  $('#review').innerHTML=rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${String(v).replace(/</g,'&lt;')}</dd></div>`).join('');
}
function requestPayload(){
  const data=new FormData(f);
  if(!data.get('smsUpdates')) data.set('smsUpdates','no');
  files.forEach(file=>data.append('files',file,file.name));
  data.set('source',location.href);
  data.set('form','ivo-service-request');
  return data;
}
function field(data,key){const v=data.get(key);return (v==null||String(v).trim()==="")?"(not provided)":String(v).trim()}
function requestSubject(data){
  const name=field(data,'name');
  const company=field(data,'company');
  if(company==="(not provided)") return `IVO service request – ${name}`;
  return `IVO service request – ${name} – ${company}`;
}
function requestSummary(data){
  const fileNote=files.length
    ? `${files.length} selected on the form (please attach ${files.length===1?"it":"them"} in your email app before sending)`
    : "None selected on the form (please attach any photos, plans or files in your email app before sending)";
  const lines=[
    "IVO service request",
    "",
    "Requester",
    `Name: ${field(data,"name")}`,
    `I am a: ${field(data,"role")}`,
    `Company: ${field(data,"company")}`,
    `Email: ${field(data,"email")}`,
    `Phone: ${field(data,"phone")}`,
    "",
    "Property",
    `Address: ${field(data,"address")}`,
    `City: ${field(data,"city")}`,
    `State: ${field(data,"state")}`,
    `Property type: ${field(data,"ptype")}`,
    `Occupancy during work: ${field(data,"occ")}`,
    `Access notes: ${field(data,"access")}`,
    "",
    "The need",
    `Service path: ${field(data,"svc")}`,
    `Priority: ${field(data,"urg")}`,
    `Description: ${field(data,"desc")}`,
    `Budget range: ${field(data,"budget")}`,
    `Target timing: ${field(data,"timing")}`,
    `Text me status updates: ${field(data,"smsUpdates")==="yes"?"Yes":"No"}`,
    `Photos, plans or files: ${fileNote}`,
    "",
    "Source page: "+field(data,"source")
  ];
  return lines.join("\n");
}
// The service path on the form picks the platform's starting trade; staff re-classify the request when they review it.
const SVC_TRADE={'Commercial construction':'general_contracting','Property services':'handyman','Emergency response':'restoration','Specialty':'general_contracting','Bid invitation':'general_contracting'};
const URGENCY={'Emergency':'emergency','Urgent':'urgent','Standard':'standard','Planned':'planned'};
function text(data,key){return String(data.get(key)||'').trim()}
function apiRequest(data){
  const extra=[
    ['I am a',text(data,'role')],['Service path',text(data,'svc')],['Property type',text(data,'ptype')],
    ['Occupancy during work',text(data,'occ')],['Access notes',text(data,'access')],['Budget range',text(data,'budget')],
    ['Target timing',text(data,'timing')],['Text me status updates',text(data,'smsUpdates')==='yes'?'Yes':'No']
  ].filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`);
  const p={
    contactName:text(data,'name'),contactEmail:text(data,'email'),
    trade:SVC_TRADE[text(data,'svc')]||'general_contracting',region:text(data,'state'),city:text(data,'city'),
    scope:(text(data,'desc')+'\n\n'+extra.join('\n')).slice(0,5000),
    urgency:URGENCY[text(data,'urg')]||'standard',website:text(data,'website')
  };
  if(text(data,'phone'))p.contactPhone=text(data,'phone').slice(0,40);
  if(text(data,'company'))p.companyName=text(data,'company').slice(0,200);
  if(text(data,'address'))p.addressLine1=text(data,'address').slice(0,300);
  return p;
}
// "Invite IVO to bid" goes to the estimating team (Bidding), not to service dispatch.
function apiBidInvitation(data){
  const p=apiRequest(data);
  const b={contactName:p.contactName,contactEmail:p.contactEmail,city:p.city||undefined,scope:p.scope,website:p.website};
  if(['WA','OR','ID'].includes(p.region))b.region=p.region;
  if(p.contactPhone)b.contactPhone=p.contactPhone;
  if(p.companyName)b.companyName=p.companyName;
  return b;
}
/** Tries the platform. Returns true when the request is handled (received, or refused with a message shown). */
async function sendToPlatform(data){
  const api=window.IVO_API;
  if(!api||!api.configured()||!api.filesFit(files))return false;
  const bid=text(data,'svc')==='Bid invitation';
  if(!bid&&(!['WA','OR','ID'].includes(text(data,'state'))||!text(data,'city')))return false;
  apiKey=apiKey||api.newKey();
  sending=true;render();hideAlert();
  const r=bid
    ?await api.post('/public/bid-invitations',apiBidInvitation(data),files,apiKey)
    :await api.post('/public/requests',apiRequest(data),files,apiKey);
  sending=false;
  if(r.kind==='ok'){
    apiKey=null;
    if(bid)showDone(
      'Bid invitation received.',
      `Your reference is ${r.ref}. Our estimating team will review it and reply from bid@ivoservgroup.com. You can also send plans and addenda to bid@ivoservgroup.com.`
    );
    else showDone(
      'Request received.',
      `Your reference is ${r.ref}. We will follow up at ${text(data,'email')||'the email you entered'}. If this is an emergency, please call (206) 539-9549 now — a form does not dispatch a crew.`
    );
    return true;
  }
  render();
  if(r.kind==='rejected'){
    showAlert(`${r.message} You can correct the form and try again, call (206) 539-9549, or email office@ivoservgroup.com.`);
    return true;
  }
  return false;
}
async function submitRequest(){
  if(sending)return;
  const endpoint=formEndpoint();
  const data=requestPayload();
  if(text(data,'website'))return; // honeypot
  if(await sendToPlatform(data))return;
  const email=data.get('email')||'the email you entered';
  if(!endpoint){
    showDone(
      'This form is not sending yet.',
      'Until a destination is connected, please call (206) 539-9549 or email office@ivoservgroup.com with the details you entered. If this is an emergency, please call — a form does not dispatch a crew.'
    );
    return;
  }
  if(/^mailto:/i.test(endpoint)){
    // Bid invitations go to the estimating inbox; everything else to the office.
    const addr=text(data,'svc')==='Bid invitation'?'bid@ivoservgroup.com':endpoint.replace(/^mailto:/i,'').split('?')[0];
    const subject=encodeURIComponent(requestSubject(data));
    const body=requestSummary(data);
    window.location.href=`mailto:${addr}?subject=${subject}&body=${encodeURIComponent(body)}`;
    showDone(
      'Your email app should open next.',
      `Please attach any photos, plans or files in your email app before you send — they are not included automatically. If the message does not open, send the same information to ${addr} and attach the files there. If this is an emergency, call (206) 539-9549.`
    );
    return;
  }
  sending=true;render();hideAlert();
  try{
    const res=await fetch(endpoint,{method:'POST',body:data});
    if(!res.ok) throw new Error(String(res.status));
    sending=false;
    showDone(
      'Request received.',
      `Thank you. We will follow up at ${email}. If this is an emergency, please call (206) 539-9549 now — a form does not dispatch a crew.`
    );
  }catch(err){
    sending=false;render();
    showAlert('We could not send this just now. Call (206) 539-9549 or email office@ivoservgroup.com, and you can try the form again.');
  }
}
next.addEventListener('click',()=>{
  if(!valid())return;
  if(cur<steps.length-1){cur++;render();f.scrollIntoView({behavior:'smooth',block:'start'});return}
  submitRequest();
});
prev.addEventListener('click',()=>{if(cur){cur--;render()}});
$('#resetForm').addEventListener('click',()=>{
  f.reset();files.length=0;$('#files').innerHTML='';cur=0;sending=false;apiKey=null;hideAlert();
  if(doneMsg)doneMsg.hidden=true;if(formNav)formNav.hidden=false;
  const bar=$('.req-prog',f);if(bar)bar.hidden=false;
  render();emChk();
});
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

/* On small screens, start FAQs collapsed so pages are shorter; everything stays reachable. */
(() => {
  const q = window.matchMedia("(max-width:600px)");
  function collapse() {
    if (!q.matches) return;
    document.querySelectorAll(".faq-grid details[open], .faq-sec details[open], details.m-acc[open]").forEach((d, i) => {
      if (i === 0) return; // keep the first one open as a cue
      d.removeAttribute("open");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", collapse);
  else collapse();
})();

// product showcase tabs
(() => {
  const root = document.querySelector("[data-platform]");
  if (!root) return;
  const tabs = [...root.querySelectorAll("[data-plat]")];
  const panels = [...root.querySelectorAll("[data-plat-panel]")];
  const marks = [...root.querySelectorAll("[data-plat-step]")];
  function show(key) {
    tabs.forEach((b) => b.setAttribute("aria-selected", b.dataset.plat === key ? "true" : "false"));
    panels.forEach((p) => { p.hidden = p.dataset.platPanel !== key; });
    marks.forEach((li) => li.classList.toggle("on", li.dataset.platStep === key));
  }
  tabs.forEach((b) => b.addEventListener("click", () => show(b.dataset.plat)));
})();

/* Same-origin fallback fade when the View Transitions API is not available. */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  if (window.matchMedia("(max-width:760px)").matches) return; // phones: open the next page straight away
  if ("startViewTransition" in document) return;
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    document.documentElement.classList.add("page-leave");
    setTimeout(() => { location.href = a.href; }, 180);
  });
})();
// Phones: long supporting paragraphs collapse under "Learn more"; the lead line stays visible.
(()=>{
  const mq=matchMedia('(max-width:600px)');
  const hosts=[...document.querySelectorAll('.split>div:not(.split-img),.det')];
  function wrap(){
    hosts.forEach(h=>{
      if(h.querySelector(':scope>details.m-more'))return;
      const lead=h.querySelector(':scope>p.lead');if(!lead)return;
      const ps=[...h.querySelectorAll(':scope>p:not(.lead)')].filter(p=>!p.classList.contains('more-row'));
      if(!ps.length||ps.reduce((n,p)=>n+p.textContent.length,0)<160)return;
      const d=document.createElement('details');d.className='m-more';
      const s=document.createElement('summary');s.textContent='Learn more';d.appendChild(s);
      ps[0].before(d);ps.forEach(p=>d.appendChild(p));
    });
  }
  function unwrap(){
    document.querySelectorAll('details.m-more').forEach(d=>{[...d.querySelectorAll(':scope>p')].forEach(p=>d.before(p));d.remove();});
  }
  const apply=()=>mq.matches?wrap():unwrap();
  apply();
  if(mq.addEventListener)mq.addEventListener('change',apply);
})();
