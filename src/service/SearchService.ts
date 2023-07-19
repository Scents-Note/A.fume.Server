import { PerfumeResponse } from '@src/controllers/definitions/response';
import { ListAndCountDTO, PagingDTO, PerfumeSearchDTO } from '@src/data/dto';
import { requestPerfumeSearch } from '@utils/opensearch';

interface PerfumeSearchResultItem {
    perfumeIdx: number;
    name: string;
    Brand: {
        name: string;
    };
    imageUrl: string;
    isLiked: boolean;
    englishName: string;
}

export default class SearchService {
    async searchPerfume(
        searchDTO: PerfumeSearchDTO,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeResponse>> {
        const query = this.buildQuery(searchDTO, pagingDTO);

        const result = await requestPerfumeSearch<PerfumeSearchResultItem>({
            query,
            _source: ['perfumeIdx', 'name', 'Brand.name', 'imageUrl'],
            size: pagingDTO.limit,
            sort: [{ _doc: { order: 'asc' } }],
        });
        const {
            body: { hits },
        } = result;

        return new ListAndCountDTO(
            hits.total.value,
            hits.hits.map(this.transformBody)
        );
    }

    private transformBody(body: {
        _source: PerfumeSearchResultItem;
    }): PerfumeResponse {
        return {
            ...body._source,
            brandName: body._source.Brand.name,
        };
    }

    private buildQuery(searchDTO: PerfumeSearchDTO, pagingDTO: PagingDTO) {
        const filter = this.buildBoolFilter(searchDTO);
        const must = this.buildBoolMust(searchDTO, pagingDTO);
        const bool = {
            ...(filter && { filter }),
            ...(must && { must }),
        };

        return { bool };
    }

    private buildBoolFilter(searchDTO: PerfumeSearchDTO) {
        const filter = [];
        const { keywordIdxList, brandIdxList, ingredientCategoryList } =
            searchDTO;
        if (keywordIdxList && keywordIdxList.length > 0) {
            filter.push({
                terms: { KeywordIdxList: keywordIdxList },
            });
        }
        if (brandIdxList && brandIdxList.length > 0) {
            filter.push({
                terms: { 'Brand.brandIdx': brandIdxList },
            });
        }
        if (ingredientCategoryList && ingredientCategoryList.length > 0) {
            filter.push({
                terms: { 'Ingredients.ingredientIdx': ingredientCategoryList },
            });
        }
        if (filter.length > 0) {
            return filter;
        }
        return undefined;
    }

    private buildBoolMust(searchDTO: PerfumeSearchDTO, pagingDTO: PagingDTO) {
        const { searchText } = searchDTO;
        const { offset } = pagingDTO;
        const must = [];
        if (searchText) {
            must.push({
                multi_match: {
                    query: searchText,
                    fields: [
                        'name',
                        'englishName',
                        'Brand.name',
                        'Brand.englishName',
                    ],
                },
            });
        }
        if (offset) {
            must.push({ range: { perfumeIdx: { gte: offset } } });
        }
        if (must.length > 0) {
            return must;
        }
        return undefined;
    }
}
