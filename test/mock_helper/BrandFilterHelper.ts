import { expect } from 'chai';
import BrandFilterDTO from '../../src/data/dto/BrandFilterDTO';
import BrandHelper from './BrandHelper';

const FIRST_INITIAL_REGEX = /^[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅍㅌㅎ]$/;

class BrandFilterHelper {
    static validTest(this: BrandFilterDTO) {
        expect(this.firstInitial).to.be.match(FIRST_INITIAL_REGEX);
        expect(this.brands).to.be.ok;
        for (const brand of this.brands) {
            BrandHelper.validTest.call(brand);
        }
    }
}
export default BrandFilterHelper;
