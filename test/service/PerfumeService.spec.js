const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const Perfume = require('../../service/PerfumeService.js');
const PerfumeIntegralDTO = require('../data/dto/PerfumeIntegralDTO');
const PerfumeThumbDTO = require('../data/dto/PerfumeThumbDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const {
    PagingRequestDTO,
    PerfumeSearchRequestDTO,
} = require('../../data/request_dto');

const mockS3FileDao = {};
Perfume.setS3FileDao(mockS3FileDao);

describe('# Perfume Service Test', () => {
    before(async function () {
        await require('../dao/common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# read detail Test', (done) => {
            mockS3FileDao.getS3ImageList = async () => {
                return ['imageUrl1', 'imageUrl2'];
            };
            Perfume.getPerfumeById(1, 1)
                .then((it) => {
                    PerfumeIntegralDTO.validTest.call(it);
                    expect(it.imageUrls).to.be.deep.eq([
                        'imageUrl1',
                        'imageUrl2',
                    ]);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# isLike Test', (done) => {
            const perfumeSearchRequestDTO = new PerfumeSearchRequestDTO({
                keywordList: [],
                brandList: [],
                ingredientList: [],
                searchText: '',
                userIdx: 1,
            });
            const pagingRequestDTO = new PagingRequestDTO({
                pagingSize: 100,
                pagingIndex: 1,
                order: null,
            });
            Perfume.searchPerfume({ perfumeSearchRequestDTO, pagingRequestDTO })
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbDTO.validTest
                    );
                    expect(
                        result.rows.filter((it) => it.isLiked == true).length
                    ).to.eq(5);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
