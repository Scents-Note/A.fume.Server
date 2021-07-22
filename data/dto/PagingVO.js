'use-strict';

class PagingVO {
    constructor({ pagingSize, pagingIndex, sort, order }) {
        this.pagingSize = pagingSize;
        this.pagingIndex = pagingIndex;
        this.order = parseSortToOrder(sort) || order;
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

module.exports = PagingVO;
