require('dotenv').config();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { token } = require('morgan');
const authJwt = require('../middlewares/authJwt');
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

  app.post('/user/update-profile', [authJwt.verifyToken], function(req, res) {
    // proceed
    const { fullname, phone, password } = req.body;
    const isChangingEmail = !!req.body?.oldEmail;
    const email = isChangingEmail ? req.body.oldEmail : req.body.email;

    User.findOne({ email }).exec((err, user) => {
      if(err) return res.send({ status: 0, message: err });
      // user not found
      if(!user) return res.send({ status: 0, message: "User Not found." });
      // password is valid
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if(!passwordIsValid) return res.send({ status:0, message: 'Invalid password' })
      // proceed
      User.updateOne({ id:user._id }, { email: isChangingEmail ? req.body.email : email, fullname, phone }).exec((err => {
        if(err) return res.send({ status: 0, message: err });

        res.send({ status: 1, message: 'User profile updated successfully' });
      }))
    })
  })

  app.post('/user/update-bankInfo', [authJwt.verifyToken], function(req, res) {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if(err) return res.send({ status: 0, message: err });
      // user not found
      if(!user) return res.send({ status: 0, message: "User Not found." });
      // password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if(!passwordIsValid) return res.send({ status:0, message: 'Invalid password' })
      // proceed -> update user
      const { accountName, accountNo, type, bank } = req.body;
      const bankInfo = { accountName, accountNo, type, bank };
      User.updateOne({ id: user._id }, { bankInfo: bankInfo }).exec((err) => {
        if(err) return res.send({ status: 0, message: err });

        res.send({ status: 1, message: 'Bank Information Updated' })
      })
    })
  })

  app.post('/user/change-password', [authJwt.verifyToken], function(req, res) {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if(err) return res.send({ status: 0, message: err });
      // user not found
      if(!user) return res.send({ status: 0, message: "User Not found." });
      // password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.old, user.password);
      if(!passwordIsValid) return res.send({ status:0, message: 'Old password is incorrect' })
      // proceed -> update password
      User.updateOne({ id: user._id }, { password: bcrypt.hashSync(req.body.password, 8) }).exec((err) => {
        if(err) return res.send({ status: 0, message: err });

        res.send({ status: 1, message: 'Security Information Updated' })
      })
    })
  })
}