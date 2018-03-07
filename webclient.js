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
  res.cookie('x_access_token', req.token, { expires: new Date(Date.now() + (12*60*60*1000)), httpOnly: true, secure: false });
  //req.session.access_token = req.token;

  res.status(200).send({'result':true});
};

module.exports = {
  getContainerView,
  getLoginView,
  getRegisterView,
  postLogin
}
