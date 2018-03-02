const config = require('./dbconfig');
const jwt = require('jsonwebtoken');

// Check token and set user
module.exports = function(req, res, next) {
	// console.log('Base url: ', req.baseUrl);
	var token = req.cookies['x-access-token'] || req.headers['x-access-token'];
	if (typeof req.headers['x-access-token'] !== 'undefined' ||
			typeof req.headers['ajax'] !== 'undefined') {
			var api = true;
	}
	if (token) {
		jwt.verify(token, config.app.accessKey, function(error, decoded) {
		  if (error) {
				console.error('Invalid token.');
				if (api) {
					res.status(401).send({'error':'Invalid token.'});
				} else {
					res.status(401).redirect('/login');
				}
			} else {
				// Valid token
				req.user = decoded;
				next();
			}
		});
	} else {
		// console.error('Missing token.');
		if (api) {
			res.status(401).send({'error':'Missing token.'});
		} else {
			res.status(401).redirect('/register'); // Was register
		}
	}
};
