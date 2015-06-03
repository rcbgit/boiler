module.exports = function(app, passport, post) {
	app.get('/news', function(req, res){
		console.log('Right before db');
		post.find(function (err, docs) {
		  if (err) return console.error(err);
		  console.log(docs);
		  res.json(docs);
		});
	});

	app.post('/news', function(req, res){
		console.log(req.body);
		var dateRaw = new Date();
		var dateString = dateRaw.toString();
		var newPost = new post({body: req.body.body, subject: req.body.subject, date: dateString	})
		;
		//console.log(newPost);
		newPost.save(function(err){
	    if(err)
	        console.log(err);
	    else
	        console.log(newPost);
	    	res.json(newPost);
		});
	});

	app.delete('/news/:id', function(req,res){
		var id = req.params.id;
		console.log('Delete ' + id);
		post.findByIdAndRemove({_id: id}, function(err, doc){
			if(err)
				console.log(err);
			else
				res.json(doc);
		});
	});

	app.get('/news/:id', function(req, res){
		var id = req.params.id;
		console.log(id);
		post.findOne({_id: id}, function(err, doc){
			if(err)
				console.log(err);
			else
				res.json(doc);
		});
	});	
	app.put('/news/:id', function(req, res){
		var id = req.params.id;
		console.log('put ' + id);
		post.findOneAndUpdate({_id: id }, req.body, function (err, doc) {
		    if (err){
		  		console.log(err);
		  	} else {
		  		res.json(doc);
		  	}
		});
	});

     app.post('/signup', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { 
	    	
	    	console.log(info);
	    	return res.redirect('/#/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/#/people');
	    });
		})(req, res, next);
	});   

    app.post('/login', function(req, res, next) {
	  passport.authenticate('local-login', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { 

	    	console.log(info);
	    	return res.redirect('/#/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(req);
	      return res.redirect('/#/people');
	    });
		})(req, res, next);
	});

}