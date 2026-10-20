export const SAVE_KEYS=['campus-go-v3','campus-go-free-v035','campus-go-before-v035'];
const MAX_BYTES=8_000_000;
export function validGame(value){return value?.version===3&&Number.isInteger(value.day)&&value.day>=1&&Number.isFinite(value.time)&&value.time>=0&&value.time<=1440&&Array.isArray(value.people)&&value.people.length>0&&value.people.length<=100&&value.people.every(p=>Number.isInteger(p.id)&&typeof p.name==='string')&&Array.isArray(value.messages)&&value.messages.length<=15000&&value.relations&&typeof value.relations==='object'&&!Array.isArray(value.relations);}
function safeKeys(value){if(!value||typeof value!=='object')return true;return Object.entries(value).every(([key,child])=>!['__proto__','prototype','constructor'].includes(key)&&safeKeys(child));}
async function checksum(text){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function createBackup(storage,now=new Date()){
  const saves=Object.fromEntries(SAVE_KEYS.map(key=>[key,storage.getItem(key)?JSON.parse(storage.getItem(key)):null]));
  if(!validGame(saves[SAVE_KEYS[0]]))throw Error('目前進度格式不完整，請先在遊戲中儲存。');
  const payload=JSON.stringify(saves);if(new TextEncoder().encode(payload).length>MAX_BYTES)throw Error('備份超過8 MB，請先匯出個別紀錄。');
  return {format:'campus-go-backup',version:1,createdAt:now.toISOString(),checksum:await checksum(payload),saves};
}
export async function readBackup(text){
  if(new TextEncoder().encode(text).length>MAX_BYTES)throw Error('檔案超過8 MB，請選擇遊戲匯出的備份。');
  let value;try{value=JSON.parse(text);}catch{throw Error('這不是有效的JSON存檔。');}
  if(!safeKeys(value))throw Error('存檔包含不支援的欄位。');
  if(validGame(value))return {[SAVE_KEYS[0]]:value}; // Older single-save exports remain readable.
  if(value?.format!=='campus-go-backup'||value.version!==1||!value.saves||!validGame(value.saves[SAVE_KEYS[0]]))throw Error('這不是支援的澄灣大學備份。');
  if(await checksum(JSON.stringify(value.saves))!==value.checksum)throw Error('備份校驗失敗，檔案可能不完整或曾被修改。');
  if(!SAVE_KEYS.every(key=>value.saves[key]==null||validGame(value.saves[key])))throw Error('備份中的自由校園或歷史進度格式不完整。');
  return value.saves;
}
export function restoreBackup(storage,saves){
  const previous=Object.fromEntries(SAVE_KEYS.map(key=>[key,storage.getItem(key)]));
  // Keep an independent recovery copy before replacing any active save.
  storage.setItem('campus-before-file-import',JSON.stringify(previous));
  try{for(const key of SAVE_KEYS){if(!(key in saves))continue;if(saves[key]==null)storage.removeItem(key);else storage.setItem(key,JSON.stringify(saves[key]));}}
  catch(error){for(const key of SAVE_KEYS){try{if(previous[key]==null)storage.removeItem(key);else storage.setItem(key,previous[key]);}catch{}}throw Error('裝置儲存空間不足，未完成匯入；原進度備份仍保留。');}
}
