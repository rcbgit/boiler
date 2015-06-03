	var express = require('express');
	var bodyParser = require('body-parser');
	var app = express();
	var passport = require('passport');
	var flash    = require('connect-flash');
	var morgan       = require('morgan');
	var cookieParser = require('cookie-parser');
	
	var mongoose = require('mongoose');
	var session      = require('express-session');
	var bcrypt   = require('bcrypt-nodejs');


	var newsDB = mongoose.createConnection('mongodb://localhost/news');
	var userDB = mongoose.createConnection('mongodb://localhost/user');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function (callback) {
	  console.log('Connected to database');
	});


	var newsSchema = new mongoose.Schema({
	  subject:  String,
	  body: String,
	  date: String
	  });

	var userSchema = mongoose.Schema({

	    local            : {
	        email        : String,
	        password     : String,
	    },
	    facebook         : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
	    twitter          : {
	        id           : String,
	        token        : String,
	        displayName  : String,
	        username     : String
	    },
	    google           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    }

	});


	userSchema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	userSchema.methods.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.local.password);
	};

	var User = userDB.model('User', userSchema);
	var post = newsDB.model('news', newsSchema);

	require('./config/passport.js')(passport, User); 	

	app.use(morgan('dev')); 
	app.use(cookieParser()); 
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(express.static(__dirname + "/public"));
	app.use(session({secret: 'thisisafuckingsecret', 
                 saveUninitialized: true,
                 resave: true}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash()); 
	require('./public/routes/routes.js')(app, passport, post);

	app.listen(3000);
	console.log('Server Running');