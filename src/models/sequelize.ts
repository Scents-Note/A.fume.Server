import properties from '@properties';

import { Sequelize } from 'sequelize';

const env = properties.NODE_ENV;
const config = require('@configs/config')[env];

export const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);
