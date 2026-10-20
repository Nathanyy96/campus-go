import {ART_V036} from './character-art-v036.js';
import {ANIME_ART} from './character-art-anime.js';
import {REVISED_ART} from './character-art-revisions.js';
import {SECOND_BATCH_ART} from './character-art-batch.js';
// Campus Go v0.14: explicit character image mapping, no shared face fallback.
export const APPROVED_ART = Object.freeze({
  0: Object.freeze({code:'S001',name:'林知夏',portrait:'assets/characters/S001-W01-portrait.webp',fullbody:'assets/characters/S001-W01-fullbody.webp',outfit:'W01',version:'v02'}),
  1: Object.freeze({code:'S002',name:'陳以晴',portrait:'assets/characters/S002-W01-portrait-v03.png',fullbody:'assets/characters/S002-W01-fullbody-v03.png',outfit:'W01',version:'v03-clear-skin'}),
  2: Object.freeze({code:'S003',name:'沈若寧',portrait:'assets/characters/S003-W01-portrait.webp',fullbody:'assets/characters/S003-W01-fullbody.webp',outfit:'W01',version:'v02'}),
  3: Object.freeze({code:'S004',name:'許可欣',portrait:'assets/characters/S004-W01-portrait.webp',fullbody:'assets/characters/S004-W01-fullbody.webp',outfit:'W01',version:'v02'}),
  4: Object.freeze({code:'S005',name:'李承佑',portrait:'assets/characters/S005-W01-portrait.webp',fullbody:'assets/characters/S005-W01-fullbody.webp',outfit:'W01',version:'v02'}),
  5: Object.freeze({code:'S006',name:'吳子謙',portrait:'assets/characters/S006-W01-portrait.webp',fullbody:'assets/characters/S006-W01-fullbody.webp',outfit:'W01',version:'v02'}),
});
export const DOCUMENT_REFERENCE_ART = Object.freeze({
  46: Object.freeze({code:'S047',name:'楊子晴',portrait:'assets/characters/S047-reference-portrait.webp',fullbody:'assets/characters/S047-reference-fullbody.webp',outfit:'原文件參考圖',version:'doc-20261017',status:'document_reference_imported'})
});
export function characterCode(id){return Number.isInteger(id)&&id>=0&&id<=998?`S${String(id+1).padStart(3,'0')}`:null;}
export function plateStyle(art){const split=art?.split??.5;return `--plate-left-width:${100/split}%;--plate-right-width:${100/(1-split)}%;--plate-right-offset:${-100*split/(1-split)}%;--plate-portrait-aspect:${split*1.5};--plate-body-aspect:${(1-split)*1.5};`;}
export function characterArt(id){const base=Object.hasOwn(ANIME_ART,id)?ANIME_ART[id]:Object.hasOwn(REVISED_ART,id)?REVISED_ART[id]:Object.hasOwn(APPROVED_ART,id)?APPROVED_ART[id]:Object.hasOwn(DOCUMENT_REFERENCE_ART,id)?DOCUMENT_REFERENCE_ART[id]:Object.hasOwn(SECOND_BATCH_ART,id)?SECOND_BATCH_ART[id]:null;return base&&ART_V036[id]?{...base,...ART_V036[id]}:base;}
export function artStatus(id){return Object.hasOwn(ANIME_ART,id)?'sample_pending_review':Object.hasOwn(REVISED_ART,id)?'sample_pending_review':Object.hasOwn(APPROVED_ART,id)?'approved_sample':Object.hasOwn(DOCUMENT_REFERENCE_ART,id)?'document_reference_imported':Object.hasOwn(SECOND_BATCH_ART,id)?'sample_pending_review':'missing';}
