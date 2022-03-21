require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.send({ status: 2, message: "No token provided!" });
  }
  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send({ status: 2, message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
}

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if(err) {
      res.send({ status: 2, message: err });
      return;
    }

    if(user.role) {
      const allowedRoles = [ 1, 2 ];
      if(allowedRoles.includes(user.role)) {
        next();
        return;
      }

      res.send({ status: 2, message: "Require Admin Role!" });
      return;
    }
  })
}

const authJwt = {
  verifyToken,
  isAdmin
}
module.exports = authJwt;
