export const CORE_IDS=[0,1,2,3,6,12,13,16,17,26,28,35,46];
export const FRIEND_IDS=[14,15,18,24,25,27,29,34,36,37,38,39,44,45,47,48,49,54,55,56];
export const STAGES=['陌生','相識','友好','曖昧','心動','交往','親密'];
export const TRAITS={warmth:'熱血',steady:'穩重',humor:'幽默',care:'體貼'};
export const SLOTS=[{name:'早上',time:540},{name:'午後',time:840},{name:'晚上',time:1140}];
export const LOCATIONS={library:'圖書館',canteen:'學生餐廳',court:'戶外球場',cafe:'樹影咖啡',photo:'攝影社',music:'音樂社',board:'桌遊社',volunteer:'志工社',park:'河畔公園',home:'我的房間',shop:'合作社',design:'設計教室'};
const concepts={
 0:['光落在底片上','一張沒拍好的照片','想被記住的風景','鏡頭另一端的你','把未來洗成照片','照片展','photo','steady'],
 1:['把名字寫在同一張表上','志工名單上的空格','笑容背後的疲倦','留一盞燈給你','兩人份的普通日子','志工企劃','volunteer','care'],
 2:['草稿紙的留白','被退回的作品','顏色不必討好誰','這次想畫你','最後一頁不是結尾','作品展','design','steady'],
 3:['球場邊的約定','輸球之後','不用逞強的那一天','一起走過加時賽','以後也在場邊','球隊練習','court','warmth'],
 4:['會議散場以後','沒人看見的準備','可靠的人也會累','把選擇交給自己','不是一個人的行程','校慶活動','cafe','care'],
 5:['留給你的座位','規則之外的一步','讓你看見我的手牌','我們自己的默契','不散場的星期五','桌遊聚會','board','humor'],
 6:['慢一點的回合','一個人也能玩的遊戲','把心事放到桌上','想和你組隊','留到下個學期的存檔','桌遊企劃','board','humor'],
 7:['多準備的一份點心','笑話說完之後','不想再用笑帶過','今晚認真說一次','早餐不要只做一份','料理活動','canteen','humor'],
12:['香氣飄出教室','失敗也能端上桌','想做給誰吃','不是客套的喜歡','冰箱上的兩張便條','料理筆記','canteen','care'],
13:['排練室最後的聲音','走音的一小節','不必每次都完美','只為你重奏一次','和聲留給明天','音樂演出','music','steady'],
16:['不同的觀看方式','別人眼中的標籤','照片裡真正的自己','站在同一邊','一起選下一個目的地','攝影作業','photo','warmth'],
17:['舞步停下的瞬間','忘掉節拍那天','不需要一直發光','把手交給你','日常也是雙人舞','社團公演','court','warmth'],
26:['書頁裡的便條','沒寄出的讀後感','故事之外的心事','這句話想念給你','一起把日子寫下去','讀書會','library','care'],
28:['一起完成的配色','推翻原來的答案','理性之外的小事','這次想聽直覺','兩個人的設計稿','設計提案','design','steady'],
35:['交換一本旅行簿','不擅長的語言','停下來也算旅行','最想回去的地方','下一站一起走','旅行筆記','cafe','humor'],
46:['留一段安靜的路','沒有說出口的邀請','照片背後的距離','我想先靠近一步','我們的日常收藏','生活手帳','park','care']
};
export function routeData(p){const d=concepts[p.id]??[...concepts[26]];return {titles:d.slice(0,5),project:d[5],place:d[6],trait:d[7],secret:`${p.name}希望${p.goal}，卻不想只被「${p.trait}」定義。`};}
export function tier(p){return CORE_IDS.includes(p.id)?'core':FRIEND_IDS.includes(p.id)?'friend':'background';}
export const TIER_NAMES={core:'核心路線',friend:'友情小篇',background:'校園同學'};
export const FOODS=['熱奶茶','黑咖啡','水果茶','飯糰','牛肉麵','抹茶點心','鬆餅','檸檬水'];
export const PRESENTS=['攝影明信片','音樂選集','料理小冊','書籤','運動毛巾','桌遊卡套','電影手帳','植物小盆栽'];
export function preferences(p){const index=p.id%8;return {topic:p.hobby,food:FOODS[index],avoid:FOODS[(index+3)%8],gift:PRESENTS[index],place:routeData(p).place};}
export const CALENDAR_EVENTS=[{day:19,title:'期中考',kind:'exam'},{day:29,title:'校慶晚會',kind:'confess'},{day:44,title:'海邊社團日',kind:'beach'},{day:59,title:'學期舞會',kind:'confess'}];
export function eventScript(p,chapter){const r=routeData(p),v=preferences(p),title=r.titles[chapter-1];const intros={
1:[`陳以晴把志工名單推到你面前。「有些名字我還對不上臉，你願意陪我認一認嗎？」`,`她把剩下的工作全圈了起來，又笑著說沒關係。你注意到她揉了揉手腕。`,`「大家都覺得我很會照顧人。」她停了一下，「所以有時候，我也不知道怎麼說自己累了。」`,`晚會散場，她沒有立刻收起桌上的燈。「你每次都會留下來，我有點開始期待這件事了。」`,`兩個杯子並排放在桌上。「我想和你練習的，不是轟轟烈烈，是以後都能坦白說今天過得怎樣。」`],
46:[`楊子晴在河畔停下腳步。「這裡很安靜。你也喜歡不用一直找話題的地方嗎？」`,`你看到手機裡一則刪了又打的邀請。她把螢幕轉開：「其實只是想問你要不要散步。」`,`她翻到手帳裡空白的一頁。「我很會記風景，但不太會記下自己想靠近誰。」`,`夕陽裡，她先放慢了腳步。「今天不是剛好順路。我是特別想和你一起走。」`,`她把一張新的合照位置留在手帳上。「不用每一天都很特別，但我希望你在。」`]
};
const lines=intros[p.id]??[`你和${p.name}一起準備${r.project}。對方留了一個位置：「你想從哪裡開始？」`,`準備${r.project}時出了小差錯。${p.name}把原本的計畫翻到背面：「也許我沒有看起來那麼有把握。」`,`你們聊到「${p.goal}」。${p.name}難得沒有立刻把話題帶開，等著你的回應。`,`人群慢慢散去，${p.name}仍留在原地。「今天想見你，和${r.project}已經沒什麼關係。」`,`你們把${r.project}告一段落。「以後也留一段時間給彼此，好嗎？」`];
return {title,lines:[lines[chapter-1],`「${p.trait}」之外，你看見${p.name}也有遲疑的時候。現在的回答，會決定這段話能走多遠。`,`你們走到${LOCATIONS[r.place]}門口。${p.name}又提起${v.topic}，語氣比剛才放鬆了一點。`],rounds:[
 [{text:'先聽完，再一起想辦法',trait:'care',good:true},{text:'把事情拆成幾個能完成的小步驟',trait:'steady',good:true},{text:'直接替對方決定，不用再討論',trait:'warmth',good:false}],
 [{text:`聊聊${v.topic}，讓話題慢慢打開`,trait:'humor',good:true},{text:'承認自己也會緊張，陪對方試一次',trait:'warmth',good:true},{text:'說別想太多，趕快結束這個話題',trait:'steady',good:false}],
 [{text:`記住對方喜歡${v.food}，問下次要不要一起去`,trait:r.trait,good:true},{text:'謝謝對方願意告訴我這些，尊重對方的步調',trait:'care',good:true},{text:'現在就要求一個關係答案',trait:'humor',good:false}]
]};}

