export const TOUCH_NAMES={hand:'牽手',hug:'擁抱',hair:'摸頭',lean:'靠肩',forehead:'額頭輕吻',kiss:'接吻',cuddle:'靠著彼此休息'};
const styles=[
 {key:'warm',label:'熟悉後自然親近',familiar:6,trust:3,description:'熟悉的朋友之間，我可以接受擁抱、摸頭或靠肩；接吻對我有曖昧的意思。'},
 {key:'social',label:'朋友之間也能親暱',familiar:3,trust:1,description:'擁抱、摸頭，甚至牽手陪著走，我都可能當成朋友間的親近，不一定是在告白。'},
 {key:'private',label:'重視自己的相處節奏',familiar:10,trust:6,description:'朋友也可以親近，但我比較在意熟悉程度和場合。讓我自在地回答，比先決定我們應該怎樣更好。'},
 {key:'romantic',label:'不同接觸有不同意思',familiar:5,trust:3,description:'朋友間的擁抱和靠肩可以很溫暖；牽手或親吻對我通常有比較特別的意思。'}
];
export function affectionPreference(p){return {...styles[p.id===1?1:p.id===46?3:(p.id*7+Math.floor(p.id/8))%4],jealousy:p.id%3===0?'sensitive':'relaxed'};}
export function touchMeaning(p,action){const style=affectionPreference(p).key;return action==='kiss'||action==='forehead'&&style!=='social'||action==='hand'&&style==='romantic'?'romantic':'friendly';}
