const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const env = require("dotenv");

env.config();

passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID:process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
	clientSecret:process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
	callbackURL:process.env.URL,
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
    // console.log(profile)    
	return done(null, profile);
}
));