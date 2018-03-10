module.exports = {
  app:{
    accessKey           : 'oZCq3CqRuK24Bt2txchdOuRHyw36eJ6hf1G1QENi'
  },
  db: {
    database            : process.env.RDS_DB_NAME  || 'Random',
    host                : process.env.RDS_HOSTNAME || 'localhost',
    port                : process.env.RDS_PORT     || 3306,
    user                : process.env.RDS_USERNAME || 'root',
<<<<<<< HEAD
    password            : process.env.RDS_PASSWORD || 'mysql',
=======
    password            : process.env.RDS_PASSWORD || 'djshaotime',
>>>>>>> origin/master
    multipleStatements  : true
  }
};
