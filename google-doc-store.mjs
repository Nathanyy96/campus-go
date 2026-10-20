import {createHmac,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
export class GoogleDocStore {
  constructor({url,secret,key,fetcher=fetch}){
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url||''))throw Error('Invalid Google backup endpoint');
    if(!secret||secret.length<32)throw Error('Missing backup signing secret');
    this.key=Buffer.from(key||'','base64');if(this.key.length!==32)throw Error('Missing backup encryption key');
    Object.assign(this,{url,secret,fetcher});
  }
  seal(value){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',this.key,iv);const encrypted=Buffer.concat([cipher.update(gzipSync(JSON.stringify(value))),cipher.final()]);return JSON.stringify({v:1,iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:encrypted.toString('base64')});}
  open(text){const value=JSON.parse(text);if(value.v!==1)throw Error('Unsupported backup');const decipher=createDecipheriv('aes-256-gcm',this.key,Buffer.from(value.iv,'base64'));decipher.setAuthTag(Buffer.from(value.tag,'base64'));return JSON.parse(gunzipSync(Buffer.concat([decipher.update(Buffer.from(value.data,'base64')),decipher.final()]),{maxOutputLength:8_000_000}).toString('utf8'));}
  async call(action,key,extra={}){
    const payload=JSON.stringify({action,key,...extra,timestamp:Date.now(),nonce:randomBytes(16).toString('hex')});
    const signature=createHmac('sha256',this.secret).update(payload).digest('hex');
    const response=await this.fetcher(this.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({payload,signature}),signal:AbortSignal.timeout(25000),redirect:'follow'});
    if(!response.ok)throw Error('Google backup unavailable');let result;try{result=await response.json();}catch{throw Error('Google backup is not deployed or authorized');}
    if(!result.ok)throw Object.assign(Error('Google backup request failed'),{status:result.status||503});return result;
  }
  async get(key){const result=await this.call('get',key);return {revision:result.revision,value:result.data?this.open(result.data):null};}
  async put(key,value,revision){const data=this.seal(value);if(data.length>400_000)throw Object.assign(Error('備份容量已達單一玩家上限，請下載本機備份。'),{status:413});return this.call('put',key,{data,revision});}
}
