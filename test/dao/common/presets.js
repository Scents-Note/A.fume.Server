const { sequelize } = require('../../../models');

module.exports = async (context) => {
    context.timeout(100000);
    await Promise.all([
        sequelize.sync(),
        require('../../../utils/db/mongoose.js'),
    ]);
    await require('./seeds.js')();
    context.timeout();
};
