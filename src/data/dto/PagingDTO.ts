import { PagingRequestDTO } from '../request/common';

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

export default PagingDTO;
