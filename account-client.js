import {resolveEndpoint} from './ai-connection.js';
import {SaveSync} from './account-sync.js';
import {ACCOUNT_ENABLED} from './account-config.js';
const MAIN='campus-go-v3',FREE='campus-go-free-v035',BEFORE='campus-go-before-v035';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parse=(key)=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
let token=sessionStorage.getItem('campus-session')||'',user=sessionStorage.getItem('campus-user')||'',sync,timer,started=false;
let status='尚未登入';
const cacheKey=()=>`campus-account-cache:${user}`;
export const accountStatus=()=>({user:ACCOUNT_ENABLED?user:'本機遊玩',status:ACCOUNT_ENABLED?status:'進度儲存在此瀏覽器 · 帳號同步尚未啟用',enabled:ACCOUNT_ENABLED,dirty:ACCOUNT_ENABLED&&!!parse(cacheKey())?.dirty});
export async function accountCall(action,method='GET',body) {
  const response=await fetch(`${resolveEndpoint(localStorage.getItem('campus-ai-url')||'')}/api/account/${action}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(25000)});
  let data;try{data=await response.json();}catch{throw Error('帳號服務尚未就緒，請稍後重試。');}
  if(!response.ok)throw Object.assign(Error(data.error||'帳號連線失敗。'),{status:response.status});return data;
}
function snapshot() {
  const game=parse(MAIN);if(!game)return null;
  delete game.cloudArchive;
  return {...game,cloudArchive:{free:parse(FREE),before:parse(BEFORE)}};
}
function restore(game) {
  const copy=structuredClone(game),archive=copy.cloudArchive;delete copy.cloudArchive;
  localStorage.setItem('campus-before-cloud-import',JSON.stringify(snapshot()));
  localStorage.setItem(MAIN,JSON.stringify(copy));
  for(const [key,value] of [[FREE,archive?.free],[BEFORE,archive?.before]]) {
    if(value)localStorage.setItem(key,JSON.stringify(value));else localStorage.removeItem(key);
  }
  localStorage.setItem('campus-active-owner',user);
}
function notify(value) {
  status=({pending:'等待同步',syncing:'正在儲存到帳號…',saved:'已儲存到帳號',offline:'離線 · 進度已保留在此裝置',conflict:'其他裝置已有新進度，請選擇存檔',expired:'登入到期 · 本機進度已保留'})[value]||value;
  document.dispatchEvent(new CustomEvent('campus-account-status',{detail:accountStatus()}));
  const node=document.querySelector('#cloudSaveStatus');if(node)node.textContent=status;
  if(value==='conflict')showConflict().catch(error=>{status=error.message;});
  if(value==='expired')showLogin('登入已到期，重新登入後可繼續同步。');
}
function panel(title,body) {
  let host=document.querySelector('#accountGate');if(!host){host=document.createElement('section');host.id='accountGate';document.body.append(host);}
  host.innerHTML=`<div class="account-gate-content"><h1>${title}</h1>${body}</div>`;host.hidden=false;return host;
}
function choose(title,text,options) {
  return new Promise(resolve=>{const host=panel(title,`<p>${esc(text)}</p>${options.map(([key,label])=>`<button type="button" data-choice="${key}">${esc(label)}</button>`).join('')}`);host.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{host.hidden=true;resolve(button.dataset.choice);});});
}
async function showConflict() {
  const data=await accountCall('save'),remote=data.save;if(!remote)return;
  const choice=await choose('選擇要繼續的進度','另一台裝置已更新存檔。兩份進度都會先留備份，再依你的選擇同步。',[['cloud',`載入雲端 · 第${remote.game.day}天`],['local',`保留此裝置 · 第${parse(cacheKey()).game.day}天`]]);
  localStorage.setItem(`campus-conflict-backup:${user}`,JSON.stringify({local:parse(cacheKey()),remote}));
  if(choice==='cloud'){restore(remote.game);sync.resolve(remote.game,remote.revision);location.reload();}
  else{restore(parse(cacheKey()).game);sync.resolve(parse(cacheKey()).game,remote.revision,{upload:true});await sync.flush();}
}
async function enter() {
  const data=await accountCall('save');user=data.username;sessionStorage.setItem('campus-user',user);
  const local=parse(cacheKey()),remote=data.save;
  sync=new SaveSync({request:accountCall,read:()=>parse(cacheKey()),write:record=>localStorage.setItem(cacheKey(),JSON.stringify(record)),notify});
  if(local?.dirty) {
    if(remote&&local.revision!==remote.revision){await showConflict();}
    else{restore(local.game);sync.resolve(local.game,remote?.revision||0,{upload:true});await sync.flush();}
  } else if(remote){restore(remote.game);sync.resolve(remote.game,remote.revision);}
  else {
    const existing=snapshot(),owner=localStorage.getItem('campus-active-owner');
    let keep=false;
    if(existing&&(!owner||owner===user))keep=(await choose('開始這段大學生活','這個帳號尚無雲端進度。此瀏覽器原有的進度可匯入帳號。',[['import','匯入此裝置的原有進度'],['new','開始全新遊戲']]))==='import';
    if(!keep){if(existing)localStorage.setItem('campus-before-account-start',JSON.stringify(existing));for(const key of [MAIN,FREE,BEFORE])localStorage.removeItem(key);}
    localStorage.setItem('campus-active-owner',user);sync.resolve(keep?existing:null,0);
  }
  document.querySelector('#accountGate')?.setAttribute('hidden','');document.documentElement.classList.remove('auth-locked');
  if(started){location.reload();return;}started=true;
  document.addEventListener('campus-save',()=>{const game=snapshot();if(!game)return;sync.queue(game);clearTimeout(timer);timer=setTimeout(()=>sync.flush(),1000);});
  window.addEventListener('online',()=>sync.flush());
  window.addEventListener('beforeunload',event=>{if(parse(cacheKey())?.dirty){event.preventDefault();event.returnValue='';}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)sync.flush();});
  setInterval(()=>sync.flush(),30000);
  await import('./app.js');const game=snapshot();if(game){sync.queue(game);await sync.flush();}
}
export async function logoutAccount() {
  await sync?.flush();
  if(parse(cacheKey())?.dirty){await choose('還有進度等待同步','請保持網路連線，等儲存完成後再登出。離線進度已保存在此裝置。',[['ok','保留登入，稍後重試']]);return;}
  await accountCall('logout','POST',{});sessionStorage.removeItem('campus-session');sessionStorage.removeItem('campus-user');location.reload();
}
export function retryAccountSync(){return sync?.flush();}
function showLogin(message='') {
  const host=panel('回到澄灣大學',`<p>登入帳號，接續你的校園生活。不同裝置使用同一帳號，就能載入已同步的進度。</p><form id="loginGate"><label>帳號<input name="username" autocomplete="username" pattern="[A-Za-z0-9_]{3,24}" minlength="3" maxlength="24" required></label><label>密碼<input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required></label><label id="confirmPassword" hidden>再次輸入密碼<input name="confirm" type="password" autocomplete="new-password" minlength="8" maxlength="128"></label><p class="account-hint">帳號使用3–24個英文字母、數字或底線。密碼至少8字元，請妥善保管。</p><p role="status" id="loginNote">${esc(message)}</p><button type="submit">登入並繼續</button><button type="button" id="switchRegister">註冊新帳號</button></form>`);
  const form=host.querySelector('form');let register=false;
  host.querySelector('#switchRegister').onclick=()=>{register=!register;host.querySelector('#confirmPassword').hidden=!register;form.elements.confirm.required=register;form.elements.password.autocomplete=register?'new-password':'current-password';host.querySelector('[type=submit]').textContent=register?'建立帳號並進入遊戲':'登入並繼續';host.querySelector('#switchRegister').textContent=register?'已有帳號，改為登入':'註冊新帳號';};
  form.onsubmit=async event=>{event.preventDefault();const note=host.querySelector('#loginNote');if(register&&form.elements.password.value!==form.elements.confirm.value){note.textContent='兩次密碼不相同，請重新輸入。';return;}const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);note.textContent='正在連接帳號…';try{const result=await accountCall(register?'register':'login','POST',{username:form.elements.username.value,password:form.elements.password.value});token=result.token;user=result.username;sessionStorage.setItem('campus-session',token);sessionStorage.setItem('campus-user',user);form.reset();await enter();}catch(error){note.textContent=error.message;}finally{buttons.forEach(b=>b.disabled=false);}};
}
export async function bootAccount(){if(token){try{await enter();return;}catch(error){showLogin(error.message);return;}}showLogin();}
