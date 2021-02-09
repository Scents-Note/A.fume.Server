const { sequelize } = require('../../models');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = () => {
    return Promise.all([
        sequelize.sync(),
        mongoose
            .connect(
                `${process.env.MONGO_URI}${process.env.NODE_ENV}?retryWrites=true&w=majority`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                }
            )
            .then(() => console.log('Successfully connected to mongodb'))
            .catch((e) => console.error(e)),
    ]).then((it) => require('./seeds.js')());
};
