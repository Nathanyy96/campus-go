import {bootAccount} from './account-client.js';
import {ACCOUNT_ENABLED} from './account-config.js';
if(ACCOUNT_ENABLED)bootAccount();
else {
  const loading=document.createElement('section');loading.id='accountGate';
  loading.innerHTML='<div class="account-gate-content"><h1>正在走進澄灣大學</h1><p role="status">讀取此裝置保存的生活與回憶…</p></div>';
  document.body.append(loading);
  import('./app.js').then(()=>{loading.remove();document.documentElement.classList.remove('auth-locked');}).catch(()=>{
    loading.querySelector('p').textContent='遊戲暫時無法載入，進度仍保存在此裝置。請重新整理後再試。';
    const retry=document.createElement('button');retry.textContent='重新載入';retry.onclick=()=>location.reload();loading.querySelector('div').append(retry);
  });
}
