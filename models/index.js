const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DB_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PWD,
    {
        host: process.env.MYSQL_HOST_URL,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql'
    }
);

const db = {}; 
db.sequelize = sequelize; 
db.Sequelize = Sequelize; 
db.User = require('./user')(sequelize, Sequelize); 
db.Brand = require('./brand')(sequelize, Sequelize); 

module.exports = db;
