import {relationship,personState,advance,log,romanticFit} from './simulation.js';
import {liking,intimacy,earnIntimacy} from './intimacy.js';
import {calendarDate,gameDate} from './calendar.js';
import {characterArt} from './character-art.js';

export const STORY_LEVELS=[20,40,60,80,100];
export const STORY_TITLES=['想多留一會兒','不必逞強的時候','只告訴你的心事','把你放進明天','我們選擇的日常'];
export const FOODS=['番茄燉飯','清爽蔬菜麵','香菇雞湯','鮮蔬蛋捲'];
export const TOGETHER=['安靜散步','一起看電影','一起做飯','玩桌遊'];
export const ROOM_ART='assets/romance/room-night-v1.png';
export const preference=p=>({food:p.id%FOODS.length,together:(p.id*7+1)%TOGETHER.length});
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function storyState(s,id){
 const r=relationship(s,id);r.story??={completed:{},album:[],daily:{},celebrated:{},notices:{}};
 const data=r.story;data.completed??={};data.album??=[];data.daily??={};data.celebrated??={};data.notices??={};return data;
}
export function sharedMoment(s,p){const r=relationship(s,p.id);r.days??=[];r.sharedDays??=[];if(!r.days.includes(s.day))r.days.push(s.day);if(!r.sharedDays.includes(s.day))r.sharedDays.push(s.day);}
export function presentFor(s,p,minutes=0){
 if(!p||s.time+minutes>1380||s.energy<5)return '今晚的時間或精力不夠，休息後再一起繼續。';
 for(let t=s.time;t<=s.time+minutes;t++){const st=personState(s,p,t);if(st.location!==s.location||st.activity==='上課中')return '先找一段兩個人都能留下來的時間；對方現在不方便，或接下來有安排。';}
 return null;
}
export function addAlbum(s,p,key,title,text,{art=null,type='共同回憶'}={}){
 const data=storyState(s,p.id);if(data.album.some(x=>x.key===key))return false;
 data.album.push({key,title,text,day:s.day,time:s.time,loc:s.location,art,type});
 relationship(s,p.id).memories.push(`${gameDate(s.day)}${title}：${text}`);return true;
}
export function nextStory(s,p){
 const data=storyState(s,p.id),index=STORY_LEVELS.findIndex((_,i)=>!data.completed[i]);if(index<0)return null;
 const r=relationship(s,p.id),required=STORY_LEVELS[index];let reason='';
 if(liking(s,p.id)<required)reason=`好感度 ${liking(s,p.id)}/${required}`;
 else if(index>=3&&r.romance?.stage!=='dating')reason='先一起確認交往心意';
 else if(index===4&&(s.day-(r.romance.startedDay??s.day)<30||intimacy(s,p.id).score<80))reason=`交往滿30天、親密度 ${intimacy(s,p.id).score}/80`;
 else if(data.lastStoryDay===s.day)reason='今天的心事先留在心裡，明天再翻開下一章';
 else if(index===2&&p.id===1&&s.location!=='park')reason='一起到河畔公園，再把這段心事說完';
 return {index,title:STORY_TITLES[index],required,reason};
}
function lines(p,index){
 const start=[
  `你正準備離開，${p.name}卻把腳步放慢。「剛剛聊到${p.hobby}，我還有一件事想說。」`,
  `${p.name}把手機扣在桌上，平常的笑容收了起來。「關於${p.goal}，其實沒有我說的那麼順利。」`,
  `話題繞了一圈，${p.name}終於看向你。「我不太常跟別人說這些。今天想試著告訴你。」`,
  `談到明天的安排，${p.name}停了一下。「如果每次都等剛好有空才見面，我可能會一直等你。」`,
  `你們翻看這段時間的回憶。${p.name}笑著說：「我想要的不是每天都特別，而是普通的日子裡也有你。」`
 ];
 const pilots={1:[
  '陳以晴收好志工社的名單，卻沒有急著走。「今天我一直在照顧大家，現在可以換你陪我走一小段嗎？」',
  '陳以晴原本還在笑，說到一半忽然安靜。「大家都說我很會合作，可是我也會怕，自己是不是只有有用的時候才被需要。」',
  '河邊的風把陳以晴的髮尾吹亂。她抬起手又放下。「跟你在一起，我好像不用一直找話題，也不怕冷場。」',
  '「先說，我不是在查勤喔。」陳以晴笑完，又認真看著你。「我只是想知道，下週哪一個晚上，我可以期待見到你？」',
  '陳以晴把兩個杯子並排放好。「我以前覺得喜歡一個人要很熱鬧。現在覺得，連一起洗杯子都能笑，也很好。」'
 ],46:[
  '楊子晴把相機拿給你看，照片裡是今天的光。「我拍到這張的時候，第一個想給你看。你現在有空嗎？」',
  '楊子晴刪掉一張又一張照片。「別人都說很好看，可是我還找不到自己真正想留下的東西。你會不會也覺得我想太多？」',
  '楊子晴停在一張沒有拍好的照片上。「這張有點糊，可是你那天在旁邊笑。我一直捨不得刪。」',
  '「下次看到漂亮的天空，我想直接問你要不要來。」楊子晴的聲音很輕。「不用每次都先想，會不會打擾你。」',
  '楊子晴把相機放回包裡，握著杯子看向你。「今天不拍了。有些時候，我想真的待在裡面，不急著把它留下來。」'
 ]};
 return pilots[p.id]?.[index]??start[index];
}
export function beginStory(s,p){
 const data=storyState(s,p.id);if(data.active)return '這段心事還沒說完，可以接著選擇，也可以先暫停。';
 const next=nextStory(s,p);if(!next)return '已經一起走完這五個章節；新的日常仍在繼續。';if(next.reason)return next.reason;
 const blocked=presentFor(s,p,9);if(blocked)return blocked;
 data.active={index:next.index,step:0,answers:[],day:s.day,loc:s.location};return lines(p,next.index);
}
export function storyBeat(s,p){
 const a=storyState(s,p.id).active;if(!a)return null;
 const previous=a.answers.at(-1),warm=previous==='listen'||previous==='share';
 const texts=[lines(p,a.index),warm?'對方沒有急著把話收回去。你們的距離像是少了一層客氣，話題也慢慢往心裡走。':'你沒有追問。對方鬆了一口氣，告訴你現在最需要的是一點安靜。',
 a.index>=3?'「下次也這樣說清楚，好不好？」對方把選擇留在你面前，等你給一個不勉強的回答。':`「謝謝你有聽進去。」${p.name}看著你，沒有急著結束這段相處。`];
 const options=a.step===0?[['listen','先陪著聽，讓對方慢慢說'],['share','分享一次自己也不確定的經驗'],['space','問問現在想說，還是先安靜待著']]:a.step===1?[['listen','記住對方掛心的事，問怎樣的陪伴最有幫助'],['share','說說你真正欣賞對方的地方'],['space','留點空間，不急著替對方解決']]:[['listen','好，我會記住今天說過的話'],['share','也告訴對方：今天對我很重要'],['space','一起慢慢來，照彼此舒服的步調']];
 return {text:texts[a.step],options,index:a.index,step:a.step};
}
export function chooseStory(s,p,answer){
 const data=storyState(s,p.id),a=data.active;if(!a)return '現在沒有進行中的事件。';
 if(a.day!==s.day||a.loc!==s.location){delete data.active;return '剛才的相處暫停了。找好時間後可以從這一章重新開始，尚未領取獎勵。';}
 if(!['listen','share','space'].includes(answer))return '請選擇畫面上的回應。';const blocked=presentFor(s,p,3);if(blocked)return blocked;
 a.answers.push(answer);a.step++;advance(s,3);if(a.step<3)return storyBeat(s,p).text;
 const r=relationship(s,p.id),warm=a.answers.filter(x=>x!=='space').length;r.familiar+=2;r.trust+=warm>0?2:1;
 if(warm>=2&&romanticFit(p))r.attraction+=1;sharedMoment(s,p);earnIntimacy(s,p.id,'story',4);
 const text=warm>=2?'你們把心事交給彼此，也記住了對方希望被怎麼陪伴。':'你們沒有急著找答案，卻找到了一種可以安心沉默的相處。';
 data.completed[a.index]={day:s.day,answers:[...a.answers],text};data.lastStoryDay=s.day;
 if(a.index===4)r.romance.soulmateDay=s.day;
 addAlbum(s,p,`story:${a.index}`,STORY_TITLES[a.index],text,{art:p.id===1&&a.index===2?'assets/romance/S002-riverside-v1.png':null,type:p.id===1&&a.index===2?'專屬事件插畫':'心動事件'});
 delete data.active;log(s,`你與${p.name}一起完成「${STORY_TITLES[a.index]}」。`);return `${text}「${STORY_TITLES[a.index]}」已收進回憶相簿。`;
}
export function pauseStory(s,p){delete storyState(s,p.id).active;return '先把心事留在這裡。之後可以重新開始這一章，尚未完成的事件不會給獎勵。';}

