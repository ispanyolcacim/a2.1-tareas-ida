/* A2.1 · 9–10 classroom lesson. No student submissions or server-side state. */
(async()=>{
'use strict';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const persons=['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes'];
const personLabels=['1. tekil kişi','2. tekil kişi','3. tekil kişi / resmî siz','1. çoğul kişi','2. çoğul kişi','3. çoğul kişi / resmî çoğul siz'];
const sectionIds=['regular','irregular','total','changes','spelling','listening','notices'];
const storageKey='hazel-a21-9-10-classroom-v1';
let saved={answers:{},notices:{}},glossReady=false;
try{const old=JSON.parse(localStorage.getItem(storageKey)||'null');if(old&&typeof old==='object')saved={answers:old.answers||{},notices:old.notices||{}};}catch{}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}}
const answerControls=new Map();
function normalize(s){return String(s).normalize('NFC').trim().toLocaleLowerCase('es').replace(/[.!?,;:¿¡]/g,'').replace(/\s+/g,' ');}
function unaccent(s){return normalize(s).replace(/[áéíóú]/g,c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u'}[c]));}
function answerHTML(id,label){return '<span class="answer-control" data-answer-id="'+id+'"><input type="text" id="'+id+'" class="answer-input" lang="es" autocomplete="off" spellcheck="false" aria-label="'+esc(label)+'"><span class="answer-view" id="'+id+'-view" lang="es" hidden></span><button type="button" class="answer-lock" aria-controls="'+id+'-view" aria-pressed="false" aria-label="'+esc(label)+': cevabı aç">🔒</button></span>';}
function registerAnswer(id,answer,opts={}){
 const wrap=document.querySelector('[data-answer-id="'+id+'"]'),input=wrap.querySelector('input'),view=wrap.querySelector('.answer-view'),lock=wrap.querySelector('.answer-lock');
 view.lang=opts.language||'es';const record={id,answer,wrap,input,view,lock,label:input.getAttribute('aria-label'),...opts};answerControls.set(id,record);
 wrap.dataset.lemma=opts.lemma||'';wrap.dataset.role=opts.role||'';wrap.dataset.context=opts.context||answer;
 const prior=saved.answers[id]||{};input.value=typeof prior.typed==='string'?prior.typed:'';
 input.addEventListener('input',()=>{saved.answers[id]={typed:input.value,open:false,checked:false};if(opts.listening)showListenFeedback(record,null);persist();});
 lock.addEventListener('click',()=>setAnswer(id,!wrap.classList.contains('is-open')));
 if(prior.open)setAnswer(id,true,false);else if(opts.listening&&prior.checked)checkListen(id,false);
}
function setAnswer(id,open,announce=true){
 const r=answerControls.get(id),old=saved.answers[id]||{};if(!r)return;
 if(open){r.view.innerHTML=r.markup?'<button type="button" class="vocab-word" data-word="'+esc(r.answer)+'" aria-label="'+esc(r.answer)+'" aria-expanded="false" aria-controls="word-popover">'+r.markup+'</button>':esc(r.answer);r.view.hidden=false;r.input.hidden=true;}else{r.view.hidden=true;r.input.hidden=false;}
 r.wrap.classList.toggle('is-open',open);r.lock.textContent=open?'🔓':'🔒';r.lock.setAttribute('aria-pressed',String(open));r.lock.setAttribute('aria-label',r.label+': cevabı '+(open?'kapat':'aç'));
 saved.answers[id]={...old,typed:r.input.value,open};persist();
 if(r.listening){showListenFeedback(r,open?'revealed':old.checked?gradeListen(r):null);updateListenProgress();}
 if(announce)$('announcement').textContent=open?'Bu cevabın kilidi açıldı.':'Cevap kapatıldı.';
 if(glossReady)document.dispatchEvent(new CustomEvent('lesson:answer',{detail:{id,open}}));
}
function markedForm(v,i,kind){
 const form=v.forms[i];
 if(v.inf==='hacer'&&i===2)return 'hi<mark class="change">z</mark>o';
 if(kind==='changes'&&(i===2||i===5)){
  if(v.group==='i → y')return esc(form).replace('y','<mark class="change">y</mark>');
  if(v.inf==='reír')return '<mark class="change">'+esc(form)+'</mark>';
  const old=v.inf.slice(0,-2);let pos=0;while(pos<old.length&&old[pos]===form[pos])pos++;
  return esc(form.slice(0,pos))+'<mark class="change">'+esc(form[pos])+'</mark>'+esc(form.slice(pos+1));
 }
 if(kind==='spelling'&&i===0){const token=v.inf.endsWith('car')?'qu':v.inf.endsWith('gar')?'gu':'c';const pos=form.length-token.length-1;return esc(form.slice(0,pos))+'<mark class="change">'+token+'</mark>'+esc(form.slice(pos+token.length));}
 if(kind==='roots'){const ending=i===5&&v.stem.endsWith('j')?'eron':['e','iste','o','imos','isteis','ieron'][i];return esc(form.slice(0,-ending.length))+'<span class="table-ending">'+ending+'</span>';}
 return esc(form);
}
function verbCard(v,kind){
 const id=kind+'-'+v.inf.normalize('NFD').replace(/[\u0300-\u036f]/g,''),stem=kind==='roots'?'<p class="stem-line">Yeni kök: <strong data-no-gloss>'+esc(v.stem)+'-</strong></p>':'';
 const note=v.note||(v.inf==='haber'?'Varlık bildirirken tekil ve çoğulda hubo kullanılır: Hubo una reunión. Hubo dos reuniones.':v.inf==='hacer'?'Él / ella / usted hizo: bu kişide kök hiz- olur.':kind==='roots'&&v.stem.endsWith('j')?'Ellos / ellas / ustedes: -ieron yerine -eron.':'');
 return '<article class="verb-card"><div class="verb-head"><button type="button" class="verb-toggle" aria-expanded="false" aria-controls="'+id+'-table" data-no-gloss><span><span lang="es">'+esc(v.inf)+'</span><small class="verb-name">'+esc(v.tr)+'</small></span><span class="arrow" aria-hidden="true">⌄</span></button><button type="button" class="verb-info" data-word="'+esc(v.inf)+'" aria-label="'+esc(v.inf)+': kelime bilgisi" aria-expanded="false">ⓘ</button></div><div class="verb-table-wrap" id="'+id+'-table" hidden>'+stem+'<table class="verb-table" aria-label="'+esc(v.inf)+' · pretérito indefinido"><tbody>'+persons.map((p,i)=>'<tr class="'+(kind==='changes'&&(i===2||i===5)?'third-person':'')+'"><th scope="row" lang="es">'+p+'</th><td>'+answerHTML(id+'-'+i,v.inf+', '+personLabels[i])+'</td></tr>').join('')+'</tbody></table>'+(note?'<p class="verb-footnote">'+esc(note)+'</p>':'')+'</div></article>';
}
function renderVerbs(id,verbs,kind){$(id).innerHTML=verbs.map(v=>verbCard(v,kind)).join('');registerVerbs(verbs,kind);}
function registerVerbs(verbs,kind){for(const v of verbs){const id=kind+'-'+v.inf.normalize('NFD').replace(/[\u0300-\u036f]/g,'');v.forms.forEach((a,i)=>registerAnswer(id+'-'+i,a,{lemma:v.inf,markup:markedForm(v,i,kind),context:persons[i]+' '+a,role:v.inf+' fiilinin pretérito indefinido çekimi · '+personLabels[i]+'.'}));}}
function renderGroups(id,verbs,kind,groups){$(id).innerHTML=groups.map((g,i)=>'<div class="irregular-group"><div class="group-label"><h3>'+esc(g)+'</h3><span>'+(kind==='changes'?'Yalnızca üçüncü kişiler':'')+'</span></div><div id="'+id+'-'+i+'" class="verb-grid"></div></div>').join('');groups.forEach((g,i)=>renderVerbs(id+'-'+i,verbs.filter(v=>v.group===g),kind));}
function renderPractice(id,items,prefix){$(id).innerHTML=items.map((p,i)=>'<article class="question-card"><div class="question-head"><span class="q-number">'+(i+1)+'</span><div class="q-content"><h4 lang="es">'+esc(p[0])+'</h4>'+answerHTML(prefix+i,'Soru '+(i+1)+': örnek cevap')+'</div></div></article>').join('');items.forEach((p,i)=>registerAnswer(prefix+i,p[1],{context:p[0],role:'Alıştırmanın örnek cevabı.',language:prefix==='context-'?'tr':'es'}));}
function selectSection(id,focus=false){if(!sectionIds.includes(id))return;document.querySelectorAll('[role="tabpanel"]').forEach(p=>p.hidden=p.id!==id);document.querySelectorAll('.nav-tab').forEach(t=>{const active=t.dataset.section===id;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;if(active&&focus){t.focus({preventScroll:true});t.scrollIntoView({block:'nearest',inline:'center'});}});document.querySelectorAll('audio').forEach(a=>a.pause());if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);document.dispatchEvent(new Event('lesson:panel'));}
let data,glossary;
try{
 const responses=await Promise.all([fetch('assets/a21-9-10/lesson-data.json?v=20261114'),fetch('assets/a21-9-10/glossary.json?v=20261114')]);
 if(responses.some(r=>!r.ok))throw Error('Lesson assets unavailable');
 [data,glossary]=await Promise.all(responses.map(r=>r.json()));
 if(data.regular.length!==30||data.roots.length!==17||data.blanks.length!==10)throw Error('Invalid lesson data');
}catch(error){$('load-status').className='load-error';$('load-status').textContent='Çalışma yüklenemedi. Sayfayı yenileyerek tekrar dene.';return;}
renderVerbs('regular-grid',data.regular,'regular');renderGroups('irregular-groups',data.roots,'roots',['U','J','I']);renderVerbs('total-grid',data.total,'total');renderGroups('vowel-groups',data.changes.filter(v=>v.group!=='i → y'),'changes',['e → i','o → u']);renderVerbs('y-grid',data.changes.filter(v=>v.group==='i → y'),'changes');renderGroups('spelling-groups',data.orthographic,'spelling',['-car → -qué','-gar → -gué','-zar → -cé']);
renderPractice('context-practice',[
 ['Ayer fuimos al centro de Madrid. ¿Ser o ir?','Ir: gittik. Al centro bir yer / yön bildiriyor.'],
 ['La exposición fue muy interesante. ¿Ser o ir?','Ser: sergi çok ilgi çekiciydi. Bir nitelik bildiriyor.'],
 ['Mis amigos fueron al concierto. ¿Ser o ir?','Ir: arkadaşlarım konsere gittiler.'],
 ['Los músicos fueron muy simpáticos. ¿Ser o ir?','Ser: müzisyenler çok cana yakındı.']
],'context-');
renderPractice('spelling-practice',[
 ['Ayer yo ___ la cuenta. (pagar)','pagué'],['El sábado yo ___ a las ocho. (llegar)','llegué'],['Anoche yo ___ mis llaves. (buscar)','busqué'],['Yo ___ a estudiar después de comer. (empezar)','empecé'],['Ayer yo ___ al tenis. (jugar)','jugué'],['Yo ___ una excursión para mi clase. (organizar)','organicé']
],'spell-practice-');
// One paragraph is a coherent four-turn exchange. Every blank has its own check and lock.
function blankHTML(n){const id='listen-'+n;return '<span class="answer-control inline-blank" data-answer-id="'+id+'"><span class="blank-number" aria-hidden="true">'+n+'</span><input type="text" id="'+id+'" lang="es" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="'+n+'. dinleme boşluğu"><span class="answer-view" id="'+id+'-view" lang="es" hidden></span><button type="button" class="inline-check" data-check="'+id+'" aria-label="'+n+'. boşluğu kontrol et">✓</button><button type="button" class="answer-lock" aria-controls="'+id+'-view" aria-pressed="false" aria-label="'+n+'. boşluk: cevabı aç">🔒</button></span>';}
const chunkColors=['#f8d4e3','#d6e5ff','#ffedb3','#d4eedb','#e6d6fa','#ffdac5','#d2eff2','#f4d0cf'];
function spanishText(text,annotations=[]){
 const ranges=[];let cursor=0;
 for(const [part,role] of annotations){const pos=text.indexOf(part,cursor);if(pos<0)continue;ranges.push({start:pos,end:pos+part.length,role});cursor=pos+part.length;}
 function inline(t){return t.split(/(\[\[\d+:[^\]]+\]\])/).map(p=>{const m=p.match(/^\[\[(\d+):([^\]]+)\]\]$/);return m?blankHTML(Number(m[1])):esc(p);}).join('');}
 let out='',pos=0;for(const [i,r]of ranges.entries()){out+=inline(text.slice(pos,r.start));out+='<span class="syntax-chunk" data-role="'+esc(r.role)+'" style="--chunk-color:'+chunkColors[i%chunkColors.length]+'">'+inline(text.slice(r.start,r.end))+'</span>';pos=r.end;}out+=inline(text.slice(pos));
 return '<span class="sentence" data-context="'+esc(text.replace(/\[\[\d+:[^\]]+\]\]/g,'____'))+'">'+out+'</span>';
}
$('dialogue-blocks').innerHTML=[1,2].map(block=>'<article class="dialogue-block"><div class="dialogue-block-head"><h3>'+block+'. paragraf</h3><audio class="audio-part" controls preload="metadata" aria-label="'+block+'. paragrafı dinle"><source src="assets/a21-9-10/dialogue-part-'+block+'.mp3" type="audio/mpeg"></audio></div><div class="dialogue-text" lang="es">'+data.turns.filter(t=>t.block===block).map(t=>'<p class="speaker-turn '+t.speaker.toLowerCase()+'"><span class="speaker-name" data-no-gloss>'+t.speaker+'</span>'+spanishText(t.text,t.syntax||[])+'</p>').join('')+'</div><div class="blank-feedback-list" id="block-feedback-'+block+'">'+data.blanks.filter(b=>b.block===block).map(b=>'<div class="blank-feedback" id="listen-'+b.id+'-feedback" role="status" aria-live="polite" hidden></div>').join('')+'</div></article>').join('');
for(const b of data.blanks){registerAnswer('listen-'+b.id,b.answer,{listening:true,number:b.id,explanation:b.explanation,group:b.group,lemma:b.lemma,role:'Dinleme cümlesinin pretérito indefinido fiili.',context:b.answer});$('listen-'+b.id).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();checkListen('listen-'+b.id);}});}
function gradeListen(r){const typed=normalize(r.input.value),answer=normalize(r.answer);return typed===answer?'correct':unaccent(typed)===unaccent(answer)?'accent':'wrong';}
function showListenFeedback(r,status){const box=$(r.id+'-feedback');box.hidden=!status;r.wrap.classList.remove('correct','wrong','accent');if(!status){updateListenProgress();return;}r.wrap.classList.add(status==='revealed'?'accent':status);box.className='blank-feedback '+(status==='correct'?'correct':status==='wrong'?'wrong':'accent');box.innerHTML='<strong>'+r.number+'. boşluk · '+(status==='correct'?'✓ Doğru':status==='accent'?'✍️ Vurgu işaretini düzelt':status==='revealed'?'🔓 Cevap açıldı':'Bir daha dinleyelim')+'</strong><span lang="es">'+esc(r.answer)+'</span> · '+esc(r.group)+'<br>'+esc(r.explanation);if(glossReady)document.dispatchEvent(new Event('lesson:answer'));updateListenProgress();}
function checkListen(id,announce=true){const r=answerControls.get(id);if(!r.input.value.trim()){showListenFeedback(r,null);if(announce){$('announcement').textContent='Önce bu boşluğa cevabını yaz.';r.input.focus();}return;}const status=gradeListen(r);saved.answers[id]={typed:r.input.value,open:false,checked:true};showListenFeedback(r,status);persist();}
function updateListenProgress(){const count=[...answerControls.values()].filter(r=>r.listening&&(saved.answers[r.id]?.checked||saved.answers[r.id]?.open)).length;$('listening-progress').textContent=count+' / 10 boşluk kontrol edildi';}
document.querySelectorAll('[data-check]').forEach(b=>b.addEventListener('click',()=>checkListen(b.dataset.check)));
const audios=[...document.querySelectorAll('audio')];audios.forEach(a=>{a.addEventListener('play',()=>audios.forEach(other=>{if(other!==a)other.pause();}));a.addEventListener('error',()=>{const error=a.closest('.audio-master')?.querySelector('.media-error');if(error)error.hidden=false;});});$('audio-speed').addEventListener('change',()=>audios.forEach(a=>a.playbackRate=Number($('audio-speed').value)));
$('headline-list').innerHTML=data.headlines.map(h=>'<div class="headline-option"><span class="headline-letter" data-no-gloss>'+h.letter+'</span><span lang="es">'+esc(h.text)+'</span></div>').join('');
$('notice-list').innerHTML=data.ads.map(ad=>'<article class="notice-card" id="notice-'+ad.id+'"><div class="notice-card-head"><h3>İLAN '+ad.id+'</h3><span class="notice-tag">Başlığı sen bul</span></div><div class="notice-text" lang="es">'+spanishText(ad.text,ad.syntax||[])+'</div><div class="notice-controls"><label for="notice-select-'+ad.id+'">Bu ilanın başlığı hangisi?</label><select class="notice-select" id="notice-select-'+ad.id+'"><option value="">— Bir başlık seç —</option>'+data.headlines.map(h=>'<option value="'+h.letter+'">'+h.letter+' · '+esc(h.text)+'</option>').join('')+'</select><button type="button" class="notice-check" data-notice-check="'+ad.id+'">Kontrol et</button><button type="button" class="answer-lock" data-notice-reveal="'+ad.id+'" aria-pressed="false" aria-controls="notice-feedback-'+ad.id+'" aria-label="'+ad.id+'. ilanın cevabını aç">🔒</button></div><div class="notice-feedback" id="notice-feedback-'+ad.id+'" role="status" aria-live="polite" hidden></div></article>').join('');
function checkNotice(id,reveal=false){const ad=data.ads.find(a=>a.id===id),select=$('notice-select-'+id),box=$('notice-feedback-'+id),record=saved.notices[id]||{};if(!reveal&&!select.value){box.hidden=false;box.className='notice-feedback';box.textContent='Önce bir başlık seç.';return;}const correct=select.value===ad.answer,head=data.headlines.find(h=>h.letter===ad.answer);box.hidden=false;box.className='notice-feedback '+(!reveal&&correct?'correct':reveal?'':'wrong');box.innerHTML='<strong>'+(!reveal&&correct?'✓ Doğru eşleştirme':reveal?'🔓 Örnek eşleştirme':'İpucuna yeniden bakalım')+'</strong><span data-no-gloss>'+head.letter+' · </span><span lang="es">'+esc(head.text)+'</span><br>'+esc(ad.explanation);$('notice-'+id).classList.toggle('is-correct',correct&&!reveal);saved.notices[id]={value:select.value,checked:!reveal,revealed:reveal};const lock=document.querySelector('[data-notice-reveal="'+id+'"]');lock.textContent=reveal?'🔓':'🔒';lock.setAttribute('aria-pressed',String(reveal));persist();updateNoticeProgress();if(glossReady)document.dispatchEvent(new Event('lesson:answer'));}
function updateNoticeProgress(){const correct=data.ads.filter(a=>saved.notices[a.id]?.checked&&saved.notices[a.id]?.value===a.answer).length;$('notice-progress').textContent=correct+' / 6 ilan doğru eşleştirildi';}
data.ads.forEach(ad=>{const select=$('notice-select-'+ad.id),prior=saved.notices[ad.id]||{};select.value=prior.value||'';if(prior.checked||prior.revealed)checkNotice(ad.id,!!prior.revealed);select.addEventListener('change',()=>{saved.notices[ad.id]={value:select.value,checked:false,revealed:false};$('notice-feedback-'+ad.id).hidden=true;$('notice-'+ad.id).classList.remove('is-correct');const lock=document.querySelector('[data-notice-reveal="'+ad.id+'"]');lock.textContent='🔒';lock.setAttribute('aria-pressed','false');persist();updateNoticeProgress();});});
document.querySelectorAll('[data-notice-check]').forEach(b=>b.addEventListener('click',()=>checkNotice(Number(b.dataset.noticeCheck))));document.querySelectorAll('[data-notice-reveal]').forEach(b=>b.addEventListener('click',()=>{const id=Number(b.dataset.noticeReveal);if(b.getAttribute('aria-pressed')==='true'){b.setAttribute('aria-pressed','false');b.textContent='🔒';$('notice-feedback-'+id).hidden=true;saved.notices[id]={value:$('notice-select-'+id).value,checked:false,revealed:false};persist();updateNoticeProgress();}else checkNotice(id,true);}));
document.querySelectorAll('.verb-toggle').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$(b.getAttribute('aria-controls')).hidden=!open;document.dispatchEvent(new Event('lesson:panel'));}));
document.querySelectorAll('[data-section]').forEach(b=>b.addEventListener('click',()=>{selectSection(b.dataset.section);if(!b.classList.contains('nav-tab'))document.querySelector('.tabs').scrollIntoView({block:'start',behavior:'smooth'});}));document.querySelector('.tabs').addEventListener('keydown',e=>{const tab=e.target.closest('.nav-tab');if(!tab)return;let i=sectionIds.indexOf(tab.dataset.section);if(e.key==='ArrowRight')i=(i+1)%7;else if(e.key==='ArrowLeft')i=(i+6)%7;else if(e.key==='Home')i=0;else if(e.key==='End')i=6;else return;e.preventDefault();selectSection(sectionIds[i],true);});
$('reset-lesson').addEventListener('click',()=>$('reset-dialog').showModal());$('reset-cancel').addEventListener('click',()=>$('reset-dialog').close());$('reset-confirm').addEventListener('click',()=>{try{localStorage.removeItem(storageKey);}catch{}location.reload();});
document.querySelectorAll('[data-classroom-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
function selectLocationSection(){const initial=location.hash.match(/^#bolum-([1-7])$/);const id=location.hash.slice(1);selectSection(initial?sectionIds[Number(initial[1])-1]:sectionIds.includes(id)?id:sectionIds[0]);}
selectLocationSection();window.addEventListener('hashchange',selectLocationSection);
const wordDefinitions=new Map(Object.entries(glossary).map(([key,val])=>[key,val.tr]));const wordMetadata=new Map(Object.entries(glossary));const phraseDefinitions=[],phraseEnglish=new Map();
const allVerbs=[...data.regular,...data.roots,...data.total,...data.changes,...data.orthographic];for(const v of allVerbs){wordDefinitions.set(v.inf,v.tr);wordMetadata.set(v.inf,{lemma:v.inf,english:v.en,type:'fiil',form:'Mastar (infinitivo)'});v.forms.forEach((form,i)=>{wordDefinitions.set(form,v.tr+' · geçmiş zaman biçimi');wordMetadata.set(form,{lemma:v.inf,english:v.en,type:'fiil',form:'Pretérito indefinido · '+personLabels[i]});});}
for(const [i,form]of data.total[1].forms.entries()){wordDefinitions.set(form,'Ser veya ir fiilinin geçmiş zaman biçimi; anlam bağlamdan anlaşılır.');wordMetadata.set(form,{lemma:'ser / ir',english:'to be / to go (depending on context)',type:'fiil',form:'Pretérito indefinido · '+personLabels[i]});}
// The established classroom word popover and constituent hover behavior follows below.
function lexicalForm(key,meta){if(!meta?.type.includes('fiil'))return '';return meta.form||(key===meta.lemma?'Mastar (infinitivo)':'Çekimli fiil');}
function sentenceForWord(word,original){
 const sentence=word.closest('.sentence');if(sentence)return{text:sentence.dataset.context||sentence.textContent,container:sentence};
 const owner=word.closest('.answer-control');if(owner)return{text:owner.dataset.context||original,owner};
 const card=word.closest('.verb-card');if(card&&word.classList.contains('verb-info'))return{text:word.dataset.word+' · pretérito indefinido çekim kartı',card};
 const container=word.closest('p,li,h1,h2,h3,h4,td,th')||word.parentElement;
 return{text:container.textContent.trim(),container};
}
function contextualRole(word,original,meta,context){
 const chunk=word.closest('.syntax-chunk');
 if(chunk){let sub='';
  if(meta?.type.includes('artikel')||meta?.type.includes('belirleyici'))sub=' Bu grupta isim belirleyicisi.';
  else if(meta?.type==='isim'||meta?.type==='özel isim')sub=' Bu grupta isim çekirdeği veya isim tamamlayıcısı.';
  else if(meta?.type.includes('sıfat'))sub=' Bu grupta ismin / öznenin niteliğini bildirir.';
  else if(meta?.type.includes('edat'))sub=' Grubu başlatan edat.';
  else if(meta?.type.includes('fiil'))sub=original.toLowerCase()==='terminarla'?' Terminar mastarı + la doğrudan nesne zamiri (onu).':' Bu grubun fiil çekirdeği.';
  if(original.toLowerCase()==='no')sub=' Fiil grubunun olumsuzluk zarfı.';
  return chunk.dataset.role+sub;
 }
 if(context.owner?.dataset.lemma)return context.owner.dataset.role;
 if(word.closest('.verb-info'))return 'Fiil kartının mastar başlığı; çekim tablosunu adlandırır.';
 const key=original.toLocaleLowerCase('es');
 if(meta?.type.includes('fiil'))return 'Cümlenin / yan cümlenin çekimli fiili veya çekimsiz fiil grubu.';
 if(['yo','tú','él','ella','usted','nosotros','nosotras','vosotros','vosotras','ellos','ellas','ustedes'].includes(key))return 'Özne zamiri; çekimin hangi kişiye ait olduğunu belirtir.';
 if(meta?.type.includes('soru'))return 'Soru ögesi; öğrenilmek istenen kişi, yer, zaman veya şeyi sorar.';
 if(key==='la'&&/^La mandaron/.test(context.text))return 'Doğrudan nesne zamiri; la presentación (sunum) yerine kullanılmıştır.';
 if(meta?.type.includes('artikel')||meta?.type.includes('belirleyici'))return 'İsim grubunun belirleyicisi; ismi tanımlar veya miktar / aidiyet bildirir.';
 if(meta?.type.includes('edat'))return 'Edat; ardından gelen isim / mastar grubunu cümlenin diğer ögelerine bağlar.';
 if(meta?.type.includes('bağlaç'))return 'Bağlayıcı; cümle veya söz öbeklerini birbirine bağlar.';
 if(meta?.type.includes('sıfat'))return 'İsim grubunda niteleyici; bir kişiye veya şeye özellik katar.';
 if(meta?.type.includes('zarf'))return 'Zarf; zaman, tarz, miktar veya eyleme ilişkin başka bir bilgi verir.';
 if(meta?.type.includes('isim'))return 'İsim grubunun çekirdeği veya isim tamamlayıcısı.';
 if(meta?.type.includes('terimi'))return 'Dilbilgisi başlığı; çalışılan çekim veya fiil grubunun adı.';
 return 'Bu başlıkta veya söz öbeğinde anlamı kuran öge.';
}

const lessonMain=document.querySelector('.shell');
const popover=document.createElement('aside');
popover.id='word-popover';popover.className='word-popover';popover.hidden=true;
popover.lang='tr';popover.setAttribute('role','dialog');popover.setAttribute('aria-modal','false');popover.setAttribute('aria-labelledby','word-title');
popover.innerHTML='<div class="word-popover-top"><div><span class="word-popover-label">KELİMEYİ KEŞFET</span><h3 id="word-title" lang="es"></h3></div><button type="button" class="word-popover-close" aria-label="Kelime anlamını kapat">×</button></div><p class="word-language-label">TÜRKÇE</p><p id="word-meaning" class="word-meaning"></p><p class="word-language-label">ENGLISH · SÖZLÜK ANLAMI</p><p id="word-english" class="word-english" lang="en"></p><dl class="word-facts"><div><dt>Sözlük biçimi</dt><dd id="word-lemma" lang="es"></dd></div><div><dt>Sözcük türü / biçimi</dt><dd id="word-type"></dd></div><div><dt>Bu cümledeki görevi</dt><dd id="word-role"></dd></div></dl><details class="word-context"><summary>İçinde geçtiği cümle</summary><p id="word-sentence" lang="es"></p></details><div id="word-phrase" class="word-phrase" hidden><p id="word-phrase-es" lang="es"></p><p id="word-phrase-tr"></p><p id="word-phrase-en" lang="en"></p></div>';
document.body.append(popover);
let activeWord=null;
let activeTerm=null;
function closeWord(restoreFocus=false){if(activeWord){activeWord.setAttribute('aria-expanded','false');if(restoreFocus&&document.contains(activeWord))activeWord.focus({preventScroll:true})}popover.hidden=true;activeWord=null;activeTerm=null}
function positionWord(){if(popover.hidden||!activeWord)return;const rect=activeWord.getBoundingClientRect();const width=popover.offsetWidth;const height=popover.offsetHeight;const left=Math.max(12,Math.min(window.innerWidth-width-12,rect.left));const below=rect.bottom+9;const top=below+height<window.innerHeight-12?below:Math.max(12,rect.top-height-9);popover.style.left=left+'px';popover.style.top=top+'px'}
function openWord(word,selectedWord=null){
  const original=selectedWord||word.dataset.word;
  if(activeWord===word&&activeTerm===original&&!popover.hidden){closeWord();return}
  closeWord();activeWord=word;activeTerm=original;
  word.setAttribute('aria-expanded','true');word.setAttribute('aria-controls','word-popover');
  const key=original.toLocaleLowerCase('es').normalize('NFC');
  let meaning=wordDefinitions.get(key);
  const paragraph=word.closest('p');
  const inflection=word.closest('h4');
  if(key==='a'&&inflection&&inflection.textContent.includes('hecho/a'))meaning='Dişil biçimi gösteren -a eki: hecho / hecha.';
  if(key==='si'&&paragraph&&paragraph.textContent.includes('Pero si los dos'))meaning='Burada vurgulama bildiriyor: oysa, ama zaten. Bu kullanımda koşul anlamı taşımaz.';
  document.getElementById('word-title').textContent=original;
  document.getElementById('word-meaning').textContent=meaning||'Bu kelimenin Türkçe karşılığı henüz eklenmedi.';
  let meta=wordMetadata.get(key);
  if(key==='a'&&inflection&&inflection.textContent.includes('hecho/a'))meta={lemma:'hecho / hecha',english:'feminine ending -a',type:'dişil eki'};
  const context=sentenceForWord(word,original);
  if(key==='la'&&/^La mandaron/.test(context.text))meta={lemma:'la',english:'it (feminine singular object)',type:'doğrudan nesne zamiri'};
  document.getElementById('word-english').textContent=meta?.english||'';
  document.getElementById('word-lemma').textContent=meta?.lemma||original.toLocaleLowerCase('es');
  const form=meta?.form||lexicalForm(key,meta);
  document.getElementById('word-type').textContent=(meta?.type||'')+(form?' · '+form:'');
  document.getElementById('word-role').textContent=word.closest('.speaker-name')?'Diyalogdaki konuşmacı etiketi; cümlenin bir ögesi değil.':contextualRole(word,original,meta,context);
  document.getElementById('word-sentence').textContent=context.text;
  popover.querySelector('.word-context').open=false;

  const phrase=word.closest('.gloss-phrase');
  document.getElementById('word-phrase').hidden=!phrase;
  if(phrase){document.getElementById('word-phrase-es').textContent=phrase.dataset.phrase;document.getElementById('word-phrase-tr').textContent=phrase.dataset.meaning;document.getElementById('word-phrase-en').textContent=phraseEnglish.get(phrase.dataset.phrase.toLocaleLowerCase('es'))||''}
  popover.hidden=false;positionWord();
}
popover.querySelector('.word-popover-close').addEventListener('click',()=>closeWord(true));
document.addEventListener('input',()=>{if(!popover.hidden)closeWord()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!popover.hidden){event.preventDefault();closeWord(true)}});
document.addEventListener('click',event=>{const word=event.target.closest('.vocab-word,.verb-info');if(word){event.preventDefault();event.stopPropagation();openWord(word);return}const field=event.target.closest('input[type="text"],textarea');if(field&&lessonMain.contains(field)&&field.value&&field.lang!=='tr'){const offset=field.selectionStart||0;const tokens=[...field.value.matchAll(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g)];const selected=tokens.find(match=>offset>=match.index&&offset<=match.index+match[0].length);if(selected&&wordDefinitions.has(selected[0].toLocaleLowerCase('es').normalize('NFC'))){openWord(field,selected[0]);return}}if(!popover.contains(event.target))closeWord()});
window.addEventListener('resize',positionWord);
document.addEventListener('scroll',event=>{if(!popover.contains(event.target))closeWord()},true);

const skipWords='button,input,textarea,select,script,style,code,kbd,.blank-letter,.expression-letter,.paragraph-number,.situation-number,.role-letter,.nav-number,.model-answer>b,.vocab-word,.word-popover,[data-no-gloss]';
function makeWordFragment(text){
 const fragment=document.createDocumentFragment();const regex=/([¿¡«“]?)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)([.,:;!?»”]*)/g;let end=0;let match;
 while((match=regex.exec(text))!==null){
  fragment.append(document.createTextNode(text.slice(end,match.index)));
  const unit=document.createElement('span');unit.className='word-unit';
  if(match[1])unit.append(document.createTextNode(match[1]));
  const button=document.createElement('button');button.type='button';button.className='vocab-word';button.textContent=match[2];button.dataset.word=match[2];button.setAttribute('aria-label',match[2]);button.title='Türkçe, English ve dilbilgisi bilgisi';button.setAttribute('aria-controls','word-popover');button.setAttribute('aria-expanded','false');
  const key=match[2].toLocaleLowerCase('es').normalize('NFC');if(key==='hizo'){const changed=document.createElement('strong');changed.className='spelling-change';changed.textContent=match[2][2];button.replaceChildren(document.createTextNode(match[2].slice(0,2)),changed,document.createTextNode(match[2].slice(3)));}if(!wordDefinitions.has(key)||!wordMetadata.has(key))button.dataset.untranslated='true';
  unit.append(button);if(match[3])unit.append(document.createTextNode(match[3]));fragment.append(unit);end=regex.lastIndex;
 }
 fragment.append(document.createTextNode(text.slice(end)));return fragment;
}
function wordChar(character){return character&&/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(character)}
function makePhraseFragment(text){const fragment=document.createDocumentFragment();const lower=text.toLocaleLowerCase('es');const ranges=[];for(const [phrase,meaning] of phraseDefinitions){let index=lower.indexOf(phrase);while(index!==-1){const end=index+phrase.length;if(!wordChar(text[index-1])&&!wordChar(text[end])&&!ranges.some(r=>index<r.end&&end>r.start))ranges.push({start:index,end,meaning});index=lower.indexOf(phrase,index+1)}}ranges.sort((a,b)=>a.start-b.start);let cursor=0;for(const range of ranges){fragment.append(makeWordFragment(text.slice(cursor,range.start)));const group=document.createElement('span');group.className='gloss-phrase';group.dataset.phrase=text.slice(range.start,range.end);group.dataset.meaning=range.meaning;group.append(makeWordFragment(text.slice(range.start,range.end)));fragment.append(group);cursor=range.end}fragment.append(makeWordFragment(text.slice(cursor)));return fragment}
function enhanceWords(root=lessonMain){const nodes=[];const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const parent=node.parentElement;if(!parent||parent.closest(skipWords)||!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(node.nodeValue))return NodeFilter.FILTER_REJECT;const language=parent.closest('[lang]');return language&&language.getAttribute('lang')==='es'?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes)node.replaceWith(makePhraseFragment(node.nodeValue))}

document.addEventListener('lesson:answer',()=>{closeWord();enhanceWords()});
document.addEventListener('lesson:panel',()=>closeWord());
enhanceWords();

glossReady=true;updateListenProgress();updateNoticeProgress();$('load-status').hidden=true;
})().catch(error=>{const status=document.getElementById('load-status');if(status){status.hidden=false;status.className='load-error';status.textContent='Çalışma yüklenemedi. Sayfayı yenileyip tekrar dene.';}console.error(error);});
