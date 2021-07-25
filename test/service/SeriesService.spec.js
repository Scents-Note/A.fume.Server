const chai = require('chai');
const { expect } = chai;

const {
    SeriesDTO,
    IngredientDTO,
    ListAndCountDTO,
    CreatedResultDTO,
} = require('../../data/dto');

const { SeriesFilterVO } = require('../../data/vo');

SeriesDTO.prototype.validTest = function () {
    expect(this.seriesIdx).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

ListAndCountDTO.prototype.validTest = function () {
    expect(this.count).to.be.ok;
    expect(this.rows.length).to.be.ok;
    for (const series of this.rows) {
        expect(series).instanceOf(SeriesDTO);
        series.validTest();
    }
};

CreatedResultDTO.prototype.validTest = function () {
    expect(this.idx).to.be.ok;
    expect(this.created).instanceOf(SeriesDTO);
    this.created.validTest();
};

SeriesFilterVO.prototype.validTest = function () {
    expect(this.seriesIdx).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
    for (const ingredient of this.ingredients) {
        expect(ingredient).instanceOf(IngredientDTO);
        ingredient.validTest();
    }
};

IngredientDTO.prototype.validTest = function () {
    expect(this.ingredientIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.seriesIdx).to.be.ok;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

const mockSeriesDTO = new SeriesDTO({
    seriesIdx: 1,
    name: '계열1',
    englishName: 'SERIES1',
    imageUrl: 'http://',
    description: '이것은 계열',
    createdAt: '2021-07-24T03:38:52.000Z',
    updatedAt: '2021-07-24T03:38:52.000Z',
});

const mockSeriesGenerator = (seriesIdx) =>
    new SeriesDTO({
        seriesIdx: seriesIdx,
        name: '계열' + seriesIdx,
        englishName: 'SERIES' + seriesIdx,
        imageUrl: 'http://',
        description: '이것은 계열',
        createdAt: '2021-07-24T03:38:52.000Z',
        updatedAt: '2021-07-24T03:38:52.000Z',
    });

const mockListAndCountDTO = new ListAndCountDTO({
    count: 1,
    rows: [
        mockSeriesGenerator(1),
        mockSeriesGenerator(2),
        mockSeriesGenerator(3),
    ],
});

const mockIngredient = (ingredientIdx, seriesIdx) =>
    new IngredientDTO({
        ingredientIdx: ingredientIdx,
        name: '재료' + ingredientIdx,
        englishName: 'Ingredient ' + ingredientIdx,
        seriesIdx: seriesIdx,
        imageUrl: 'http://',
        description: '이것은 재료',
        createdAt: '2021-07-24T03:38:52.000Z',
        updatedAt: '2021-07-24T03:38:52.000Z',
    });

const seriesService = require('../../service/SeriesService');
seriesService.setSeriesDao({
    create: async (seriesInputDTO) =>
        new CreatedResultDTO({
            idx: 1,
            created: mockSeriesDTO,
        }),
    readByIdx: async (seriesIdx) => mockSeriesDTO,
    readAll: async () => mockListAndCountDTO,
    search: async () => mockListAndCountDTO,
    update: async () => 1,
    delete: async () => 1,
    findSeries: async () => mockSeriesDTO,
});

const mockIngredientDAO = {};
seriesService.setIngredientDao(mockIngredientDAO);

const mockNoteDAO = {};
seriesService.setNoteDao(mockNoteDAO);

describe('# Brand Service Test', () => {
    describe('# postSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .postSeries(mockSeriesDTO)
                .then((createdResultDTO) => {
                    createdResultDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesByIdx Test', () => {
        it('# success Test', (done) => {
            seriesService
                .getSeriesByIdx(1)
                .then((seriesDTO) => {
                    seriesDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesAll Test', () => {
        it('# success Test', (done) => {
            seriesService
                .getSeriesAll({})
                .then((listAndCountDTO) => {
                    listAndCountDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# searchSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .searchSeries({})
                .then((listAndCountDTO) => {
                    listAndCountDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# putSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .putSeries(mockSeriesDTO)
                .then((affectedRow) => {
                    expect(affectedRow).to.be.eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# deleteSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .deleteSeries(1)
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getIngredientList Test', () => {
        it('# success Test', (done) => {
            mockIngredientDAO.readAll = async () =>
                new ListAndCountDTO({
                    count: 1,
                    rows: [...new Array(5)].map((it, index) =>
                        mockIngredient(index + 1, 1)
                    ),
                });
            seriesService
                .getIngredientList(1)
                .then((result) => {
                    expect(result.count).to.be.eq(1);
                    for (const ingredientDTO of result.rows) {
                        ingredientDTO.validTest();
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterSeries Test', () => {
        it('# success Test', (done) => {
            const isFiltered = (ingredientIdx) => ingredientIdx % 2 == 1;
            mockIngredientDAO.readBySeriesIdxList = async (seriesIdxList) => {
                const ret = [];
                for (let i = 1; i <= 5; i++) ret.push(mockIngredient(i, 1));
                for (let i = 6; i <= 7; i++) ret.push(mockIngredient(i, 2));
                for (let i = 8; i <= 10; i++) ret.push(mockIngredient(i, 3));
                return ret;
            };
            const mockNote = (ingredientIdx, count) => ({
                ingredientIdx,
                count,
            });
            mockNoteDAO.countIngredientUsed = async (ingredientIdxList) =>
                [...new Array(10)].map((it, index) =>
                    mockNote(index + 1, isFiltered(index + 1) ? 100 : 4)
                );

            seriesService
                .getFilterSeries({})
                .then((result) => {
                    result.validTest();
                    expect(result.rows.length).to.be.eq(3);
                    for (const seriesFilterVO of result.rows) {
                        for (const ingredientDTO of seriesFilterVO.ingredients) {
                            expect(
                                isFiltered(ingredientDTO.ingredientIdx)
                            ).to.be.eq(true);
                        }
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# findSeriesByEnglishName Test', () => {
        it('# success Test', (done) => {
            seriesService
                .findSeriesByEnglishName('')
                .then((seriesDTO) => {
                    seriesDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
