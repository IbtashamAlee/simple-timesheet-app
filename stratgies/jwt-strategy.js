const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("userschema");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.MY_SECRET_KEY || 'thisismymostsecrectkey';

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(person => {
                    if (person) {
                        return done(null, person);
                    }
                    return done(null, false)
                })
                .catch(err => console.log(err));
        })
    );
};
