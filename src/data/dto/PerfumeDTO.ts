import { BrandDTO } from '@dto/BrandDTO';

class PerfumeDTO {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly story: string;
    readonly abundanceRate: number;
    readonly volumeAndPrice: { [key: string]: number }[];
    readonly imageUrl: string;
    readonly Brand: BrandDTO;
    constructor(
        perfumeIdx: number,
        name: string,
        story: string,
        abundanceRate: number,
        volumeAndPrice: { [key: string]: number }[],
        imageUrl: string,
        Brand: BrandDTO
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = Brand.name;
        this.story = story;
        this.abundanceRate = abundanceRate;
        this.volumeAndPrice = volumeAndPrice;
        this.imageUrl = imageUrl;
        this.Brand = Brand;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeDTO {
        return new PerfumeDTO(
            json.perfumeIdx,
            json.name,
            json.story,
            json.abundanceRate,
            json.volumeAndPrice,
            json.imageUrl,
            BrandDTO.createByJson(json.Brand)
        );
    }
}

export { PerfumeDTO };
