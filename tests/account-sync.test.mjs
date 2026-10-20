import test from 'node:test';
import assert from 'node:assert/strict';
import {SaveSync} from '../account-sync.js';
function client(server,initial={game:{day:1},revision:0,dirty:false,serial:0}) {
  let local=structuredClone(initial);const states=[];
  const sync=new SaveSync({request:server,read:()=>local,write:value=>{local=value;},notify:s=>states.push(s)});
  return {sync,read:()=>local,states};
}
test('two devices cannot silently overwrite each other; explicit local choice uses latest revision',async()=>{
  let cloud=null,revision=0;
  const server=async(_,__,body)=>{if(body.revision!==revision)throw Object.assign(Error(),{status:409});cloud=body.game;return {revision:++revision};};
  const a=client(server),b=client(server);
  a.sync.queue({day:2});await a.sync.flush();b.sync.queue({day:3});await b.sync.flush();
  assert.equal(cloud.day,2);assert.equal(b.read().dirty,true);assert.equal(b.sync.blocked,true);
  b.sync.resolve(b.read().game,revision,{upload:true});await b.sync.flush();assert.equal(cloud.day,3);assert.equal(revision,2);
});
test('a save made during upload is queued and uploaded with the new server revision',async()=>{
  let release;let calls=0;const revisions=[];
  const c=client(async(_,__,body)=>{revisions.push(body.revision);if(++calls===1)await new Promise(r=>{release=r;});return {revision:calls};});
  c.sync.queue({day:2});const uploading=c.sync.flush();c.sync.queue({day:3});release();await uploading;
  assert.deepEqual(revisions,[0,1]);assert.equal(c.read().game.day,3);assert.equal(c.read().dirty,false);
});
test('offline progress survives retry and expired sessions never discard pending saves',async()=>{
  let fail=true;const c=client(async()=>{if(fail)throw Error('offline');return {revision:1};});
  c.sync.queue({day:7});await c.sync.flush();assert.equal(c.read().dirty,true);fail=false;await c.sync.flush();assert.equal(c.read().dirty,false);
  const expired=client(async()=>{throw Object.assign(Error(),{status:401});});expired.sync.queue({day:8});await expired.sync.flush();assert.equal(expired.read().game.day,8);assert.equal(expired.sync.blocked,true);
});
