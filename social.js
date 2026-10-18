import {absolute, advance, BY_ID, clock, hash, log, personState, relationship, createAppointment, isBooked, romanticFit} from './simulation.js';

const unique = (items, value) => { if (!items.includes(value)) items.push(value); };

export function bond(s, id) {
  const r = relationship(s, id);
  r.days ??= [];
  r.sharedDays ??= [];
  r.romance ??= {stage:'friends', cooldownUntil:0, attempts:{}, firsts:{}};
  // Older saves recorded shared experiences as text. Keep those experiences useful.
  for (const memory of r.memories) {
    const match = memory.match(/^第(\d+)天一起(?:在|參與)/);
    if (match) unique(r.sharedDays, Number(match[1]));
  }
  return r;
}

export function relationshipLabel(s, id) {
  const r = bond(s, id);
  if (r.romance.stage === 'dating') return '正在交往';
  return r.familiar >= 10 && r.trust >= 4 ? '逐漸熟悉的朋友' : r.familiar > 0 ? '已經認識' : '還沒正式認識';
}

export function syncSocial(s) {
  s.social ??= {lastInitiativeDay:0};
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
      !s.appointments.some(a=>a.person===p.id && ['confirmed','proposed'].includes(a.status));
  }).sort((a,b)=>hash(a.id*31+s.day)-hash(b.id*31+s.day));
  const p=people[0];
  if (!p) return;
  const walking=['散步','運動'].includes(p.hobby), loc=walking?'park':'cafe';
  const a=createAppointment(s,{person:p.id,day:s.day,time:1080,loc,kind:walking?'walk':'meal',status:'proposed',origin:'npc'});
  bond(s,p.id).lastProactive=s.day;
  s.social.lastInitiativeDay=s.day;
  s.messages.unshift({person:p.id,day:s.day,time:s.time,kind:'proposal',appointmentId:a.id,read:false,
    text:`今天18:00要不要一起到${BY_ID[loc].name}${walking?'走走':'吃點東西'}？17:30前回我就好，不方便也沒關係。`});
  log(s,`${p.name}主動傳來一則邀約，等待你的回覆。`);
}

export function replyProposal(s, id, accept) {
  syncSocial(s);
  const a=s.appointments.find(a=>a.id===id);
  if (!a || a.status!=='proposed') return '這則邀約已處理或過期，沒有新增約定。';
  if (accept && isBooked(s,a.day,a.time,a.id)) return '這個時段已有約定，無法同時答應。可以先婉拒其中一個邀請。';
  a.status=accept?'confirmed':'declined';
  const message=s.messages.find(m=>m.appointmentId===id);
  if (message) {message.read=true;message.reply=accept?'accepted':'declined';}
  log(s, accept?`你答應了${s.people.find(p=>p.id===a.person).name}：第${a.day}天${clock(a.time)}，${BY_ID[a.loc].name}見。`:'你婉拒了邀約，彼此保留自己的時間。');
  return accept?'已確認約定，可到「我的日程」查看。':'已回覆：謝謝邀請，這次不方便，下次有機會再約。';
}

