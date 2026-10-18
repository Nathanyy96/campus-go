import {relationship,personState,absolute,advance,log} from './simulation.js';
import {activePartners} from './relationship-rules.js';
import {affectionPreference,TOUCH_NAMES} from './affection-preferences.js';
import {gameDate} from './calendar.js';
export function relationshipFeeling(s,id){const r=relationship(s,id);r.relationshipScenes??=[];return r.relationshipScenes;}
export function witnessAffection(s,p,action,meaning){for(const other of activePartners(s,p.id)){
 if(personState(s,other).location!==s.location||personState(s,other).activity==='上課中')continue;
 const r=relationship(s,other.id),romantic=meaning==='romantic';if(romantic&&r.romance.agreement==='open')continue;if(!romantic&&affectionPreference(other).jealousy!=='sensitive')continue;
 const scenes=relationshipFeeling(s,other.id);if(scenes.some(e=>e.day===s.day&&e.other===p.id))continue;
 const scene={id:`feeling-${s.day}-${other.id}-${p.id}`,day:s.day,other:p.id,action,kind:romantic?'boundary':'reassurance',status:'pending',source:'witnessed'};scenes.push(scene);if(scenes.length>12)scenes.shift();
 r.memories.push(`${gameDate(s.day)}我在場看見你和${p.name}${TOUCH_NAMES[action]}，${romantic?'希望談清楚我們的交往承諾':'知道你們可能只是朋友，但也想被在意'}`);
 s.messages.unshift({person:other.id,day:s.day,time:s.time,direction:'in',kind:'relationship',source:'相處事件',read:false,text:romantic?'剛才看見你們親近，我有些在意。找個時間把我們的想法說清楚，好嗎？':'我知道朋友也能親近。不過我也有點想你，等一下能留一點時間給我嗎？'});
 }}
export function relationshipSceneAction(s,p,action){const r=relationship(s,p.id);r.romance??={stage:'friends',firsts:{},attempts:{}};const rom=r.romance;
 if(s.energy<5||s.time+6>1380)return '先留一點時間與精力，再好好談吧。';for(let t=s.time;t<=s.time+6;t++)if(personState(s,p,t).location!==s.location||personState(s,p,t).activity==='上課中')return '先當面找一個能好好說話的時間。';
 const scenes=relationshipFeeling(s,p.id),issue=[...scenes].reverse().find(e=>['pending','concealed','discussed'].includes(e.status));
 if(action==='privacy'){if(rom.stage!=='dating')return '交往後可以一起討論要不要公開。';rom.visibility=rom.visibility==='private'?'public':'private';advance(s,4);const label=rom.visibility==='private'?'先低調交往，沒有隱瞞彼此的承諾':'願意向朋友公開交往';r.memories.push(`${gameDate(s.day)}我們討論並決定${label}`);return `好，我們${label}。`;}
 if(action==='disclose'){
  if(rom.stage!=='dating')return '先確認我們現在的關係，再聊交往期間的事情。';
  const entries=s.people.flatMap(other=>(s.relations[other.id]?.affection?.history??[]).filter(e=>other.id!==p.id&&e.meaning==='romantic'&&(e.day-1)*1440+e.time>=(rom.startedAt??((rom.startedDay??s.day)-1)*1440)).map(e=>({...e,other:other.id}))).filter(e=>!scenes.some(scene=>scene.other===e.other&&scene.day===e.day));
  if(!entries.length)return '目前沒有尚未說清楚、交往期間和別人的曖昧接觸紀錄。';
  const e=entries.at(-1),other=s.people.find(person=>person.id===e.other);scenes.push({id:`disclosed-${s.day}-${p.id}-${e.other}`,day:e.day,other:e.other,action:e.action,kind:rom.agreement==='open'?'reassurance':'boundary',status:'pending',source:'disclosed'});r.memories.push(`${gameDate(s.day)}你主動告訴我和${other.name}${TOUCH_NAMES[e.action]}的事情，希望把感受說清楚`);advance(s,4);return '謝謝你願意自己告訴我。我的感受和我們原本的約定，也想一起談清楚。';
 }
 if(action==='repair'){
  if(rom.stage!=='ended'&&!issue)return '我們目前沒有未說清楚的心事，可以安心聊聊日常。';
  rom.repairDays??=[];if(rom.repairDays.includes(s.day))return '今天已經好好聽過彼此的想法，讓之後的相處慢慢證明吧。';rom.repairDays.push(s.day);r.trust++;if(issue&&issue.kind==='reassurance')issue.status='resolved';else if(issue)issue.status='discussed';r.memories.push(`${gameDate(s.day)}我們聽彼此說完在意的事情，沒有把朋友間的親近直接當成背叛`);advance(s,6);return rom.stage==='ended'?'謝謝你願意聽。我們可以先慢慢說話，想想下次怎樣相處會更舒服。':'我不是要你遠離所有朋友。我想知道自己對你代表什麼，也願意聽你的想法。';
 }
 if(action==='reconcile'){
  if(rom.stage!=='ended')return '目前沒有需要重新開始的前段交往。';if(absolute(s)<(rom.cooldownUntil??0))return '我還需要一點自己的時間，之後再討論重新開始，好嗎？';
  if(!(rom.repairDays?.length)||r.trust<9||r.familiar<18||r.attraction<5)return '我願意繼續了解彼此，但想先談過分開的原因，再累積能放心重新開始的相處。';
  if(activePartners(s,p.id).some(other=>s.relations[other.id].romance.agreement!=='open')||activePartners(s,p.id).length&&!rom.openConsent)return '如果現在有其他交往關係，先和每位當事人把安排談清楚。';
  rom.previousStartedDay??=rom.startedDay;rom.stage='dating';rom.startedDay=s.day;rom.startedAt=absolute(s);rom.agreement=rom.openConsent?'open':'exclusive';rom.reconciliations??=[];rom.reconciliations.push(s.day);for(const e of scenes)if(e.status!=='resolved')e.status='resolved';r.memories.push(`${gameDate(s.day)}談過分開的原因後，彼此同意重新交往，保留過去的回憶`);advance(s,6);log(s,`你和${p.name}把話說清楚，願意重新開始。`);return '我願意和你重新開始。過去的回憶我沒有忘，這次我們一起把相處過得更舒服。';
 }
 if(!issue)return '目前沒有等待處理的心事。';
 if(action==='downplay'){if(issue.status==='concealed')return '這個說法已經講過了，對方仍希望之後再談清楚。';issue.status='concealed';if(issue.kind==='boundary'&&!issue.downplayed){issue.downplayed=true;r.trust=Math.max(0,r.trust-1);}r.memories.push(`${gameDate(s.day)}你說先把那次接觸當朋友間的親近，我仍有一些疑問，想之後再談`);advance(s,4);return '我聽到了。不過我還有些疑問，等我們都準備好，再把彼此的想法說清楚。';}
 if(action==='clarify'){if(issue.status==='resolved')return '這件事已經聊清楚。';issue.status='resolved';r.memories.push(`${gameDate(s.day)}你坦白說明那次接觸的意思，我們重新確認相處與承諾，沒有自動改成非專一交往`);advance(s,6);return '謝謝你把自己的想法說清楚。這次我願意繼續相處；我們原本的交往約定沒有自動改變，有不同想法再一起談。';}
 return '可以先聽聽彼此在意什麼。';
}

