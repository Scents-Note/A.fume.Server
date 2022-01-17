const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        gender: { type: Number, require: false },
        ageGroup: { type: Number, require: false },
        result: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    {
        timestamps: true,
    }
);

/**
 * Ranking 생성
 *
 * @param {Object} payload
 */
rankingSchema.statics.create = function (payload) {
    const rank = new this(payload);
    return rank.save();
};

/**
 * Ranking 전체 조회
 */
rankingSchema.statics.findAll = function () {
    return this.find({});
};

/**
 * Ranking 조회
 *
 * @param {number} userIdx
 */
rankingSchema.statics.findItem = function (filter) {
    return this.findOne(filter);
};

/**
 * Ranking 조회
 *
 * @param {number} userIdx
 */
rankingSchema.statics.upsert = function (filter, payload) {
    const doc = this.findOneAndUpdate(filter, payload, {
        new: true,
        upsert: true,
    });
    return doc;
};

/**
 * Ranking 삭제
 *
 * @param {number} userIdx
 */
rankingSchema.statics.delete = function (filter) {
    return this.remove(filter);
};

module.exports = mongoose.model('ranking', rankingSchema);
