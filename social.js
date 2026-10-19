import {affectionAction} from './affection.js';
import {TOUCH_NAMES} from './affection-preferences.js';
import {relationshipSceneAction} from './relationship-scenes.js';
import {scheduleConflict} from './schedule-rules.js';
import {intimacyGate,earnIntimacy,intimacy,liking} from './intimacy.js';
import {relationshipPreference,activePartners,hasUnclearCommitments} from './relationship-rules.js';
import {gameDate,weekday,datedText} from './calendar.js';
import {absolute, advance, BY_ID, clock, hash, log, personState, relationship, createAppointment, isBooked, romanticFit} from './simulation.js';

const unique = (items, value) => { if (!items.includes(value)) items.push(value); };

export function bond(s, id) {
  const r = relationship(s, id);
  r.days ??= [];
  r.sharedDays ??= [];
  r.romance ??= {stage:'friends', cooldownUntil:0, attempts:{}, firsts:{}};
  r.romance.attempts??={};r.romance.firsts??={};r.romance.cooldownUntil??=0;
  if(r.romance.stage==='dating')r.romance.agreement??='exclusive';
  // Older saves recorded shared experiences as text. Keep those experiences useful.
  for (const memory of r.memories) {
    const match = memory.match(/^第(\d+)天一起(?:在|參與)/);
    if (match) unique(r.sharedDays, Number(match[1]));
  }
  return r;
}

export function relationshipLabel(s, id) {
  const r = bond(s, id);
  if(r.romance.stage==='ended')return s.day-(r.romance.endedDay??s.day)<3?'已結束交往 · 需要空間':'結束交往後，慢慢重新相處';
  if(r.romance.stage==='dating'&&r.romance.trial)return '試著交往中';
  if (r.romance.stage === 'dating') return s.day-(r.romance.startedDay??s.day)>=7&&r.trust>=18&&r.sharedDays.length>=4?'穩定交往中':'正在交往';
  return friendshipStage(s,id).label;
}
export const FRIENDSHIP_STAGES=[
 {label:'還沒正式認識',description:'先從一次自然的招呼開始。'},
 {label:'已經認識',description:'你們記得彼此，還在找舒服的相處方式。'},
 {label:'逐漸熟悉的朋友',description:'已經能聊近況，也開始記得對方在意的事。'},
 {label:'聊得來的朋友',description:'經過不同日子的相處，談話逐漸自在。'},
 {label:'彼此信任的朋友',description:'一起經歷事情、守住約定，讓彼此更放心。'},
 {label:'親近的朋友',description:'長時間累積的信任，讓你們成為生活中重要的朋友。'}
];
export function friendshipStage(s,id){const r=bond(s,id);let index=0;if(r.familiar>0)index=1;if(r.familiar>=10&&r.trust>=4)index=2;if(r.familiar>=18&&r.trust>=8&&r.days.length>=3)index=3;if(r.familiar>=28&&r.trust>=14&&r.days.length>=5&&r.sharedDays.length>=2)index=4;if(r.familiar>=40&&r.trust>=22&&r.days.length>=8&&r.sharedDays.length>=4)index=5;return {...FRIENDSHIP_STAGES[index],index,next:FRIENDSHIP_STAGES[index+1]?.label??null};}

