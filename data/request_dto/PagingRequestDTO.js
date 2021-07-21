'use strict';

class PagingRequestDTO {
    constructor({ pagingSize, pagingIndex, sort }) {
        this.pagingSize = parseInt(pagingSize) || 10;
        this.pagingIndex = parseInt(pagingIndex) || 1;
        this.sort = sort || 'createdAt_desc';
    }
}

module.exports = PagingRequestDTO;
