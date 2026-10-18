import {scheduleConflict} from './schedule-rules.js';
import {gameDate,weekday,datedText} from './calendar.js';
import {syncNames} from './names.js';
import {advance, relationship, personState, log, CLUB_PLACES, CLUBS, createAppointment} from './simulation.js';

export function migrate(s) {
  syncNames(s);
  s.life ??= {money:1200,ingredients:0,cleanliness:50,cooking:0,club:null,practice:0,actions:{},ledger:[]};
  return s;
}
const specs={clean:{loc:'home',minutes:25,energy:8,label:'整理房間'},buy:{loc:'shop',minutes:10,energy:0,cost:120,label:'購買兩份食材'},cook:{loc:'home',minutes:35,energy:8,label:'練習做飯'},work:{loc:'cafe',minutes:90,energy:22,label:'咖啡店兼職'},practice:{minutes:40,energy:12,label:'參加社團合作'}};
export function lifeAction(s,action){
  migrate(s);const l=s.life,c=specs[action];if(!c)return '沒有這個活動。';
  const loc=action==='practice'?CLUB_PLACES[l.club]:c.loc;
  if(action==='practice'&&l.club===null)return '先到喜歡的社團教室申請加入。';
  if(s.location!==loc)return '請先前往活動地點。';
  if(s.time+c.minutes>1380)return '今晚時間不足，明天再安排吧。';
  if(s.energy<c.energy+2)return '精力不足，先休息一下。';
  if((l.actions[`${s.day}:${action}`]??0)>=(action==='clean'||action==='buy'?3:1))return '今天已經完成這項活動，留些時間給其他事情吧。';
  if(action==='work'&&(s.time<660||s.time>1080))return '兼職可在11:00至18:00之間開始。';
  if(action==='practice'&&(s.time<840||s.time+40>960))return '社團合作時段為14:00至16:00，請預留40分鐘。';
  if((c.cost??0)>l.money)return '生活費不足，可以先到咖啡店兼職。';
  if(action==='cook'&&l.ingredients<1)return '沒有食材了，先到便利商店購買。';
  const peers=action==='practice'?s.people.filter(p=>p.club===l.club&&personState(s,p).location===s.location):[];
  if(action==='practice'&&!peers.length)return '目前沒有社員在場，稍等一下或明天再來。';
  l.actions[`${s.day}:${action}`]=(l.actions[`${s.day}:${action}`]??0)+1;
  advance(s,c.minutes);s.energy=Math.max(0,s.energy-c.energy);
  if(action==='clean')l.cleanliness=Math.min(100,l.cleanliness+30);
  if(action==='buy'){l.ingredients+=2;l.money-=120;l.ledger.unshift({day:s.day,amount:-120,text:c.label});}
  if(action==='cook'){l.ingredients--;l.cooking++;s.energy=Math.min(100,s.energy+18);l.cleanliness=Math.max(0,l.cleanliness-10);}
  if(action==='work'){l.money+=300;l.ledger.unshift({day:s.day,amount:300,text:c.label});}
  if(action==='practice'){l.practice++;for(const p of peers){const r=relationship(s,p.id);r.familiar++;r.trust++;r.days??=[];r.sharedDays??=[];if(!r.days.includes(s.day))r.days.push(s.day);if(!r.sharedDays.includes(s.day))r.sharedDays.push(s.day);r.memories.push(`${gameDate(s.day)}一起參與${CLUBS[l.club]}合作`);}}
  log(s,`${c.label}完成。${action==='practice'?`與${peers.length}位社員一起合作。`:''}`);return `${c.label}完成，時間過了${c.minutes}分鐘。`;
}
export function joinClub(s){migrate(s);const club=CLUB_PLACES.indexOf(s.location);if(club<0)return '請到社團教室申請。';if(s.life.club===club)return '你已是這個社團的成員。';if(s.life.club!==null)return '試玩版目前可加入一個社團，先累積共同經驗吧。';if(s.time+10>1380)return '今晚太晚了，明天再申請。';s.life.club=club;advance(s,10);log(s,`你加入了${CLUBS[club]}，合作活動開放於14:00–16:00。`);return `歡迎加入${CLUBS[club]}。` ;}
export function inviteHome(s,p){
  migrate(s);const r=relationship(s,p.id),l=s.life;
  const state=personState(s,p);if(state.location!==s.location)return '先當面聊聊，再提出邀請。';if(state.activity==='上課中')return '現在在上課，下課再討論邀約吧。';
  if(r.familiar<10||r.trust<4)return '謝謝邀請，但到家裡吃飯我還想再熟悉一點。先在學校相處吧。';
  if(l.cleanliness<60)return '你提到房間還沒整理好，等準備好了再約吧。';
  if(l.cooking<1)return '先練習一道拿手菜，下次再邀請對方品嚐。';
  if(l.ingredients<2)return '需要兩份食材，先去便利商店補齊。';
  const day=s.time<1020?s.day:s.day+1;
  if(scheduleConflict(s,{day,time:1080,duration:30,person:p.id}))return '18:00與其他安排重疊，先調整日程再邀請。';
  // Reserve ingredients now, so subsequent cooking cannot consume the guest's meal.
  l.ingredients-=2;createAppointment(s,{person:p.id,day,time:1080,loc:'home',status:'confirmed',kind:'home',reservedFood:2});
  log(s,`你與${p.name}約好${gameDate(day)}18:00在住處共餐，已備妥兩份食材。`);
  return `好，${gameDate(day)}18:00到你家吃飯。謝謝你先問我，我會準時到。`;
}
export function lifeNextDay(s){migrate(s);s.life.cleanliness=Math.max(0,s.life.cleanliness-12);}
