const seasonalArr = ['봄', '여름', '가을', '겨울'];
const sillageArr = ['가벼움', '보통', '무거움'];
const longevityArr = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
const genderArr = ['남성', '중성', '여성'];

const KeywordDao = require('../dao/KeywordDao');

// 예시 : '가벼움' -> 1 
module.exports.inputStrToDBIntOfReview = async ({longevity, sillage, seasonal, gender, keywordList}) => {
    try{
        // seasonal 변환하기 (비트연산)
        let sum = 0;
        if (seasonal) {
            seasonal.map(it => {
                const bit = Math.pow(2, seasonalArr.indexOf(it))
                sum = sum + bit
            })
        }

        // keywordList 변환하기
        let keywordIdxList;
        if (keywordList) {
            keywordIdxList = await Promise.all(keywordList.map(it => {
                return KeywordDao.readKeywordIdx(it)
            }))
        }

        return {
            longevity: longevity? longevityArr.indexOf(longevity)+1 : null,
            sillage: sillage? sillageArr.indexOf(sillage)+1 : null,
            seasonal: seasonal? sum : null,
            gender: gender? genderArr.indexOf(gender)+1 : null,
            keywordList: keywordList? keywordIdxList: []
        }

    }catch(err) {
        console.log(err)
    }
};

// 예시 : 1 -> '가벼움' 
module.exports.DBIntToOutputStrOfReview = async ({longevity, sillage, seasonal, gender, keywordList}) => {
    try{
        // seasonal 변환하기 (비트연산)
        let seasonalStrList = [];
        if (seasonal) {
            for (i=0; i<4; i++) {
                if (seasonal & Math.pow(2, i)) {
                    seasonalStrList.push(seasonalArr[i])
                }
            }
        }

        // keywordList 변환하기
        let keywordStrList;
        if (keywordList) {
            keywordStrList = await Promise.all(keywordList.map(it => {
                if (typeof it == 'string') {
                    return KeywordDao.readKeywordName(it)
                }
                if (typeof it == 'object') {
                    return it
                }
            }))
        }

        return {
            longevity: longevity? longevityArr[longevity-1] : null,
            sillage: sillage? sillageArr[sillage-1] : null,
            seasonal: seasonal? seasonalStrList : null,
            gender: gender? genderArr[gender-1] : null,
            keywordList: keywordList? keywordStrList : []
        }

    }catch(err) {
        console.log(err)
    }
};

// 예시 : (가벼움) 0 -> 1
module.exports.InputIntToDBIntOfReview = async ({longevity, sillage, seasonal, gender, keywordList}) => {
    try{
        // seasonal 변환하기 (비트연산)
        let sum = 0;
        if (seasonal) {
            seasonal.map(it => {
                const bit = Math.pow(2, seasonalArr.indexOf(it))
                sum = sum + bit
            })    
        }
    
        // keywordList 변환하기
        let keywordIdxList;
        if (keywordList) {
            keywordIdxList = await Promise.all(keywordList.map(it => {
                return KeywordDao.readKeywordIdx(it)
            }))
        }
        
        return {
            longevity: longevity+1? longevity+1 : null,
            sillage: sillage+1? sillage+1 : null,
            seasonal: seasonal? sum : null,
            gender: gender+1? gender+1 : null,
            keywordList: keywordList? keywordIdxList: []
        }

    }catch(err) {
        console.log(err)
    }
};

// 예시 : (가벼움) 1 -> 0
module.exports.DBIntToOutputIntOfReview = async ({longevity, sillage, seasonal, gender, keywordList}) => {
    try{
        // seasonal 변환하기 (비트연산)
        let seasonalStrList = [];
        if (seasonal) {
            for (i=0; i<4; i++) {
                if (seasonal & Math.pow(2, i)) {
                    seasonalStrList.push(seasonalArr[i])
                }
            }
        }
        
        // keywordList 변환하기
        let keywordStrList;
        if (keywordList) {
            keywordStrList = await Promise.all(keywordList.map(it => {
                if (typeof it == 'string') {
                    return KeywordDao.readKeywordName(it)
                }
                if (typeof it == 'object') {
                    return it
                }
            }))
        }

        return {
            longevity: longevity? longevity-1 : null,
            sillage: sillage? sillage-1 : null,
            seasonal: seasonal? seasonalStrList : null,
            gender: gender? gender-1 : null,
            keywordList: keywordList? keywordStrList : []
        }

    }catch(err) {
        console.log(err)
    }
};

module.exports.getApproxAge = async (birthYear) => {
    const thisYear = new Date().getFullYear()
    const exactAge = thisYear - birthYear + 1
    const exactAgeTens = parseInt(exactAge / 10) * 10
    const exactAgeUnit = exactAge % 10 

    let section;
    if (exactAgeUnit < 4) 
        section = '초반'
    else if (exactAgeUnit >= 4 && exactAgeUnit < 7)
        section = '중반'
    else
        section = '후반'
    
    return `${exactAgeTens}대 ${section}`
}


