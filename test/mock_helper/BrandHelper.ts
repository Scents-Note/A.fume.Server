import { expect } from 'chai';

import { BrandDTO } from '@dto/index';
const FIRST_INITIAL_REGEX = /^[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅍㅌㅎ]$/;

class BrandHelper {
    static validTest = function (this: BrandDTO) {
        expect(this.brandIdx).to.be.ok;
        expect(this.name).to.be.ok;
        expect(this.firstInitial).to.be.match(FIRST_INITIAL_REGEX);
        expect(this.imageUrl).to.be.ok;
        expect(this.description).to.be.not.undefined;
        expect(this.createdAt).to.be.ok;
        expect(this.updatedAt).to.be.ok;
    };
    static create(condition?: any) {
        return BrandDTO.createByJson(
            Object.assign(
                {
                    brandIdx: 1,
                    name: '브랜드1',
                    englishName: 'BRAND1',
                    firstInitial: 'ㅂ',
                    imageUrl: 'http://',
                    description: '이것은 브랜드',
                    createdAt: '2021-07-24T03:38:52.000Z',
                    updatedAt: '2021-07-24T03:38:52.000Z',
                },
                condition
            )
        );
    }

    static createWithIdx(brandIdx: number) {
        return BrandDTO.createByJson({
            brandIdx,
            name: '브랜드' + brandIdx,
            englishName: 'BRAND' + brandIdx,
            firstInitial: 'ㅂ',
            imageUrl: 'http://',
            description: '이것은 브랜드: ' + brandIdx,
            createdAt: '2021-07-24T03:38:52.000Z',
            updatedAt: '2021-07-24T03:38:52.000Z',
        });
    }
}

export default BrandHelper;
