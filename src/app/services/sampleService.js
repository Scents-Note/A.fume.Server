const defaultSampleDao = require('../dao/sampleDao');

module.exports = (dependencies) => {
    const {sampleDao} = Object.assign({sampleDao: defaultSampleDao}, dependencies);
    return {
        method1: () => {
            sampleDao.getAll();
        },
        method2: () => {
            sampleDao.getById();
            sampleDao.insert();
        }
    };
}