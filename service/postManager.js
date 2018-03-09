const Post = require('../model/post');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../dbconfig');
const Sql = require('../DATSQL/DATSql');

var create = (req, res, next) => {
  var post = new Post(req.body);
  post.user_id = req.user.id;

  var curr_date = new Date();
  post.date = "" + curr_date.getDate() + "/" + curr_date.getMonth() + "/" + curr_date.getFullYear() + " " + curr_date.getHours() + ":" + curr_date.getMinutes();

  post.locked = false;

  post.save(function(error, post_id) {
    if (error) {
      res.status(400).send({'error':'Could not create post.'});
    } else {
      req.post_id = post_id;
      next();
    }
  });
};

var getPost = (req, res, next) => {
  var post = new Post(req);
  post.id = req.params.post_id;

  post.get(function(error, p) {
    if (error) {
      res.status(400).send({'error':'Could not get post.'});
    } else {
      req.post = new Post(p);
      next();
    }
  });
};

var getSubPosts = (req, res, next) => {
  Sql.query('SELECT * FROM posts WHERE parent_id=?;', [req.post_id],
  function(error, results, fields) {
    if (error) {
      console.error(error);
      res.status(400).send({'error':error});
    } else {
      var posts = [];

      for (var i = 0; i < results.length; i++){
        var post = new Post(results[i]);

        posts.push(post);
      }

      req.posts = posts;
      next();
    }
  });
}

var getThreads = (req, res, next) => {
  Sql.query('SELECT * FROM posts WHERE parent_id IS NULL;', [],
  function(error, results, fields) {
    if (error) {
      console.error(error);
      res.status(400).send({'error':error});
    } else {
      var posts = [];

      for (var i = 0; i < results.length; i++){
        var post = new Post(results[i]);
        post.id = results[i].id; //for some reason id is not set in post.

        posts.push(post);
      }

      req.posts = posts;
      next();
    }
  });
}

module.exports = {
  create,
  getPost,
  getSubPosts,
  getThreads
}
