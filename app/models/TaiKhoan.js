const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

const TaiKhoanSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,//duy nhat
    },
    matkhau: {
        type: String
    },
    hoten: {
        type: String,
    },
    sodienthoai: {
        type: String,
    },
    _congviecdadang: {
        type: [{ type: Schema.Types.ObjectId, ref: 'CongViec' }]
    },
    _congviecdaungtuyen: {
        type: [{ type: Schema.Types.ObjectId, ref: 'CongViec' }]
    },
    _tintucdadang: {
        type: [{ type: Schema.Types.ObjectId, ref: 'TinTuc' }]
    },
    kichhoatnhatuyendung: {
        type: Boolean,
        default: false
    },
    khoa: {
        type: Boolean,
        default: false
    },
    hoanthienhoso: {
        type: Boolean,
        default: false
    },
    trangthai: {
        type: String
    },
    hotenthat: {
        type: String,
        default: ''
    },
    diachi: {
        type: String,
        default: ''
    },
    truongdaihoc: {
        type: String,
        default: ''
    },
    chuyennganh: {
        type: String,
        default: ''
    },
    gioithieu: {
        type: String,
        default: '<p></p>'
    },
    anhdaidien: {
        type: String,
        default: ''
    },
    cv: {
        type: String,
        default: ''
    },
    thongbao: {
        type: Boolean,
        default: false
    },
    noidungthongbao: {
        type: Array,
        "default": []
    },
    nhatuyendung: {
        tencongty: String,
        sodienthoai: String,
        email: String,
        diachi: String,
        website: String,
        linhvuchoatdong: String,
        gioithieu: String,
        logo: String
    }
    // tokens: [{
    //     access: {
    //         type: String,
    //         required: true
    //     },
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]


});



// TaiKhoanSchema.methods.toJSON = function () {
//     const taikhoan = this;
//     const taikhoanObject = taikhoan.toObject();
//     //ham pick lodashg chi lay 1 so thuoc tinh cua object
//     return _.pick(taikhoanObject, ['_id', 'email', 'hoten','_congviecdadang','_congviecdaungtuyen'],'hoanthienhoso', 'matkhau', 'sodienthoai', 'kichhoatnhatuyendung');
// };

const TaiKhoan = mongoose.model('TaiKhoan', TaiKhoanSchema);

module.exports = { TaiKhoan };