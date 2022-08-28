import properties from '@properties';
const { sequelize } = require('@sequelize');

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
    await sequelize.query(
        'CREATE FULLTEXT INDEX ft_idx_perfume_name_one ON perfumes(`name`)'
    );
    await sequelize.query(
        'CREATE FULLTEXT INDEX ft_idx_brand_name_one ON brands(`name`)'
    );
    await sequelize.query(
        'CREATE FULLTEXT INDEX ft_idx_perfume_name ON perfumes(`name`, `english_name`)'
    );
    await sequelize.query(
        'CREATE FULLTEXT INDEX ft_idx_brand_name ON brands(`name`, `english_name`)'
    );

    context.timeout();
};
