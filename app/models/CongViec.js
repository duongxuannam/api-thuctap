const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

const CongViecSchema = new Schema({
    tieude: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        // unique: true,//duy nhat
    },
    diadiem: {
        type: String,
        trim: true,
    },
    chuyennganh: {
        type: String,
    },
    kieu: {
        type: String,
    },
    chucvu: {
        type: String,
    },
    luong: {
        type: String,
    },
    trinhdo: {
        type: String,
    },
    kinhnghiem: {
        type: String,
    },
    mota: {
        type: String,
        required: true,
        minlength: 1,
    },
    soluong: {
        type: Number,
        required: true,
    },
    ngaydang: {
        type: Date,
        default: new Date()
    },
    thoihan: {
        type: String,
    },
    luotxem: {
        type: Number,
        default: 0
    },
    danop: {
        type: Number,
        default: 0
    },
    _nguoidang: {
        type: Schema.Types.ObjectId,
        ref: 'TaiKhoan',
        required: true,
    },
    _danhsachungtuyen: {
        type: [{ type: Schema.Types.ObjectId, ref: 'TaiKhoan' }]
    },
    hinhanh: {
        type: String
    }
});
CongViecSchema.index({tieude: 'text', diadiem: 'text', chuyennganh: 'text', kieu: 'text', chucvu: 'text'});
// CongViecSchema.methods.toJSON = function () {
//     const congviec = this;
//     const congviecObject = congviec.toObject();
//     //ham pick lodashg chi lay 1 so thuoc tinh cua object
//     return _.pick(congviecObject, ['_id', 'tieude', 'soluong', 'mieuta', 'diadiem', 'chuyennganh','ngaydang', '_nguoidang']);
// };

const CongViec = mongoose.model('CongViec', CongViecSchema);

module.exports = { CongViec }