import {DAILY_ART} from './daily-wardrobe-art.js';
import {CORE_IDS} from './semester-data.js';
export const DAILY_NAMES=Object.freeze(['原本日常服','白藍連帽款','針織衫百褶裙','白上衣牛仔短褲']);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initializeDailyWardrobe(s){if(Number.isInteger(s.dailyWardrobe?.seed)&&s.dailyWardrobe?.overrides)return false;s.dailyWardrobe={seed:Math.floor(Math.random()*0x100000000),overrides:{}};return true;}
function wardrobe(s){initializeDailyWardrobe(s);return s.dailyWardrobe;}
export function dailyOutfit(s,p){
 if(!DAILY_ART[p?.id])return 0;
 const w=wardrobe(s),o=w.overrides[p.id];if(o?.day===s.day&&Number.isInteger(o.index)&&o.index>=0&&o.index<=3)return o.index;
 // A saved seed gives each character a stable, independently mixed choice for each game day.
 let x=(w.seed^Math.imul(s.day,0x9e3779b1)^Math.imul(p.id+1,0x85ebca6b))>>>0;
 x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return (x^(x>>>16))>>>30;
}
export function selectDailyOutfit(s,p,index){
 if(!p||!Number.isInteger(index)||index< -1||index>3||(!DAILY_ART[p.id]&&index>0))return {ok:false,text:'這套日常服尚未完成，請選擇已完成的服裝。'};
 const w=wardrobe(s);if(index===-1)delete w.overrides[p.id];else w.overrides[p.id]={day:s.day,index};
 if(s.semester){s.semester.lookPreviews??={};s.semester.lookPreviews[p.id]='daily';}
 return {ok:true,text:index===-1?'已恢復每日隨機穿搭，今天的選擇會維持到明天。':`今日改穿${DAILY_NAMES[index]}；明天恢復隨機選擇。`};
}
export function dailyFigure(p,index,cls='',full=false){
 const a=DAILY_ART[p?.id];if(!a||index<1||index>3)return '';
 const width=a.width/3,height=full?a.height:a.height*.62;
 const x=(index-1)*width,clip=`daily-${p.id}-${index}-${full?'full':'close'}`;
 return `<div class="s-art s-daily-look ${full?'s-full':''} ${cls}" style="--plate-portrait-aspect:${width/height};--plate-body-aspect:${width/height}"><svg viewBox="${x} 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(p.name)}${DAILY_NAMES[index]}${full?'全身圖':'近景'}"><defs><clipPath id="${clip}"><rect x="${x}" y="0" width="${width}" height="${height}"/></clipPath></defs><image href="${a.source}" width="${a.width}" height="${a.height}" clip-path="url(#${clip})"/></svg></div>`;
}
export function renderDailyWardrobe(s,p,original){
 if(!CORE_IDS.includes(p.id))return '';
 const ready=!!DAILY_ART[p.id],selected=dailyOutfit(s,p),manual=s.dailyWardrobe?.overrides?.[p.id]?.day===s.day;
 return `<section class="s-daily-wardrobe"><h2>日常服裝衣櫃</h2><p class="s-fine">${ready?'四套日常服，每個遊戲日隨機選一套；當天與重新讀檔維持一致。':'新三套全身圖待補，目前穿原本日常服。'}不需要好感解鎖，換裝不花時段。</p><p>今日穿搭：${DAILY_NAMES[selected]} · ${manual?'今日指定':'每日隨機'}</p>${ready?`<button type="button" data-s-action="daily-outfit" data-look="-1" aria-pressed="${!manual}">恢復每日隨機</button>`:''}<details><summary>查看${ready?'四套':'日常'}服裝與今日換裝</summary><div class="s-daily-grid">${DAILY_NAMES.map((name,index)=>`<div>${index===0?original:dailyFigure(p,index,'',true)}<button type="button" data-s-action="daily-outfit" data-look="${index}" aria-pressed="${selected===index}" ${!ready&&index>0?'disabled':''}>${name}${!ready&&index>0?' · 待補':''}</button></div>`).join('')}</div></details></section>`;
}
