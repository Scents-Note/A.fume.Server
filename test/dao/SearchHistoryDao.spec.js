const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const searchHistoryDao = require('../../dao/SearchHistoryDao.js');
const { Perfume, User, SearchHistory } = require('../../models');

describe('# searchHistoryDao Test', () => {
    before(async () => {
        await require('./presets.js')();
    });
    before(async () => {
        await sequelize.sync();
        await Perfume.upsert({
            perfumeIdx: 1,
            brandIdx: 1,
            mainSeriesIdx: 1,
            name: '오토니엘 로사 오 드 뚜왈렛',
            englishName: 'OTHONIEL ROSA EAU DE TOILETTE',
            imageThumbnailUrl: '',
            releaseDate: '2020-12-30',
        });
        await User.upsert({
            userIdx: 1,
            nickname: '쿼카맨',
            password: 'dummy',
            gender: 1,
            phone: '010-2081-3818',
            email: 'heesung6701@naver.com',
            birth: '1995',
            grade: 1,
        });
        await SearchHistory.destroy({ where: { perfumeIdx: 1, userIdx: 1 } });
    });
    describe('# create Test', () => {
        it('# success case', (done) => {
            searchHistoryDao.create(1, 1).then((result) => {
                done();
            });
        });
    });
});
