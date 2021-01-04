const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
    process.env.MYSQL_USER,
    process.env.MYSQL_PWD,
    {
        host: process.env.MYSQL_HOST_URL,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        logging: process.env.SEQUELIZE_LOGGING == 'true'
    }
);

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {}; 

db.User = require('./user')(sequelize, Sequelize);
db.Brand = require('./brand')(sequelize, Sequelize);
db.Series = require('./series')(sequelize, Sequelize);
db.Perfume = require('./perfume')(sequelize, Sequelize); 
db.PerfumeDetail = require('./perfumeDetail')(sequelize, Sequelize); 

for(const key in db) {
    const value = db[key];
    if(!value.associate) continue;
    value.associate(db);
}

db.sequelize = sequelize; 
db.Sequelize = Sequelize; 

module.exports = db;
