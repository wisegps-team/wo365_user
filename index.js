var express = require('express');
var app = express();

app.use(express.static('build'));

app.get('/src/*/*', function (req, res) {
    if(req.url.indexOf('.html')==-1){
      res.send('<script>top.location="home.html"</script>');
    }
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})