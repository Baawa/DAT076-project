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

var getFavoritesForUser = (req, res, next) => {
  Sql.query('SELECT * FROM favorites WHERE user_id=?;', [req.user_id],
  function(error, results, fields) {
    if (error) {
      console.error(error);
      res.status(400).send({'error':error});
    } else {
      var favs = [];

      for (var i = 0; i < results.length; i++){
        var fav = new Favorite(results[i]);

        favs.push(fav);
      }

      req.favorites = favs;
      next();
    }
  });
}

module.exports = {
  add,
  remove,
  getFavoritesForUser
}