export function cancelAppointment(s, id) {
  const a=s.appointments.find(a=>a.id===id);
  if (!a || a.status!=='confirmed') return '這個約定目前無法取消。';
  const late=absolute(s) >= (a.day-1)*1440+a.time-30;
  a.status='cancelled';
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
  const r=bond(s,p.id),romance=r.romance;
  const minutes=action==='dateChat'?6:action==='confess'||action==='apologize'?4:2;
  const unavailable=availableFor(s,p,minutes);
  if(unavailable) return unavailable;
  const meeting=s.appointments.find(a=>a.person===p.id&&a.day===s.day&&a.status==='met'&&s.location===a.loc&&s.time>=a.time&&s.time+minutes<a.time+30);
  if(action==='dateChat') {
    if(!meeting) return '約好並如約見面後，再一起留一段時間好好聊聊。';
    if(meeting.sharedConversation) return '剛才一起聊過了，這段回憶我會記得。';
    meeting.sharedConversation=true;r.trust+=2;if(romanticFit(p))r.attraction++;
    unique(r.days,s.day);unique(r.sharedDays,s.day);
    const text=`第${s.day}天一起${meeting.loc==='home'?'在家吃飯，分享今天的小事':meeting.loc==='park'?'在河邊散步，聊起各自想做的事':'在咖啡店共餐，聊起校園裡的小事'}`;
    r.memories.push(text);advance(s,minutes);log(s,`你和${p.name}留了一段時間，好好聽彼此說話。`);
    return '和你這樣慢慢聊，我覺得很自在。今天這段時間很開心。';
  }
  if(action==='apologize') {
    const missed=s.appointments.find(a=>a.person===p.id&&a.status==='missed'&&!a.apologized);
    if(!missed) return '我們之間目前沒有還沒說清楚的失約。';
    missed.apologized=true;r.trust++;advance(s,minutes);
    r.memories.push(`第${s.day}天你為失約道歉，答應更早確認行程`);
    log(s,`你向${p.name}解釋失約並道歉。`);
    return '謝謝你願意解釋。下次記得提前告訴我，我也會安排自己的時間。';
  }
  if(!['confess','hand','hug','kiss'].includes(action)) return '先聊聊今天的生活吧。';
  if(romance.cooldownUntil>absolute(s)) return '剛才已經說過我的想法了，先聊點別的，給彼此一些時間。';
  if(romance.attempts[`${s.day}:${action}`]) return '今天已經聊過這件事，留點時間慢慢相處吧。';
  if(action==='confess'&&romance.stage==='dating') return '我們已經在交往了。比起再確認一次，我更想珍惜一起相處的時間。';
  romance.attempts[`${s.day}:${action}`]=true;
  const refuse=(text)=>{romance.cooldownUntil=absolute(s)+180;advance(s,2);log(s,`${p.name}表達了自己的界線，你停下邀請，給對方空間。`);return text;};
  if(!romanticFit(p)) return refuse('我很珍惜我們的相處，但對你是朋友的感覺。希望你能理解。');
  if(action==='confess') {
    if(r.familiar<18||r.trust<9||r.attraction<5||r.days.length<3||r.sharedDays.length<2)
      return refuse('我還想多了解彼此。一起經歷些日常，再慢慢想這件事，好嗎？');
    if(hash((p.id+1)*211+s.day*17)<.18) return refuse('我最近有些事情要整理，還沒有準備好開始交往。可以再給我一點時間嗎？');
    romance.stage='dating';romance.startedDay=s.day;advance(s,minutes);
    r.memories.push(`第${s.day}天彼此表達心意，決定開始交往`);
    log(s,`你與${p.name}確認了彼此的心意，開始交往。`);
    return '我也一直很期待和你見面。我願意，我們慢慢認識交往後的彼此。';
  }
  if(romance.stage!=='dating') return refuse('這樣的接觸對我有特別的意思，我還沒有準備好。先像現在這樣相處吧。');
  if(!['home','park','cafe','plaza'].includes(s.location)) return refuse('這裡不太適合，我想留在比較自在的場合。');
  if(action==='kiss'&&(romance.firsts.hand===undefined||romance.firsts.hug===undefined||romance.firsts.hand>=s.day||romance.firsts.hug>=s.day))
    return refuse('我想再慢一點，先習慣牽手、擁抱的相處，再說好嗎？');
  if(action==='hug'&&romance.firsts.hand===undefined) return refuse('我想先從牽手慢慢習慣，好嗎？');
  if(hash((p.id+1)*211+s.day*17)<.22) return refuse('我今天比較想保留一點自己的空間。我們說說話就好，好嗎？');
  const names={hand:'牽手',hug:'擁抱',kiss:'接吻'};
  const first=romance.firsts[action]===undefined;
  if(first) {romance.firsts[action]=s.day;r.memories.push(`第${s.day}天問過彼此意願後，第一次${names[action]}`);}
  advance(s,minutes);log(s,`你詢問${p.name}的意願，對方答應了${names[action]}。`);
  return {hand:'「可以啊。」對方輕輕握住你的手，和你並肩待了一會兒。',hug:'「我願意。」你們靠近，給彼此一個溫暖的擁抱，再慢慢鬆開。',kiss:'「好。」確認彼此的心意後，你們輕輕接吻，笑著靠在一起。'}[action];
}
