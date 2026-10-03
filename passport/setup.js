const User = require('../models/Users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

passport.use(new LocalStrategy( 
    async (username, password, done) => {
        const existingUser = await User.findOne({ username: username });
        
        if (!existingUser) {
            return done(null, false, { message: 'User does not exist'});
        } 

        if (!bcrypt.compareSync(password, existingUser.password)) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, existingUser);
    })
)