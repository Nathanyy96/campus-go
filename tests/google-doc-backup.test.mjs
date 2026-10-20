import test from 'node:test';import assert from 'node:assert/strict';
import {randomBytes,createHmac} from 'node:crypto';import vm from 'node:vm';import {readFileSync} from 'node:fs';
import {GoogleDocStore} from '../google-doc-store.mjs';import {createGoogleAccountRoute} from '../accounts-google-docs.mjs';import {newGame} from '../simulation.js';
const secret='test-only-signing-secret-32-characters-minimum';
function fakeAppsScript(){
  const properties=new Map([['CAMPUS_BACKUP_SECRET',secret]]),documents=new Map(),cache=new Map();let nextId=0;
  function document(id){return {getId:()=>id,getBody:()=>({getText:()=>documents.get(id),setText:text=>documents.set(id,text)}),saveAndClose(){}};}
  const context={ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties.get(key),setProperty:(key,value)=>properties.set(key,value)})},Utilities:{computeHmacSha256Signature:(payload,key)=>[...createHmac('sha256',key).update(payload).digest()]},LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock(){}})},CacheService:{getScriptCache:()=>({get:key=>cache.get(key),put:(key,value)=>cache.set(key,value)})},DocumentApp:{openById:document,create:()=>{const id=String(++nextId);documents.set(id,'');return document(id);}}};
  vm.createContext(context);vm.runInContext(readFileSync(new URL('../cloud/google-doc-backup.gs',import.meta.url),'utf8'),context);
  const fetcher=async(url,options)=>({ok:true,json:async()=>JSON.parse(context.doPost({postData:{contents:options.body}}).text)});
  return {fetcher,documents};
}
test('signed encrypted Google document storage survives a new server instance; stale writes and forged signatures fail',async()=>{
  const remote=fakeAppsScript(),key=randomBytes(32).toString('base64');const config={url:'https://script.google.com/macros/s/test/exec',secret,key,fetcher:remote.fetcher};
  const a=new GoogleDocStore(config);await a.put('user:alice',{message:'private game progress'},0);
  assert.ok(![...remote.documents.values()].join('').includes('private game progress'));
  const b=new GoogleDocStore(config),row=await b.get('user:alice');assert.equal(row.value.message,'private game progress');
  await assert.rejects(()=>b.put('user:alice',{message:'stale'},0),error=>error.status===409);
  const forged=new GoogleDocStore({...config,secret:'wrong-signature-key-32-characters-long'});await assert.rejects(()=>forged.get('user:alice'),error=>error.status===401);
  const corrupt=JSON.parse(a.seal({day:1}));corrupt.tag=randomBytes(16).toString('base64');assert.throws(()=>a.open(JSON.stringify(corrupt)));
});
test('Google Docs account flow isolates users, preserves password hashes and enforces two-device save revisions',async()=>{
  const remote=fakeAppsScript(),storage=new GoogleDocStore({url:'https://script.google.com/macros/s/test/exec',secret,key:randomBytes(32).toString('base64'),fetcher:remote.fetcher}),route=createGoogleAccountRoute(storage);
  async function call(action,method='GET',body,token=''){let response;const req={method,headers:{authorization:`Bearer ${token}`},socket:{remoteAddress:'test'},async *[Symbol.asyncIterator](){if(body)yield JSON.stringify(body);}};await route(req,new URL(`https://test/api/account/${action}`),(status,data)=>{response={status,...data};});return response;}
  const alice=await call('register','POST',{username:'alice',password:'sample-password'});assert.equal(alice.status,200);
  assert.equal((await call('login','POST',{username:'alice',password:'wrong-password'})).status,401);
  assert.equal((await call('register','POST',{username:'alice',password:'sample-password'})).status,409);
  const deviceB=await call('login','POST',{username:'alice',password:'sample-password'});const bob=await call('register','POST',{username:'bobby',password:'sample-password'});
  const game=newGame();game.day=8;assert.equal((await call('save','PUT',{game,revision:0},alice.token)).revision,1);
  assert.equal((await call('save','PUT',{game,revision:0},deviceB.token)).status,409);
  assert.equal((await call('save','GET',null,deviceB.token)).save.game.day,8);assert.equal((await call('save','GET',null,bob.token)).save,null);
  const record=(await storage.get('user:alice')).value;assert.ok(record.password_hash);assert.ok(!JSON.stringify(record).includes('sample-password'));
  await call('logout','POST',{},alice.token);assert.equal((await call('save','GET',null,alice.token)).status,401);assert.equal((await call('save','GET',null,deviceB.token)).status,200);
});
