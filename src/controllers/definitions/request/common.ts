import { PagingDTO } from '@dto/index';
import { DEFAULT_PAGE_SIZE } from '@utils/constants';

type Ascending = 'DESC' | 'ASC';

class PagingRequestDTO {
    readonly requestSize: number;
    readonly lastPosition: number;
    readonly sort: string;
    constructor(requestSize: number, lastPosition: number, sort: string) {
        this.requestSize = requestSize;
        this.lastPosition = lastPosition;
        this.sort = sort;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    public toPageDTO(): PagingDTO {
        return new PagingDTO(
            this.lastPosition + 1,
            this.requestSize,
            this.getOrder()
        );
    }

    private getOrder(): [string, string][] | undefined {
        if (!this.sort) {
            return undefined;
        }
        const order: [string, string][] = [];
        const [key, _ascending] = this.sort.split('_');
        let ascending: Ascending = 'ASC';
        switch (_ascending) {
            case 'desc':
            case 'dsc':
                ascending = 'DESC';
                break;
            case 'asc':
            default:
                ascending = 'ASC';
                break;
        }
        order.push([key, ascending]);
        return order;
    }

    static createByJson(json: any, defaultJson?: any): PagingRequestDTO {
        const defaultValue: any = Object.assign(
            {
                requestSize: DEFAULT_PAGE_SIZE,
                lastPosition: -1,
                sort: 'createdAt_dsc',
            },
            defaultJson
        );
        const requestSize: number =
            parseInt(json.requestSize) || defaultValue.requestSize;
        const lastPosition: number =
            parseInt(json.lastPosition) || defaultValue.lastPosition;
        const sort: string = json.sort || defaultValue.sort;
        return new PagingRequestDTO(requestSize, lastPosition, sort);
    }
}

export { PagingRequestDTO };
