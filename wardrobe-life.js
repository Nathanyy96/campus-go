import {relationship,personState,advance,hash,log} from './simulation.js';
import {intimacy,earnIntimacy} from './intimacy.js';
import {gameDate} from './calendar.js';
export const WARDROBE_ATLAS='assets/wardrobe/couple-wardrobe-v02.png';
export const INNERWEAR_IMAGE='assets/wardrobe/innerwear-products-v01.png';
export const LOOKS={casual:{label:'校園日常',column:0},date:{label:'外出約會',column:1},home:{label:'柔棉居家服',column:2}};
export const INNERWEAR={ivory:{label:'米白柔棉成套',column:0},blue:{label:'霧藍柔棉成套',column:1},sage:{label:'鼠尾草綠柔棉成套',column:2}};
export const wardrobePilot=id=>[1,46].includes(id);
export function wardrobeState(s,id){const r=relationship(s,id);return r.wardrobe??={look:null,inner:null,permissionDay:0,askedDay:0};}
export function wardrobeImage(id,look){const row=id===1?0:1,column=LOOKS[look]?.column??0;const [x,w]=[[2,406],[416,388],[812,375]][column],[y,h]=row===0?[2,612]:[622,699];return {row,column,x,y,w,h};}
function available(s,p,minutes){if(s.location!=='home')return '先在住處見面，再一起挑選衣服。';if(s.time+minutes>1380||s.energy<8)return '時間或精力不足，改天再慢慢挑吧。';for(let t=s.time;t<=s.time+minutes;t++)if(personState(s,p,t).location!==s.location)return '對方接下來還有安排，先約好一段時間吧。';return null;}
export function askWardrobe(s,p){if(!wardrobePilot(p.id))return '這位同學的換裝素材尚未完成。';const r=relationship(s,p.id),w=wardrobeState(s,p.id);if(r.romance?.stage!=='dating'||intimacy(s,p.id).score<55||r.trust<16)return '我想再熟悉一些，等彼此更自在，再一起挑私人的穿搭。';const blocked=available(s,p,3);if(blocked)return blocked;if(w.permissionDay===s.day)return '今天已經同意一起挑選，選好後再讓我確認。';if(w.askedDay===s.day)return '今天已經談過了，先尊重對方的回答。';w.askedDay=s.day;advance(s,3);if(hash((p.id+1)*613+s.day*31)<.2)return '今天想自己選衣服，改天再一起看看，好嗎？';w.permissionDay=s.day;log(s,`${p.name}同意今天一起挑穿搭，內衣褲只以衣物商品圖討論。`);return '可以一起挑。我會自己進房間換好，外套可以請你幫我整理；不喜歡的款式我也會直接告訴你。';}
export function changeWardrobe(s,p,look,inner){const r=relationship(s,p.id),w=wardrobeState(s,p.id);if(!wardrobePilot(p.id)||!LOOKS[look]||!INNERWEAR[inner])return '請先選一套內衣褲與外出／居家穿搭。';if(r.romance?.stage!=='dating'||w.permissionDay!==s.day)return '先詢問今天是否願意一起挑衣服。';const blocked=available(s,p,10);if(blocked)return blocked;if(w.changedDay===s.day)return '今天已經一起挑過一套了，先享受接下來的相處吧。';if((p.id===46&&inner==='sage')||(p.id===1&&inner==='blue'&&look==='home'))return '這個搭配今天不是很喜歡，能換個顏色讓我看看嗎？';w.look=look;w.inner=inner;w.changedDay=s.day;earnIntimacy(s,p.id,'wardrobe',2);r.memories.push(`${gameDate(s.day)}一起挑了${LOOKS[look].label}與${INNERWEAR[inner].label}，對方私下換好衣服後一起整理外套`);advance(s,10);log(s,`${p.name}換好${LOOKS[look].label}，你們笑著整理好衣襬。`);return '這套我喜歡。我先換好再出來，你幫我看看外套平不平整，好嗎？';}
