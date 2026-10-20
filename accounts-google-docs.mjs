import {randomBytes,randomUUID,timingSafeEqual,createHash} from 'node:crypto';
import {GoogleDocStore} from './google-doc-store.mjs';
import {passwordHash,validSave} from './accounts.mjs';
const digest=value=>createHash('sha256').update(value).digest('hex');
let configured;const attempts=new Map();
function store(){return configured??=new GoogleDocStore({url:process.env.GOOGLE_DOCS_BACKUP_URL,secret:process.env.GOOGLE_DOCS_BACKUP_SECRET,key:process.env.GOOGLE_DOCS_ENCRYPTION_KEY});}
export function createGoogleAccountRoute(storage){
  async function change(key,update){for(let i=0;i<3;i++){const row=await storage.get(key),next=await update(structuredClone(row.value));try{await storage.put(key,next,row.revision);return next;}catch(error){if(error.status!==409||i===2)throw error;}}}
  return async function(req,url,json){
    const action=url.pathname.split('/').at(-1);
    try {
      if(action==='status'){await storage.get('user:__health__');json(200,{enabled:true,provider:'google-docs'});return true;}
      let raw='';if(['POST','PUT'].includes(req.method))for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>8_000_000){json(413,{error:'存檔超過容量限制，請下載本機備份。'});return true;}}
      let data;try{data=raw?JSON.parse(raw):{};}catch{json(400,{error:'請求格式不正確。'});return true;}
      if(['register','login'].includes(action)&&req.method==='POST'){
        const username=typeof data.username==='string'?data.username.trim().toLowerCase():'';
        const now=Date.now(),key=`${req.socket.remoteAddress}:${username}`;
        for(const [name,hits] of attempts)if(now-hits.at(-1)>900000)attempts.delete(name);
        const hits=(attempts.get(key)||[]).filter(time=>now-time<900000);
        if(hits.length>=20||attempts.size>10000){json(429,{error:'嘗試次數太多，請稍後再試。'});return true;}hits.push(now);attempts.set(key,hits);
        if(!/^[a-z0-9_]{3,24}$/.test(username)||username==='__health__'||typeof data.password!=='string'||data.password.length<8||data.password.length>128){json(400,{error:'帳號需3–24個英文字母、數字或底線；密碼需8–128字元。'});return true;}
        const userKey=`user:${username}`;
        if(action==='register'){
          const salt=randomBytes(16).toString('hex'),hash=await passwordHash(data.password,salt);
          try{await storage.put(userKey,{id:randomUUID(),username,salt,password_hash:hash,sessions:{},save:null},0);}catch(error){if(error.status===409){json(409,{error:'此帳號已被使用。'});return true;}throw error;}
        }
        const record=(await storage.get(userKey)).value;
        const hash=await passwordHash(data.password,record?.salt||'invalid-user-padding');
        if(!record||!timingSafeEqual(Buffer.from(hash,'hex'),Buffer.from(record.password_hash,'hex'))){json(401,{error:'帳號或密碼不正確。'});return true;}
        const token=`${username}.${randomBytes(32).toString('base64url')}`;
        await change(userKey,value=>{value.sessions=Object.fromEntries(Object.entries(value.sessions||{}).filter(([,expires])=>expires>Date.now()));value.sessions[digest(token)]=Date.now()+7*86400000;return value;});
        json(200,{token,username});return true;
      }
      const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):'';
      const username=token.split('.')[0];if(!/^[a-z0-9_]{3,24}$/.test(username)){json(401,{error:'請先登入帳號。'});return true;}
      const key=`user:${username}`,row=await storage.get(key),user=row.value,tokenHash=digest(token);
      if(!user||!(user.sessions?.[tokenHash]>Date.now())){json(401,{error:'登入已到期，請重新登入。'});return true;}
      if(action==='save'&&req.method==='GET'){json(200,{username,save:user.save});return true;}
      if(action==='logout'&&req.method==='POST'){await change(key,value=>{delete value.sessions[tokenHash];return value;});json(200,{ok:true});return true;}
      if(action==='save'&&req.method==='PUT'){
        if(!validSave(data.game)||!Number.isInteger(data.revision)||data.revision<0){json(400,{error:'存檔格式不正確。'});return true;}
        const result=await change(key,value=>{
          if(!(value.sessions?.[tokenHash]>Date.now()))throw Object.assign(Error('session'),{status:401});
          if((value.save?.revision||0)!==data.revision)throw Object.assign(Error('conflict'),{status:409});
          value.save={game:data.game,revision:data.revision+1,updated_at:new Date().toISOString()};return value;
        });json(200,{revision:result.save.revision,updated_at:result.save.updated_at});return true;
      }
      json(404,{error:'找不到此操作。'});return true;
    }catch(error){const code=[401,409,413].includes(error.status)?error.status:503;json(code,{error:code===409?'另一台裝置已有新進度，請選擇要保留的版本。':code===401?'登入已到期，請重新登入。':code===413?'備份容量已達上限，請下載本機備份。':'Google 文件備份暫時無法連線，本機進度仍保留。'});return true;}
  };
}
let route;
export async function googleAccountRoute(req,url,json){route??=createGoogleAccountRoute(store());return route(req,url,json);}
