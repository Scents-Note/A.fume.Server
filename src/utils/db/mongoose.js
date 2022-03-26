import mongoose from 'mongoose';

import properties from '@properties';

import { logger } from '@modules/winston';

mongoose.Promise = global.Promise;

module.exports = mongoose
    .connect(
        `${properties.MONGO_URI}${properties.NODE_ENV}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => logger.info('Successfully connected to mongodb'))
    .catch((e) => console.error(e));
