import properties from '../utils/properties';

module.exports = {
    development: {
        username: properties.MYSQL_DEV_USERNAME,
        password: properties.MYSQL_DEV_PASSWORD,
        database: properties.MYSQL_DEV_DATABASE,
        host: properties.MYSQL_DEV_HOST,
        port: properties.MYSQL_DEV_PORT,
        dialect: properties.MYSQL_DEV_DIALECT,
        timezone: '+09:00',
        logging: false,
    },
    test: {
        username: properties.MYSQL_TST_USERNAME,
        password: properties.MYSQL_TST_PASSWORD,
        database: properties.MYSQL_TST_DATABASE,
        host: properties.MYSQL_TST_HOST,
        port: properties.MYSQL_TST_PORT,
        dialect: properties.MYSQL_TST_DIALECT,
        timezone: '+09:00',
        logging: false,
    },
    production: {
        username: properties.MYSQL_PRD_USERNAME,
        password: properties.MYSQL_PRD_PASSWORD,
        database: properties.MYSQL_PRD_DATABASE,
        host: properties.MYSQL_PRD_HOST,
        port: properties.MYSQL_PRD_PORT,
        dialect: properties.MYSQL_PRD_DIALECT,
        timezone: '+09:00',
        logging: false,
    },
};
