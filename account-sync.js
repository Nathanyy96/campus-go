// Revision-based sync. A failed request never discards the local pending snapshot.
export class SaveSync {
  constructor({request, read, write, notify=()=>{}}) {
    Object.assign(this,{request,read,write,notify});this.running=null;this.blocked=false;
  }
  queue(game) {
    const old=this.read();
    this.write({...old,game:structuredClone(game),dirty:true,serial:(old.serial||0)+1});
    this.notify('pending');
  }
  flush() {
    if(this.running)return this.running;
    if(this.blocked||!this.read()?.dirty)return Promise.resolve();
    this.running=this.send().finally(()=>{this.running=null;});return this.running;
  }
  async send() {
    while(this.read()?.dirty&&!this.blocked) {
      const snapshot=structuredClone(this.read());this.notify('syncing');
      try {
        const result=await this.request('save','PUT',{game:snapshot.game,revision:snapshot.revision});
        const current=this.read();
        this.write({...current,revision:result.revision,dirty:current.serial!==snapshot.serial});
        this.notify(this.read().dirty?'pending':'saved');
      } catch(error) {
        if(error.status===409){this.blocked=true;this.notify('conflict');}
        else if(error.status===401){this.blocked=true;this.notify('expired');}
        else this.notify('offline');
        return;
      }
    }
  }
  resolve(game,revision,{upload=false}={}) {
    const previous=this.read();this.write({game:structuredClone(game),revision,dirty:upload,serial:(previous?.serial||0)+1});
    this.blocked=false;this.notify(upload?'pending':'saved');
  }
}
