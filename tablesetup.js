// Import
const Table = require('./DATSQL/DATSqlTable');
const Column = require('./DATSQL/DATSqlColumn');
const Sql = require('./DATSQL/DATSql');
const config = require('./dbconfig');

// Sql setup
const createTables = (req, res, next) => {
  console.log('Will create tables...');
  var table = new Table('users');
  table.beginTransaction();

  // Users table
  table.addColumn(new Column('id', Column.Type.ID, null));
  table.addColumn(new Column('name', null, Column.Property.UNIQUE));
  table.addColumn(new Column('password', Column.Type.VARCHAR_511, Column.Property.NOT_NULL));
  table.addColumn(new Column('banned', Column.Type.BOOL, Column.Property.NOT_NULL));
  table.addColumn(new Column('admin', Column.Type.BOOL, Column.Property.NOT_NULL));
  table.addColumn(new Column('image', null, null));
  table.save(null);

  table.setTableName('posts');
  table.addColumn(new Column('id', Column.Type.ID, null));
  table.addColumn(new Column('user_id', Column.Type.INT, Column.Property.NOT_NULL));
  table.addColumn(new Column('parent_id', Column.Type.INT, null));
  table.addColumn(new Column('repost_id', Column.Type.INT, null));
  table.addColumn(new Column('title', null, null));
  table.addColumn(new Column('text', null, null));
  table.addColumn(new Column('date', null, null));
  table.addColumn(new Column('locked', Column.Type.BOOL, Column.Property.NOT_NULL));
  table.addColumn(new Column('number_of_favorite', Column.Type.INT, null));
  table.save(null);

  table.setTableName('favorites');
  table.addColumn(new Column('id', Column.Type.ID, null));
  table.addColumn(new Column('user_id', Column.Type.INT, Column.Property.NOT_NULL));
  table.addColumn(new Column('post_id', Column.Type.INT, Column.Property.NOT_NULL));
  table.save(null);

  // Commit transaction
  table.commit(function (error, result) {
    if (error) {
      res.status(500).send({'error':error});
    } else {
      // res.send({'result':true});
      next();
    }
  });
};

const deleteTables = (req, res, next) => {
  console.log('Will delete tables...');
  var table = new Table('users');
  table.beginTransaction();
  table.drop();
  table.setTableName('posts');
  table.drop();
  table.setTableName('favorites');
  table.drop();

  table.commit(function (error, result) {
    if (error) {
      res.status(500).send({'error':error});
    } else {
      // res.send({'result':true});
      next();
    }
  });
};

module.exports = {
  createTables,
  deleteTables
};
