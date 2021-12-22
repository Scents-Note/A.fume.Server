class PerfumeThumbDTO {
    perfumeIdx: number;
    name: string;
    brandName: string;
    isLiked: boolean;
    imageUrl: string;
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        isLiked: boolean,
        imageUrl: string
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.isLiked = isLiked;
        this.imageUrl = imageUrl;
    }

    static createByJson(json: any): PerfumeThumbDTO {
        const perfumeIdx: number = json.perfumeIdx;
        const name: string = json.name;
        const brandName: string = json.brandName;
        const isLiked: boolean = json.isLiked;
        const imageUrl: string = json.imageUrl;
        return new PerfumeThumbDTO(
            perfumeIdx,
            name,
            brandName,
            isLiked,
            imageUrl
        );
    }
}

export default PerfumeThumbDTO;
