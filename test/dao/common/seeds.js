const {
    Brand,
    Series,
    Perfume,
    PerfumeDetail,
    User,
    LikePerfume,
    Ingredient,
    SearchHistory,
    PerfumeSurvey,
    Sequelize,
    sequelize,
} = require('../../../models');
const { GENDER_MAN, GENDER_WOMAN } = require('../../../utils/code');

module.exports = () => {
    const firstJob = [];
    for (let i = 1; i <= 5; i++) {
        firstJob.push(
            Brand.upsert({
                brandIdx: i,
                name: `브랜드${i}`,
                startCharacter: 'ㅂ',
                englishName: 'brand english-name',
                imageUrl: `http://image-url/${i}`,
                description: '브랜드 설명 텍스트',
            }),
            Series.upsert({
                seriesIdx: i,
                name: `계열${i}`,
                englishName: 'series english-name',
                description: '계열 설명 텍스트',
            }),
            User.upsert({
                userIdx: i,
                nickname: `user${i}`,
                password: 'test',
                gender: (i % 2) + 1,
                phone: `010-0000-000${i}`,
                email: `email${i}@afume.com`,
                birth: '1995',
                grade: 1,
            })
        );
    }
    const secondJob = [];
    for (let i = 1; i <= 5; i++) {
        secondJob.push(
            Ingredient.upsert({
                ingredientIdx: i,
                name: `재료${i}`,
                seriesIdx: 1,
                englishName: 'ingredient english-name',
                description: '재료 설명 텍스트',
            }),
            Perfume.upsert({
                perfumeIdx: i,
                brandIdx: i,
                mainSeriesIdx: i,
                name: `향수${i}`,
                englishName: 'perfume english name',
                imageThumbnailUrl: `http://perfume-image/${i}`,
                releaseDate: `2021-01-1${i}`,
                likeCnt: 1,
            })
        );
    }
    const thirdJob = [];
    for (let i = 1; i <= 5; i++) {
        thirdJob.push(
            PerfumeDetail.upsert({
                perfumeIdx: i,
                story: `스토리${i}`,
                abundanceRate: 1,
                imageUrl: '',
                volumeAndPrice: '{"30":"95000","100":"190000"}',
            }),
            LikePerfume.upsert({ userIdx: 1, perfumeIdx: i }),
            SearchHistory.upsert({ userIdx: i, perfumeIdx: i }),
            SearchHistory.upsert({ userIdx: 1, perfumeIdx: i }),
            PerfumeSurvey.upsert({ perfumeIdx: i, gender: GENDER_WOMAN })
        );
    }
    return Promise.all(firstJob)
        .then((it) => Promise.all(secondJob))
        .then((it) => Promise.all(thirdJob))
        .catch((err) => {
            console.log(err);
        });
};