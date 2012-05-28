var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname + '/public'));

var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
	res.render('index.ejs', { locals: {} });
});

app.listen(8888);