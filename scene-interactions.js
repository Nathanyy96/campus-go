/**
 * Campus Go v0.13 local scene interactions.
 * Explicitly scoped to existing v0.5 rules; no NPC seat occupancy, AI or cloud writes.
 */
import {advance, log} from './simulation.js';
import {resolveScene} from './scene-system.js';

const STUDY_TYPES=new Set(['科系','學習','住處']);
const STUDY_WORDS=/書|桌|工作|座位|讀|學習|筆記|電腦|窗邊/;

export function sceneAnchor(manifest,placeId,anchorId){
 const place=resolveScene(manifest,placeId);
 const anchor=place?.anchors.find(a=>a.anchor_id===anchorId)??null;
 return {place,anchor};
}
export function sceneAnchorActions(manifest,placeId,anchorId){
 const {place,anchor}=sceneAnchor(manifest,placeId,anchorId);
 if(!place||!anchor)return [];
 const actions=[{id:'observe',label:'看看這裡',minutes:0}];
 if(anchor.kind==='seat') actions.push({id:'rest',label:'坐著休息 · 10分鐘',minutes:10});
 if(STUDY_TYPES.has(place.original_type) &&
   (anchor.kind==='seat'||STUDY_WORDS.test(anchor.label)))
   actions.push({id:'study',label:'專心學習 · 30分鐘',minutes:30});
 return actions;
}
function conflictsWithAppointment(game,duration){
 return (game.appointments??[]).some(a=>a.day===game.day &&
   (a.status==='confirmed' || a.status==='met') &&
   (a.time>=game.time && a.time<game.time+duration ||
    a.status==='met'&&a.time<=game.time&&a.time+30>game.time));
}
export function executeSceneAnchor(game,manifest,{placeId,anchorId,actionId}){
 if(!game||game.location!==placeId)return {ok:false,changed:false,message:'你目前不在這個場景，不能從遠方操作物件。'};
 const {place,anchor}=sceneAnchor(manifest,placeId,anchorId);
 if(!place||!anchor)return {ok:false,changed:false,message:'這個場景互動點不存在。'};
 const allowed=sceneAnchorActions(manifest,placeId,anchorId);
 const action=allowed.find(a=>a.id===actionId);
 if(!action)return {ok:false,changed:false,message:'這個物件目前不支援這項行動。'};
 if(actionId==='observe')return {
   ok:true,changed:false,actionId,message:`你看看「${anchor.label}」。${place.original_description}（僅是公開環境觀察）`
 };
 if(game.time+action.minutes>1380)return {ok:false,changed:false,message:'今天的可活動時間不足，明天再來吧。'};
 if(conflictsWithAppointment(game,action.minutes))return {ok:false,changed:false,message:'接下來有已確認的約定，先赴約或協調時間。'};
 if(actionId==='study'){
  if(game.energy<10)return {ok:false,changed:false,message:'精力不足，先休息再學習。'};
  advance(game,30);game.energy=Math.max(0,game.energy-8);game.knowledge+=1;
  log(game,`你在${place.name}的${anchor.label}專心學習30分鐘，知識增加了。`);
  return {ok:true,changed:true,actionId,message:'完成30分鐘學習：知識 +1，精力已消耗。'};
 }
 if(actionId==='rest'){
  advance(game,10);game.energy=Math.min(100,game.energy+6);
  log(game,`你在${place.name}的${anchor.label}坐著休息10分鐘。`);
  return {ok:true,changed:true,actionId,message:'坐著休息了10分鐘，精力略有恢復。'};
 }
 return {ok:false,changed:false,message:'未支援的場景行動。'};
}
