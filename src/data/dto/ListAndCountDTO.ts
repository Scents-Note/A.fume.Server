class ListAndCountDTO<Type> {
    count: number;
    rows: Type[];
    constructor(count: number, rows: Type[]) {
        this.count = count;
        this.rows = rows;
    }
    public toString(): string {
        return `ListAndCountDTO (count: ${this.count}, rows: ${this.rows})`;
    }
}

export { ListAndCountDTO };
