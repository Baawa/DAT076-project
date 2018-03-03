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


//Post
const postLogin = (req, res, next) => {
  res.send({'result':{'token':req.token}, 'token':req.token, 'header':'x-access-token'});
};

module.exports = {
  getContainerView,
  getLoginView,
  getRegisterView,
  postLogin
}
