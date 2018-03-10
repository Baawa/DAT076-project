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
    password            : process.env.RDS_PASSWORD || 'djshaotime',
=======
    password            : process.env.RDS_PASSWORD || 'mysql',
>>>>>>> f3f6d445bf7c1dd42bd95a972d336f53a04eba96
    multipleStatements  : true
  }
};
