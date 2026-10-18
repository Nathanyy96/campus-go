import {scrypt as rawScrypt,randomBytes,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(rawScrypt);let database;
const attempts=new Map();
async function db(){if(!process.env.DATABASE_URL)return null;if(!database)database=(async()=>{const {Pool}=await import('pg');const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==='false'?false:{rejectUnauthorized:true},max:5});await pool.query(`CREATE TABLE IF NOT EXISTS campus_users (id BIGSERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL);CREATE TABLE IF NOT EXISTS campus_sessions (token_hash TEXT PRIMARY KEY, user_id BIGINT REFERENCES campus_users(id) ON DELETE CASCADE, expires TIMESTAMPTZ NOT NULL);CREATE TABLE IF NOT EXISTS campus_saves (user_id BIGINT PRIMARY KEY REFERENCES campus_users(id) ON DELETE CASCADE, game JSONB NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());`);return pool;})().catch(e=>{database=null;throw e;});return database;}
const digest=t=>createHash('sha256').update(t).digest('hex');
export async function passwordHash(password,salt){return (await scrypt(password,salt,64)).toString('hex');}
export function validSave(game){return game?.version===3&&Number.isInteger(game.day)&&game.day>=1&&Number.isFinite(game.time)&&game.time>=0&&game.time<=1440&&Array.isArray(game.people)&&game.people.length<=100&&Array.isArray(game.messages)&&game.messages.length<=3000&&game.relations&&typeof game.relations==='object';}
export async function accountRoute(req,url,json){
 if(!url.pathname.startsWith('/api/account'))return false;
 if(url.pathname==='/api/account/status'){json(200,{enabled:!!process.env.DATABASE_URL});return true;}
 try{
 const pool=await db();if(!pool){json(503,{error:'帳號服務尚未連接資料庫。目前進度仍保留在此瀏覽器。'});return true;}
 let body='';if(req.method==='POST'||req.method==='PUT')for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>2000000){json(413,{error:'存檔太大，請聯絡管理者。'});return true;}}
 const data=body?JSON.parse(body):{};const action=url.pathname.split('/').at(-1);
 if(['register','login'].includes(action)&&req.method==='POST'){
  const key=req.socket.remoteAddress,now=Date.now(),hits=(attempts.get(key)||[]).filter(t=>now-t<900000);if(hits.length>=20){json(429,{error:'嘗試次數太多，請15分鐘後再試。'});return true;}hits.push(now);attempts.set(key,hits);
  const username=typeof data.username==='string'?data.username.trim().toLowerCase():'';const password=data.password;
  if(!/^[a-z0-9_]{3,24}$/.test(username)||typeof password!=='string'||password.length<8||password.length>128){json(400,{error:'帳號需3–24個英文字母、數字或底線；密碼需8–128字元。'});return true;}
  let user;
  if(action==='register'){const salt=randomBytes(16).toString('hex'),hash=await passwordHash(password,salt);try{user=(await pool.query('INSERT INTO campus_users(username,password_hash,salt) VALUES($1,$2,$3) RETURNING id,username',[username,hash,salt])).rows[0];}catch(e){if(e.code==='23505'){json(409,{error:'此帳號已被使用，請換一個名稱。'});return true;}throw e;}}
  else{user=(await pool.query('SELECT * FROM campus_users WHERE username=$1',[username])).rows[0];const hash=await passwordHash(password,user?.salt||'invalid-user-padding');if(!user||!timingSafeEqual(Buffer.from(hash,'hex'),Buffer.from(user.password_hash,'hex'))){json(401,{error:'帳號或密碼不正確。'});return true;}}
  const token=randomBytes(32).toString('base64url');await pool.query('DELETE FROM campus_sessions WHERE expires<NOW()');await pool.query("INSERT INTO campus_sessions(token_hash,user_id,expires) VALUES($1,$2,NOW()+INTERVAL '7 days')",[digest(token),user.id]);json(200,{token,username:user.username});return true;
 }
 const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):'';
 const user=(await pool.query('SELECT u.id,u.username FROM campus_sessions s JOIN campus_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires>NOW()',[digest(token)])).rows[0];if(!user){json(401,{error:'登入已到期，請重新登入。'});return true;}
 if(action==='logout'&&req.method==='POST'){await pool.query('DELETE FROM campus_sessions WHERE token_hash=$1',[digest(token)]);json(200,{ok:true});return true;}
 if(action==='save'&&req.method==='GET'){const row=(await pool.query('SELECT game,revision,updated_at FROM campus_saves WHERE user_id=$1',[user.id])).rows[0];json(200,{username:user.username,save:row||null});return true;}
 if(action==='save'&&req.method==='PUT'){
  if(!validSave(data.game)||!Number.isInteger(data.revision)||data.revision<0){json(400,{error:'存檔格式不正確。'});return true;}
  let result;if(data.revision===0)result=await pool.query('INSERT INTO campus_saves(user_id,game) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING revision,updated_at',[user.id,JSON.stringify(data.game)]);else result=await pool.query('UPDATE campus_saves SET game=$1,revision=revision+1,updated_at=NOW() WHERE user_id=$2 AND revision=$3 RETURNING revision,updated_at',[JSON.stringify(data.game),user.id,data.revision]);
  if(!result.rows.length)json(409,{error:'另一個裝置已有較新的存檔，請重新檢查後選擇。'});else json(200,result.rows[0]);return true;
 }
 json(404,{error:'找不到此操作'});return true;
 }catch{json(503,{error:'帳號服務暫時無法連線。瀏覽器進度不受影響，請稍後重試。'});return true;}
}
