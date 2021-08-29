const { sequelize } = require('../../../models');

if (process.env.NODE_ENV != 'test') {
    throw new Error('Only allow TEST ENV');
}

module.exports = async (context) => {
    context.timeout(100000);
    await Promise.all([
        sequelize.sync(),
        require('../../../utils/db/mongoose.js'),
    ]);
    await require('./seeds.js')();
    context.timeout();
};
