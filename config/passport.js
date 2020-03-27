const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require("../models/User");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = require("./config").secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {	
	User.findById(jwt_payload.id)
		.then(user => {
			if(user){
				return done(null,user)
			}
			return done(null,false)
		})
  }));
}