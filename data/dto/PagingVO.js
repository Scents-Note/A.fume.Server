'use-strict';

class PagingVO {
    constructor({ pagingSize, pagingIndex, sort }) {
        this.pagingSize = pagingSize;
        this.pagingIndex = pagingIndex;
        this.order = parseSortToOrder(sort);
    }
}

function parseSortToOrder(sort) {
    let order = [];
    if (sort) {
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
    }
    return order;
}

module.exports = PagingVO;
