module.exports = {
  app:{
    accessKey           : process.env.APP_SECRET || 'abc123'
  },
  db: {
    database            : process.env.RDS_DB_NAME  || 'dat076_db',
    host                : process.env.RDS_HOSTNAME || 'localhost',
    port                : process.env.RDS_PORT     || 3306,
    user                : process.env.RDS_USERNAME || 'root',
    password            : process.env.RDS_PASSWORD || 'root',
    multipleStatements  : true
  }
};
