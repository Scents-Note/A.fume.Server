import IngredientDTO from './IngredientDTO';
import SeriesDTO from './SeriesDTO';

class SeriesFilterDTO extends SeriesDTO {
    ingredients: IngredientDTO[];
    constructor(
        seriesIdx: number,
        name: string,
        englishName: string,
        description: string,
        imageUrl: string,
        createdAt: string,
        updatedAt: string,
        ingredients: IngredientDTO[]
    ) {
        super(
            seriesIdx,
            name,
            englishName,
            description,
            imageUrl,
            createdAt,
            updatedAt
        );
        this.ingredients = ingredients;
    }

    static createByJson(json: any) {
        const seriesIdx: number = json.seriesIdx;
        const name: string = json.name;
        const englishName: string = json.englishName;
        const description: string = json.description;
        const imageUrl: string = json.imageUrl;
        const createdAt: string = json.createdAt;
        const updatedAt: string = json.updatedAt;
        const ingredients: IngredientDTO[] = json.ingredients;
        return new SeriesFilterDTO(
            seriesIdx,
            name,
            englishName,
            description,
            imageUrl,
            createdAt,
            updatedAt,
            ingredients
        );
    }
}

export default SeriesFilterDTO;
