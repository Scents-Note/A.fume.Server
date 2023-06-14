import properties from '@properties';

const env = properties.NODE_ENV;
const config = require('@configs/config')[env];

import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
    database: config.database,
    username: config.username,
    password: config.password,
    host: config.host,
    dialect: 'mysql',
    models: [__dirname + '/tables'], // or [Player, Team],
});
