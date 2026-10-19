import {affectionPreference,touchMeaning,TOUCH_NAMES} from './affection-preferences.js';
import {relationship,personState,absolute,advance,log,romanticFit} from './simulation.js';
import {earnIntimacy} from './intimacy.js';
import {witnessAffection} from './relationship-scenes.js';
import {gameDate} from './calendar.js';
export function affectionState(s,id){const r=relationship(s,id);r.affection??={};const a=r.affection;a.firsts??={};a.history??=[];a.asked??={};a.rewards??={};return a;}
export function affectionAction(s,p,action,{initiated=false}={}){
 const r=relationship(s,p.id),a=affectionState(s,p.id),pref=affectionPreference(p),now=absolute(s);r.romance??={stage:'friends',firsts:{},attempts:{}};const rom=r.romance;rom.firsts??={};
 if(s.time+2>1380||s.energy<5)return '先留點時間與精力，再慢慢相處。';for(let t=s.time;t<=s.time+2;t++){const st=personState(s,p,t);if(st.location!==s.location||st.activity==='上課中')return '先找一個能自在見面的時間，對方現在正忙或準備離開。';}
 if(action==='preference'){a.known=true;advance(s,2);return `「${pref.description}」你記下了${p.name}自己的相處方式；實際接觸時仍可直接表達想法。`;}
 if(!TOUCH_NAMES[action])return '可以先聊聊各自喜歡的相處方式。';
 if((a.asked[action]??-Infinity)+30>now)return '剛才已經表達過了，先自然地相處一會兒，不用一直重複問。';
 if(rom?.stage==='ended'&&now<(rom.cooldownUntil??0))return '我現在需要一點自己的時間，之後再慢慢相處。';
 const decline=text=>{a.asked[action]=now;advance(s,2);return text;};
 if(/想獨處|需要空間|暫時不想接觸/.test(s.npcBrains?.[p.id]?.intent??''))return decline('我今天想保留一點自己的空間，陪我說說話就好，好嗎？');
 const meaning=touchMeaning(p,action),dating=rom?.stage==='dating';
 const familiar=dating?0:pref.familiar+(action==='kiss'?10:['hair','lean','hand'].includes(action)?2:['forehead','cuddle'].includes(action)?6:0),trust=dating?0:pref.trust+(action==='kiss'?6:['forehead','cuddle'].includes(action)?4:0);
 if(r.familiar<familiar||r.trust<trust)return decline(`「我想再熟悉一點，現在先聊聊吧。」${p.name}說明了自己的步調，沒有要求一定要先交往。`);
 if(meaning==='romantic'&&!dating&&(!romanticFit(p)||r.attraction<5))return decline('朋友間的親近我可以理解，但這個動作對我有曖昧的意思，目前還沒有那樣的感覺。');
 if(['cuddle','forehead','kiss'].includes(action)&&!['home','park','cafe'].includes(s.location))return decline('這裡太忙了，我想找個能自在相處的場合，再看看當時的心情。');
 a.asked[action]=now;a.firsts[action]??=s.day;a.lastMeaning=meaning;a.lastAccepted={action,day:s.day,time:s.time,meaning,initiated};a.history.push({...a.lastAccepted});a.history=a.history.slice(-24);
 const key=`${s.day}:touch`;if(!a.rewards[key]){a.rewards[key]=true;r.memories.push(`${gameDate(s.day)}我們${initiated?'由我主動提議、你答應':'問過彼此想法後'}${TOUCH_NAMES[action]}，${dating?'交往中的自在親近':meaning==='friendly'?'我把它當成朋友間的親近，沒有因此開始交往':'這是有曖昧的親近，但還沒有確認交往'}`);}
 if(dating)rom.firsts[action]??=s.day;earnIntimacy(s,p.id,'touch');rom.lastAccepted={...a.lastAccepted};witnessAffection(s,p,action,dating?'romantic':meaning);advance(s,2);log(s,`${p.name}${initiated?'主動提議，你答應':'答應了'}${TOUCH_NAMES[action]}。`);
 const gestures={hand:'對方握住你的手，放鬆地和你並肩走一小段。',hug:'你們給彼此一個溫暖的擁抱，再自在地鬆開。',hair:'你輕輕順過對方的頭髮，對方笑著看了你一眼。',lean:'你們肩靠著肩，慢慢聊起剛才的小事。',forehead:'你輕吻對方額頭，對方帶著笑意看著你。',kiss:'你們確認彼此的想法後，輕輕接吻。',cuddle:'你們靠著彼此，安靜地休息了一會兒。'};
 return `${initiated?'「那就過來吧。」':p.id===1?'「可以呀，別那麼緊張。」':p.id===46?'「嗯，這樣待一會兒也很好。」':'「可以，這樣我覺得自在。」'}${gestures[action]}${dating?'':meaning==='friendly'?'「對我來說，朋友也可以這樣親近。」':'你們沒有急著替這段關係下定義。'}`;
}
export function affectionOffer(s,p){const a=affectionState(s,p.id),r=relationship(s,p.id),pref=affectionPreference(p);if(a.offer?.day===s.day)return a.offer.status==='offered'?a.offer:null;if(r.familiar<Math.max(8,pref.familiar)||r.trust<Math.max(4,pref.trust)||r.romance?.stage==='ended')return null;
 const st=personState(s,p);if(st.location!==s.location||st.activity==='上課中'||s.time+3>1380||(p.id+s.day)%3!==0)return null;
 const action=pref.key==='private'?'lean':'hug';a.offer={day:s.day,action,status:'offered'};return a.offer;
}
export function answerAffectionOffer(s,p,accept){const a=affectionState(s,p.id),offer=a.offer;if(!offer||offer.status!=='offered'||offer.day!==s.day)return '這次邀請已經回覆或過了時間。';if(!accept){offer.status='declined';relationship(s,p.id).memories.push(`${gameDate(s.day)}我提議${TOUCH_NAMES[offer.action]}，你說先聊聊，我尊重你的步調`);return '「好呀，那我們先聊聊。」對方自在地收回邀請，沒有影響感情。';}const before=a.lastAccepted;const text=affectionAction(s,p,offer.action,{initiated:true});if(a.lastAccepted!==before)offer.status='accepted';return text;}
