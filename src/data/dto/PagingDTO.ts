import { PagingRequestDTO } from '@src/controllers/definitions/request/common';
import { DEFAULT_PAGE_SIZE } from '@src/utils/constants';

type Ascending = 'DESC' | 'ASC';

class PagingDTO {
    offset: number;
    limit: number;
    order: string[][] | undefined;
    constructor(offset: number, limit: number, order: string[][] | undefined) {
        this.offset = offset;
        this.limit = limit;
        this.order = order;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    public sqlOrderQuery(defaultQuery: string): string {
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

    public sequelizeOption(): any {
        return {
            offset: this.offset,
            limit: this.limit,
            order: this.order,
        };
    }
    static createByJson({
        offset,
        limit,
        order,
    }: {
        offset?: number;
        limit?: number;
        order?: string[][];
    }): PagingDTO {
        return new PagingDTO(offset || 0, limit || DEFAULT_PAGE_SIZE, order);
    }

    static create(pagingRequestDTO: PagingRequestDTO): PagingDTO {
        const { requestSize, lastPosition, sort } = pagingRequestDTO;
        return new PagingDTO(
            lastPosition + 1,
            requestSize,
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
