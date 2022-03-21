require('dotenv').config();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { token } = require('morgan');
const db = require("../models");
const User = db.user;
const secretKey = process.env.SECRET_KEY;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/auth/signup', function(req, res) {
    const user = new User({
      fullname: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      transactions: [],
      notifications: [],
    })

    user.save((err, user) => {
      if (err) {
        return res.send({ status: 0, message: err });
      }

      if(req.body.role) {
        if([1, 2, 3].includes(req.body.roles)) {
          user.role = req.body.role;
        } else {
          return res.send({ status: 0, message: 'Invalid user role' });
        }
      } else {
        user.role = 3; // regular user role
      }

      if([1, 2, 3].includes(user.role)) {
        user.save(err => {
          if (err) {
            return res.send({ status: 0, message: err });
          }

          return res.send({ status: 1, message: "User was registered successfully!" });
        })
      }
    })
  })

  app.post('/auth/signin', function(req, res) {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if(err) {
        res.send({ status: 0, message: err });
        return;
      }
      // user not found
      if(!user) return res.send({ status: 0, message: "User Not found." });
      // password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if(!passwordIsValid) return res.send({ status:0, message: 'Invalid password' })

      // proceed signin
      const token = jsonwebtoken.sign({ id: user._id, email: user.email, role: user.role }, secretKey, { expiresIn: 86400 });
      const { email, phone, fullname, notifications, role, transactions, bankInfo, _id } = user;
      res.send({ status: 1, accessToken: token, email, phone, fullname, notifications, transactions, bankInfo, role, _id })
    })
  })

  app.post('/auth/user-token', function(req, res) {
    jsonwebtoken.verify(req.body.token, secretKey, (err, decoded) => {
      if (err) return res.send({ status: 0, message: err });

      User.findOne({ email: decoded.email }).exec((err, user) => {
        if(err) {
          res.send({ status: 0, message: err });
          return;
        }
        // user not found
        if(!user) return res.send({ status: 0, message: "User Not found." });
        // proceed
        const { email, phone, fullname, notifications, role, transactions, bankInfo, _id } = user;
        res.send({ status: 1, accessToken: req.body.token, email, phone, fullname, notifications, transactions, bankInfo, role, _id });
      })
    })
  })
}