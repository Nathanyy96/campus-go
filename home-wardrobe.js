import {BLACK_OUTFIT_ART} from './black-outfit-art.js';
import {semester,routeBond,stage,atSlot,intimacyValue} from './semester.js';
const entries=[
 ['cotton','花草棉睡衣','好感55／親密35',0],['cat','粉色貓耳居家裙','相處1天',120],['bunny','深藍水手兔耳款','相處2天',150],['ivory','白色水手領裙','親密45',180],['maid','黑白蕾絲居家裙','體貼4',180],['ruffle','霧藍荷葉邊套裝','穩重4',160],['navy','深藍水手層次裙','幽默4',160],['sky','晴空雙層裙','熱血4',160],['satin','櫻粉緞面睡衣','好感95',220],['knit','奶油針織長睡裙','親密70／好感100',260]
];
export const HOME_OUTFITS=entries.map(([key,label,requirement,price],index)=>({key,label,requirement,price,index}));
function collection(s,p){const v=semester(s);v.homeWardrobe??={};return v.homeWardrobe[p.id]??={unlocked:[],selected:'cotton'};}
export function homeOutfits(s,p){const v=semester(s),b=routeBond(s,p),c=collection(s,p),dating=b.score>=55&&intimacyValue(s,p)>=35;
 const milestones=[dating,dating&&(b.days?.length||0)>=1,dating&&(b.days?.length||0)>=2,dating&&intimacyValue(s,p)>=45,dating&&v.traits.care>=4,dating&&v.traits.steady>=4,dating&&v.traits.humor>=4,dating&&v.traits.warmth>=4,dating&&b.score>=95,dating&&intimacyValue(s,p)>=70&&b.score>=100];
 HOME_OUTFITS.forEach((outfit,i)=>{if(milestones[i]&&!c.unlocked.includes(outfit.key))c.unlocked.push(outfit.key);});
 return HOME_OUTFITS.map(outfit=>({...outfit,unlocked:c.unlocked.includes(outfit.key),selected:c.selected===outfit.key}));
}
export function selectedHomeOutfit(s,p){const c=collection(s,p);return homeOutfits(s,p).find(outfit=>outfit.key===c.selected&&outfit.unlocked)||null;}
export function selectHomeOutfit(s,p,key){const v=semester(s),b=routeBond(s,p),outfit=homeOutfits(s,p).find(outfit=>outfit.key===key);
 if(!outfit?.unlocked)return {ok:false,text:'先達成衣櫃中的條件，或購買這套衣服送給對方。'};
 if(b.score<55||intimacyValue(s,p)<35||s.location!=='home'||v.slot<2||v.homeInvite?.person!==p.id||v.homeInvite.index!==v.index||!v.homeInvite.accepted||(v.slot<3&&!atSlot(s,p)))return {ok:false,text:'等伴侶答應今晚來訪後，在房間一起挑選。'};
 const c=collection(s,p);if(c.selected===key&&homeWearMode(s,p)==='home')return {ok:true,text:`${p.name}：「就穿這套${outfit.label}，舒服最重要。」`};c.selected=key;c.wash=false;c.mode='home';
 const voice=p.id===1?'你選得很細心耶，我也喜歡這個樣子。':p.id===46?'那我就穿這套。和你待在一起，慢慢來就好。':p.id%3===0?'好呀，今天就當作我們的小小主題夜。':p.id%3===1?'別一直盯著看嘛……不過，這套我很喜歡。':'這套很舒服。待會一起泡杯熱茶吧。';
 return {ok:true,text:`${p.name}：「${stage(s,p)>=6?'下次也一起挑吧。':''}${voice}」已換上${outfit.label}，今晚的房間與睡前畫面會使用同一套。`};
}
export function homeFashionSelected(s,p){return !!collection(s,p).wash;}
export const WASH_SETS=['花草綠刺繡套裝','冰藍花紋套裝','象牙白蕾絲套裝','酒紅玫瑰套裝'];
export function homeWearMode(s,p){const c=collection(s,p);return c.mode??(c.wash?'wash':'home');}
export function washSetIndex(s,p){const index=collection(s,p).washLook;return Number.isInteger(index)&&index>=0&&index<4?index:0;}
function washGate(s,p){const v=semester(s),b=routeBond(s,p);
 if(b.score<55||intimacyValue(s,p)<35)return {ok:false,text:'換裝需要好感55、親密35，交往標籤不是開關。'};
 if(b.score<55||intimacyValue(s,p)<35||s.location!=='home'||v.slot<2||v.homeInvite?.person!==p.id||v.homeInvite.index!==v.index||!v.homeInvite.accepted||(v.slot<3&&!atSlot(s,p)))return {ok:false,text:'先與伴侶約好今晚在家相處，再一起挑選洗後服裝。'};
 return null;
}
export function wearWashFashion(s,p,index=0){if(!Number.isInteger(index)||index<0||index>3)return {ok:false,text:'請選擇衣櫃中的套裝。'};const error=washGate(s,p);if(error)return error;
 const c=collection(s,p);c.wash=true;c.mode='wash';c.washLook=index;const reply=['這個刺繡很細緻，我想留給安靜的晚上。','這套顏色很清爽，連心情都輕鬆了一點。','這套比平常精緻……我有點不好意思，不過很喜歡。','今天就換個配色吧，偶爾也想試試不一樣的自己。'][index];return {ok:true,text:`${p.name}：「${p.id===1?'你居然記得我的喜好。':p.id===46?'和你一起慢慢挑，感覺很好。':''}${reply}」已換上${WASH_SETS[index]}；睡前保留同一套，亦可換回居家服。`};
}
export function wearBathLook(s,p,kind){if(!['towel','robe'].includes(kind))return {ok:false,text:'請選擇浴巾或浴袍。'};const error=washGate(s,p);if(error)return error;const c=collection(s,p);c.mode=kind;c.wash=false;return {ok:true,text:`${p.name}：「我先整理一下，等會再一起聊。」已切換${kind==='towel'?'短版浴巾':'簡單短版浴袍'}，衣櫃仍可隨時換回原穿搭。`};
}
export function buyHomeOutfit(s,p,key){const v=semester(s),b=routeBond(s,p),outfit=homeOutfits(s,p).find(outfit=>outfit.key===key);
 if(!outfit||!outfit.price)return {ok:false,text:'這套隨交往進度解鎖。'};
 if(b.score<55||intimacyValue(s,p)<35)return {ok:false,text:'好感55、親密35之後，再挑選居家禮物。'};
 if(outfit.unlocked)return {ok:false,text:'已經擁有這套衣服，不會重複扣款。'};
 if(s.life.money<outfit.price)return {ok:false,text:`這套衣服需要$${outfit.price}。`};
 s.life.money-=outfit.price;collection(s,p).unlocked.push(key);
 return {ok:true,text:`${p.name}收下${outfit.label}：「謝謝你記得我的喜好。」已加入衣櫃，今晚見面時可以一起挑選。`};
}

export function wearBlackSleep(s,p){
 if(!BLACK_OUTFIT_ART[p?.id])return {ok:false,text:'這位角色的黑色荷葉邊睡衣全身圖待補。'};
 const error=washGate(s,p);if(error)return error;
 const c=collection(s,p);c.mode='sleep-black';c.wash=false;
 return {ok:true,text:`已換上${p.name}的黑色荷葉邊睡衣；房間與睡前保留同一套，不消耗時段。`};
}
