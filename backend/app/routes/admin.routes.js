require('dotenv').config();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { token } = require('morgan');
const { isAdmin } = require('../middlewares/authJwt');
const authJwt = require('../middlewares/authJwt');
const { user } = require('../models');
const db = require("../models");
const Services = db.services;
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

  app.post('/admin/service/create', [authJwt.verifyToken, isAdmin], function(req, res) {
    const newService = new Services({
      name: req.body.name,
      denominations: req.body.denominations,
      type: req.body.type,
      rate: req.body.rate,
    })

    newService.save((err, service) => {
      if(err) return res.send({ status: 0, message: 'Error occurred: Duplicate item or incorrect variables, more:', stack: err });

      if(req.body?.coinname) {
        service.coinname = req.body.coinname
        service.cryptoAddress = req.body?.cryptoAddress
      }

      service.save(err => {
        if(err) return res.send({ status: 0, message: err });
      })
      return res.send({ status: 1, message: "New service created successfully!" });
    })
  })

  app.post('/admin/service/update', [authJwt.verifyToken, isAdmin], function(req, res) {
    Services.findOne({ id: req.body._id }).exec((err, service) => {
      if(err) return res.send({ status: 0, message: err });
      // user not found
      if(!service) return res.send({ status: 0, message: "Service Not found." });
      // proceed
      const { name, denominations, type, rate } = req.body;
      Services.updateOne({ id:service._id }, { name, denominations, type, rate, coinname: type == 'crypto' ? req.body.coinname : null, cryptoAddress: type == 'crypto' ? req.body.cryptoAddress : null }).exec((err => {
        if(err) return res.send({ status: 0, message: err });

        res.send({ status: 1, message: 'Service updated successfully' });
      }))
    })
  })

  app.post('/admin/service/delete', [authJwt.verifyToken, isAdmin], function(req, res) {
    Services.findOne({ id: req.body.itemId }).exec((err, service) => {
      if(err) return res.send({ status: 0, message: err });
      // user not found
      if(!service) return res.send({ status: 0, message: "Service Not found." });
      // proceed
      Services.deleteOne({ id: req.body.itemId }).exec((err => {
        if(err) return res.send({ status: 0, message: err });

        res.send({ status: 1, message: 'Service deleted successfully' });
      }))
    })
  })

  app.post('/admin/transaction/update-status', [authJwt.verifyToken, isAdmin], function(req, res) {
    User.findOne({ email: req.body?.email }).exec((err, user) => {
      if(err) return res.send({ status: 0, message: err });
      if(!user) return res.send({ status: 0, message: 'User Not found' });
      // proceed
      const txArray = user.transactions.filter(x => x.id === req.body?.txId);
      let transaction = user.transactions.find(x => x.id == req.body?.txId);
      transaction.status = req.body?.status;
      txArray.push(transaction);
      user.notifications.push({ title: 'Confirmed Transaction', message: `$${transaction.amountValue} ${transaction.service.name} has been confirmed, ${transaction.returnValue} will be sent to you within 24 hours, else contact admin`, type: db.TransactionTypes.trade });
      user.save((err) => {
        if(err) return res.send({ status: 0, message: err });

        return res.send({ status: 1, message: "Transaction updated", data: user });
      })
    })
  })
}