export function syncSocial(s) {
  s.social ??= {lastInitiativeDay:0};
  s.social.commitmentWarning=hasUnclearCommitments(s);
  for (let i=0; i<s.appointments.length; i++) {
    const a=s.appointments[i];
    a.id ??= `legacy-${i}`;
    if (a.status === 'proposed' && absolute(s) >= (a.day-1)*1440+a.time-30) {
      a.status='expired';
      log(s, `與${s.people.find(p=>p.id===a.person).name}的待回覆邀約已過期，雙方沒有確認約定。`);
    }
  }
  // One unsolicited invitation at most per day, from someone who already knows you.
  if (s.social.lastInitiativeDay === s.day || s.time > 960 || isBooked(s,s.day,1080)) return;
  const people=s.people.filter(p=>{
    const r=bond(s,p.id);
    return r.familiar>=8 && r.trust>=3 && s.day-r.lastProactive>=2 &&
      !scheduleConflict(s,{day:s.day,time:1080,duration:60,person:p.id});
  }).sort((a,b)=>Number(bond(s,b.id).romance.stage==='dating'&&liking(s,b.id)>=80&&intimacy(s,b.id).score>=80)-Number(bond(s,a.id).romance.stage==='dating'&&liking(s,a.id)>=80&&intimacy(s,a.id).score>=80)||hash(a.id*31+s.day)-hash(b.id*31+s.day));
  const p=people[0];
  if (!p) return;
  const closeInvite=bond(s,p.id).romance.stage==='dating'&&liking(s,p.id)>=80&&intimacy(s,p.id).score>=80;
  if(closeInvite&&!scheduleConflict(s,{day:s.day,time:1200,duration:45,person:p.id})&&(s.life?.cleanliness??0)>=60){const a=createAppointment(s,{person:p.id,day:s.day,time:1200,loc:'home',kind:'partner-stay',duration:45,status:'proposed',origin:'npc'});bond(s,p.id).lastProactive=s.day;s.social.lastInitiativeDay=s.day;s.messages.unshift({person:p.id,day:s.day,time:s.time,kind:'proposal',appointmentId:a.id,read:false,text:'今天20:00想去找你，吃點東西、聊聊天。要是都覺得自在，也想留下來；見面後再一起決定，好嗎？19:30前回我就好。'});return;}
  const walking=['散步','運動'].includes(p.hobby),homeVisit=bond(s,p.id).familiar>=18&&bond(s,p.id).trust>=8&&hash(p.id*59+s.day)<.25,loc=homeVisit?'guestHome':walking?'park':'cafe';
  const a=createAppointment(s,{person:p.id,day:s.day,time:1080,loc,kind:homeVisit?'visit':walking?'walk':'meal',duration:homeVisit?60:30,status:'proposed',origin:'npc'});
  bond(s,p.id).lastProactive=s.day;
  s.social.lastInitiativeDay=s.day;
  s.messages.unshift({person:p.id,day:s.day,time:s.time,kind:'proposal',appointmentId:a.id,read:false,
    text:homeVisit?'今天18:00要不要來我家坐坐？我會留一小時，17:30前回我就好，不方便也沒關係。':`今天18:00要不要一起到${BY_ID[loc].name}${walking?'走走':'吃點東西'}？17:30前回我就好，不方便也沒關係。`});
  log(s,`${p.name}主動傳來一則邀約，等待你的回覆。`);
}

export function replyProposal(s, id, accept) {
  syncSocial(s);
  const a=s.appointments.find(a=>a.id===id);
  if (!a || a.status!=='proposed') return '這則邀約已處理或過期，沒有新增約定。';
  if (accept && isBooked(s,a.day,a.time,a.id,a.duration??30)) return '這個時段已有約定，無法同時答應。可以先婉拒其中一個邀請。';
  a.status=accept?'confirmed':'declined';
  const message=s.messages.find(m=>m.appointmentId===id);
  if (message) {message.read=true;message.reply=accept?'accepted':'declined';}
  log(s, accept?`你答應了${s.people.find(p=>p.id===a.person).name}：${gameDate(a.day)}${clock(a.time)}，${BY_ID[a.loc].name}見。`:'你婉拒了邀約，彼此保留自己的時間。');
  return accept?'已確認約定，可到「我的日程」查看。':'已回覆：謝謝邀請，這次不方便，下次有機會再約。';
}

export function cancelAppointment(s, id) {
  const a=s.appointments.find(a=>a.id===id);
  if (!a || a.status!=='confirmed') return '這個約定目前無法取消。';
  const late=absolute(s) >= (a.day-1)*1440+a.time-30;
  a.status='cancelled';
  if(a.reservedMoney&&s.life){s.life.money+=a.reservedMoney;a.reservedMoney=0;}
  if (a.reservedFood && s.life) {s.life.ingredients+=a.reservedFood;a.reservedFood=0;}
  if (late) relationship(s,a.person).trust-=1;
  const p=s.people.find(p=>p.id===a.person);
  s.messages.unshift({person:p.id,day:s.day,time:s.time,read:false,text:late?'收到。臨時變動有點可惜，下次請早點告訴我。':'收到，謝謝你提前告訴我，我會安排自己的事情。'});
  log(s,`你通知${p.name}取消約定。${late?'臨時取消讓對方有些失落。':'已提前告知，沒有影響信任。'}`);
  return late?'已通知取消。臨時變動會讓對方失落，下次早點安排。':'已提前通知取消，雙方可以安排其他事情。';
}

