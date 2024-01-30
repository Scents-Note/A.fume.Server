import { DEFAULT_PAGE_SIZE } from '@src/utils/constants';
import { Fn } from 'sequelize/types/utils';

class PagingDTO {
    readonly offset: number;
    readonly limit: number;
    readonly order: (Fn | string[])[] | undefined;
    constructor(
        offset: number,
        limit: number,
        order: (Fn | string[])[] | undefined
    ) {
        this.offset = offset;
        this.limit = limit;
        this.order = order;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    public sqlOrderQuery(defaultQuery: string): string {
        if (!this.order || this.order.length == 0) {
            return defaultQuery;
        }
        return this.order
            .map((it: any) => {
                if (it.fn) {
                    return `${it.fn}(${it.args})`;
                }
                return `${it[0]} ${it[1]}`;
            })
            .join(' ');
    }

    public sequelizeOption(): any {
        return {
            offset: this.offset,
            limit: this.limit,
            order: this.order,
        };
    }
    static createByJson({
        offset,
        limit,
        order,
    }: {
        offset?: number;
        limit?: number;
        order?: (Fn | string[])[];
    }): PagingDTO {
        return new PagingDTO(offset || 0, limit || DEFAULT_PAGE_SIZE, order);
    }
}

export { PagingDTO };
