import { PagingRequestDTO } from '@request/common';
import { DEFAULT_PAGE_SIZE } from '@src/utils/constants';

type Ascending = 'DESC' | 'ASC';

class PagingDTO {
    pagingSize: number;
    pagingIndex: number;
    order: string[][] | undefined;
    constructor(
        pagingSize: number,
        pagingIndex: number,
        order: string[][] | undefined
    ) {
        this.pagingSize = pagingSize;
        this.pagingIndex = pagingIndex;
        this.order = order;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    public sqlQuery(defaultQuery: string): string {
        if (!this.order || this.order.length == 0) {
            return defaultQuery;
        }
        return this.order
            .map((it: any) => {
                if (it.fn) {
                    return `${it.fn}(${it.args})`;
                }
                return `${it[0]} ${it[1]}`;
            })
            .join(' ');
    }

    static createByJson(json: any): PagingDTO {
        const { pagingSize, pagingIndex, order } = json;
        return new PagingDTO(
            pagingSize || DEFAULT_PAGE_SIZE,
            pagingIndex || 1,
            order
        );
    }

    static create(pagingRequestDTO: PagingRequestDTO): PagingDTO {
        const { pagingSize, pagingIndex, sort } = pagingRequestDTO;
        return new PagingDTO(
            pagingSize,
            pagingIndex,
            sort ? this.parseSortToOrder(sort) : undefined
        );
    }

    private static parseSortToOrder(sort: string): [string, string][] {
        const order: [string, string][] = [];
        const [key, _ascending] = sort.split('_');
        let ascending: Ascending = 'ASC';
        switch (_ascending) {
            case 'desc':
            case 'dsc':
                ascending = 'DESC';
                break;
            case 'asc':
            default:
                ascending = 'ASC';
                break;
        }
        order.push([key, ascending]);
        return order;
    }
}

export { PagingDTO };
