class PagingRequestDTO {
    pagingSize: number;
    pagingIndex: number;
    sort: string;
    constructor(pagingSize: number, pagingIndex: number, sort: string) {
        this.pagingSize = pagingSize;
        this.pagingIndex = pagingIndex;
        this.sort = sort;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PagingRequestDTO {
        const pagingSize: number = json.pagingSize || 10;
        const pagingIndex: number = json.pagingIndex || 1;
        const sort: string = json.sort || 'createdAt_ds';
        return new PagingRequestDTO(pagingSize, pagingIndex, sort);
    }
}

export { PagingRequestDTO };
