import KeywordDao from '@dao/KeywordDao';
import { PerfumeThumbDTO, PerfumeThumbKeywordDTO } from '@src/data/dto';
import { Keyword } from '@src/models';
import { LikePerfumeService } from './LikePerfumeService';
import { NotMatchedError } from '@src/utils/errors/errors';
import fp from 'lodash/fp';
import { commonJob } from './PerfumeService';
import _ from 'lodash';

const keywordDao = new KeywordDao();

class KeywordService {
    likePerfumeService: LikePerfumeService;
    constructor(likePerfumeService?: LikePerfumeService) {
        this.likePerfumeService =
            likePerfumeService ?? new LikePerfumeService();
    }
    /**
     * 키워드 전체 조회
     *
     * @returns {Promise<Keyword[]>}
     **/
    async getKeywordAll(pagingIndex: number, pagingSize: number) {
        const result = await keywordDao.readAll(pagingIndex, pagingSize);
        return {
            ...result,
            rows: result.rows.map(this.transform),
        };
    }

    /**
     * 특정 향수의 키워드 목록 조회
     *
     * @param {number} perfumeIdx
     * @returns {Promise<keyword[]>}
     */
    async getKeywordOfPerfume(perfumeIdx: number) {
        const keywords = await keywordDao.readAllOfPerfume(perfumeIdx);
        return keywords.map(this.transform);
    }

    private transform(it: Keyword) {
        return {
            ...it,
            id: undefined,
            keywordIdx: it.id,
        };
    }

    async getPerfumeThumbKeywordConverter(
        perfumeIdxList: number[],
        userIdx: number = -1
    ): Promise<(item: PerfumeThumbDTO) => PerfumeThumbKeywordDTO> {
        let likePerfumeList: any[] = [];
        if (userIdx > -1) {
            likePerfumeList = await this.likePerfumeService.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
        }

        const joinKeywordList: any[] = await keywordDao
            .readAllOfPerfumeIdxList(perfumeIdxList)
            .catch((err: Error) => {
                if (err instanceof NotMatchedError) {
                    return [];
                }
                throw err;
            });

        return (item: PerfumeThumbDTO): PerfumeThumbKeywordDTO => {
            return fp.compose(
                ...commonJob,
                this.likePerfumeService.isLikeJob(likePerfumeList),
                this.addKeyword(joinKeywordList),
                PerfumeThumbKeywordDTO.createByJson
            )(item);
        };
    }

    private addKeyword(joinKeywordList: any[]): (obj: any) => any {
        const keywordMap: { [key: number]: string[] } = _.chain(joinKeywordList)
            .groupBy('perfumeIdx')
            .mapValues((arr) => arr.map((it) => it.Keyword.name))
            .value();

        return (obj: any) => {
            const ret: any = Object.assign({}, obj);
            ret.keywordList = keywordMap[obj.perfumeIdx] || [];
            return ret;
        };
    }
}

export default KeywordService;
