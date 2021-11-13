class ListAndCountDTO<Type> {
    count: number;
    rows: Type[];
    constructor(count: number, rows: Type[]) {
        this.count = count;
        this.rows = rows;
    }
}

export default ListAndCountDTO;