const FESTIVALS=[{month:2,date:14,key:'valentine',title:'情人節的小約定'},{month:5,date:20,key:'thanks',title:'把喜歡說出口的一天'},{month:10,date:1,key:'campus',title:'校慶後的散步'},{month:12,date:25,key:'christmas',title:'冬夜裡的一杯熱飲'}];
export function birthday(p){return {month:1+(p.id*7+3)%12,date:1+(p.id*11+5)%28};}
export function celebrations(s,p){
 const r=relationship(s,p.id),data=storyState(s,p.id),now=calendarDate(s.day),items=[];
 if(r.familiar<=0)return items;
 const b=birthday(p);if(now.month===b.month&&now.date===b.date)items.push({key:`birthday:${now.year}`,title:`${p.name}的生日`,kind:'birthday'});
 for(const f of FESTIVALS)if(f.month===now.month&&f.date===now.date)items.push({key:`${f.key}:${now.year}`,title:f.title,kind:f.key});
 if(r.romance?.stage==='dating')for(const n of [30,100])if(s.day-(r.romance.startedDay??s.day)>=n)items.push({key:`anniversary:${r.romance.startedDay}:${n}`,title:`交往${n}天的紀念`,kind:'anniversary'});
 return items.filter(x=>!data.celebrated[x.key]);
}
export function upcomingCelebrations(s,p){
 if(relationship(s,p.id).familiar<=0)return [];
 const items=[],b=birthday(p),rom=relationship(s,p.id).romance;
 for(let offset=1;offset<=7;offset++){
  const d=calendarDate(s.day+offset);
  if(d.month===b.month&&d.date===b.date)items.push({day:s.day+offset,title:`${p.name}的生日`});
  for(const f of FESTIVALS)if(f.month===d.month&&f.date===d.date)items.push({day:s.day+offset,title:f.title});
  if(rom?.stage==='dating'&&[30,100].includes(s.day+offset-(rom.startedDay??s.day)))items.push({day:s.day+offset,title:`交往${s.day+offset-rom.startedDay}天的紀念`});
 }
 return items;
}
export function celebrate(s,p,key,choice){
 const data=storyState(s,p.id),event=celebrations(s,p).find(e=>e.key===key);if(!event)return '這個紀念已經一起過過，或今天不是這個節日。';
 if(!['letter','walk','meal'].includes(choice))return '選一種你們想留下的紀念。';
 const blocked=presentFor(s,p,15);if(blocked)return blocked;
 if(choice==='meal'&&(s.life?.ingredients??0)<2)return '一起準備點心需要兩份食材，可以先選寫一段話或聊聊這段日子。';
 if(choice==='meal')s.life.ingredients-=2;
 const labels={letter:'把一直想說的話寫下來',walk:'聊起一路走到今天的小事',meal:'一起準備一份簡單的點心'};
 data.celebrated[key]={day:s.day,choice};relationship(s,p.id).trust+=2;sharedMoment(s,p);earnIntimacy(s,p.id,'celebration',4);advance(s,15);
 addAlbum(s,p,key,event.title,`${labels[choice]}。對方說：「不用多盛大，我知道你記得。」`,{type:'紀念日'});return `${event.title}：${labels[choice]}。已留下紀念回憶。`;
}
export function syncStoryMessages(s){
 for(const p of s.people){const r=relationship(s,p.id);if(r.familiar<4)continue;const data=storyState(s,p.id);
  if(data.active&&(data.active.day!==s.day||data.active.loc!==s.location))delete data.active;
  const score=liking(s,p.id)>=45?intimacy(s,p.id).score:0,levels=[20,40,60,80,100];
  if(!Array.isArray(data.notesUnlocked))data.notesUnlocked=levels.filter(n=>score>=n);
  else for(const level of levels){if(score<level||data.notesUnlocked.includes(level))continue;data.notesUnlocked.push(level);const quote=level===20?`其實我最喜歡吃${FOODS[preference(p).food]}。`:level===40?`我喜歡${TOGETHER[preference(p).together]}，下次可以一起試試。`:level===60?'你想親近一點的時候，可以先問我，我會告訴你舒服的步調。':level===80?`關於${p.goal}，我想慢慢跟你說。`:'和你在一起，我不用一直想怎麼表現才好。';s.messages.unshift({person:p.id,day:s.day,time:s.time,kind:'notebook-unlock',direction:'in',source:'生活事件',read:false,text:`「${quote}」關於對方的筆記翻開了新的一頁：親密度${level}的線索已解鎖。`});}
  for(const event of celebrations(s,p)){if(data.notices[event.key])continue;data.notices[event.key]=s.day;s.messages.unshift({person:p.id,day:s.day,time:s.time,kind:'keepsake-notice',direction:'in',source:'生活事件',read:false,text:`${event.title}。想和你留一點時間，說說最近的事。不一定要準備禮物。`});}
  // One personalized daily check-in at most; do not infer historical absences on migration.
  if(data.lastCheckInDay===undefined){data.lastCheckInDay=s.day;continue;}
  if(r.romance?.stage!=='dating'||s.time<1080||data.lastCheckInDay>=s.day||s.messages.some(m=>m.person===p.id&&m.day===s.day&&m.kind==='romance-daily'))continue;
  data.lastCheckInDay=s.day;const text=p.id===1?'今天有沒有一件小事，想留到晚上告訴我？我也替你留了一件。':p.id===46?'剛剛看到一個很喜歡的光影，第一個想到你。等你有空再告訴我今天過得怎麼樣。':`今天做${p.hobby}時想到上次的聊天。晚點有空的話，想聽聽你今天的小事。`;
  s.messages.unshift({person:p.id,day:s.day,time:s.time,kind:'romance-daily',direction:'in',source:'生活事件',read:false,text});
 }
}

