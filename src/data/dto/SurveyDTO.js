'use strict';

class SurveyDTO {
    constructor({
        userIdx,
        surveyKeywordList,
        surveyPerfumeList,
        surveySeriesList,
    }) {
        this.userIdx = userIdx;
        this.surveyKeywordList = surveyKeywordList;
        this.surveyPerfumeList = surveyPerfumeList;
        this.surveySeriesList = surveySeriesList;
    }
}

module.exports = SurveyDTO;
