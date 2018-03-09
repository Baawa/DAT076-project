// Imports
//const Users = require('./BDUserManager');

const getStartView = (req, res, next) => {
  res.render('start', {assetpath:'../', user:req.user, posts:req.posts});
};

const getLoginView = (req, res, next) => {
  res.render('login', {assetpath:'../'});
};

const getRegisterView = (req, res, next) => {
  res.render('register', {assetpath:'../'});
};

const getNewPostView = (req, res, next) => {
  res.render('newpost', {assetpath:'../', user:req.user});
}

const getThreadView = (req, res, next) => {
  res.render('thread', {assetpath:'../', user:req.user, post:req.post});
}


//Post
const postLogin = (req, res, next) => {
  res.cookie('x_access_token', req.token, { expires: new Date(Date.now() + (12*60*60*1000)), httpOnly: true, secure: false });
  //req.session.access_token = req.token;

  res.status(200).send({'result':true});
};

module.exports = {
  getStartView,
  getLoginView,
  getRegisterView,
  getNewPostView,
  getThreadView,
  postLogin
}
