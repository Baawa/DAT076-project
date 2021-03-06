// Packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const Table = require('./tablesetup');
const Auth = require('./server_auth');
const Webclient = require('./webclient');
const Users = require('./service/userManager');
const config = require('./dbconfig');
const Posts = require('./service/postManager');
const Favorites = require('./service/favoriteManager');


// Setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
	limit:1024*1024*20,
	type:'application/json'
}));
app.use(bodyParser.urlencoded({
	extended:true,
	limit:1024*1024*20
}));
app.use(cookieParser());
app.listen(process.env.PORT || 8081, function () {
  console.log('Server is running.');
});

// Normal response
const standardResponse = (req, res, next) => {
	console.log('Standard response: true');
	res.send({'result':true});
};

app.get('/', Auth, Favorites.getFavoritesForUser, Posts.getThreads, Webclient.getStartView);
app.get('/about/:user_id', Auth, Users.getUser, Webclient.getAboutView);
app.get('/login', Webclient.getLoginView);
app.get('/register', Webclient.getRegisterView);
app.get('/post/new', Auth, Webclient.getNewPostView);
app.get('/post/:post_id', Auth, Favorites.getFavoritesForUser, Posts.getPost, Posts.getSubPosts, Webclient.getThreadView);
app.get('/userpage/:user_id', Auth, Users.getUser, Favorites.getFavoritesForFoundUser, Posts.getThreads, Posts.getAllSubPosts, Webclient.getUserView);
app.get('/logout', Auth, function(req, res, next){
	res.clearCookie('x_access_token');
  res.redirect('/');
});
app.get('/about', Auth, Users.getUser, Webclient.getAboutView);
app.get('/help', Auth, Webclient.getHelpView);

app.get('/user/:user_id', Auth, Users.getUser, function(req, res, next){
	res.send({'user': req.found_user});
});

//Post-requests
app.post('/login', Users.login, Webclient.postLogin);
app.post('/register', Users.register, standardResponse);
app.post('/userpage', Auth, Users.loadPic, Users.login, function(req, res, next){
	res.clearCookie('x_access_token');
	res.cookie('x_access_token', req.token, { expires: new Date(Date.now() + (60*60*1000)), httpOnly: true, secure: false });
}, Auth, standardResponse);
app.post('/ban', Auth, Users.ban, standardResponse);
app.post('/post/new', Auth, Posts.create, standardResponse);
app.post('/favorite/', Auth, Favorites.getFavoritesForUser, Favorites.toggle, Posts.increaseFavorite, standardResponse);
app.post('/post/lock', Auth, Posts.getPost, Posts.lockPost, standardResponse);

//tablesetup
app.get('/setup/', Table.deleteTables, Table.createTables, Users.createAdmin, standardResponse);

// Route not found - default to '/'
app.get('*', Auth, function(req, res, next) {
	console.log('Route not found: ', req.url);
	res.redirect('/');
});
