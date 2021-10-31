const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = mongoose
    .connect(
        `${process.env.MONGO_URI}${process.env.NODE_ENV}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('Successfully connected to mongodb'))
    .catch((e) => console.error(e));
