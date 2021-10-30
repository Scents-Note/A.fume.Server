'use strict';

class ResponseDTO {
    constructor({ message, data }) {
        this.message = message;
        this.data = data;
    }
}

module.exports = ResponseDTO;