export const DAILY_ACTIVITIES={study:{label:'並肩自習',minutes:25},care:{label:'交換今天的小事',minutes:10},food:{label:'一起做喜歡的料理',minutes:20},ritual:{label:'建立兩人的晚安習慣',minutes:8}};
export function coupleDaily(s,p,kind,food){
 const r=relationship(s,p.id),data=storyState(s,p.id),spec=DAILY_ACTIVITIES[kind];if(!spec||r.romance?.stage!=='dating')return '確認交往後，可以一起安排這些日常。';
 const blocked=presentFor(s,p,spec.minutes);if(blocked)return blocked;
 const key=`${s.day}:${kind}`;if(data.daily[key])return '今天已經一起做過了，把下一次留給明天吧。';
 if(kind==='study'&&!['library','home','cafe'].includes(s.location))return '一起去圖書館、家裡或咖啡店，找個能坐下來的地方。';
 if(kind==='food'){
  if(s.location!=='home')return '先一起到家裡，才方便準備料理。';
  if(!Number.isInteger(food)||food<0||food>=FOODS.length)return '先選一道想做的料理。';
  if((s.life?.ingredients??0)<2)return '需要兩份食材，先到商店準備吧。';s.life.ingredients-=2;
 }
 data.daily[key]=true;if(kind==='study')s.knowledge++;if(kind==='care')s.energy=Math.min(100,s.energy+8);
 const hit=kind==='food'&&food===preference(p).food;r.trust+=hit?2:1;sharedMoment(s,p);earnIntimacy(s,p.id,'daily-'+kind,hit?4:2);advance(s,spec.minutes);
 const text=kind==='food'?`一起做了${FOODS[food]}。${hit?'「你記得我最喜歡這個？」對方笑著多盛了一點。':'你們邊吃邊討論下次想試的味道。'}`:kind==='study'?'各自完成一小段進度，卡住時互相討論。知識+1。':kind==='care'?'你們輪流說了一件開心和一件不容易的事，沒有急著給建議。精力恢復8。':'「今天先說晚安，不用一直等我回訊息。」你們約定，忙碌時也留一句讓彼此放心的話。';
 addAlbum(s,p,`daily:${key}`,spec.label,text,{type:'情侶日常'});return text;
}

