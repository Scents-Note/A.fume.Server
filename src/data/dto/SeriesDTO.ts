class SeriesDTO {
    seriesIdx: number;
    name: string;
    englishName: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    constructor(
        seriesIdx: number,
        name: string,
        englishName: string,
        description: string,
        imageUrl: string,
        createdAt: string,
        updatedAt: string
    ) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static createByJson(json: any): SeriesDTO {
        const seriesIdx: number = json.seriesIdx;
        const name: string = json.name;
        const englishName: string = json.englishName;
        const description: string = json.description;
        const imageUrl: string = json.imageUrl;
        const createdAt: string = json.createdAt;
        const updatedAt: string = json.updatedAt;
        return new SeriesDTO(
            seriesIdx,
            name,
            englishName,
            description,
            imageUrl,
            createdAt,
            updatedAt
        );
    }
}

export default SeriesDTO;
