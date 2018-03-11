'use strict';

// Import
const Sql = require('../DATSQL/DATSql');
const Pasteurize = require('pasteurize').Pasteurize;

// Definition
class Post {
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
        if (typeof blob.body.title !== 'undefined') {
          data = blob.body;
        }
      }
    }
    // Properties
    this.user_id = data.user_id;
    this.parent_id = data.parent_id || null;
    this.repost_id = data.repost_id || null;
    this.title = data.title || null;
    this.text = data.text || null;
    this.date = data.date || null;
    this.locked = data.locked || false;
    this.number_of_favorite = 0;
  }

  get(callback) {
    if (typeof this.id !== 'undefined') {
      // console.log('Id: ', this.id);
      Sql.query('SELECT * FROM posts WHERE id=?;', [this.id], function(error, results, fields) {
        if (error) {
          console.error(error);
          callback('Failed to find post.', null);
        } else if (results.length > 0) {
          // console.log('Found user.');
          var post = results[0];
          callback(null, post);
        } else {
          console.log('Could not find post.');
          callback('Could not find post.', null);
        }
      });
    } else {
      console.log('Missing id for post.');
      callback('Missing id for post.', null);
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

  updateFavoriteNumber(callback) {
    if (this.title.length > 0) {
      Sql.query('UPDATE posts SET number_of_favorite = number_of_favorite +1 WHERE id = ?', this.id, function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not update number of favorites.', null);
        } else {
          console.log('Did update post favorite number: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    } else {
      console.error('Cannot save user without post.');
      callback('Cannot save user without post.', null);
    }
  }

  update(callback){
    if (typeof this.id !== 'undefined'){
      Sql.query('UPDATE posts SET ? WHERE id = ?;', [this, this.id], function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not save post.', null);
        } else {
          console.log('Did save post: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    } else {
      console.error('Cannot save without post.');
      callback('Cannot save without post.', null);
    }
  }
}

module.exports = Post;
