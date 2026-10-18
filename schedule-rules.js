// Half-open intervals allow one activity to end exactly when another begins.
export const overlaps=(start,duration,otherStart,otherDuration)=>start<otherStart+otherDuration&&start+duration>otherStart;
export function scheduleConflict(s,{day,time,duration=30,person,exceptId,kind,loc}){
 return (s.appointments??[]).find(a=>(exceptId===undefined||a.id!==exceptId)&&a.day===day&&(['confirmed','met'].includes(a.status)||(person!==undefined&&a.status==='proposed'&&a.person===person))&&overlaps(time,duration,a.time,a.duration??30)&&!(a.person===person&&a.loc==='home'&&loc==='home'&&a.kind!==kind&&[a.kind,kind].includes('partner-stay')&&[a.kind,kind].every(k=>['partner-movie','partner-stay'].includes(k))))||(s.personalPlans??[]).find(a=>a.day===day&&!a.done&&overlaps(time,duration,a.time,a.duration));
}
