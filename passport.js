const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
let secretObj = require("./config/jwt");

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (email, password, cb) {

    console.log("[passport.js] email -> ", email);
    console.log("[passport.js] password -> ", password);

    try {
      // con.connect();

      db.query("SELECT email , password FROM user WHERE email = ?", [email], (err, rt, fields) => {
        if (err) {
          console.log(err);
        }
        console.log(rt);
        if (rt.length < 1) {
          return cb(null, false, {
            message: 'Incorrect email or password.'
          })
        } else if (email == rt[0].email && password == rt[0].password) {
          return cb(null, email, {
            message: 'Logged in Successfully'
          })
        } else {
          return cb(null, false, {
            message: 'Incorrect email or password.'
          })
        }
      });
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretObj.secret
  },
  async function (jwtPayload, cb) {

    console.log("JWTStrategy!!!", jwtPayload);

    try {
      db.query("SELECT email FROM user WHERE email = ?", [jwtPayload], (err, rt, fields) => {
        return cb(null, rt[0].email);
      });
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  }
));