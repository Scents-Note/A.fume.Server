const { sequelize } = require('../../../models');

module.exports = () => {
    return Promise.all([
        sequelize.sync(),
        require('../../../utils/db/mongoose.js'),
    ]).then((it) => require('./seeds.js')());
};
