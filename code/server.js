const express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('connect-flash'),
	db = require('./db');

var app = express();

app.set('view engine', 'ejs');
app.set("views", "views");
app.listen(port = process.env.PORT || 3000, function(){
	console.log("server started on : http://localhost:"+ port+"/");
})

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
	res.locals.session = req.session;
	next();
});
app.use(flash());
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	req.isAjax = req.xhr
	next();
});

app.use(methodOverride("_method"));

var routes = require('./app/routes');
routes(app)