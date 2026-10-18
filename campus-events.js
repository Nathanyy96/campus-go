import {weekday} from './calendar.js';
import {overlaps} from './schedule-rules.js';
const PROGRAMS=[
 {key:'film',title:'電影片段交流夜',loc:'council',club:7,hobbies:['電影','閱讀'],description:'分享喜歡的鏡頭，聽聽不同科系的看法。',reward:'知識 +1',knowledge:1},
 {key:'music',title:'午后不插電分享',loc:'music',club:0,hobbies:['音樂','攝影'],description:'帶著一首喜歡的歌，認識社團以外的新朋友。',reward:'精力 +12',energy:12},
 {key:'photo',title:'校園攝影散步',loc:'park',club:1,hobbies:['攝影','散步'],description:'沿河畔找一個主題，一起交流構圖與觀察。',reward:'知識 +1',knowledge:1},
 {key:'board',title:'跨系桌遊交流',loc:'board',club:2,hobbies:['桌遊','閱讀'],description:'一起學一款桌遊，和不同科系的同學分組合作。',reward:'知識 +1',knowledge:1},
 {key:'volunteer',title:'週末志工小隊',loc:'volunteer',club:6,hobbies:['散步','運動'],description:'合作整理校園分享物資，聽聽彼此在意的事情。',reward:'參與同學的共同經歷',knowledge:0},
 {key:'cook',title:'簡單料理交換課',loc:'cook',club:5,hobbies:['料理','烹飪'],description:'社團提供練習材料，一起完成一道日常料理。',reward:'料理經驗 +1',cooking:1}
];
const roll=n=>{const value=Math.sin(n*12.9898)*43758.5453;return value-Math.floor(value);};
export function eventOnDay(day){const w=weekday(day),week=Math.floor((day-1)/7);let index,time;if(w===2){index=week%2;time=1110;}else if(w===5){index=2+week%2;time=840;}else if(w===6){index=4+week%2;time=600;}else return null;return {...PROGRAMS[index],day,time,duration:60,id:`campus-${day}-${PROGRAMS[index].key}`};}
export function upcomingCampusEvents(s){return Array.from({length:8},(_,i)=>eventOnDay(s.day+i)).filter(e=>e&&(e.day>s.day||e.time+e.duration>s.time)).slice(0,3);}
export function eventParticipants(s,event){if(!event)return [];return s.people.filter(p=>!s.appointments.some(a=>a.person===p.id&&a.day===event.day&&['confirmed','met'].includes(a.status)&&overlaps(event.time-20,event.duration+40,a.time,a.duration??30))).sort((a,b)=>{
 const score=p=>(p.club===event.club?0:event.hobbies.includes(p.hobby)?1:2)+roll(p.id*53+event.day*17);
 return score(a)-score(b);
 }).slice(0,8);}
