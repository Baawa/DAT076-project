const User = require('../model/user');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../dbconfig');
const Sql = require('../DATSQL/DATSql');

var register = (req, res, next) => {
  var user = new User(req.body);
  user.banned = false;

  if (typeof user.password !== 'undefined' && typeof user.name != 'undefined') {
    user.save(function(error, user_id) {
      if (error) {
        res.status(400).send({'error':'Could not create user.'});
      } else {
        next();
      }
    });
  } else {
    res.status(400).send({'error':'Must have password.'});
  }
};

var login = (req, res, next) => {
  if (typeof req.body.name !== 'undefined' && typeof req.body.password !== 'undefined') {
    const user = new User(req);
    user.authenticate(function(error, userinfo) {
      if (error) {
        res.status(401).send(error);
      } else {
        req.user = userinfo;
        req.token = jwt.sign(userinfo, config.app.accessKey);
        next();
      }
    });
  } else {
    res.status(401).send('Missing name and/or password in request.');
  }
};

var logout = (req, res, next) => {
  if (clearTokenCookie(req, res)) {
    next();
  } else {
    res.status(400).send({'error':'Cookie not found.'});
  }
};

var clearTokenCookie = (req, res, next) => {
  if (req.cookies['x-access-token']) {
    res.clearCookie('x-access-token');
    return true;
  }
  return false;
}

var getUser = (req, res, next) => {
  var user = new User(req);
  user.get(function(error, u) {
    if (error) {
      res.status(400).send({'error':'Could not get user.'});
    } else {
      req.user = new User(u);
      next();
    }
  });
};

var updateUser = (req, res, next) => {
  var user = new User(req);
  user.update(function(error, result) {
    if (error) {
      res.status(400).send({'error':'Could not update user.'});
    } else {
      next();
    }
  });
};

module.exports = {
  login,
  register,
  logout,
  clearTokenCookie,
  getUser,
  updateUser
}
