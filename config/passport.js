const Local = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User model
const User = mongoose.model('users');



module.exports = function(passport){

    passport.use(new Local({usernameField: 'email'}, (email,password,done )=>{
        // check for user
        User.findOne({
            email:email
        }).then(user =>{
            if(!user){
                return done(null, false,{message:'User Not Found'});
            }

            //password match
            bcrypt.compare(password, user.password, (err,isMatch) =>{
                if (err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false,{message:'Wrong password'})
                }
            })

        })

    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}