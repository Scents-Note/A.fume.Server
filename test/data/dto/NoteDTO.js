const { expect } = require('chai');

const {
    NOTE_TYPE_TOP,
    NOTE_TYPE_MIDDLE,
    NOTE_TYPE_BASE,
    NOTE_TYPE_SINGLE,
} = require('../../../utils/code');
const NoteDTO = require('../../../data/dto/NoteDTO');

NoteDTO.prototype.validTest = function () {
    expect(this.perfumeIdx).to.be.ok;
    expect(this.ingredientIdx).to.be.ok;
    expect(this.ingredientName).to.be.ok;
    expect(this.type).to.be.oneOf([
        NOTE_TYPE_TOP,
        NOTE_TYPE_MIDDLE,
        NOTE_TYPE_BASE,
        NOTE_TYPE_SINGLE,
    ]);
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

module.exports = NoteDTO;
