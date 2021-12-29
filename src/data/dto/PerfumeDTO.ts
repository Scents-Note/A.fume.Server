import BrandDTO from './BrandDTO';

class PerfumeDTO {
    perfumeIdx: number;
    name: string;
    brandName: string;
    story: string;
    abundanceRate: number;
    volumeAndPrice: { [key: string]: number }[];
    imageUrl: string;
    Brand: BrandDTO;
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

export default PerfumeDTO;
