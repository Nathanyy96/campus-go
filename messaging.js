import {characterArt} from './character-art.js';
import {personState,relationship,BY_ID,absolute} from './simulation.js';
export function migrateMessages(s){s.admirers??=[];s.chatQueue??=[];s.personalPlans??=[];s.chatSerial??=0;}
export function sendMessage(s,person,text,photo=null){
 migrateMessages(s);text=text.trim().slice(0,600);
 if(!s.people.some(p=>p.id===person)||(!text&&!photo))return null;
 if(s.chatQueue.some(q=>q.person===person))return null;
 const m={id:`chat-${++s.chatSerial}`,person,text,photo,direction:'out',day:s.day,time:s.time,read:true};
 s.messages.unshift(m);s.chatQueue.push({id:m.id,person,at:absolute(s)+8+(person%5)*4});return m;
}
export function fallbackReply(s,p,m){const st=personState(s,p);if(m.photo)return '收到你分享的照片了！我有空再仔細看，晚點聊。';if(/課|讀|作業|報告/.test(m.text))return `我最近想${p.goal}，課業也得留點時間。你今天讀得怎麼樣？`;if(/吃|餐|飯/.test(m.text))return '一起吃飯聽起來不錯。不過先用邀約確認時間吧，我還得看看自己的安排。';return st.activity==='上課中'?'剛在上課，現在才看到。你今天過得如何？':`剛才在忙${st.activity}。最近還是很喜歡${p.hobby}，你呢？`;}
export function syncAttention(s){
 migrateMessages(s);
 if(s.attentionDay===s.day)return;
 const candidates=s.people.filter(p=>!s.admirers.includes(p.id)&&relationship(s,p.id).familiar>=2);
 if(!candidates.length)return;
 const p=candidates[(s.day*7)%candidates.length];s.admirers.push(p.id);s.attentionDay=s.day;
 s.messages.unshift({person:p.id,asset:characterArt(p.id)?.fullbody??null,text:`今天和你聊得很開心，我先關注你了。有空可以再聊聊${p.hobby}。${characterArt(p.id)?'也分享一張我的穿搭照給你。':''}`,day:s.day,time:s.time,kind:'attention',read:false});
}