export function startMiniGame(s,p,mode='cards'){
 if(!['cards','movie'].includes(mode))return '找不到這個活動。';const r=relationship(s,p.id),data=storyState(s,p.id);if(data.game)return '這一局還沒結束，可以接著玩。';
 const stay=s.partnerStay,room=stay?.person===p.id&&stay.day===s.day&&stay.status==='agreed'&&s.location==='home';
 const a=s.appointments.find(a=>a.person===p.id&&a.day===s.day&&a.status==='met'&&a.loc===s.location&&s.time>=a.time&&s.time+15<=a.time+(a.duration??30));
 if(!room&&!a)return '先依約見面，或在確認留宿後一起玩。';if(r.familiar<4)return '再熟悉一點，就可以一起玩這個小活動。';
 const blocked=presentFor(s,p,15);if(blocked)return blocked;
 if(room){stay.room??={atmosphere:0,done:[],sleep:'separate'};if(stay.room.done.includes(mode==='cards'?'game':'movie'))return '今晚已經一起做過這個活動，換一個吧。';}
 const week=Math.floor((s.day-1)/7);data.plays??={};if((data.plays[week]??0)>=3)return '這週已經一起玩了三次，下週再繼續收集新的回憶。';
 data.plays[week]=(data.plays[week]??0)+1;data.game={mode,round:0,score:0,answers:[],day:s.day,loc:s.location,room,week};return miniRound(s,p).prompt;
}
export function miniRound(s,p){
 const game=storyState(s,p.id).game;if(!game)return null;
 const pref=preference(p);const rounds=game.mode==='cards'?[
  {prompt:'抽到「空出來的一個下午」。對方比較期待哪一種相處？',options:TOGETHER,correct:pref.together},
  {prompt:'抽到「一起吃晚餐」。你會替對方準備哪一道？',options:FOODS,correct:pref.food},
  {prompt:`抽到「最近最在意的事」。你記得${p.name}提過什麼？`,options:[p.goal,'先不管，所有人都想成為社團幹部','應該是買一台昂貴的新車'],correct:0}
 ]:[
  {prompt:'先一起選電影：今晚想要哪一種節奏？',options:['安靜的生活片','熱鬧的冒險片','邊看邊聊的輕喜劇'],correct:pref.together%3},
  {prompt:'主角遇到挫折了。你會怎麼接住對方的感受？',options:['問問哪個片段讓你想到自己','立刻宣布主角做錯了什麼','直接跳過，別談心情'],correct:0},
  {prompt:'片尾字幕出現，還想留下哪一種餘韻？',options:TOGETHER,correct:pref.together}
 ];return {...rounds[game.round],round:game.round,mode:game.mode};
}
export function chooseMiniGame(s,p,choice){
 const data=storyState(s,p.id),g=data.game;if(!g)return '現在沒有進行中的小遊戲。';
 if(g.day!==s.day||g.loc!==s.location){delete data.game;return '這局因為離開或跨日而結束，沒有結算獎勵。';}
 if(g.room&&(s.partnerStay?.person!==p.id||s.partnerStay?.status!=='agreed'||s.partnerStay?.day!==s.day)){delete data.game;return '今晚的留宿已取消，這局先結束，沒有結算獎勵。';}
 const round=miniRound(s,p);if(!Number.isInteger(choice)||choice<0||choice>=round.options.length)return '請選擇畫面上的答案。';
 const blocked=presentFor(s,p,5);if(blocked)return blocked;g.answers.push(choice);if(choice===round.correct)g.score++;advance(s,5);g.round++;
 if(g.round<3)return `${choice===round.correct?'「你有記得耶。」':'「我的答案跟你不一樣，下次再猜看看。」'} ${miniRound(s,p).prompt}`;
 const score=g.score,r=relationship(s,p.id);r.trust+=score>=2?2:1;sharedMoment(s,p);earnIntimacy(s,p.id,'date-game',score>=2?4:2);
 if(g.room){const room=s.partnerStay?.room;if(room){room.atmosphere+=score>=2?2:1;room.done.push(g.mode==='cards'?'game':'movie');}}
 const title=g.mode==='cards'?'你記得的默契卡':'一起選的電影';const text=`三回合${score}/3次默契。${score===3?'「連這個你都記得。」對方把最後一張卡留給你。':score>=2?'你們記得不少彼此的小事，也多找到一個話題。':'有些答案猜錯了，笑完之後，反而更知道對方怎麼想。'}`;
 addAlbum(s,p,`game:${g.week}:${data.plays[g.week]}`,title,text,{type:'約會收藏'});delete data.game;return `${text}已收進回憶相簿。`;
}
export function cancelMiniGame(s,p){delete storyState(s,p.id).game;return '這局先停在這裡，沒有結算獎勵，仍計入本週已開始的次數。';}

