'use strict';

// Import
const Sql = require('./DATSQL/DATSql');
const Pasteurize = require('pasteurize').Pasteurize;

// Definition
class Favorite {
  constructor(blob) {
    var data = blob || {};
    if (typeof blob !== 'undefined') {
      // Default user
      if (typeof blob.post !== 'undefined') {
        if (typeof blob.post.id !== 'undefined') {
          this.id = blob.post.id;
        }
      }
      // Body
      if (typeof blob.body !== 'undefined') {
        if (typeof blob.body.user_id !== 'undefined') {
          data = blob.body;
        }
      }
    }
    // Properties
    this.user_id = data.user_id;
    this.post_id = data.post_id;
  }

  get(callback) {
    if (typeof this.id !== 'undefined') {
      // console.log('Id: ', this.id);
      Sql.query('SELECT * FROM favorites WHERE id=?;', [this.id], function(error, results, fields) {
        if (error) {
          console.error(error);
          callback('Failed to find fav.', null);
        } else if (results.length > 0) {
          // console.log('Found user.');
          var fav = results[0];
          callback(null, fav);
        } else {
          console.log('Could not find fav.');
          callback('Could not find fav.', null);
        }
      });
    } else {
      console.log('Missing id for fav.');
      callback('Missing id for fav.', null);
    }
  }

  save(callback) {
    if (this.title.length > 0) {
      Sql.query('INSERT INTO posts SET ?;', this, function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not save post.', null);
        } else {
          console.log('Did save post: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    } else {
      console.error('Cannot save user without post.');
      callback('Cannot save user without post.', null);
    }
  }

  remove(callback) {
    if (typeof this.id !== 'undefined') {
      // console.log('Id: ', this.id);
      Sql.query('DELETE FROM favorites WHERE id=?;', [this.id], function(error, results, fields) {
        if (error) {
          console.error(error);
          callback('Failed to find fav.', false);
        } else {
          callback(null, true);
        }
      });
    } else {
      console.log('Missing id for fav.');
      callback('Missing id for fav.', false);
    }
  }
}

module.exports = Favorite;
