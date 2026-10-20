/* Deploy as a Google Apps Script web app, execute as owner.
 * Set CAMPUS_BACKUP_SECRET in Script Properties, matching the server.
 * Documents stay private; the endpoint accepts only signed server requests.
 * Never paste the signing secret into the game's frontend or a Google Doc.
 */
function doPost(e) {
  function reply(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
  var lock;
  try {
    if(!e.postData||e.postData.contents.length>450000)return reply({ok:false,status:413});
    var request=JSON.parse(e.postData.contents),properties=PropertiesService.getScriptProperties();
    var secret=properties.getProperty('CAMPUS_BACKUP_SECRET');
    if(!secret||typeof request.payload!=='string'||typeof request.signature!=='string')return reply({ok:false,status:401});
    var expected=Utilities.computeHmacSha256Signature(request.payload,secret).map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');
    var difference=expected.length^request.signature.length;
    for(var i=0;i<expected.length;i++)difference|=expected.charCodeAt(i)^(request.signature.charCodeAt(i)||0);
    if(difference)return reply({ok:false,status:401});
    var payload=JSON.parse(request.payload);
    if(!Number.isFinite(payload.timestamp)||Math.abs(Date.now()-payload.timestamp)>300000||!/^[a-f0-9]{32}$/.test(payload.nonce)||!/^user:[a-z0-9_]{3,24}$/.test(payload.key)||['get','put'].indexOf(payload.action)<0)return reply({ok:false,status:400});
    lock=LockService.getScriptLock();if(!lock.tryLock(10000))return reply({ok:false,status:503});
    var cache=CacheService.getScriptCache();if(cache.get(payload.nonce))return reply({ok:false,status:409});cache.put(payload.nonce,'1',600);
    var propertyKey='record:'+payload.key,documentId=properties.getProperty(propertyKey),record={revision:0,data:null};
    if(documentId){var current=DocumentApp.openById(documentId);record=JSON.parse(current.getBody().getText());}
    if(payload.action==='get')return reply({ok:true,revision:record.revision,data:record.data});
    if(!Number.isInteger(payload.revision)||payload.revision!==record.revision)return reply({ok:false,status:409});
    if(typeof payload.data!=='string'||payload.data.length>400000)return reply({ok:false,status:413});
    var next={revision:record.revision+1,updatedAt:new Date().toISOString(),data:payload.data,previous:record.data?{revision:record.revision,data:record.data}:null};
    var document=documentId?DocumentApp.openById(documentId):DocumentApp.create('Campus Go 玩家備份 '+payload.key.slice(5));
    document.getBody().setText(JSON.stringify(next));document.saveAndClose();
    if(!documentId)properties.setProperty(propertyKey,document.getId());
    return reply({ok:true,revision:next.revision,updated_at:next.updatedAt});
  } catch(error){return reply({ok:false,status:503});}
  finally{if(lock&&lock.hasLock())lock.releaseLock();}
}
function doGet(){return ContentService.createTextOutput('Campus Go backup endpoint. Signed server requests only.');}
