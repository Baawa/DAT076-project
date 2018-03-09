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

app.get('/', Auth, Posts.getThreads, Webclient.getStartView); // TODOs.getProducts);
app.get('/login', Webclient.getLoginView);
app.get('/register', Webclient.getRegisterView);
app.get('/post/new', Auth, Webclient.getNewPostView);
app.get('/post/:post_id', Auth, Posts.getPost, Webclient.getThreadView);

//Post-requests
app.post('/login', Users.login, Webclient.postLogin);
app.post('/register', Users.register, standardResponse);
app.post('/post/new', Auth, Posts.create, standardResponse);

//tablesetup
app.get('/setup/', Table.deleteTables, Table.createTables, standardResponse);

// Route not found - default to '/'
app.get('*', Auth, function(req, res, next) {
	console.log('Route not found: ', req.url);
	res.redirect('/');
});
