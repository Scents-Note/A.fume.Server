class ListAndCountDTO<Type> {
    readonly count: number;
    readonly rows: Type[];
    constructor(count: number, rows: Type[]) {
        this.count = count;
        this.rows = rows;
    }
    public toString(): string {
        return `ListAndCountDTO (count: ${this.count}, rows: ${this.rows})`;
    }

    public convertType<T>(converter: (type: Type) => T): ListAndCountDTO<T> {
        return new ListAndCountDTO<T>(this.count, this.rows.map(converter));
    }
}

export { ListAndCountDTO };
