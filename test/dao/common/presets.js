import properties from '../../../src/utils/properties';
const { sequelize } = require('../../../src/models');

if (properties.NODE_ENV != 'test') {
    throw new Error('Only allow TEST ENV');
}

module.exports = async (context) => {
    context.timeout(100000);
    if (properties.NODE_ENV != 'test') {
        throw new Error('Only allow TEST ENV');
    }
    await Promise.all([
        sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function () {
                return sequelize.sync({ force: true });
            })
            .then(function () {
                return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            }),
        require('../../../src/utils/db/mongoose.js'),
    ]);
    await require('./seeds.js')();
    context.timeout();
};
