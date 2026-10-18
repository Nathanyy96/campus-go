import {affectionPreference} from './affection-preferences.js';
import {intimacy} from './intimacy.js';
import {relationshipPreference} from './relationship-rules.js';
import {gameDate,weekday,datedText} from './calendar.js';
import {characterArt} from './character-art.js';
import {ordinaryEvents,personState,relationship,CLUB_PLACES} from './simulation.js';
export const AI_ACTIVITIES={read:['library','閱讀'],sport:['court','打球與運動'],walk:['park','散步與整理心情'],practice:['club','社團自主練習'],work:['cafe','兼職工作'],shop:['shop','採買生活用品'],social:['plaza','和朋友交流']};
export function brain(s,id){s.npcBrains??={};return s.npcBrains[id]??=( {day:0,mood:'',thought:'',intent:'',memories:[],plans:[]});}
export function needsThought(s,p){const b=brain(s,p.id);if(b.day<s.day)return true;return s.relations[p.id]?.romance?.stage==='dating'&&(b.dailyThinkCount??1)<2&&s.time>=(b.lastThoughtAt??540)+360&&s.time<=1260&&!s.messages.some(m=>m.person===p.id&&m.day===s.day&&m.kind==='initiative'&&!m.read);}
export function thinkingContext(s,p){const b=brain(s,p.id),r=relationship(s,p.id);const slot=ordinaryEvents(p,s.day).sort((a,b)=>a.time-b.time).find(e=>e.time>=s.time+15&&e.time<=1200&&!/上課|課前|餐|吃|洗手間|回到/.test(e.activity));return {day:s.day,time:s.time,weekday:weekday(s.day),activity:personState(s,p).activity,mood:b.mood,intent:b.intent,memories:[...b.memories,...r.memories,...Object.entries(r.futurePlans??{}).map(([kind,plan])=>`共同計畫${kind}：${plan.status}，目標日期${plan.targetDay?gameDate(plan.targetDay):'尚未約定'}`),...(r.wardrobe?.look?[`目前穿搭偏好：${r.wardrobe.look}，一起挑選並由本人私下換好`]:[])].slice(-8).map(datedText),relationship:r.romance?.stage==='dating'?`交往中，親密度${intimacy(s,p.id).score}/100，${intimacy(s,p.id).label}；${r.romance.agreement==='open'?'已明確同意可各自發展其他關係':'期待專一的交往'}`:r.romance?.stage==='ended'?'已結束交往，需要保留空間':'朋友，尚未交往',affectionMeaning:affectionPreference(p).description,relationshipMood:(r.relationshipScenes??[]).some(e=>e.status!=='resolved')?'有親眼看見或被告知的心事，希望談清楚':'自在相處',relationshipPreference:relationshipPreference(p),canMessage:r.familiar>=2&&!(r.romance?.stage==='ended'&&s.day-(r.romance.endedDay??s.day)<3)&&personState(s,p).activity!=='上課中'&&s.time>=540&&s.time<=1260,hasPhoto:!!characterArt(p.id),slot:slot?.time??null};}
export function applyThought(s,p,result,source='OpenAI'){
 if(!result||!['thought','mood','intent','message'].every(k=>typeof result[k]==='string')||!Object.hasOwn(AI_ACTIVITIES,result.activity))return false;
 const b=brain(s,p.id),context=thinkingContext(s,p);b.dailyThinkCount=b.day===s.day?(b.dailyThinkCount??1)+1:1;b.lastThoughtAt=s.time;b.day=s.day;b.thought=result.thought.slice(0,300);b.mood=result.mood.slice(0,80);b.intent=result.intent.slice(0,180);b.source=source==='Gemini'?'Gemini':'OpenAI';
 b.memories=[...b.memories,`${gameDate(s.day)}：${b.intent}`].slice(-12);
 const [place,label]=AI_ACTIVITIES[result.activity];b.plans=[...(b.plans||[]).filter(plan=>plan.day===s.day&&plan.time<=s.time),...(context.slot===null?[]:[{day:s.day,time:context.slot,loc:place==='club'?CLUB_PLACES[p.club]:place,activity:label}])];
 if(context.canMessage&&(result.message.trim()||(result.sharePhoto===true&&context.hasPhoto)))s.messages.unshift({person:p.id,text:result.message.slice(0,600),asset:result.sharePhoto===true?characterArt(p.id)?.fullbody??null:null,direction:'in',source:b.source,kind:'initiative',day:s.day,time:s.time,read:false});return true;
}
