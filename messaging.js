import {characterArt} from './character-art.js';
import {relationship,absolute} from './simulation.js';
export function migrateMessages(s){s.admirers??=[];s.chatQueue??=[];s.personalPlans??=[];s.chatSerial??=0;for(const m of s.messages??[]){if(typeof m.asset==='string'&&/^assets\/characters\/(?!anime-v03[56]\/)/.test(m.asset)){m.asset=characterArt(m.person)?.portrait??null;}if(m.kind==='attention'&&m.direction==='system')m.text=m.text.replace('這表示對方願意多認識你，不代表已經有戀愛感情。','');}for(const m of s.pendingMessages??[]){if(!m.delivered&&!m.aiMigrated){m.delivered=true;m.aiMigrated=true;sendMessage(s,m.person,'今天有什麼安排？');}}}
export function sendMessage(s,person,text,photo=null){
 migrateMessages(s);text=text.trim().slice(0,600);
 if(!s.people.some(p=>p.id===person)||(!text&&!photo))return null;
 if(s.chatQueue.filter(q=>q.person===person).length>=5)return null;
 const m={id:`chat-${++s.chatSerial}`,person,text,photo,direction:'out',day:s.day,time:s.time,read:true};
 s.messages.unshift(m);s.chatQueue.push({id:m.id,person,at:absolute(s)+8+(person%5)*4});return m;
}
export function syncAttention(s){
 migrateMessages(s);
 if(s.attentionDay===s.day)return;
 const candidates=s.people.filter(p=>!s.admirers.includes(p.id)&&relationship(s,p.id).familiar>=2);
 if(!candidates.length)return;
 const p=candidates[(s.day*7)%candidates.length];s.admirers.push(p.id);s.attentionDay=s.day;
 s.messages.unshift({person:p.id,source:'系統通知',direction:'system',text:`${p.name}開始關注你。`,day:s.day,time:s.time,kind:'attention',read:false});
}
