import {scheduleConflict} from './schedule-rules.js';
import {intimacyGate,earnIntimacy} from './intimacy.js';
import {bond} from './social.js';
import {advance,createAppointment,isBooked,personState,hash,log} from './simulation.js';
import {gameDate} from './calendar.js';
export const PARTNER_DATES={stay:{label:'到家留宿邀約',loc:'home',time:1335,duration:45},study:{label:'圖書館整理未來方向',loc:'library',time:1080,duration:60},walk:{label:'河畔散步',loc:'park',time:1080,duration:60},shopping:{label:'百貨約會',loc:'mall',time:1080,duration:60,cost:100},cinema:{label:'雙人電影約會',loc:'cinema',time:1200,duration:120,cost:240},movie:{label:'居家電影之夜',loc:'home',time:1200,duration:120}};
function releaseStay(s){const stay=s.partnerStay;if(!stay)return;stay.status='cancelled';for(const a of s.appointments.filter(a=>a.id===stay.appointment||a.joinedStay===stay.appointment)){a.duration=a.stayOriginalDuration??(a.kind==='partner-movie'?120:45);if(a.kind==='partner-stay')a.status='cancelled';delete a.joinedStay;delete a.stayOriginalDuration;}}
export function partnerProgress(s,p){const r=bond(s,p.id),firsts=r.romance.firsts;return {days:Math.max(1,s.day-(r.romance.startedDay??s.day)+1),milestones:Object.entries({hand:'牽手',hug:'擁抱',kiss:'接吻',lean:'依偎',hair:'撫摸頭髮',forehead:'額頭輕吻',cuddle:'靠著彼此休息',overnight:'留宿',shower:'一起洗澡'}).map(([id,label])=>({id,label,day:firsts[id]})),next:firsts.hand===undefined?'見面時，可以先詢問牽手的意願。':firsts.hug===undefined?'找舒服的場合，詢問是否願意擁抱。':firsts.kiss===undefined?'牽手與擁抱之後，隔天再詢問接吻的意願。':r.trust<16?'再累積幾次約會，聽聽彼此的近況。':'安排散步、看電影或留宿見面，在家相處時再確認留宿意願。'};}
export function bookPartnerDate(s,p,kind,options={}){
 const base=PARTNER_DATES[kind],r=bond(s,p.id);if(!base||r.romance.stage!=='dating')return '正式交往後可以安排兩人約會。';
 const d={...base,time:options.time??base.time},day=options.day??(s.time<d.time-60?s.day:s.day+1);
 if(!Number.isInteger(day)||day<s.day||day>s.day+365||!Number.isInteger(d.time)||d.time<480||d.time+d.duration>1380||(day===s.day&&d.time<=s.time))return '請選未來的日期與時間，活動需在08:00–23:00之間完成。';
 if(kind==='stay'&&d.time<1200)return '留宿見面時間請安排在20:00以後。';
 if(s.appointments.some(a=>a.person===p.id&&a.day===day&&a.time===d.time&&a.kind==='partner-'+kind&&['confirmed','proposed','met'].includes(a.status)))return '這次約會已在日程中，不需要重複預約。';
 if(scheduleConflict(s,{day,time:d.time,duration:d.duration,person:p.id,kind:'partner-'+kind,loc:d.loc}))return '這段時間已有安排，與邀約或個人行程重疊，請選其他時間。';
 if((s.life?.money??0)<(d.cost??0))return '這次約會需準備 $'+d.cost+'，先保留足夠生活費。';
 if(d.loc==='home'&&(s.life?.cleanliness??50)<60)return '先把住處整理到60以上，再邀請對方到家裡。';
 if(hash((p.id+1)*337+day*19)<.16)return '那天我想留點時間處理自己的事，改天再約，好嗎？';
 if(d.cost){s.life.money-=d.cost;s.life.ledger.unshift({day:s.day,amount:-d.cost,text:d.label+'預留費用'});}
 createAppointment(s,{reservedMoney:d.cost??0,person:p.id,day,time:d.time,loc:d.loc,duration:d.duration,kind:'partner-'+kind,status:'confirmed'});
 const at=String(Math.floor(d.time/60)).padStart(2,'0')+':'+String(d.time%60).padStart(2,'0');
 log(s,'你和'+p.name+'約好'+gameDate(day)+' '+at+d.label+'。');
 return '已約好'+gameDate(day)+' '+at+' '+d.label+(kind==='stay'?'；到家見面後，再詢問當晚是否願意留宿。':'，可到情侶頁或我的日程查看。');
}
export function partnerAction(s,p,action){const r=bond(s,p.id),rom=r.romance;if(rom.stage!=='dating')return '目前沒有正在進行的交往關係。';
 if(action==='cancelStay'){const stay=s.partnerStay;if(!stay||stay.person!==p.id||stay.status!=='agreed')return '目前沒有待進行的留宿。';releaseStay(s);log(s,'你們取消了今晚留宿，各自休息。');return '已取消留宿，對方會依原本約會時間離開。';}
 const minutes=action==='overnight'?5:action==='breakfast'?20:20;if(s.time+minutes>1380||s.energy<8)return '時間或精力不足，先休息，改天再好好相處。';
 for(let t=s.time;t<=s.time+minutes;t++)if(personState(s,p,t).location!==s.location||personState(s,p,t).activity==='上課中')return '對方現在不在這裡，或接下來有安排。先約好時間再見面吧。';
 rom.daily??={};const key=`${s.day}:${action}`;if(rom.daily[key])return '今天已經進行過了，留些時間做其他事情吧。';
 if(action==='overnight'){const gate=intimacyGate(s,p,'overnight');if(gate)return gate;
  let a=s.appointments.find(a=>a.person===p.id&&a.day===s.day&&a.status==='met'&&a.loc==='home'&&s.time>=a.time&&s.time<a.time+(a.duration??30));
  if(s.location!=='home'||s.time<1200)return '20:00後在家見面時，可以詢問今晚是否留宿；可先安排留宿邀約或居家約會。';
  if(s.partnerStay?.day===s.day&&['agreed','completed'].includes(s.partnerStay.status))return '今晚已經安排留宿，先照顧好現有約定。';
  if((s.life?.cleanliness??0)<60||r.trust<16||r.sharedDays.length<3||s.day-(rom.startedDay??s.day)<3||rom.firsts.hug===undefined)return '我還想慢慢來。先多幾次自在的約會，也把家裡整理舒服些吧。';
  const extensionStart=a?.time??s.time;
  const compatible=other=>other.person===p.id&&other.loc==='home'&&['partner-movie','partner-stay'].includes(other.kind);
  if(s.appointments.some(other=>other!==a&&other.day===s.day&&['confirmed','met'].includes(other.status)&&other.time+(other.duration??30)>s.time&&other.time<1380&&!compatible(other))||s.personalPlans?.some(other=>other.day===s.day&&!other.done&&other.time+other.duration>s.time&&other.time<1380))return '今晚稍後有其他安排與留宿時間重疊，先調整日程再討論。';
  rom.daily[key]=true;advance(s,5);if(hash((p.id+1)*337+s.day*23)<.2)return '今晚我想回自己家休息，下次再討論，好嗎？';
  if(!a)a=createAppointment(s,{person:p.id,day:s.day,time:extensionStart,loc:'home',kind:'partner-stay',status:'met',duration:1380-extensionStart});
  a.stayOriginalDuration=a.duration??30;a.duration=1380-a.time;
  for(const other of s.appointments.filter(other=>other!==a&&other.day===s.day&&compatible(other)&&['confirmed','met'].includes(other.status)&&other.time+(other.duration??30)>s.time)){other.status='met';other.joinedStay=a.id;}
  s.partnerStay={person:p.id,day:s.day,status:'agreed',appointment:a.id,room:{atmosphere:0,done:[],sleep:'separate'}};log(s,`${p.name}答應今晚留宿，22:00後可以在家一起結束今天。`);return '今晚可以留下來。先分開睡也沒關係；到伴侶頁的「睡前時光」選活動，慢慢放鬆，再問問今晚的想法。明早可以一起吃早餐。';
 }
 if(action==='breakfast'){const stay=s.partnerStay;if(!stay||stay.person!==p.id||stay.status!=='completed'||stay.day!==s.day-1||s.location!=='home'||s.time+20>540)return '留宿隔天08:00–09:00，可以在家一起吃早餐。';if((s.life?.ingredients??0)<2)return '早餐需要兩份食材，下次提前準備好吧。';s.life.ingredients-=2;stay.status='breakfast';}
 else if(action==='checkin'){if(!['home','park','cafe'].includes(s.location))return '去家裡、公園或咖啡店，找個能好好說話的地方吧。';}
 else if(action==='activity'){const a=s.appointments.find(a=>a.person===p.id&&a.day===s.day&&a.status==='met'&&a.kind?.startsWith('partner-')&&s.location===a.loc&&s.time+20<=a.time+a.duration);if(!a)return '先安排散步或電影之夜，準時到場後，再開始共同活動。';if(a.partnerActivity)return '這次約會已經完成共同活動，可以聊聊或詢問親密互動。';a.partnerActivity=true;}
 else return '沒有這個伴侶活動。';
 rom.daily[key]=true;earnIntimacy(s,p.id,'shared',3);r.trust++;if(!r.sharedDays.includes(s.day))r.sharedDays.push(s.day);rom.experiences??=[];const label={checkin:'交換近況，談談最近需要的支持',activity:['home','cinema'].includes(s.location)?'一起看電影，分享喜歡的片段':s.location==='mall'?'一起逛百貨，認識彼此的生活喜好':'沿著河畔散步，交換生活裡的小事',breakfast:'一起準備早餐，再各自出門'}[action];rom.experiences.push({day:s.day,label});r.memories.push(`${gameDate(s.day)}${label}`);advance(s,minutes);log(s,`你和${p.name}${label}。`);return `${label}。你們多了解彼此一點，也留下一段共同回憶。`;
}
export function finishPartnerNight(s){const stay=s.partnerStay;if(!stay||stay.status!=='agreed')return '';if(stay.day!==s.day||s.location!=='home'||s.time<1320||bond(s,stay.person).romance.stage!=='dating'){releaseStay(s);return '今晚留宿未完成，對方依自己的安排回家。';}stay.status='completed';const r=bond(s,stay.person);r.romance.firsts.overnight??=s.day;r.memories.push(`${gameDate(s.day)}彼此同意在家留宿，${stay.room?.sleep==='together'?'確認意願後並肩休息':'分開休息'}，隔天各自安排生活`);r.trust++;return `你們道過晚安，${stay.room?.sleep==='together'?'並肩安心休息':'各自休息'}。明早09:00前可一起準備早餐（兩份食材）。`;}
export function syncPartnerStay(s){const stay=s.partnerStay;if(stay?.status==='agreed'&&(s.day!==stay.day||s.location!=='home'||bond(s,stay.person).romance.stage!=='dating')){releaseStay(s);log(s,'今晚留宿已取消，對方會依自己的安排離開。');}}
