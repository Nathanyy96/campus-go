// Hidden narrative state. Public UI exposes attitude and dialogue, never suspicion values.
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
export function intimacy(b){return b.intimacy??=b.flags?.includes(5)?60:b.dating?35:Math.min(25,(b.flags?.length??0)*5);}
export function addIntimacy(b,n){const old=intimacy(b);b.intimacy=clamp(old+n);return b.intimacy-old;}
export function riskState(b){return b.discovery??={value:0,evidence:[],seen:[],lastEvidenceDay:-999,lastDecayWeek:-1,pending:null,resolved:null};}
export function disposition(p){return ['direct','quiet','observe','secret'][p.id%4];}
export function attitude(b){const d=riskState(b);return d.pending?{probe:'她似乎有話想問你。',direct:'她想當面把事情說清楚。',quiet:'她比平常安靜，像在等你先開口。',observe:'她最近問得格外仔細。',secret:'她也有一件一直沒說的事。'}[d.pending]:d.value>=40?'她最近有些心事。':null;}
function bump(s,p,amount,token,text){const b=s.semester.bonds[p.id],d=riskState(b);if(d.seen.includes(token)||b.agreement==='open')return;d.seen.push(token);d.seen=d.seen.slice(-120);d.value=clamp(d.value+amount);d.lastEvidenceDay=s.day;d.evidence.push({day:s.day,text});d.evidence=d.evidence.slice(-12);const type=disposition(p),threshold=type==='direct'?60:type==='secret'?90:80;if(d.value>=threshold)d.pending=type;else if(d.value>=40&&!d.pending)d.pending='probe';}
export function recordEncounter(s,target,witnesses,kind,loc){const v=s.semester;v.rumors??=[];const token=`${s.day}:${v.slot}:${target.id}:${kind}`,amount={hand:20,hug:25,kiss:40,date:20,public:35}[kind]??0;if(!amount)return;
 for(const p of s.people){if(p.id===target.id)continue;const b=v.bonds[p.id];if(!b||(!b.dating&&intimacy(b)<25))continue;
  if(witnesses.some(w=>w.id===p.id))bump(s,p,amount,token,`在${loc}親眼看見你和${target.name}相處。`);
  else if(witnesses.some(w=>w.club===p.club&&w.id!==target.id)){if(!v.rumors.some(r=>r.token===token&&r.person===p.id))v.rumors.push({person:p.id,due:s.day+2,amount:Math.min(25,amount-5),token,text:`社團朋友提到你和${target.name}在${loc}的相處。`});}
  if(v.promise?.person===p.id&&v.promise.until>=s.day)bump(s,p,40,token+':promise','你答應暫時專心陪伴，卻沒有做到。');
 }
}
export function homeEvidence(s,visitor){const v=s.semester;v.homeEvidence??=[];const other=v.homeEvidence.find(x=>x.person!==visitor.id);if(other)bump(s,visitor,20,`home:${other.person}:${other.day}`,`房間裡留著${other.name}先前來訪的杯子與便條。`);v.homeEvidence=v.homeEvidence.filter(x=>x.person!==visitor.id).slice(-5);v.homeEvidence.push({person:visitor.id,name:visitor.name,day:s.day});}
export function processRisk(s){const v=s.semester;for(const r of v.rumors??[]){if(r.due>s.day)continue;const p=s.people.find(p=>p.id===r.person);if(p)bump(s,p,r.amount,r.token+':rumor',r.text);}v.rumors=(v.rumors??[]).filter(r=>r.due>s.day);const week=Math.floor(s.day/7);for(const b of Object.values(v.bonds)){const d=riskState(b);if(d.lastDecayWeek<week){if(s.day-d.lastEvidenceDay>=7)d.value=clamp(d.value-5);d.lastDecayWeek=week;}}}
export function reassure(b){const d=riskState(b);d.value=clamp(d.value-5);}
export function discoveryScript(p,b){const type=riskState(b).pending??'probe';const lines={probe:[`「最近……你和其他同學也常一起出去嗎？」${p.name}把話說得很輕。`,'「我不是要替你決定。只是希望你對我說的話，是真的。」','她等你把話說完，沒有替你選答案。'],direct:[`「我看見了，也聽到一些事。」${p.name}看著你，「我們需要談清楚。」`,'「你曾經說的承諾，現在還算數嗎？」','「接下來怎麼相處，我也要有選擇。」'],quiet:[`${p.name}收起笑容。「你開心就好……不過，我也有自己的感受。」`,'「我一直在等你主動說。被隱瞞，比答案本身更難受。」','「如果繼續，就別再讓我只能猜。」'],observe:[`「那天你說去讀書，可是有人在別處看見你。」${p.name}問得很具體。`,'她把幾次對不上的時間一一說出來。「我想聽你的版本。」','「這件事不能一直靠繞開話題處理。」'],secret:[`「其實，我也有沒告訴你的事。」${p.name}停了一下。`,'她坦白自己也有尚未說清的曖昧。「我們是不是都把彼此想得太簡單？」','「我們可以談清楚界線，也可以各自離開。這次要一起決定。」']}[type];
 const options=type==='secret'?['討論雙方都同意的開放關係與界線','互相坦白，重新慢慢了解','和平結束交往，保留這段相處']:['坦白自己的選擇，也聽她的感受','否認，說事情不是她想的那樣','請求原諒，承諾接下來三天主動陪伴'];return {title:type==='probe'?'一句想問你的話':'把沒有說完的話說清楚',lines,options,type};}
export function resolveDiscovery(s,p,answer){const b=s.semester.bonds[p.id],d=riskState(b),type=d.pending??'probe';let text;
 if(type==='secret'){if(answer===0){b.agreement='open';d.value=15;text='雙方談妥開放關係。往後仍要尊重各自的場合與當次同意。';}else if(answer===1){d.value=20;text='彼此坦白，保留好感，重新練習把話說清楚。';}else{b.dating=false;b.trial=false;b.agreement='friends';text='和平結束交往。好感、親密與共同回憶保留。';}}
 else if(answer===0){b.score=clamp(b.score+(type==='quiet'?5:type==='probe'?0:-12),-5);d.value=20;text=type==='quiet'?'「謝謝你終於願意先說。」她說出了真正的心事。':'你坦白說清楚，也接受她需要時間。';}
 else if(answer===1){const evidence=d.evidence.length;d.value=clamp(d.value+(evidence?15:-10));text=evidence?'已有目擊或物證，否認讓她更難相信。這件事還沒有說完。':'她暫時接受解釋，但仍希望你言行一致。';}
 else{b.score=clamp(b.score-18,-5);d.value=25;s.semester.promise={person:p.id,until:s.day+3};text='她願意再談一次。你承諾三天主動陪伴；違背承諾會留下新的傷害。';}
 d.resolved={day:s.day,type,answer};d.pending=null;return text;
}
