import properties from '../properties';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = mongoose
    .connect(
        `${properties.MONGO_URI}${properties.NODE_ENV}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('Successfully connected to mongodb'))
    .catch((e) => console.error(e));
