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

  var lockPost = (req, res, next) => {
    if (typeof req.post !== 'undefined') {
      var post = new Post(req.post);
      post.id = req.post.id;
      post.locked = true;
      post.title = "[LOCKED] " + post.title;

      post.update(function(error, post_id){
        if (error) {
          res.status(400).send({'error':'Could not create post.'});
        } else {
          next();
        }
      });
    }
  };

  var getPost = (req, res, next) => {
    var post = new Post(req);
    post.id = req.post_id || req.params.post_id || req.body.post_id;

    post.get(function(error, p) {
      if (error) {
        res.status(400).send({'error':'Could not get post.'});
      } else {
        var post = new Post(p);
        post.id = p.id;

        post.favorite = false;

        if (typeof req.favs !== 'undefined'){
          for (var j = 0; j < req.favs.length; j++){
            if (req.favs[j].post_id == post.id){
              post.favorite = true;
              break;
            }
          }
        }

        req.post = post;

        next();
      }
    });
  };

  var increaseFavorite = (req, res, next) => {
    var post_id = req.post_id || req.params.post_id || req.body.post_id;

    if (typeof post_id !== 'undefined') {

      var post = new Post();
      post.id = post_id;

      post.get(function(error, p) {
        if (error) {
          res.status(400).send({'error':'Could not get post.'});
        } else {
          var post = new Post(p);
          post.id = p.id;

          if (req.body.decrease == "1" ) {
            post.decreaseFavoriteNumber(function(error, post){
            if (error) {
              res.status(400).send({'error':'Could not update post.'});
            } else {
              next();
            }
            });
          } else {
            post.updateFavoriteNumber(function(error, post){
              if (error) {
                res.status(400).send({'error':'Could not update post.'});
              } else {
                next();
              }
            });
          }
        }
      });
    } else{
      res.status(400).send({'error':'No post id.'});
    }
  };

  var getSubPosts = (req, res, next) => {
    var post_id = req.post.id || req.post_id;

    Sql.query('SELECT * FROM posts WHERE parent_id=?;', [post_id],
    function(error, results, fields) {
      if (error) {
        console.error(error);
        res.status(400).send({'error':error});
      } else {
        var posts = [];

        for (var i = 0; i < results.length; i++){
          var post = new Post(results[i]);
          post.id = results[i].id;

          posts.push(post);
        }

        req.sub_posts = posts;
        next();
      }
    });
  };

  var getAllSubPosts = (req, res, next) => {
    Sql.query('SELECT * FROM posts;', [],
    function(error, results, fields) {
      if (error) {
        console.error(error);
        res.status(400).send({'error':error});
      } else {
        var posts = [];

        for (var i = 0; i < results.length; i++){
          var post = new Post(results[i]);
          post.id = results[i].id;

          posts.push(post);
        }

        req.sub_posts = posts;
        next();
      }
    });
  };

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
          post.favorite = false;

          if (typeof req.favs !== 'undefined'){
            for (var j = 0; j < req.favs.length; j++){
              if (req.favs[j].post_id == post.id){
                post.favorite = true;
                post.number_of_favorite++;
                console.log(post.number_of_favorite);
                break;
              }
            }
          }

          posts.push(post);
        }

        req.posts = posts;
        next();
      }
    });
  };

  module.exports = {
    create,
    lockPost,
    getPost,
    getSubPosts,
    getThreads,
    getAllSubPosts,
    increaseFavorite
  }
