'use strict';

class ListAndCountResponseDTO {
    constructor({ message, count, rows }) {
        this.message = message;
        this.data = {
            count,
            rows,
        };
    }
}

module.exports = ListAndCountResponseDTO;
