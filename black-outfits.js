import {BLACK_OUTFIT_ART} from './black-outfit-art.js';
import {semester,unlockedLooks,routeBond,intimacyValue} from './semester.js';
import {homeWearMode} from './home-wardrobe.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function blackOutfitFigure(p,index,cls=''){
 const a=BLACK_OUTFIT_ART[p?.id];if(!a||![0,1].includes(index))return '';
 return `<div class="s-black-look ${cls}" style="--black-aspect:${a.aspect}"><img src="${a.source}" alt="${esc(p.name)}${index===0?'黑色水手領約會套裝':'黑色荷葉邊睡衣'}全身圖" style="left:${-100*index}%" loading="lazy"></div>`;
}
export function dateOutfitSelected(s,p){return BLACK_OUTFIT_ART[p?.id]&&semester(s).dateOutfits?.[p.id]==='black-sailor'?'black-sailor':'classic';}
export function selectDateOutfit(s,p,key){
 if(!['classic','black-sailor'].includes(key))return {ok:false,text:'請選擇約會衣櫃中的穿搭。'};
 if(!unlockedLooks(s,p).includes('date'))return {ok:false,text:'曖昧階段後解鎖約會服裝。'};
 if(key==='black-sailor'&&!BLACK_OUTFIT_ART[p.id])return {ok:false,text:'這位角色的黑色水手領約會套裝待補。'};
 const v=semester(s);v.dateOutfits??={};v.dateOutfits[p.id]=key;v.lookPreviews??={};v.lookPreviews[p.id]='date';
 return {ok:true,text:`已選擇${key==='classic'?'經典約會穿搭':'黑色水手領約會套裝'}；約會章節與穿搭鑑賞使用同一選擇。`};
}
export function renderDateOutfits(s,p){const ready=!!BLACK_OUTFIT_ART[p.id],locked=!unlockedLooks(s,p).includes('date'),selected=dateOutfitSelected(s,p);return `<div class="s-date-outfits"><h3>約會服裝</h3><p class="s-fine">曖昧階段解鎖。選擇會保存，並套用到約會章節。</p><div class="s-button-row"><button type="button" data-s-action="date-outfit" data-look="classic" aria-pressed="${selected==='classic'}" ${locked?'disabled':''}>經典約會穿搭</button><button type="button" data-s-action="date-outfit" data-look="black-sailor" aria-pressed="${selected==='black-sailor'}" ${locked||!ready?'disabled':''}>黑色水手領${ready?'':' · 待補'}</button></div>${ready?`<details><summary>查看黑色水手領全身圖</summary>${blackOutfitFigure(p,0)}</details>`:'<p class="s-fine">此角色新約會套裝待補，經典穿搭仍可使用。</p>'}</div>`;}
export function renderSleepWardrobe(s,p){const ready=!!BLACK_OUTFIT_ART[p.id],locked=routeBond(s,p).score<55||intimacyValue(s,p)<35;return `<section class="s-sleep-wardrobe"><h2>睡衣套裝衣櫃</h2><p class="s-fine">好感55、親密35，且今晚來訪獲得同意後可換裝；房間與睡前保留同一套，不花時段。</p>${ready?`<div class="s-sleep-choice">${blackOutfitFigure(p,1)}<button type="button" data-s-action="sleep-black" aria-pressed="${homeWearMode(s,p)==='sleep-black'}" ${locked?'disabled':''}>換上黑色荷葉邊睡衣</button></div>`:'<p>黑色荷葉邊睡衣全身圖待補；仍可使用既有居家衣櫃。</p>'}</section>`;}
