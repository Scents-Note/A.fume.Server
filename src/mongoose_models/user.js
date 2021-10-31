const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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

/**
 * User 생성
 *
 * @param {Object} payload
 */
userSchema.statics.create = function (payload) {
    const user = new this(payload);
    return user.save();
};
/**
 * User 전체 조회
 */
userSchema.statics.findAll = function () {
    return this.find({});
};

/**
 * User 조회
 *
 * @param {number} userIdx
 */
userSchema.statics.findOneByPk = function (userIdx) {
    return this.findOne({ userIdx });
};

/**
 * User 수정
 *
 * @param {number} userIdx
 * @param {Object} payload
 */
userSchema.statics.updateByPk = function (userIdx, payload) {
    return this.findOneAndUpdate({ userIdx }, payload, { new: true });
};

/**
 * User 삭제
 *
 * @param {number} userIdx
 */
userSchema.statics.deleteByPk = function (userIdx) {
    return this.remove({ userIdx });
};

module.exports = mongoose.model('user', userSchema);
