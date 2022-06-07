class SurveyDTO {
    userIdx: number;
    surveyKeywordList: number[];
    surveyPerfumeList: number[];
    surveySeriesList: number[];
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
