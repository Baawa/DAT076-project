  const Favorite = require('../model/favorite');
  const path = require('path');
  const jwt = require('jsonwebtoken');
  const config = require('../dbconfig');
  const Sql = require('../DATSQL/DATSql');

  var add = (req, res, next) => {
    var fav = new Favorite(req.body);

    fav.save(function(error, fav_id) {
      if (error) {
        res.status(400).send({'error':'Could not create fav.'});
      } else {
        req.fav_id = fav_id;
        next();
      }
    });
  };

  var remove = (req, res, next) => {
    var fav = new Favorite(req.body);

    fav.remove(function(error, fav_id) {
      if (error) {
        res.status(400).send({'error':'Could not delete fav.'});
      } else {
        next();
      }
    });
  };

  var toggle = (req, res, next) => {
    var post_id = req.body.post_id;

    if (typeof post_id != 'undefined' && typeof req.user != 'undefined') {
      var exists = false;
      var fav;

      if (typeof req.favs != 'undefined'){
        for (var j = 0; j < req.favs.length; j++){
          if (req.favs[j].post_id == post_id && req.favs[j].user_id == req.user.id){
            exists = true;
            fav = req.favs[j];
            break;
          }
        }
      }

      if (exists) {
        fav.remove(function(error, fav_id) {
          if (error) {
            res.status(400).send({'error':'Could not delete fav.'});
          } else {
            next();
          }
        });
      } else{
        fav = new Favorite();
        fav.post_id = parseInt(post_id);
        fav.user_id = req.user.id;
        fav.save(function(error, fav_id) {
          if (error) {
            res.status(400).send({'error':'Could not create fav.'});
          } else {
            req.fav_id = fav_id;
            next();
          }
        });
      }
    } else{
      res.status(400).send({'error':'Could not find post.'});
    }
  }

  var getFavoritesForUser = (req, res, next) => {
    Sql.query('SELECT * FROM favorites WHERE user_id=?;', [req.user.id],
    function(error, results, fields) {
      if (error) {
        console.error(error);
        res.status(400).send({'error':error});
      } else {
        var favs = [];

        for (var i = 0; i < results.length; i++){
          var fav = new Favorite(results[i]);
          fav.id = results[i].id;

          favs.push(fav);
        }

        req.favs = favs;
        next();
      }
    });
  }

  var getFavoritesForFoundUser = (req, res, next) => {
    Sql.query('SELECT * FROM favorites WHERE user_id=?;', [req.found_user.id],
    function(error, results, fields) {
      if (error) {
        console.error(error);
        res.status(400).send({'error':error});
      } else {
        var favs = [];

        for (var i = 0; i < results.length; i++){
          var fav = new Favorite(results[i]);
          fav.id = results[i].id;

          favs.push(fav);
        }

        req.favs = favs;
        next();
      }
    });
  }

  module.exports = {
    add,
    remove,
    toggle,
    getFavoritesForUser,
    getFavoritesForFoundUser
  }
