// Individual preferences are canonical; a preference never substitutes for consent.
const openToDiscussion=new Set([1,6,14,24,37,52,63,70]);
export const relationshipPreference=p=>openToDiscussion.has(p.id)?'open-to-discussion':'exclusive';
export const activePartners=(s,except)=>s.people.filter(p=>p.id!==except&&s.relations[p.id]?.romance?.stage==='dating');
export const hasUnclearCommitments=s=>{const partners=activePartners(s);return partners.length>1&&partners.some(p=>s.relations[p.id].romance.agreement!=='open');};