export function confirmTrial(s,p){
 const r=relationship(s,p.id),rom=r.romance;if(rom?.stage!=='dating'||!rom.trial)return '目前沒有待確認的試交往。';
 if(s.day-(rom.startedDay??s.day)<3||r.trust<9)return '先相處至少三天、累積信任9，再一起討論想不想正式走下去。';
 const blocked=presentFor(s,p,6);if(blocked)return blocked;
 rom.trial=false;advance(s,6);addAlbum(s,p,`confirm:${rom.startedDay}`,'決定繼續走下去','你們談過試交往的感受，確認願意延續彼此已說好的承諾。',{type:'關係儀式'});
 return '「這幾天的相處，我很喜歡。我想和你繼續走下去。」試交往已確認，原本的交往日期與回憶都保留。';
}

export function saveMoment(s,p){
 const blocked=presentFor(s,p);if(blocked)return blocked;const r=relationship(s,p.id);if(r.familiar<4)return '先認識彼此，再詢問要不要留下一張紀念。';
 return addAlbum(s,p,`moment:${s.day}:${s.location}`,'今天的這一刻',`你們在${s.location==='home'?'家裡':'這裡'}留下一段願意記住的相處。`,{type:'紀念卡'})?'已保存今天的紀念卡，可以到回憶相簿下載。':'今天在這裡已經留過紀念了。';
}
export function eventMarkup(s,p){
 const data=storyState(s,p.id),beat=storyBeat(s,p),next=nextStory(s,p),r=relationship(s,p.id);
 if(r.familiar<=0)return '';
 return `<section class="romance-events" id="romance-events-${p.id}"><h3>屬於你們的下一章</h3>${beat?`<article class="story-beat"><p class="story-step">${esc(STORY_TITLES[beat.index])} · ${beat.step+1}/3</p><p class="story-line" aria-live="polite">${esc(beat.text)}</p><div class="story-options">${beat.options.map(([key,label])=>`<button data-story-choice="${key}" data-person="${p.id}">${esc(label)}</button>`).join('')}<button class="quiet" data-story-pause="${p.id}">先暫停</button></div></article>`:next?`<p>${esc(next.title)} · 好感度${next.required}</p>${next.reason?`<p class="fine">下一步：${esc(next.reason)}</p>`:`<p>對方似乎有話想對你說。找9分鐘，慢慢聽完。</p><button data-story-start="${p.id}">留一點時間給彼此</button>`}`:'<p>五個章節都已走過。你們把往後的答案留給日常。</p>'}<details><summary>章節與回憶 · ${Object.keys(data.completed).length}/5</summary>${STORY_TITLES.map((title,i)=>`<p>${data.completed[i]?'已留下回憶':'尚未發生'} · ${title}${data.completed[i]?' · '+gameDate(data.completed[i].day):' · 好感度'+STORY_LEVELS[i]}</p>`).join('')}</details></section>`;
}
export function celebrationMarkup(s,p){const items=celebrations(s,p),upcoming=upcomingCelebrations(s,p);const preview=upcoming.length?`<details><summary>未來七天的小期待</summary>${upcoming.map(e=>`<p>${gameDate(e.day)} · ${esc(e.title)}</p>`).join('')}</details>`:'';return items.length?`<section class="romance-celebrations"><h3>今天值得記住的事</h3>${items.map(e=>`<div><p>${esc(e.title)}</p><div class="partner-actions">${[['letter','把想說的話寫下來'],['walk','聊聊一路走來的小事'],['meal','一起準備點心 · 食材2']].map(([k,label])=>`<button data-celebrate="${esc(e.key)}" data-celebrate-choice="${k}" data-person="${p.id}">${label} · 15分</button>`).join('')}</div></div>`).join('')}${preview}</section>`:preview;}
export function miniMarkup(s,p){const round=miniRound(s,p),g=storyState(s,p.id).game;return round?`<section class="date-minigame"><h3>${g.mode==='cards'?'默契卡':'一起選電影'} · 第${round.round+1}/3回合</h3><p aria-live="polite">${esc(round.prompt)}</p><div class="story-options">${round.options.map((v,i)=>`<button data-mini-answer="${i}" data-person="${p.id}">${esc(v)}</button>`).join('')}<button class="quiet" data-mini-cancel="${p.id}">先結束這一局</button></div></section>`:'';}
export function dailyMarkup(s,p){if(relationship(s,p.id).romance?.stage!=='dating')return '';const pref=preference(p),visible=liking(s,p.id)>=45&&intimacy(s,p.id).score>=20;return `<section class="couple-everyday"><h3>把普通的一天過在一起</h3><div class="partner-actions">${relationship(s,p.id).romance?.trial?`<button data-confirm-trial="${p.id}">談談是否想正式繼續交往 · 6分</button>`:''}${Object.entries(DAILY_ACTIVITIES).filter(([k])=>k!=='food').map(([k,d])=>`<button data-couple-daily="${k}" data-person="${p.id}">${d.label} · ${d.minutes}分</button>`).join('')}<button data-mini-start="cards" data-person="${p.id}">玩默契卡 · 3回合</button><button data-mini-start="movie" data-person="${p.id}">一起選電影 · 3回合</button></div><details><summary>一起做飯 · 食材2份、20分</summary><p>${visible?`記得對方喜歡${FOODS[pref.food]}，可以試著做給對方吃。`:'先從一道簡單的料理，慢慢認識彼此的口味。'}</p><div class="partner-actions">${FOODS.map((f,i)=>`<button data-couple-daily="food" data-food="${i}" data-person="${p.id}">${f}</button>`).join('')}</div></details></section>`;}
export function albumMarkup(s,p){
 const data=storyState(s,p.id);return `<section class="romance-album" id="romance-album-${p.id}"><h3>回憶相簿 · ${data.album.length}段</h3><p>只收藏真的發生過的相處。紀念卡使用角色照片與文字；有專屬插畫的事件會另外標示。</p><button data-save-moment="${p.id}">詢問並留下今天的紀念</button>${[...data.album].reverse().map((item,i)=>`<article class="album-entry">${item.art?`<img src="${esc(item.art)}" loading="lazy" alt="${esc(item.title)}事件插畫">`:''}<div><small>${gameDate(item.day)} · ${esc(item.type)}</small><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p><button data-export-moment="${data.album.length-1-i}" data-person="${p.id}">下載紀念卡</button></div></article>`).join('')||'<p class="fine">一起完成心動事件、紀念日或約會遊戲後，這裡會留下第一段收藏。</p>'}</section>`;
}
export async function downloadMoment(s,p,index){
 const item=storyState(s,p.id).album[index];if(!item)return;
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;const ctx=canvas.getContext('2d');ctx.fillStyle='#f6f3eb';ctx.fillRect(0,0,1200,800);
 const spec=characterArt(p.id),art=item.art??spec?.portrait;if(art){try{const img=new Image();img.src=art;await img.decode();const width=!item.art&&spec?.layout==='two-view'?img.width*(spec.split??.5):img.width;const sw=Math.min(width,img.height*.7),sh=Math.min(img.height,width/.7);ctx.drawImage(img,(width-sw)/2,0,sw,sh,0,0,560,800);}catch{/* The written memory remains exportable without artwork. */}}
 ctx.fillStyle='#203d34';ctx.font='bold 34px sans-serif';ctx.fillText(p.name,610,100);ctx.font='26px sans-serif';ctx.fillText(item.title,610,165);ctx.font='20px sans-serif';ctx.fillText(gameDate(item.day),610,215);
 const chars=[...item.text];let line='',y=295;ctx.font='24px sans-serif';for(const char of chars){if(ctx.measureText(line+char).width>520){ctx.fillText(line,610,y);y+=40;line='';if(y>680)break;}line+=char;}ctx.fillText(line,610,y);ctx.font='18px sans-serif';ctx.fillText('Campus Go · 澄灣大學 · 回憶紀念卡',610,750);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)return;const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`CampusGo-${p.id}-${item.day}-${index}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
