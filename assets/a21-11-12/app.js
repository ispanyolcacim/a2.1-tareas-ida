(function(){
'use strict';
const LESSON_TITLE='A2.1 (11-12) Ders İçi Grup Yazma Çalışması';
if(typeof document==='undefined')return;
const D=window.A21_LESSON,$=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const people=['yo','tú','él / ella / usted','nosotros/as','vosotros/as','ellos / ellas / ustedes'];
const verbAliases=new Map();for(const v of D.verbs){verbAliases.set(v.inf,v);for(const alias of v.inf.split(/\s*\/\s*/))verbAliases.set(alias,v);}
function verbButton(inf,label=inf){return '<button class="verb-link" type="button" data-verb="'+esc(inf)+'">'+esc(label)+'</button>';}
const roots=D.verbs.filter(v=>v.family==='roots');
$('rootList').innerHTML=roots.map(v=>'<span>'+verbButton(v.inf)+' → <b>'+esc(v.stem)+'</b></span>').join('');
const ser=verbAliases.get('ser')||verbAliases.get('ir'),dar=verbAliases.get('dar'),ver=verbAliases.get('ver');
$('totalRows').innerHTML=people.map((p,i)=>'<tr><th scope="row">'+p+'</th><td>'+ser.forms[i]+'</td><td>'+dar.forms[i]+'</td><td>'+ver.forms[i]+'</td></tr>').join('');
for(const v of [...D.verbs].sort((a,b)=>a.inf.localeCompare(b.inf,'es'))){const o=document.createElement('option');o.value=v.inf;o.textContent=v.inf+' · '+v.tr;$('verbSelect').append(o);}
function showVerb(inf){const v=verbAliases.get(inf);if(!v)return;closeWord();$('verbTitle').textContent=v.inf;$('verbMeaning').textContent=v.tr+' · '+v.en;$('verbForms').innerHTML=people.map((p,i)=>'<tr><th scope="row">'+p+'</th><td lang="es">'+esc(v.forms[i])+'</td></tr>').join('');$('verbNote').textContent=v.note||'Tamamlanmış olayları anlatırken, öznenin kişisine uygun çekimi seç.';$('verbDialog').showModal();}
$('verbDialog').addEventListener('close',()=>{$('verbSelect').value='';});
$('verbSelect').addEventListener('change',e=>{if(e.target.value)showVerb(e.target.value);});$('verbClose').onclick=()=>$('verbDialog').close();
$('storyVerbs').innerHTML=['salir','llegar','coger','confundir','abrir','encontrar','pedir','poder','volver','decidir'].map(v=>'<button type="button" data-verb="'+v+'">'+v+'</button>').join('');
const roleColors={'Özne':'var(--subject)','Fiil':'var(--verb)','Nesne':'var(--object)','Zarf / edat öbeği':'var(--adverbial)','Bağlayıcı':'var(--connector)','Nitelik':'#ffe1cf'};
function words(text,context,role){let h='',end=0;for(const m of text.matchAll(/[\p{L}]+/gu)){h+=esc(text.slice(end,m.index));h+='<span class="word-unit"><button type="button" class="word" data-word="'+esc(m[0].toLowerCase())+'" data-context="'+esc(context)+'" data-role="'+esc(role)+'" aria-haspopup="dialog">'+esc(m[0])+'</button></span>';end=m.index+m[0].length;}return h+esc(text.slice(end));}
function sample(sentences){return sentences.map(parts=>{const context=parts.map(x=>x[0]).join('');return '<span class="sample-sentence">'+parts.map(([text,role])=>'<span class="chunk" style="--chunk-color:'+roleColors[role]+'">'+words(text,context,role)+'</span>').join('')+'</span>';}).join(' ');}
$('simpleExample').innerHTML=sample(D.simple);$('linkedExample').innerHTML=sample(D.linked);
$('modelToggle').onclick=()=>{const open=$('linkedExampleWrap').hidden;$('linkedExampleWrap').hidden=!open;$('modelToggle').setAttribute('aria-expanded',String(open));$('modelToggle').textContent=open?'🔓 Bağlantılı örneği kapat':'🔒 Bağlantılı örneği aç';};
const categories=[...new Set(D.phrases.filter(p=>p.category!=='Hikâye kalıbı').map(p=>p.category))];
$('connectorGrid').innerHTML=categories.map(category=>'<article class="card connector-card"><h4>'+esc(category)+'</h4><div class="connector-list">'+D.phrases.map((p,i)=>p.category===category?'<div><button type="button" class="phrase-link" data-phrase="'+i+'" lang="es">'+esc(p.es)+'</button><span>'+esc(p.tr)+'</span></div>':'').join('')+'</div></article>').join('');
$('storyPhrases').innerHTML=D.phrases.map((p,i)=>p.category==='Hikâye kalıbı'?'<div><button type="button" class="phrase-link" data-phrase="'+i+'" lang="es">'+esc(p.es)+'</button><span>'+esc(p.tr)+'</span></div>':'').join('');
$('storyWords').innerHTML=D.words.map((word,i)=>'<button type="button" data-story-word="'+i+'" lang="es">'+esc(word.es)+'</button>').join('');
let wordTrigger=null;
function closeWord(restore=false){$('wordPopover').hidden=true;if(wordTrigger){wordTrigger.setAttribute('aria-expanded','false');if(restore&&wordTrigger.isConnected)wordTrigger.focus({preventScroll:true});}wordTrigger=null;}
function placeWord(){if(!wordTrigger||$('wordPopover').hidden)return;const p=$('wordPopover'),r=wordTrigger.getBoundingClientRect(),width=p.offsetWidth,height=p.offsetHeight;p.style.left=Math.max(12,Math.min(document.documentElement.clientWidth-width-12,r.left))+'px';p.style.top=(r.bottom+9+height<document.documentElement.clientHeight-12?r.bottom+9:Math.max(12,r.top-height-9))+'px';}
function openWord(button){if(wordTrigger===button&&!$('wordPopover').hidden){closeWord();return;}closeWord();wordTrigger=button;let entry,context='',role='';
 if(button.hasAttribute('data-phrase')){const p=D.phrases[Number(button.dataset.phrase)];entry={lemma:p.es,tr:p.tr,en:p.en,type:'Anlatım ifadesi',form:p.category};context=p.example+'\n'+p.exampleTr;role=p.note||p.category+' ilişkisini kurar; hikâyenin anlamına uygun olduğunda kullan.';}
 else if(button.hasAttribute('data-story-word')){const p=D.words[Number(button.dataset.storyWord)];entry={lemma:p.es,tr:p.tr,en:p.en,type:p.type,form:''};role='Görseldeki bir nesneyi, kişiyi veya ipucunu adlandırmak için kullanılır.';}
 else{entry=D.lex[button.dataset.word];if(!entry)return;context=button.dataset.context;role=button.dataset.role+' öbeğinde kullanılan '+entry.type.toLocaleLowerCase('tr')+'.';if(button.dataset.word==='la'&&context.includes('la recuperé'))entry={...entry,tr:'onu (cüzdanı)',en:'it (the wallet)',type:'Doğrudan nesne zamiri',form:'Dişil tekil la cartera ismine gönderme yapar.'};}
 $('wordTitle').textContent=button.textContent;$('wordTr').textContent=entry.tr;$('wordEn').textContent=entry.en;$('wordLemma').textContent=entry.lemma;$('wordForm').textContent=entry.type+(entry.form?' · '+entry.form:'');$('wordRole').textContent=role;$('wordContext').textContent=context;$('wordContext').hidden=!context;button.setAttribute('aria-expanded','true');$('wordPopover').hidden=false;placeWord();
}
$('wordClose').onclick=()=>closeWord(true);document.addEventListener('click',e=>{const v=e.target.closest('[data-verb]');if(v){showVerb(v.dataset.verb);return;}const word=e.target.closest('[data-word],[data-phrase],[data-story-word]');if(word){openWord(word);return;}if(!$('wordPopover').contains(e.target))closeWord();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('wordPopover').hidden){e.preventDefault();e.stopPropagation();closeWord(true);}},true);window.addEventListener('resize',closeWord);document.addEventListener('scroll',e=>{if(!$('wordPopover').contains(e.target))closeWord();},true);
const DRAFT_KEY='a21-11-12-classroom-group-writing-v1';let storageAvailable=true,active=0;
function getDraft(){return{names:[...document.querySelectorAll('.member-name')].map(x=>x.value.trim()),group:$('groupLabel').value.trim(),title:$('textTitle').value.trim(),plan:$('storyPlan').value,text:$('groupText').value,tab:active};}
function saveDraft(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(getDraft()));storageAvailable=true;$('draftStatus').textContent='✓ Taslak kaydedildi · '+new Date().toLocaleTimeString('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit'});}catch{storageAvailable=false;$('draftStatus').textContent='Taslak bu tarayıcıya kaydedilemedi. Metninizin kopyasını alın.';}}
function addMember(value=''){const row=document.createElement('div');row.className='member-row';const label=document.createElement('label');label.append(document.createTextNode('Öğrenci'));const input=document.createElement('input');input.type='text';input.className='member-name';input.autocomplete='given-name';input.placeholder='İsminiz';input.value=value;label.append(input);row.append(label);const b=document.createElement('button');b.type='button';b.className='small-button';b.textContent='×';b.setAttribute('aria-label','Bu öğrenci alanını kaldır');b.onclick=()=>{if($('members').children.length>1){row.remove();renumber();saveDraft();}};row.append(b);$('members').append(row);renumber();}
function renumber(){[...$('members').children].forEach((r,i)=>{r.querySelector('label').firstChild.textContent='Öğrenci '+(i+1);r.querySelector('button').disabled=$('members').children.length===1;});}
let draft=null;try{draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');}catch{}
if(draft&&typeof draft==='object'){if(Array.isArray(draft.names))draft.names.forEach(n=>addMember(String(n)));$('groupLabel').value=String(draft.group||'');$('textTitle').value=String(draft.title||'');$('storyPlan').value=String(draft.plan||'');$('groupText').value=String(draft.text||'');$('draftStatus').textContent='✓ Önceki taslağınız geri yüklendi.';}
if(!$('members').children.length)addMember();
$('addMember').onclick=()=>{addMember();saveDraft();[...document.querySelectorAll('.member-name')].at(-1).focus();};
$('groupForm').addEventListener('input',saveDraft);
$('groupForm').addEventListener('submit',e=>e.preventDefault());
document.querySelectorAll('[data-accent]').forEach(b=>b.onclick=()=>{const t=$('groupText');t.setRangeText(b.dataset.accent,t.selectionStart,t.selectionEnd,'end');t.focus();saveDraft();});
function copyContent(){const s=getDraft();return LESSON_TITLE+'\nGrup: '+(s.group||'—')+'\nGrup üyeleri: '+s.names.join(' · ')+'\n\n'+s.title+'\n\n'+s.text+(s.plan.trim()?'\n\nPLAN NOTLARI\n'+s.plan:'');}
$('copyText').onclick=async()=>{
 const text=copyContent(),status=$('formStatus'),manualCopy=$('manualCopy');
 try{
  await navigator.clipboard.writeText(text);
  manualCopy.hidden=true;
  status.textContent='✓ İsimler ve metin kopyalandı.';
 }catch{
  manualCopy.value=text;
  manualCopy.hidden=false;
  manualCopy.focus();
  manualCopy.select();
  status.textContent='Metin seçildi. Cihazınızın kopyalama komutunu kullanın.';
 }
};
const tabs=[...document.querySelectorAll('[data-tab]')];
function selectTab(i,focus=false,save=true){active=Math.max(0,Math.min(tabs.length-1,i));closeWord();tabs.forEach((b,j)=>{const chosen=j===active;b.setAttribute('aria-selected',String(chosen));b.tabIndex=chosen?0:-1;$(b.dataset.tab).hidden=!chosen;});$('sectionCounter').textContent=(active+1)+' / '+tabs.length;$('prevSection').disabled=active===0;$('nextSection').disabled=active===tabs.length-1;if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);if(focus)tabs[active].focus({preventScroll:true});if(save)saveDraft();}
tabs.forEach((b,i)=>{b.onclick=()=>selectTab(i);b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(active+1)%tabs.length;else if(e.key==='ArrowLeft')n=(active-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectTab(n,true);});});
$('prevSection').onclick=()=>{selectTab(active-1);$('prevSection').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});};$('nextSection').onclick=()=>{selectTab(active+1);window.scrollTo({top:0,behavior:'instant'});};document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{selectTab(tabs.findIndex(t=>t.dataset.tab===b.dataset.go));window.scrollTo({top:0,behavior:'instant'});});
$('homeworkButton').onclick=()=>{closeWord();$('homeworkDialog').showModal();$('homeworkButton').setAttribute('aria-expanded','true');};$('homeworkClose').onclick=()=>$('homeworkDialog').close();$('homeworkDialog').addEventListener('close',()=>{$('homeworkButton').setAttribute('aria-expanded','false');$('homeworkButton').focus({preventScroll:true});});
$('zoomImage').onclick=()=>$('imageDialog').showModal();$('imageClose').onclick=()=>$('imageDialog').close();
for(const id of ['homeworkDialog','imageDialog','verbDialog'])$(id).addEventListener('click',e=>{if(e.target!==$(id))return;const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();});
function preparePrint(){document.body.classList.toggle('homework-print',$('homeworkDialog').open);const s=getDraft();$('printMembers').textContent='Grup: '+(s.group||'—')+'\nGrup üyeleri: '+s.names.join(' · ');$('printStory').textContent=s.title+'\n\n'+s.text;}
$('printButton').onclick=()=>{preparePrint();window.print();};$('homeworkPrint').onclick=()=>{preparePrint();window.print();};window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',()=>document.body.classList.remove('homework-print'));
window.addEventListener('beforeunload',e=>{if(!storageAvailable&&$('groupText').value.trim()){e.preventDefault();e.returnValue='';}});
const legacy=location.hash.slice(1),legacyIndex=tabs.findIndex(t=>t.dataset.tab===legacy);selectTab(legacyIndex>=0?legacyIndex:Number.isInteger(draft?.tab)?draft.tab:0,false,false);
})();
