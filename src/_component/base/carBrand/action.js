import {randomStr} from '../../../_modules/tool';

class carBrandAction {
    constructor() {
        this.key=carBrandAction.getkey();
        this.cb=[];

        this.action={
            load:carBrandAction.load,
            select:carBrandAction.select
        }
    }
    
    act(name,key){
        let eventName=(key||this.key)+'-'+carBrandAction._base_act+name;
        return eventName;
    }

    emitLoad(id){
        if(carBrandAction.load){
            carBrandAction.load=false;
            this.emit('load',id);
        }
    }

    emit(name,params){
        name=this.action[name]?this.action[name]:this.act(name);
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(name, false, false);
        evt.params=params;
        window.dispatchEvent(evt);
    }

    on(name,callback){
        let key=carBrandAction.getkey();//卸载事件时需要用到的key
        name=this.action[name]?this.action[name]:this.act(name);
        this.cb.push({
            name,
            callback,
            key:key
        });
        window.addEventListener(name,callback);
        return key;
    }

    off(key){
        let e=this.cb.filter(ele=>ele.key==key);
        window.removeEventListener(e.name,e.callback);
    }

    clearEvent(){
        this.cb.forEach(e=>window.removeEventListener(e.name,e.callback));
        this.cb=[];
    }
}
carBrandAction.getkey=randomStr;
carBrandAction._base_act='CAR-BRAND-ACTION-';
carBrandAction.load=carBrandAction._base_act+'LOADED';
carBrandAction.select=carBrandAction._base_act+'SELECT';


export default carBrandAction;