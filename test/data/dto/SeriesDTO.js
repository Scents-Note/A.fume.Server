const { expect } = require('chai');

const SeriesDTO = require('../../../src/data/dto/SeriesDTO');

SeriesDTO.validTest = function () {
    expect(this.seriesIdx).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

SeriesDTO.create = function (condition) {
    return new SeriesDTO(
        Object.assign(
            {
                seriesIdx: 1,
                name: '계열1',
                englishName: 'SERIES1',
                imageUrl: 'http://',
                description: '이것은 계열',
                createdAt: '2021-07-24T03:38:52.000Z',
                updatedAt: '2021-07-24T03:38:52.000Z',
            },
            condition
        )
    );
};

SeriesDTO.createWithIdx = function (seriesIdx) {
    return new SeriesDTO({
        seriesIdx,
        name: `계열 ${seriesIdx}`,
        englishName: `SERIES ${seriesIdx}`,
        imageUrl: 'http://',
        description: '이것은 계열',
        createdAt: '2021-07-24T03:38:52.000Z',
        updatedAt: '2021-07-24T03:38:52.000Z',
    });
};

module.exports = SeriesDTO;