export function semesterFixedEvent(p,index,slot,legacy=false){return (tier(p)!=='background'||legacy)&&((index%5===p.id%5&&slot===2)||(index%5===(p.id+2)%5&&slot===1));}
export function semesterLocation(p,index,slot,invite=null,legacy=false){if(invite?.person===p.id&&invite.index===index&&invite.slot===slot&&invite.accepted)return 'home';if(semesterFixedEvent(p,index,slot,legacy))return routeData(p).place;if(slot===0)return ['library','design','photo'][p.dept%3];if(slot===1)return ['canteen','cafe','court'][p.id%3];const club=['music','photo','board','basket','dance','cook','volunteer','council'][p.club];return ['photo','music','board','volunteer'].includes(club)?club:['park','library','cafe'][p.id%3];}
export function beachScript(p){return {title:'把海風留在這一天',lines:[`浪花剛好碰到腳踝。${p.name}回過頭：「今天不用趕著去哪裡。我想好好記住這片海。」`,`黃昏，你們把水果放到野餐墊上。「喜歡的不只是風景，還有現在和誰坐在這裡。」`,`星光落在海面上。「回去之後，生活還是會忙吧。但我們可以記得，今天有這樣一起慢下來。」`],rounds:[[{text:'一起走到安全的淺水處，問對方想怎麼玩',trait:'care',good:true},{text:'聊聊最近最想記住的一件小事',trait:'steady',good:true},{text:'拉著對方去不熟悉的深水區',trait:'warmth',good:false}],[{text:'先問喜歡什麼，再分享帶來的水果',trait:'care',good:true},{text:'拿自己有點笨拙的準備開個玩笑',trait:'humor',good:true},{text:'只顧拍照，忽略對方正在說話',trait:'steady',good:false}],[{text:'謝謝對方今天的陪伴，約好忙碌時也坦白溝通',trait:'steady',good:true},{text:'慢慢走回集合處，把安靜的時刻留給彼此',trait:'care',good:true},{text:'把這趟約會當成必須答應所有要求的交換',trait:'humor',good:false}]]};}
