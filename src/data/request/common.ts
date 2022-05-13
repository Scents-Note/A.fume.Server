import { DEFAULT_PAGE_SIZE } from '@src/utils/constants';

class PagingRequestDTO {
    pagingSize: number;
    lastPosition: number;
    sort: string;
    constructor(pagingSize: number, lastPosition: number, sort: string) {
        this.pagingSize = pagingSize;
        this.lastPosition = lastPosition;
        this.sort = sort;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PagingRequestDTO {
        const pagingSize: number =
            parseInt(json.pagingSize) || DEFAULT_PAGE_SIZE;
        const lastPosition: number = parseInt(json.lastPosition) || -1;
        const sort: string = json.sort || 'createdAt_dsc';
        return new PagingRequestDTO(pagingSize, lastPosition, sort);
    }
}

export { PagingRequestDTO };
