import {STUDENT_NAMES} from './names.js';
export const DEPTS=['資訊工程','企業管理','視覺設計','外國語文','傳播媒體','心理學','運動休閒','餐旅管理'];
export const CLUBS=['音樂社','攝影社','桌遊社','籃球社','舞蹈社','料理社','志工社','學生自治'];
export const PLACES=[
 ['plaza','中央廣場',550,430,'公共','榕樹下有幾張長椅，遠處傳來社團排練的聲音。'],
 ['library','圖書館',520,130,'學習','靠窗座位灑進陽光。適合安靜閱讀與準備報告。'],
 ['office','教師辦公室',740,130,'行政','門口貼著諮詢時間，偶爾有同學拿著資料進出。'],
 ['admin','行政接待處',915,130,'行政','課務與轉入報到的窗口。'],
 ['cs','資訊工程教室',180,290,'科系','白板上留著今天的程式題，桌邊擺著筆電。'],
 ['business','企業管理教室',180,395,'科系','幾位同學正在討論分組提案。'],
 ['language','外國語文教室',345,290,'科系','書架上有外文讀物與交流活動海報。'],
 ['psych','心理學教室',345,395,'科系','圓桌旁放著研究方法與討論課的講義。'],
 ['design','視覺設計教室',755,290,'科系','作品與草圖散在桌上，這裡有新的展覽公告。'],
 ['media','傳播媒體教室',915,290,'科系','攝影器材櫃旁貼著採訪分組表。'],
 ['sport','運動休閒教室',755,395,'科系','運動課程的紀錄板上寫著本週的練習安排。'],
 ['hospitality','餐旅管理教室',915,395,'科系','今天的料理實作剛結束，空氣裡有淡淡香氣。'],
 ['music','音樂社',770,535,'社團','譜架和吉他靠在牆邊，大家正在準備練習。'],
 ['photo','攝影社',920,535,'社團','一面照片牆記錄著校園的不同角落。'],
 ['board','桌遊社',770,625,'社團','長桌上排著棋盤與卡牌，歡迎加入一局。'],
 ['basket','籃球社',140,180,'社團','隊員會在這裡集合，再一起去球場。'],
 ['dance','舞蹈社',920,625,'社團','鏡牆映著整齊的排練空間。'],
 ['cook','料理社',770,715,'社團','料理台旁貼著本週的共享食譜。'],
 ['volunteer','志工社',920,715,'社團','大家正在整理物資與週末活動的名單。'],
 ['council','學生自治辦公室',915,50,'社團','場地借用表、活動企劃與學生提案放在桌上。'],
 ['court','戶外球場',140,70,'運動','午後常有人來這裡投籃。'],
 ['gym','體育館',325,100,'運動','場館開放給體育課與社團練習。'],
 ['canteen','學生餐廳',345,535,'生活','熱騰騰的餐點和聊天聲，是午間最熱鬧的地方。'],
 ['cafe','樹影咖啡',180,625,'生活','玻璃窗外是樹影，適合輕鬆聊天。'],
 ['shop','便利商店',345,625,'生活','飲料、文具與簡單餐點都能在這裡找到。'],
 ['gate','校門',550,705,'公共','沿著步道走出校園，就是熟悉的生活街區。'],
 ['home','我的住處',345,745,'住處','小小的套房，慢慢整理成自己的生活。'],
 ['park','河畔公園',145,745,'公共','樹蔭和步道沿著河岸延伸，適合散步。'],
 ['west','西側步道',345,200,'公共','連接教學區、體育館與圖書館。'],
 ['east','東側步道',755,200,'公共','通往專業教室與行政大樓。'],
 ['rest','生活休息區',550,555,'公共','飲水機、洗手間入口與可稍坐的長椅。']
].map(([id,name,x,y,type,desc])=>({id,name,x,y,type,desc}));
export const BY_ID=Object.fromEntries(PLACES.map(p=>[p.id,p]));
export const DEPT_PLACES=['cs','business','design','language','media','psych','sport','hospitality'];
export const CLUB_PLACES=['music','photo','board','basket','dance','cook','volunteer','council'];
export const EDGES=[['plaza','west'],['plaza','east'],['plaza','canteen'],['plaza','rest'],['rest','gate'],['gate','home'],['home','park'],['home','shop'],['shop','cafe'],['shop','canteen'],['cafe','park'],['west','cs'],['west','language'],['cs','business'],['language','psych'],['business','psych'],['psych','plaza'],['business','canteen'],['west','gym'],['gym','court'],['court','basket'],['west','library'],['library','office'],['office','admin'],['office','east'],['admin','council'],['east','design'],['design','media'],['design','sport'],['media','hospitality'],['sport','hospitality'],['sport','music'],['hospitality','photo'],['music','photo'],['music','board'],['photo','dance'],['board','dance'],['board','cook'],['dance','volunteer'],['cook','volunteer'],['music','rest'],['cook','gate']];
export const hash=(n)=>{let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export function route(from,to){if(!BY_ID[from]||!BY_ID[to])throw Error('Unknown place');const distances=Object.fromEntries(PLACES.map(p=>[p.id,Infinity])),prev={},todo=new Set(PLACES.map(p=>p.id));distances[from]=0;while(todo.size){const a=[...todo].sort((a,b)=>distances[a]-distances[b])[0];todo.delete(a);if(a===to)break;for(const e of EDGES){const b=e[0]===a?e[1]:e[1]===a?e[0]:null;if(!b||!todo.has(b))continue;const weight=Math.max(1,Math.round(Math.hypot(BY_ID[a].x-BY_ID[b].x,BY_ID[a].y-BY_ID[b].y)/65));if(distances[a]+weight<distances[b]){distances[b]=distances[a]+weight;prev[b]=a;}}}const nodes=[to];while(nodes[0]!==from){const p=prev[nodes[0]];if(!p)throw Error('Disconnected map');nodes.unshift(p);}return {nodes,minutes:distances[to]};}
const first=['林','陳','沈','許','江','周','李','王','張','吳','劉','黃','蔡','鄭','楊','何'];
const female=['知夏','以晴','若寧','可欣','語彤','予安','映彤','采薇','思涵','品妍','子晴','書瑤','芷萱','心瑜','宛庭','依晨','詠恩','雅筑','沐晴','雨柔','婉甄','佩儀','靖雯','佳穎'];
const male=['承佑','柏辰','宇哲','子謙','明軒','奕安','哲宇','書恆','冠廷','庭維','俊傑','立衡','睿哲','育誠','浩然','文謙'];
const traits=['慢熱而細心','開朗、喜歡合作','安靜但有自己的想法','直率、重視守約','好奇、喜歡新事物','務實、願意傾聽','獨立、珍惜空間','幽默、偶爾有點迷糊'];
const hobbies=['攝影','音樂','料理','閱讀','運動','桌遊','電影','散步'];
const goals=['完成自己的第一件作品','找一群能自在相處的朋友','爭取下學期獎學金','把社團活動辦好','練習勇敢表達自己的想法','平衡課業與兼職'];
const featured=[['林知夏',0,0,1],['陳以晴',1,1,6],['沈若寧',2,2,1],['許可欣',3,6,3],['李承佑',4,1,7],['吳子謙',5,0,2]];
export function createRoster(){const counts=[12,12,10,10,10,8,10,8];let people=[],id=0;for(let dept=0;dept<8;dept++)for(let j=0;j<counts[dept];j++,id++){let sex=j<Math.round(counts[dept]*.6)?'女':'男';people.push({id,name:sex==='女'?first[id%16]+female[Math.floor(id/16)*7+id%16<24?Math.floor(id/16)*7+id%16:(id*7)%24]:first[id%16]+male[(id*3)%16],sex,age:20+id%5,dept,club:(id*3+dept)%8,trait:traits[id%8],hobby:hobbies[(id+dept)%8],goal:goals[id%6],portrait:null,friend:(id+7)%80});}for(let i=0;i<6;i++){let p=people[i];Object.assign(p,{name:featured[i][0],portrait:i,dept:featured[i][2],club:featured[i][3],sex:i<4?'女':'男',trait:traits[i],hobby:hobbies[i]});}
// Preserve exact department sizes and 32 male / 48 female after featured identities are placed.
const original=people.map(p=>p.dept);let targetCounts=counts.slice();for(const p of people.slice(0,6))targetCounts[p.dept]--;let at=0;for(let i=6;i<people.length;i++){while(targetCounts[at]===0)at++;people[i].dept=at;targetCounts[at]--;}
let femaleCount=people.filter(p=>p.sex==='女').length;for(let i=79;femaleCount!==48&&i>=6;i--){if(femaleCount>48&&people[i].sex==='女'){people[i].sex='男';femaleCount--;}else if(femaleCount<48&&people[i].sex==='男'){people[i].sex='女';femaleCount++;}}
const used=new Set();for(let i=0;i<people.length;i++){const p=people[i];if(i>=6){const names=p.sex==='女'?female:male;let k=0;let n;do{n=first[(i+Math.floor(k/names.length))%first.length]+names[(i*7+k)%names.length];k++;}while(used.has(n));p.name=n;}used.add(p.name);}for(const p of people)p.name=STUDENT_NAMES[p.id];return people;}
export function newGame(){return {version:3,day:1,time:540,location:'plaza',energy:100,knowledge:0,people:createRoster(),relations:{},follow:[],appointments:[],messages:[],pendingMessages:[],journal:[{at:540,day:1,text:'新學期開始。你站在中央廣場，今天可以先去教室，也可以認識幾位同學。'}],interactionCounts:{},transferAdded:false};}
export const absolute=(s)=> (s.day-1)*1440+s.time;
export const clock=(t)=>`${String(Math.floor(t/60)%24).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
export function relationship(s,id){return s.relations[id]??(s.relations[id]={familiar:0,trust:0,attraction:0,lastProactive:0,memories:[]});}
export function ordinaryEvents(p,day){
 const own=DEPT_PLACES[p.dept],club=CLUB_PLACES[p.club],seed=p.id*17+day*13,weekend=(day-1)%7>=5;
 const options=weekend?['library','cafe','park','court','shop','canteen','gym','plaza']:['library','cafe','plaza',own,'park','canteen','office','shop'];
 const free=(n)=>options[(seed+n)%options.length];
 const leisure=loc=>({library:'閱讀與整理筆記',cafe:'喝咖啡、與朋友聊天',park:'散步與攝影',court:'自主打球',shop:'採買生活用品',canteen:'用餐與休息',gym:'自主健身',plaza:'逛市集與碰見朋友',office:'處理課務與諮詢'}[loc]||'自習與整理作業');
 const morning=!weekend&&(p.id+day)%4!==0,afternoon=!weekend&&(p.id+day*2)%3===0;
 const lunch=660+(seed%5)*20;
 const events=[{time:0,loc:'gate',activity:'在校外休息'},
 {time:480+(seed%3)*15,loc:morning?own:free(1),activity:morning?'課前準備':'安排早上的空檔'},
 {time:540,loc:morning?own:free(2),activity:morning?'上課中':leisure(free(2))},
 {time:630,loc:free(3),activity:weekend?({library:'閱讀興趣書籍',cafe:'和朋友喝咖啡',park:'週末散步',court:'自主打球',shop:'採買生活用品',canteen:'早餐與朋友聚餐',gym:'自主健身',plaza:'參加校園市集'}[free(3)]):'課間處理自己的事情'},
 {time:lunch,loc:p.id%7===0?'cafe':'canteen',activity:'吃飯、與朋友聊天'},
 {time:780,loc:afternoon?own:(seed%4===1?'canteen':free(4)),activity:afternoon?'上課中':seed%4===1?'午後用餐與休息':leisure(free(4))},
 {time:870,loc:seed%5===0?'canteen':(seed%4===0?(weekend?'park':'office'):club),activity:seed%5===0?'吃晚午餐、整理筆記':seed%4===0?(weekend?'週末戶外活動':'與老師討論課業'):'社團練習與交流'},
 {time:960,loc:seed%3===0?'canteen':free(5),activity:seed%3===0?'吃點東西、整理筆記':leisure(free(5))},
 {time:1050+(seed%3)*15,loc:'canteen',activity:'晚餐時間'},
 {time:1140,loc:p.club===3||seed%4===0?'court':seed%3===0?club:free(6),activity:p.club===3||seed%4===0?'晚間打球':seed%3===0?'晚間社團活動':'晚間自由活動'},
 {time:1260+(seed%3)*15,loc:'gate',activity:'回到校外住處'}];
 if(p.id<3&&day===1)Object.assign(events.find(e=>e.time===540),{loc:'plaza',activity:'課前自由活動'});
 if(seed%4===0)events.push({time:900,loc:'rest',activity:'暫時去洗手間'},{time:915,loc:club,activity:'繼續社團活動'});
 if(p.transfer&&day===3)events.push({time:540,loc:'admin',activity:'辦理轉入報到'},{time:600,loc:own,activity:'認識新同學'});
 return events;
}
export function dayPlan(s,p){const events=ordinaryEvents(p,s.day);for(const plan of s.npcBrains?.[p.id]?.plans??[]){if(plan.day!==s.day)continue;const slot=events.find(e=>e.time===plan.time);if(slot&&!/上課|課前|餐|吃|洗手間|回到/.test(slot.activity)&&BY_ID[plan.loc])Object.assign(slot,{loc:plan.loc,activity:plan.activity});}for(const a of s.appointments.filter(a=>a.person===p.id&&a.day===s.day&&['confirmed','met'].includes(a.status))){const before=events.filter(e=>e.time<a.time).sort((a,b)=>a.time-b.time).at(-1);let travel=route(before.loc,a.loc).minutes;for(let i=events.length-1;i>=0;i--)if(events[i].time>=a.time-travel&&events[i].time<a.time+30)events.splice(i,1);events.push({time:a.time-travel,loc:a.loc,activity:'前往約定地點'},{time:a.time+30,loc:DEPT_PLACES[p.dept],activity:'繼續自己的安排'});}
const byTime=new Map();for(const e of events)byTime.set(e.time,e);const sorted=[...byTime.values()].sort((a,b)=>a.time-b.time);let last='gate';const segments=[];for(let i=0;i<sorted.length;i++){const e=sorted[i],end=sorted[i+1]?.time??1440,r=route(last,e.loc);segments.push({...e,end,from:last,route:r});last=e.loc;}return segments;}
export function personState(s,p,time=s.time){const seg=dayPlan(s,p).filter(e=>e.time<=time).at(-1);const elapsed=time-seg.time;let coords=BY_ID[seg.loc],location=seg.loc,activity=seg.activity;if(elapsed<seg.route.minutes){let remain=elapsed;const ns=seg.route.nodes;for(let i=1;i<ns.length;i++){const a=BY_ID[ns[i-1]],b=BY_ID[ns[i]],mins=route(a.id,b.id).minutes;if(remain<mins){const t=remain/mins;coords={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};break;}remain-=mins;}location=null;activity='移動中';}
return {location,x:coords.x,y:coords.y,activity,destination:seg.loc};}
export function log(s,text){s.journal.unshift({at:s.time,day:s.day,text});s.journal=s.journal.slice(0,70);}
export function resolveAppointments(s){
  for(const a of s.appointments.filter(a=>a.day===s.day&&a.status==='confirmed')){
    const p=s.people.find(p=>p.id===a.person);
    if(s.time>=a.time&&s.time<=a.time+20&&s.location===a.loc&&personState(s,p).location===a.loc){
      a.status='met';a.metAt=s.time;
      const r=relationship(s,a.person);r.trust+=3;r.familiar+=3;
      r.days??=[];r.sharedDays??=[];
      if(!r.days.includes(s.day))r.days.push(s.day);
      if(!r.sharedDays.includes(s.day))r.sharedDays.push(s.day);
      r.memories.push(`第${s.day}天一起在${BY_ID[a.loc].name}見面`);
      log(s,`你如約見到${p.name}。對方留出半小時，可以一起好好聊聊。`);
    }else if(s.time>a.time+20){a.status='missed';relationship(s,a.person).trust-=2;log(s,`你錯過與${p.name}的約定。可以下次見面時解釋。`);}
  }
}
export function advance(s,minutes){
  if(!Number.isFinite(minutes)||minutes<0)throw Error('Invalid time');
  const end=Math.min(1380,s.time+minutes),spent=end-s.time;
  resolveAppointments(s);
  for(let t=s.time+1;t<=end;t++){
    s.time=t;resolveAppointments(s);
    for(const m of s.pendingMessages.filter(m=>!m.delivered&&m.at<=absolute(s))){
      const p=s.people.find(p=>p.id===m.person),st=personState(s,p);
      const text=st.activity==='上課中'?'我正在上課，晚點再聊。':st.location?`我剛好在${BY_ID[st.location].name}，之後還有自己的安排。`:'我正在路上，等到地方再說。';
      s.messages.unshift({person:p.id,text,day:s.day,time:s.time,read:false});m.delivered=true;log(s,`${p.name}回覆：「${text}」`);
    }
  }
  s.energy=Math.max(0,s.energy-Math.ceil(spent/45));
}
export function nextDay(s){for(const a of s.appointments.filter(a=>a.day===s.day&&a.status==='confirmed')){a.status='missed';relationship(s,a.person).trust-=2;}s.day++;s.time=480;s.energy=100;s.location='home';if(s.day===3&&!s.transferAdded){s.people.push({id:80,name:'何映澄',sex:'女',age:22,dept:2,club:1,trait:'慢熱、喜歡仔細觀察',hobby:'攝影',goal:'適應新的科系並完成作品',portrait:null,friend:2,transfer:true});s.transferAdded=true;log(s,'班級公告：今天有一位設計系轉學生報到，上午可到行政接待處詢問。');}log(s,`第${s.day}天開始，今天又有新的安排。`);}
export function talk(s,p,topic){const st=personState(s,p);if(st.location!==s.location)return '對方已經離開這裡，改天再聊吧。';if(st.activity==='上課中')return '現在在上課，我們下課再聊，好嗎？';const key=`${s.day}:${p.id}:${topic}`,count=s.interactionCounts[key]??0;s.interactionCounts[key]=count+1;const r=relationship(s,p.id);if(count>=2)return '剛才好像聊過這個了。下次再分享新的事情吧。';r.days??=[];if(!r.days.includes(s.day))r.days.push(s.day);let text;if(topic==='greet'){r.familiar+=2;text=r.familiar<=2?`你好，我是${p.name}，${DEPTS[p.dept]}系的。最近想${p.goal}。你呢？`:`又見面了。今天過得怎麼樣？我剛在忙${st.activity==='自由活動'?'自己的事情':st.activity}。`;}else if(topic==='interest'){r.familiar+=2;r.attraction+=romanticFit(p)?1:0;text=`我喜歡${p.hobby}。有時候一投入，就會忘記時間。下次有機會可以一起試試。`;r.memories.push(`你知道我喜歡${p.hobby}`);}else if(topic==='study'){r.familiar+=1;r.trust+=1;text=s.knowledge>=3?'你剛才的想法蠻有幫助的，謝謝。我也想把自己的部分做好。':'最近的作業有點忙，不過慢慢整理應該可以完成。我們可以互相討論。';}else{r.trust+=1;text=`最近最在意的是${p.goal}。謝謝你願意聽我說。`;}
advance(s,4);log(s,`你和${p.name}聊了${{greet:'近況',interest:'興趣',study:'課業',listen:'最近的心事'}[topic]}。`);return text;}
export const romanticFit=p=>p.sex==='女'?p.id%5!==3:p.id%7===5;
export function isBooked(s,day,time,exceptId){return s.appointments.some(a=>a.id!==exceptId&&['confirmed','met'].includes(a.status)&&a.day===day&&Math.abs(a.time-time)<60);}
export function createAppointment(s,props){const a={id:`a-${s.day}-${s.time}-${s.appointments.length}`,kind:'meal',...props};s.appointments.push(a);return a;}
export function invite(s,p){
  const st=personState(s,p);
  if(st.location!==s.location)return {text:'對方不在這裡，先找個合適時間再邀約。'};
  if(st.activity==='上課中')return {text:'現在在上課，下課再聊邀約，好嗎？'};
  const r=relationship(s,p.id);
  if(s.appointments.some(a=>a.person===p.id&&['confirmed','proposed'].includes(a.status)))return {text:'我們已經有約定或待回覆的邀約，到日程或訊息確認吧。'};
  if(r.familiar<5)return {text:'我們還不太熟，先在學校多聊幾次，好嗎？'};
  let day=s.time<1020?s.day:s.day+1;const time=1080;
  const counter=(p.id+s.day)%3===0;
  if(counter)day++;
  if(isBooked(s,day,time))return {text:'你這個時段已有其他約定，先把時間安排好吧。'};
  const a=createAppointment(s,{person:p.id,day,time,loc:'cafe',status:counter?'proposed':'confirmed',origin:counter?'counter':'player'});
  if(counter){
    const text=`這天有點忙，改成第${day}天18:00在樹影咖啡，好嗎？請在當天17:30前回覆，我再留出時間。`;
    s.messages.unshift({person:p.id,day:s.day,time:s.time,text,kind:'proposal',appointmentId:a.id,read:false});
    log(s,`${p.name}提出改期，等待你在訊息中確認。`);return {text};
  }
  log(s,`你與${p.name}約好第${day}天18:00在樹影咖啡見。`);
  return {text:`好啊，第${day}天18:00在樹影咖啡見。我會記得的。`};
}
export function askLocation(s,p){const last=s.pendingMessages.find(m=>m.person===p.id&&!m.delivered);if(last)return '已經傳訊息了，給對方一點回覆時間。';s.pendingMessages.push({person:p.id,at:absolute(s)+10+(p.id%4)*5,delivered:false});log(s,`你傳訊息給${p.name}，詢問今天的安排。`);return '訊息已送出。對方有空時會回覆，等待或做其他事會推進時間。';}
