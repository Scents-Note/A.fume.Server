import PagingRequestDto from '../request_dto/PagingRequestDTO';

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
            this.parseSortToOrder(sort)
        );
    }

    private static parseSortToOrder(sort: string): string[][] | undefined {
        if (!sort) return undefined;
        const order = [];
        let [key, ascending] = sort.split('_');
        ascending = ascending || 'desc';
        switch (ascending) {
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
