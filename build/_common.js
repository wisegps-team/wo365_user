var getScriptRequest = function() {
    var urlparse;
    urlparse = document.scripts[document.scripts.length - 1].src.split("\?");
    var parms = urlparse[1].split("&");
    var values = {};
    for (var i = 0; i < parms.length; i++) {
        var parm = parms[i].split("=");
        values[parm[0]] = parm[1];
    }
    return values;
}

var sr = getScriptRequest();
// console.log(JSON.stringify(sr));
W.version = '43';
document.write('<script src="' + sr["u"] + 'common.js?v=' + W.version + '"><\/script>');