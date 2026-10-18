import {PLACES,BY_ID,EDGES,personState,advance} from './simulation.js';

export const OUTDOORS=new Set(['plaza','court','park','west','east','gate','district','rest']);
export const WORLD={width:1140,height:860};
export function buildingRect(p){return {x:p.x-47,y:p.y-45,w:94,h:55};}
export function doorPosition(id){const p=BY_ID[id];return {x:p.x,y:p.y+23};}
export function atWalkLocation(s){const a=s.exploration,p=BY_ID[s.location];return !a||a.mode==='inside'||a.place!==s.location||Math.hypot(a.x-p.x,a.y-(p.y+23))<=60;}
export function advanceWalking(s){const energy=s.energy,location=s.location;if(!atWalkLocation(s))s.location=null;try{advance(s,1);}finally{s.location=location;}const a=s.exploration;a.walkedMinutes=(a.walkedMinutes??0)+1;s.energy=Math.max(0,energy-(a.walkedMinutes%45===0?1:0));}
export function roomObjects(p){
 const learning=['科系','學習'].includes(p.type),home=['home','guestHome'].includes(p.id);
 const objects=learning?[
  {x:155,y:145,w:110,h:44,label:'窗邊書桌',kind:'study'}, {x:420,y:145,w:110,h:44,label:'討論桌',kind:'study'},
  {x:155,y:265,w:110,h:44,label:'閱讀座位',kind:'study'}, {x:420,y:265,w:110,h:44,label:'休息座位',kind:'rest'}
 ]:home?[
  {x:110,y:110,w:135,h:80,label:'沙發',kind:'rest'}, {x:450,y:105,w:150,h:90,label:'床鋪',kind:'rest'},
  {x:130,y:270,w:110,h:44,label:'書桌',kind:'study'}, {x:450,y:270,w:130,h:44,label:'餐桌',kind:'rest'}
 ]:[
  {x:110,y:120,w:140,h:48,label:p.id==='cinema'?'電影座位':'靠窗座位',kind:'rest'},
  {x:450,y:120,w:140,h:48,label:'休息座位',kind:'rest'},
  {x:110,y:260,w:140,h:48,label:'交流座位',kind:'rest'},
  {x:450,y:260,w:140,h:48,label:'長椅',kind:'rest'}
 ];return objects.map((o,i)=>({...o,id:`furniture-${i}`,type:'object',approach:{x:o.x+o.w/2,y:o.y+o.h+22}}));
}
export function obstacles(mode,place){return mode==='inside'?roomObjects(BY_ID[place]):PLACES.filter(p=>!OUTDOORS.has(p.id)).map(buildingRect);}
export function walkable(x,y,mode,place){const w=mode==='inside'?720:WORLD.width,h=mode==='inside'?460:WORLD.height,r=8;if(x<r+8||y<r+12||x>w-r-8||y>h-r-8)return false;return !obstacles(mode,place).some(o=>x>o.x-r&&x<o.x+o.w+r&&y>o.y-r&&y<o.y+o.h+r);}
export function stepPosition(pos,dx,dy,mode,place){let {x,y}=pos;if(walkable(x+dx,y,mode,place))x+=dx;if(walkable(x,y+dy,mode,place))y+=dy;return {x,y};}
export function personStandingSpot(player,target,mode,place,others=[]){
 const offsets=[[32,20],[-32,20],[0,42],[20,36],[-20,36],[42,0],[-42,0],[32,-20],[-32,-20],[30,-30],[-30,-30],[20,-36],[-20,-36],[0,-42]];
 const options=offsets.map(([x,y])=>({x:target.x+x,y:target.y+y})).filter(p=>walkable(p.x,p.y,mode,place)&&!others.some(o=>Math.abs(o.x-p.x)<22&&Math.abs(o.y-p.y)<38));
 return options.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]??null;
}
export function findWalkPath(start,goal,mode,place){
 const size=10,w=mode==='inside'?720:WORLD.width,h=mode==='inside'?460:WORLD.height,cols=Math.ceil(w/size),key=(x,y)=>y*cols+x;
 if(!walkable(goal.x,goal.y,mode,place))return [];
 const sx=Math.round(start.x/size),sy=Math.round(start.y/size),gx=Math.round(goal.x/size),gy=Math.round(goal.y/size),first=key(sx,sy),last=key(gx,gy),open=[first],g=new Map([[first,0]]),prev=new Map(),closed=new Set();let found=false;
 const heuristic=id=>Math.hypot(id%cols-gx,Math.floor(id/cols)-gy);
 while(open.length&&closed.size<14000){open.sort((a,b)=>(g.get(b)+heuristic(b))-(g.get(a)+heuristic(a)));const current=open.pop();if(closed.has(current))continue;if(current===last){found=true;break;}closed.add(current);const x=current%cols,y=Math.floor(current/cols);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx*size>w||ny*size>h||!walkable(nx*size,ny*size,mode,place))continue;if(dx&&dy&&(!walkable((x+dx)*size,y*size,mode,place)||!walkable(x*size,(y+dy)*size,mode,place)))continue;const id=key(nx,ny),score=g.get(current)+Math.hypot(dx,dy);if(score<(g.get(id)??Infinity)){g.set(id,score);prev.set(id,current);open.push(id);}}
 }
 if(!found)return [];const path=[{x:gx*size,y:gy*size}];let id=last;while(id!==first){id=prev.get(id);if(id===undefined)return [];if(id!==first)path.unshift({x:(id%cols)*size,y:Math.floor(id/cols)*size});}path.push(goal);return path;
}
export function worldPeople(s,mode,place){
 const candidates=s.people.map(p=>({p,st:personState(s,p)})).filter(({st})=>mode==='inside'?st.location===place:!st.location||OUTDOORS.has(st.location));
 const groups=new Map();return candidates.map(({p,st},i)=>{let pos;if(mode==='inside'){
  const spots=[{x:310,y:220},{x:370,y:220},{x:310,y:330},{x:370,y:330},{x:80,y:220},{x:640,y:220},{x:310,y:100},{x:370,y:100},{x:80,y:350},{x:640,y:350},{x:280,y:390},{x:420,y:390},{x:80,y:80},{x:640,y:80},{x:350,y:280}];pos=spots[i%spots.length];
 }else {const group=st.location??'moving',j=groups.get(group)??0;groups.set(group,j+1);const a=j*Math.PI/4+(Math.floor(j/8)*.4),r=48+Math.floor(j/8)*30;pos=st.location?{x:st.x+Math.cos(a)*r,y:st.y+Math.sin(a)*r+24}:{x:st.x,y:st.y+24};for(let n=0;n<12&&!walkable(pos.x,pos.y,'outside',place);n++)pos={x:st.x+Math.cos(a+n*.5)*(r+10),y:st.y+Math.sin(a+n*.5)*(r+10)+24};}
 return {type:'person',id:p.id,p,label:p.name,x:pos.x,y:pos.y,activity:st.activity,location:st.location};});
}
export function worldTargets(s,mode,place){return [...worldPeople(s,mode,place).filter(p=>p.location===s.location),...(mode==='inside'?[{type:'exit',id:'exit',label:'走出建築',x:360,y:425},...roomObjects(BY_ID[place]).map(o=>({...o,x:o.approach.x,y:o.approach.y}))]:PLACES.filter(p=>!OUTDOORS.has(p.id)).map(p=>({type:'door',id:p.id,label:`進入${p.name}`, ...doorPosition(p.id)})))];}
export function nearestTarget(s,pos,mode,place){return worldTargets(s,mode,place).map(t=>({...t,distance:Math.hypot(t.x-pos.x,t.y-pos.y)})).filter(t=>t.distance<=44).sort((a,b)=>a.distance-b.distance)[0]??null;}
export function nearestOutdoor(pos){return PLACES.filter(p=>OUTDOORS.has(p.id)).sort((a,b)=>Math.hypot(a.x-pos.x,a.y+25-pos.y)-Math.hypot(b.x-pos.x,b.y+25-pos.y))[0].id;}
export {PLACES,BY_ID,EDGES};

