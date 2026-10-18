import {characterArt} from './character-art.js';
import {ordinaryEvents,personState,relationship,CLUB_PLACES} from './simulation.js';
export const AI_ACTIVITIES={read:['library','閱讀'],sport:['court','打球與運動'],walk:['park','散步與整理心情'],practice:['club','社團自主練習'],work:['cafe','兼職工作'],shop:['shop','採買生活用品'],social:['plaza','和朋友交流']};
export function brain(s,id){s.npcBrains??={};return s.npcBrains[id]??=( {day:0,mood:'',thought:'',intent:'',memories:[],plans:[]});}
export function thinkingContext(s,p){const b=brain(s,p.id),r=relationship(s,p.id);const slot=ordinaryEvents(p,s.day).sort((a,b)=>a.time-b.time).find(e=>e.time>=s.time+15&&e.time<=1200&&!/上課|課前|餐|吃|洗手間|回到/.test(e.activity));return {day:s.day,time:s.time,weekday:(s.day-1)%7,activity:personState(s,p).activity,mood:b.mood,intent:b.intent,memories:[...b.memories,...r.memories].slice(-8),canMessage:r.familiar>=2,hasPhoto:!!characterArt(p.id),slot:slot?.time??null};}
export function applyThought(s,p,result){
 if(!result||!['thought','mood','intent','message'].every(k=>typeof result[k]==='string')||!Object.hasOwn(AI_ACTIVITIES,result.activity))return false;
 const b=brain(s,p.id),context=thinkingContext(s,p);b.day=s.day;b.thought=result.thought.slice(0,300);b.mood=result.mood.slice(0,80);b.intent=result.intent.slice(0,180);b.source='OpenAI';
 b.memories=[...b.memories,`第${s.day}天：${b.intent}`].slice(-12);
 const [place,label]=AI_ACTIVITIES[result.activity];b.plans=context.slot===null?[]:[{day:s.day,time:context.slot,loc:place==='club'?CLUB_PLACES[p.club]:place,activity:label}];
 if(context.canMessage&&(result.message.trim()||(result.sharePhoto===true&&context.hasPhoto)))s.messages.unshift({person:p.id,text:result.message.slice(0,600),asset:result.sharePhoto===true?characterArt(p.id)?.fullbody??null:null,direction:'in',source:'OpenAI',kind:'initiative',day:s.day,time:s.time,read:false});return true;
}
