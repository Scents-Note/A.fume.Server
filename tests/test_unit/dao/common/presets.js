import properties from '@properties';
const { sequelize } = require('@sequelize');

if (properties.NODE_ENV != 'test') {
    throw new Error('Only allow TEST ENV');
}

let firstTime = true;
let ready = false;

const LONG_TIME = 60000;
const VERY_LONG_TIME = 120000;

async function initialDatabase(context) {
    console.log(`presets start`);
    firstTime = false;
    const start = new Date().getSeconds();
    context.timeout(LONG_TIME);
    await Promise.all([
        sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function () {
                return sequelize.sync({ force: true });
            })
            .then(function () {
                return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            }),
        require('@src/utils/db/mongoose.js'),
    ]);
    await require('./seeds.js')();
    await sequelize.query(
        'CREATE FULLTEXT INDEX ft_idx_perfume_name ON perfumes(`name`, `english_name`)'
    );
    await sequelize.query(
        'CREATE FULLTEXT INDEX ft_idx_brand_name ON brands(`name`, `english_name`)'
    );
    context.timeout();
    const end = new Date().getSeconds();
    console.log(`presets done / time : ${end - start}s`);
    ready = true;
}

const resolveCapture = (context, resolve, limitTimeout) => {
    context.timeout(LONG_TIME);
    return () => {
        clearTimeout(limitTimeout);
        resolve();
        context.timeout();
    };
};
const queue = [];

module.exports = async (context) => {
    if (properties.NODE_ENV != 'test') {
        throw new Error('Only allow TEST ENV');
    }

    if (firstTime) {
        await initialDatabase(context);
        for (const resolveCapture of queue) {
            resolveCapture();
        }
        return true;
    }
    if (!ready) {
        return new Promise((resolve, reject) => {
            const limitTimeout = setTimeout(() => {
                reject(
                    new Error(
                        `More than ${VERY_LONG_TIME} seconds have passed in the queue.`
                    )
                );
            }, VERY_LONG_TIME);
            queue.push(resolveCapture(context, resolve, limitTimeout));
        });
    }
    return true;
};
