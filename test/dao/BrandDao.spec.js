const dotenv = require('dotenv');
dotenv.config({path: './config/.env.test'});

const chai = require('chai');
const { expect } = chai;
const brandDao = require('../../dao/BrandDao.js');
const { Brand } = require('../../models');

describe('# brandDao Test', () => {
    before(async () => {
        const sequelize = require('../../models').sequelize
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({force: true});
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        await Brand.create({brandIdx: 1, name: '조 말론 런던', startCharacter: 'ㅈ', englishName: 'Jo Malone', imageUrl: '', description:'런던 브랜드'});
        await Brand.create({brandIdx: 2, name: '르 라보', startCharacter: 'ㄹ', englishName: 'Le Labo', imageUrl: '', description: `2006년 뉴욕에서 탄생한 핸드 메이드 퍼퓸 하우르 르 라보를 소개합니다.
        르 라보는 향수를 만드는 실험실을 테마로 하며, 핸드메이드 퍼퓸과 홈 컬렉션, 바디 컬렉션을 선보입니다.
        르 라보의 퍼퓸 컬렉션은 재능 있고 독창적인 조향사들과의 작업으로 만들어집니다.
        
        르 라보는 뉴욕에서 탄생한 핸드메이드 퍼퓸 브랜드입니다.
        르 라보는 오늘날 럭셔리 향수 시장의 틀을 깬 혁신적인 경험을 선사합니다.
        모든 향수는 신선하게 핸드 블렌딩 되며, 고객의 이름이나 원하는 문구를 넣은 맞춤 라벨링 서비스가 제공됩니다.
        
        르 라보는 향수를 만들어 내거나 새로운 매장을 여는 모든 과정 하나 하나에 심혈을 기울입니다.
        르 라보의 가장 중요한 미션은 우리의 작품과 그 아름다움을 세상에 공유하는 것입니다. 이것은 단순히 제품을 판매하는 차원이 아니라, 르 라보에서 감각적인 경험과 추억, 새로운 관점을 제공하는 것입니다.
        이것은 하나의 새로운 라이프 스타일입니다.`});
    });
    describe('# create Test', () => {
        before(async () => {
            await Brand.destroy({where: { name: '삽입테스트' }});
        });
        it('# success case', (done) => {
            brandDao.create({name: '삽입테스트', englishName: 'insert Test', startCharacter: 'ㅅ', imageUrl: '', description: 'brand 생성 테스트를 위한 더미데이터입니다.'})
            .then((result) => {
                expect(result).gt(0);
                done();
            }).catch(() => {
                expect(false).true();
                done();
            });
        });
        it('# DuplicatedEntryError case', (done) => {
            brandDao.create({name: '삽입테스트', englishName: 'insert Test', startCharacter: 'ㅅ', imageUrl: '', description: ''})
            .then(() => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err.parent.errno).eq(1062);
                expect(err.parent.code).eq('ER_DUP_ENTRY');
                done();
            });
        });
    });
    
    describe('# read Test', () => {
        it('# success case', (done) => {
            brandDao.read(2).then((result) => {
                expect(result.name).eq('르 라보');
                expect(result.startCharacter).eq('ㄹ');
                expect(result.description.length).gt(0);
                done();
            }).catch(err => {
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAll Test', () => {
        it('# success case', (done) => {
            brandDao.readAll(1, 10, [['createdAt', 'desc']]).then((result) => {
                expect(result.length).gt(0);
                done();
            });
        });
    });

    describe('# update Test', () => {
        let brandIdx;
        let origin = {
            name: '수정테스트',
            englishName: 'modify test',
            startCharacter: 'ㅅ',
            imageUrl: '', 
            description: ''
        }

        before(async () => {
            let { dataValues } = await Brand.create(origin);
            brandIdx = dataValues.brandIdx;
        });
        it('# success case', (done) => {
            brandDao.update({brandIdx, name:'변경된 이름', englishName:'modified_name', startCharacter:'ㅂ', imageUrl: 'image_url', description: '변경완료'})
            .then(async (result) => {
                expect(result).eq(1);
                const updated = await brandDao.read(brandIdx);
                expect(updated.name).eq('변경된 이름');
                expect(updated.englishName).eq('modified_name');
                expect(updated.startCharacter).eq('ㅂ');
                expect(updated.imageUrl).eq('image_url');
                expect(updated.description).eq('변경완료');
                done();
            });
        });
        after(async () => {
            await Brand.destroy({ where: { brandIdx}});
        });
    });
    
    describe('# delete Test', () => {
        let brandIdx;
        before(async () => {
            const { dataValues } = await Brand.create({name: '삭제테스트', englishName: 'delete test', startCharacter: 'ㅅ', imageUrl: '', description: ''});
            brandIdx = dataValues.brandIdx;
        });
        it('# success case', (done) => {
            brandDao.delete(brandIdx)
            .then((result) => {
                expect(result).eq(1);
                done();
            })
        });
        after(async () => {
            if(!brandIdx) return;
            await Brand.destroy({where: { brandIdx }});
        });
    });
})
