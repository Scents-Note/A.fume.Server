import {
    Brand,
    Ingredient,
    JoinPerfumeKeyword,
    Note,
    Perfume,
} from '@src/models';
import { client, opensearch_index_name } from '@utils/opensearch';

export class PerfumeSearchRefreshService {
    private transformToDoc(perfume: Perfume) {
        perfume = perfume.toJSON();
        return {
            perfumeIdx: perfume.perfumeIdx,
            name: perfume.name,
            englishName: perfume.englishName,
            imageUrl: perfume.imageUrl,
            createdAt: perfume.createdAt,
            updatedAt: perfume.updatedAt,
            Brand: {
                brandIdx: perfume.Brand.brandIdx,
                name: perfume.Brand.name,
                englishName: perfume.Brand.englishName,
            },
            Ingredients: perfume.Notes.map((v) => {
                return {
                    ingredientIdx: v.ingredientIdx,
                    categoryIdx: v.Ingredients.categoryIdx,
                };
            }),
            KeywordIdxList: perfume.JoinPerfumeKeywords.map(
                (i) => i.keywordIdx
            ),
        };
    }

    async migratePerfumes() {
        const perfumes = await Perfume.findAll({
            where: {
                deleted_at: null,
            },
            include: [
                {
                    model: Brand,
                    as: 'Brand',
                },
                {
                    model: JoinPerfumeKeyword,
                    as: 'JoinPerfumeKeywords',
                },
                {
                    model: Note,
                    as: 'Notes',
                    include: [
                        {
                            model: Ingredient,
                            as: 'Ingredients',
                        },
                    ],
                },
            ],
            // raw: true,
            nest: true,
        });
        const docs = perfumes
            .map((i) => {
                return [
                    {
                        index: {
                            _index: opensearch_index_name,
                            _id: i.perfumeIdx,
                        },
                    },
                    this.transformToDoc(i),
                ];
            })
            .flat();
        // 기존 문서를 모두 삭제하고, 새로 추가함.
        // FIXME: 변경분만 확인후 추가하는 방식으로 개선 필요.
        await client.deleteByQuery({
            index: opensearch_index_name,
            body: { query: { match_all: {} } },
        });
        await client.bulk({ body: docs, refresh: true });
    }
}
