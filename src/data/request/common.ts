import { DEFAULT_PAGE_SIZE } from '@src/utils/constants';

class PagingRequestDTO {
    requestSize: number;
    lastPosition: number;
    sort: string;
    constructor(requestSize: number, lastPosition: number, sort: string) {
        this.requestSize = requestSize;
        this.lastPosition = lastPosition;
        this.sort = sort;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PagingRequestDTO {
        const requestSize: number =
            parseInt(json.requestSize) || DEFAULT_PAGE_SIZE;
        const lastPosition: number = parseInt(json.lastPosition) || -1;
        const sort: string = json.sort || 'createdAt_dsc';
        return new PagingRequestDTO(requestSize, lastPosition, sort);
    }
}

export { PagingRequestDTO };
