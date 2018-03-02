// Imports
//const Users = require('./BDUserManager');

const getContainerView = (req, res, next) => {
  res.render('container', {assetpath:'../'});
};

const getLoginView = (req, res, next) => {
  res.render('login', {assetpath:'../'});
};

const getRegisterView = (req, res, next) => {
  res.render('register', {assetpath:'../'});
};

module.exports = {
  getContainerView,
  getLoginView,
  getRegisterView
}
