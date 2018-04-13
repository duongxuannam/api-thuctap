const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

const TinTucSchema = new Schema({
    tieude: {
        type: String,
        // required: true,
        trim: true,
        minlength: 1,
        // unique: true,//duy nhat
    },
    noidung: {
        type: String,
    },
    hinhanh: {
        type: String,
    },
    ngaydang: {
        type: Date,
        default: new Date()
    },
    luotxem: {
        type: Number,
        default: 0
    },
    _nguoidang: {
        type: Schema.Types.ObjectId,
        ref: 'TaiKhoan',
        required: true,
    },
});

// TinTucSchema.methods.toJSON = function () {
//     const congviec = this;
//     const congviecObject = congviec.toObject();
//     //ham pick lodashg chi lay 1 so thuoc tinh cua object
//     return _.pick(congviecObject, ['_id', 'tieude', 'soluong', 'mieuta', 'diadiem', 'chuyennganh','ngaydang', '_nguoidang']);
// };

const TinTuc = mongoose.model('TinTuc', TinTucSchema);

module.exports = { TinTuc }