function availableFor(s,p,minutes) {
  if (s.time+minutes>1380) return '今晚時間不足，明天再聊吧。';
  for(let t=s.time;t<=s.time+minutes;t++) {
    const st=personState(s,p,t);
    if(st.location!==s.location) return '我接下來還有安排，找個能好好相處的時間吧。';
    if(st.activity==='上課中') return '現在在上課，下課後再聊吧。';
  }
  if(s.energy<5) return '你好像有些累了，先休息一下吧。';
  return null;
}

export function socialAction(s,p,action) {
  const trial=action==='tryDating';if(trial)action='confess';
  const r=bond(s,p.id),romance=r.romance;
  const minutes=action==='dateChat'?6:['confess','apologize','discussOpen','breakup'].includes(action)?4:2;
  const unavailable=availableFor(s,p,minutes);
  if(unavailable) return unavailable;
  const meeting=s.appointments.find(a=>a.person===p.id&&a.day===s.day&&a.status==='met'&&s.location===a.loc&&s.time>=a.time&&s.time+minutes<a.time+30);
  if(Object.hasOwn(TOUCH_NAMES,action)||action==='preference')return affectionAction(s,p,action);
  if(['privacy','disclose','repair','reconcile','downplay','clarify'].includes(action))return relationshipSceneAction(s,p,action);
  if(action==='dateChat') {
    if(!meeting) return '約好並如約見面後，再一起留一段時間好好聊聊。';
    if(meeting.sharedConversation) return '剛才一起聊過了，這段回憶我會記得。';
    meeting.sharedConversation=true;r.trust+=2;if(romanticFit(p))r.attraction++;
    unique(r.days,s.day);unique(r.sharedDays,s.day);
    const text=`${gameDate(s.day)}一起${meeting.loc==='guestHome'?'到同學家作客，分享最近的生活':meeting.loc==='home'?'在家吃飯，分享今天的小事':meeting.loc==='park'?'在河邊散步，聊起各自想做的事':'在咖啡店共餐，聊起校園裡的小事'}`;
    r.memories.push(text);advance(s,minutes);log(s,`你和${p.name}留了一段時間，好好聽彼此說話。`);
    return '和你這樣慢慢聊，我覺得很自在。今天這段時間很開心。';
  }
  if(action==='apologize') {
    const missed=s.appointments.find(a=>a.person===p.id&&a.status==='missed'&&!a.apologized);
    if(!missed) return '我們之間目前沒有還沒說清楚的失約。';
    missed.apologized=true;r.trust++;advance(s,minutes);
    r.memories.push(`${gameDate(s.day)}你為失約道歉，答應更早確認行程`);
    log(s,`你向${p.name}解釋失約並道歉。`);
    return '謝謝你願意解釋。下次記得提前告訴我，我也會安排自己的時間。';
  }
  if(action==='breakup'){
    if(romance.stage!=='dating')return '你們目前沒有正在進行的交往關係。';
    romance.stage='ended';romance.endedDay=s.day;romance.openConsent=false;romance.agreement=null;romance.cooldownUntil=absolute(s)+3*1440;
    r.trust=Math.max(0,r.trust-2);r.memories.push(`${gameDate(s.day)}你當面說清楚結束交往，彼此保留空間`);
    for(const a of s.appointments.filter(a=>a.person===p.id&&['proposed','confirmed'].includes(a.status))){a.status='cancelled';if(a.reservedMoney&&s.life){s.life.money+=a.reservedMoney;a.reservedMoney=0;}if(a.reservedFood&&s.life){s.life.ingredients+=a.reservedFood;a.reservedFood=0;}}
    advance(s,minutes);log(s,`你和${p.name}結束交往。既有回憶保留，不會立刻回到親近朋友。`);return '你把結束交往的決定說清楚。彼此需要一段時間適應，也暫停了尚未進行的兩人約定。';
  }
  if(action==='discussOpen'){
    if(romance.stage==='ended'&&romance.cooldownUntil>absolute(s))return '對方現在需要空間，之後再談關係吧。';
    if(romance.openConsent)return '你們已談過可以各自發展其他關係；這不代表可以忽略約定或對方的感受。';
    if(romance.boundaryAskedDay===s.day)return '今天已經談過這個想法，先尊重對方的回答。';
    romance.boundaryAskedDay=s.day;advance(s,minutes);romance.knownPreference=relationshipPreference(p);
    if(relationshipPreference(p)==='exclusive'){r.memories.push(`${gameDate(s.day)}我說明希望交往是專一的關係`);return '我希望交往是彼此專一的。如果你想同時和其他人發展，我不會答應；你仍然可以選擇結束我們的關係。';}
    if(r.familiar<18||r.trust<12||r.days.length<3||r.sharedDays.length<2)return '我願意討論不同的相處方式，但目前還不夠了解彼此，暫時沒有同意同時交往。';
    romance.openConsent=true;if(romance.stage==='dating')romance.agreement='open';r.memories.push(`${gameDate(s.day)}充分討論後，同意可以各自發展其他關係，仍要尊重每一方的界線與約定`);
    log(s,`你和${p.name}明確討論並同意非專一的關係安排。`);return '我願意在彼此知情的前提下，試著讓各自也能發展其他關係。時間、變動和界線仍要說清楚；其他當事人也需要自己答應。';
  }
  if(!['confess','hand','hug','kiss','lean','hair','forehead','cuddle'].includes(action)) return '先聊聊今天的生活吧。';
  if(action!=='confess'&&romance.stage==='dating'){const gate=intimacyGate(s,p,action);if(gate)return gate;}
  if(romance.cooldownUntil>absolute(s)) return '剛才已經說過我的想法了，先聊點別的，給彼此一些時間。';
  if(romance.attempts[`${s.day}:${action}`]) return '今天已經聊過這件事，留點時間慢慢相處吧。';
  if(action==='confess'&&romance.stage==='dating') return '我們已經在交往了。比起再確認一次，我更想珍惜一起相處的時間。';
  if(action==='confess'){const others=activePartners(s,p.id);if(others.length&&(!romance.openConsent||others.some(other=>!bond(s,other.id).romance.openConsent||bond(s,other.id).romance.agreement!=='open')))return '你目前已有交往對象。如果想同時發展，需要先和每位當事人談清楚並得到明確同意；目前還沒有成立新的交往關係。';}
  romance.attempts[`${s.day}:${action}`]=true;
  const refuse=(text)=>{romance.cooldownUntil=absolute(s)+180;advance(s,2);log(s,`${p.name}表達了自己的界線，你停下邀請，給對方空間。`);return text;};
  if(!romanticFit(p)) return refuse('我很珍惜我們的相處，但對你是朋友的感覺。希望你能理解。');
  if(action==='confess') {
    if(r.familiar<(trial?14:18)||r.trust<(trial?7:9)||r.attraction<5||r.days.length<3||r.sharedDays.length<(trial?1:2))
      return refuse('我還想多了解彼此。一起經歷些日常，再慢慢想這件事，好嗎？');
    if(hash((p.id+1)*211+s.day*17)<.18) return refuse('我最近有些事情要整理，還沒有準備好開始交往。可以再給我一點時間嗎？');
    romance.trial=trial;romance.stage='dating';romance.startedDay=s.day;romance.startedAt=absolute(s);romance.agreement=romance.openConsent?'open':'exclusive';advance(s,minutes);
    r.memories.push(`${gameDate(s.day)}彼此表達心意，決定開始交往`);
    log(s,`你與${p.name}確認了彼此的心意，開始交往。`);
    if(trial)return '可以，我們先試著交往看看。這是雙方確認的交往，也保留慢慢認識與重新討論的空間。';
    return romance.agreement==='open'?'我願意。我們依照先前談好的安排交往，也讓每位當事人知情；有變動仍要說清楚。':'我也一直很期待和你見面。我願意和你專一地交往，我們慢慢認識交往後的彼此。';
  }
  return '我們可以先說說自己喜歡的相處方式。';
}
