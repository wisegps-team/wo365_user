/**
 * 用于组件通用的一些mixins
 */



export var  P={
    rebuild:function (com) {
        if(typeof com.bind=='function')
            com.bind().forEach(function(fn) {
                com[fn.name]=fn.bind(com);
            }, this);
    },
    requal:function(a,b){
        let type=typeof a;
        if(type=='undefined')
            return (typeof b==type);
        else if(type==typeof b&&type=='object'){
            let e=true;
            for(let k in b){
                if(a[k]!=b[k])e=false;
            }
            return e;
        }else
            return (a==b);
    }
}


export default P;