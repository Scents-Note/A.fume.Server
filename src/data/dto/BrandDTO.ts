class BrandDTO {
    readonly brandIdx: number;
    readonly name: string;
    readonly englishName: string;
    readonly firstInitial: string;
    readonly imageUrl: string;
    readonly description: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    constructor(
        brandIdx: number,
        name: string,
        englishName: string,
        firstInitial: string,
        imageUrl: string,
        description: string,
        createdAt: string,
        updatedAt: string
    ) {
        this.brandIdx = brandIdx;
        this.name = name;
        this.englishName = englishName;
        this.firstInitial = firstInitial;
        this.imageUrl = imageUrl;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): BrandDTO {
        const brandIdx: number = json.brandIdx;
        const name: string = json.name;
        const englishName: string = json.englishName;
        const firstInitial: string = json.firstInitial;
        const imageUrl: string = json.imageUrl;
        const description: string = json.description;
        const createdAt: string = json.createdAt;
        const updatedAt: string = json.updatedAt;
        return new BrandDTO(
            brandIdx,
            name,
            englishName,
            firstInitial,
            imageUrl,
            description,
            createdAt,
            updatedAt
        );
    }
}

export { BrandDTO };
