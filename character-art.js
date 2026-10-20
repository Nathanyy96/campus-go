import {ART_V036} from './character-art-v036.js';
import {ANIME_ART} from './character-art-anime.js';
// Only anime artwork ships; retired photo art remains recoverable in Git history.
export function characterCode(id){return Number.isInteger(id)&&id>=0&&id<=998?`S${String(id+1).padStart(3,'0')}`:null;}
export function plateStyle(art){const split=art?.split??.5;return `--plate-left-width:${100/split}%;--plate-right-width:${100/(1-split)}%;--plate-right-offset:${-100*split/(1-split)}%;--plate-portrait-aspect:${split*1.5};--plate-body-aspect:${(1-split)*1.5};`;}
export function characterArt(id){const base=ANIME_ART[id]??null;return base&&ART_V036[id]?{...base,...ART_V036[id]}:base;}
export function artStatus(id){return Object.hasOwn(ANIME_ART,id)?'sample_pending_review':'missing';}
