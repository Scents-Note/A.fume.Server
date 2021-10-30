'use strict';

class PagingDTO {
    constructor({ pagingSize, pagingIndex, order }) {
        this.pagingSize = pagingSize;
        this.pagingIndex = pagingIndex;
        this.order = order;
    }

    static create(pagingRequestDTO) {
        const { pagingSize, pagingIndex, sort } = pagingRequestDTO;
        return new PagingDTO({
            pagingSize,
            pagingIndex,
            order: parseSortToOrder(sort),
        });
    }
}

function parseSortToOrder(sort) {
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

module.exports = PagingDTO;
