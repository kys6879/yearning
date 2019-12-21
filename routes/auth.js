var express = require('express');
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
const passport = require('passport');
var router = express.Router();
const mysql = require('../database/mysql.js');
const cryptoUtil = require('../util/cryptoUtil');

router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    session: false
  }, (err, user, info) => {

    let result = {
      status: "",
      message: ""
    };

    console.log("[auth.js] /login !!!!", info);
    console.log("[auth.js] /login !!!!", user);

    if (err | !user || (user == undefined)) {
      console.log("[auth.js] /login  err !!!!", err);
      console.log("[auth.js] /login  user !!!!", user);

      result.status = false;
      result.message = info.message;

      return res.status(409).send(result);
    }

    req.login(user, {
      session: false
    }, (err) => {
      if (err) {
        result.status = false;
        result.message = "serverError";
        return next(result);
      }

      console.log(secretObj.secret);
      const token = jwt.sign(user, secretObj.secret);

      result.status = true;
      result.message = token;

      return res.status(200).send(result);
    });
  })(req, res);
});

module.exports = router;