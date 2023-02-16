const {
    Brand,
    Series,
    Perfume,
    User,
    Note,
    LikePerfume,
    LikeReview,
    Ingredient,
    IngredientCategories,
    InquireHistory,
    ReportUserInquirePerfume,
    PerfumeSurvey,
    Keyword,
    JoinPerfumeKeyword,
    JoinReviewKeyword,
    Review,
} = require('@sequelize');

import { GENDER_MAN, GENDER_WOMAN } from '@utils/constants';

module.exports = () => {
    const firstJob = [];
    for (let i = 1; i <= 5; i++) {
        firstJob.push(
            Brand.upsert({
                brandIdx: i,
                name: `브랜드${i}`,
                firstInitial: 'ㅂ',
                englishName: 'brand english-name',
                imageUrl: `http://image-url/${i}`,
                description: '브랜드 설명 텍스트',
            }),
            Series.upsert({
                seriesIdx: i,
                name: `계열${i}`,
                englishName: 'series english-name',
                description: '계열 설명 텍스트',
                imageUrl: 'image-url',
            }),
            User.upsert({
                userIdx: i,
                nickname: `user${i}`,
                password: 'test',
                gender: (i % 2) + 1,
                email: `email${i}@afume.com`,
                birth: '1995',
                grade: 1,
            }),
            Keyword.upsert({
                id: i,
                name: `키워드${i}`,
            }),
            IngredientCategories.upsert({
                idx: i,
                name: '카테고리' + i,
            })
        );
    }
    const secondJob = [];
    for (let i = 1; i <= 5; i++) {
        secondJob.push(
            Ingredient.upsert({
                ingredientIdx: i,
                name: `재료${i}`,
                seriesIdx: i,
                englishName: 'ingredient english-name',
                description: '재료 설명 텍스트',
                imageUrl: 'image-url',
                categoryIdx: i,
            }),
            Perfume.upsert({
                perfumeIdx: i,
                brandIdx: i,
                name: `향수${i}`,
                englishName: `perfume-${i}`,
                imageUrl: `http://perfume-image/${i}`,
                story: `스토리${i}`,
                abundanceRate: 1,
                volumeAndPrice: '30/95000,100/190000',
            })
        );
    }
    secondJob.push(
        Perfume.upsert({
            perfumeIdx: 10,
            brandIdx: 1,
            name: `향수10`,
            englishName: `perfume-10`,
            imageUrl: `http://perfume-image/10_1.png`,
            story: `스토리10`,
            abundanceRate: 1,
            volumeAndPrice: '30/95000',
        })
    );
    const thirdJob = [];
    for (let i = 1; i <= 5; i++) {
        thirdJob.push(
            LikePerfume.upsert({ userIdx: 1, perfumeIdx: i }),
            InquireHistory.upsert({ userIdx: i, perfumeIdx: i }),
            InquireHistory.upsert({ userIdx: 1, perfumeIdx: i }),
            PerfumeSurvey.upsert({ perfumeIdx: i, gender: GENDER_WOMAN }),
            Review.upsert({
                id: i,
                perfumeIdx: i,
                userIdx: i,
                score: i,
                longevity: i,
                sillage: i,
                seasonal: 4,
                gender: 1,
                access: 1,
                content: `시향노트${i}`,
                likeCnt: 5,
            }),
            Review.upsert({
                id: i + 5,
                perfumeIdx: 10,
                userIdx: i,
                score: i,
                longevity: i,
                sillage: i,
                seasonal: 1,
                gender: 1,
                access: 0,
                content: `(비공개)시향노트${i}`,
                likeCnt: 5,
            }),
            JoinPerfumeKeyword.upsert({
                perfumeIdx: (i % 2) + 1,
                keywordIdx: i,
                count: i,
            })
        );
    }
    const fourthJob = [];
    for (let i = 1; i <= 5; i++) {
        fourthJob.push(
            LikeReview.upsert({ reviewIdx: i, userIdx: i }),
            JoinReviewKeyword.upsert({ reviewIdx: i, keywordIdx: i }),
            ReportUserInquirePerfume.upsert({
                userIdx: i,
                perfumeIdx: i,
                count: 1,
            }),
            ReportUserInquirePerfume.upsert({
                userIdx: 1,
                perfumeIdx: i,
                count: 1,
            }),
            PerfumeSurvey.upsert({ perfumeIdx: i, gender: GENDER_WOMAN }),
            Note.upsert({ perfumeIdx: 1, ingredientIdx: i, type: (i % 4) + 1 }),
            Note.upsert({ perfumeIdx: 1, ingredientIdx: i, type: 1 }),
            Note.upsert({
                perfumeIdx: 2,
                ingredientIdx: i,
                type: ((i + 1) % 4) + 1,
            }),
            Note.upsert({
                perfumeIdx: 3,
                ingredientIdx: i,
                type: ((i + 2) % 4) + 1,
            }),
            Note.upsert({
                perfumeIdx: 4,
                ingredientIdx: i,
                type: ((i + 3) % 4) + 1,
            }),
            Note.upsert({
                perfumeIdx: 5,
                ingredientIdx: i,
                type: ((i + 4) % 4) + 1,
            })
        );
    }
    return Promise.all(firstJob)
        .then((it) => Promise.all(secondJob))
        .then((it) => Promise.all(thirdJob))
        .then((it) => Promise.all(fourthJob))
        .catch((err) => {
            console.log(err);
        });
};
