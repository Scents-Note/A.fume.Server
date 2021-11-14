import PagingRequestDto from '../request_dto/PagingRequestDTO';

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

    static create(pagingRequestDTO: PagingRequestDto) {
        const { pagingSize, pagingIndex, sort } = pagingRequestDTO;
        return new PagingDTO(
            pagingSize,
            pagingIndex,
            sort ? this.parseSortToOrder(sort) : undefined
        );
    }

    private static parseSortToOrder(sort: string): string[][] {
        const order = [];
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
