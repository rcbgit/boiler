var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport, User) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        console.log('whatasdrfds');

        User.findOne({ 'local.email' :  email }, function(err, user, info) {

            if (err){
                console.log(err);
                return done(err);
            }
            if (user) {
                console.log('user is already taken');
                console.log(info);
                return done(null, false, {message: 'That email is already taken!'});
            } else {
                console.log('creating user');
                var newUser            = new User();

                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err){
                        throw err;
                    }
                    console.log(info);
                    return done(null, newUser);
                });
            }

            

        });    

        

    }));
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err){
                return done(err);
            }
            if (!user){
                return done(null, false, {message: 'No User Found'}); //req.flash('loginMessage', 'No user found.')); 
            }
            if (!user.validPassword(password)){
                return done(null, false, {message: 'Wrong Password'}); //req.flash('loginMessage', 'Oops! Wrong password.')); 
            }
            return done(null, user);
        });

    }));

};
