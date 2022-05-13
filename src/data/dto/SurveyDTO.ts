class SurveyDTO {
    readonly userIdx: number;
    readonly surveyKeywordList: number[];
    readonly surveyPerfumeList: number[];
    readonly surveySeriesList: number[];
    constructor(
        userIdx: number,
        surveyKeywordList: number[],
        surveyPerfumeList: number[],
        surveySeriesList: number[]
    ) {
        this.userIdx = userIdx;
        this.surveyKeywordList = surveyKeywordList;
        this.surveyPerfumeList = surveyPerfumeList;
        this.surveySeriesList = surveySeriesList;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { SurveyDTO };
