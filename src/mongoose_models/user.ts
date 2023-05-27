import { Schema, model } from 'mongoose';

interface IUser {
    userIdx: number;
    surveyKeywordList: ArrayConstructor;
    surveySeriesList: ArrayConstructor;
    surveyPerfumeList: ArrayConstructor;
}

const userSchema = new Schema<IUser>(
    {
        userIdx: { type: Number, required: true, unique: true, primary: true },
        surveyKeywordList: { type: Array, required: true },
        surveySeriesList: { type: Array, required: true },
        surveyPerfumeList: { type: Array, required: true },
    },
    {
        timestamps: true,
    }
);

export const User = model('User', userSchema);
