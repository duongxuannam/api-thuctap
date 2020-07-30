const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const request = require('request');

const { mongoose } = require('./app/models/db');
const { CongViec } = require('./app/models/CongViec');
const { TaiKhoan } = require('./app/models/TaiKhoan');
const { TinTuc } = require('./app/models/TinTuc');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//khai bao port
const PORT = process.env.PORT || 1995;
const server = require('http').Server(app);
var io = require('socket.io')(server);
// server.listen(PORT);

//--------------------------------------------------SOCKET- IO
io.on('connection', function (socket) {
  console.log('co nguoi ket noi', socket.id);
  // socket.emit('Server-send-id', 'saquadikhap')
});

//wake-up server
app.get('/wakeUp', (_, res) => {
  request('https://api-playhard.herokuapp.com/wakeUp', function (
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Print the google web page.
    }
  });
  return res.send('Wake upppp');
});

//---------------------------------------------------GUI MAIL-------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sieunhandungcam1995@gmail.com',
    pass: 'kuteshock95',
  },
});

//const transporter = nodemailer.createTransport('smtps://sieunhandungcam1995%40gmail.com:kuteshock95@smtp.gmail.com');

const guiMailQuenMatKhau = (mail, id, hoten) => {
  const rs = `https://apimongo.herokuapp.com/rsmatkhau/${id}`;
  const tenhienthi = hoten;
  let mailOptions = {
    from: 'From Nam with Love', // sender address
    to: mail,
    subject: `Quên mật khẩu ✔`, // Subject line
    text: `Chào ${tenhienthi}. Chúng tôi muốn xác nhận việc bạn muốn reset lại mật khẩu.`, // plain text body
    html: `
       <p>Vui lòng click vào <a href=${rs}>link</a> để reset lại mật khẩu. </p> 
         `, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('o day a', error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};

const guiRsMatKhau = (mail, matkhau, hoten) => {
  const tenhienthi = hoten;
  let mailOptions = {
    from: 'From Nam with Love', // sender address
    to: mail,
    subject: `Reset mật khẩu ✔`, // Subject line
    text: `Chào ${tenhienthi}. Mật khẩu của bạn đã được reset.`, // plain text body
    html: `
       <p>Mật khâu mới của bạn là : ${matkhau}</p> 
         `, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('o day a', error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};

const guiMailCoNguoiUngTuyen = (mail, idCongViec, idTaiKhoan, hoten, cv) => {
  const congviec = `https://thuctap-web.herokuapp.com/danhsachungtuyen/${idCongViec}`;
  const tenhienthi = hoten;
  const taikhoan = `https://thuctap-web.herokuapp.com/chitiettaikhoan/${idTaiKhoan}`;
  let mailOptions = {
    from: 'From Nam with Love', // sender address
    to: mail,
    subject: `Chào ${tenhienthi} có người vừa ứng tuyển ✔`, // Subject line
    text: `Chào ${tenhienthi} có người vừa ứng tuyển.`, // plain text body
    html: `<p>Có người vừa ứng tuyển vào công việc mà bạn đăng. </p> 
       <p><a href=${taikhoan}>Chi tiết</a> tài khoản. </p> 
        <p><a href=${cv}>CV</a></p>.
      <p><a href=${congviec}> Danh sách </a>đã ứng tuyển</p>  `, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('o day a', error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};

const guiMailDuyetDangKyNhaTuyenDung = (mail, tenhienthi) => {
  const dd = `https://thuctap-web.herokuapp.com/themcongviec`;
  let mailOptions = {
    from: 'From Nam with Love', // sender address
    to: mail,
    subject: 'Thư gửi từ dự án Tìm địa điểm thực tập ✔', // Subject line
    text: `Chào ${tenhienthi} tài khoản của bạn đã được kích hoạt.`, // plain text body
    html: `<b>Chào ${tenhienthi} tài khoản của bạn đã được kích hoạt nhà tuyển dụng. Bạn đã có thể </b> <a href=${dd}>đăng tuyển công việc</a>`, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('o day a', error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};
// gui mail dang ky nhatuyendung
const guiMailDangKyNhaTuyenDung = (hoten, tencongty) => {
  const dd = `https://thuctap-web.herokuapp.com/quanly`;
  let mailOptions = {
    from: 'From Nam with Love', // sender address
    to: 'sieunhandungcam1995@gmail.com',
    subject: 'Thư gửi từ dự án Tìm địa điểm thực tập ✔', // Subject line
    text: `Chào Admin tài khoản ${hoten} đã đăng ký kích hoạt nhà tuyển dụng cho công ty ${tencongty}.`, // plain text body
    html: `<b>Chào Admin tài khoản ${hoten} đã đăng ký kích hoạt nhà tuyển dụng cho công ty ${tencongty}. Vui lòng </b> <a href=${dd}>kiểm tra </a>`, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('o day a', error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};

// gui mail test
// const testgui = () => {
//     ;
//     let mailOptions = {
//         from: 'From Nam with Love', // sender address
//         to: 'duongxuannam1995@gmail.com',
//         subject: 'Thư gửi từ dự án Tìm địa điểm thực tập ✔', // Subject line
//         text: `Chào Admin tài khoản  đã đăng ký kích hoạt nhà tuyển dụng cho công ty .`, // plain text body
//         html: `<b>Chào Admin tài khoản  đã đăng ký kích hoạt nhà tuyển dụng cho công t. Vui lòng </b> <a href=>kiểm tra </a>` // html body
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log('o day a', error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// }
// app.get('/ahuhu', (req, res) => {
//     testgui()
//     res.send('ahuhu');
// });

// cloudinary.config({
//     cloud_name: 'thuctap',
//     api_key: '586676579855377',
//     api_secret: 'IJuf1j4hbInzcUfNSU2lMnGT5vI'
// })

// ////////////////////////////////////////////////////NOTIFICANTION//////////////////////////////////////////
//con mej mafy

var sendNotification = function (data) {
  var headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: 'Basic ODY0YWIxOGItNTY3MC00MzAzLWE5ZDQtZjA4Y2MzMjQ5YjE5',
  };

  var options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers,
  };

  var https = require('https');
  var req = https.request(options, function (res) {
    res.on('data', function (data, error) {
      if (error) {
        return console.log(error);
      }
      console.log('Response:');
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function (e) {
    console.log('ERROR:');
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

var messageWeb = {
  app_id: 'f4318781-c9c6-4ab2-b805-7975e030c9b9',
  contents: { en: 'Có tin tức mới' },
  included_segments: ['All'],
  isChromeWeb: true,
  headings: { en: 'Thông báo' },
  url: 'https://thuctap-web.herokuapp.com/tintuc',
};
var messageAndroid = {
  app_id: 'f4318781-c9c6-4ab2-b805-7975e030c9b9',
  contents: { en: 'Có tin tức mới' },
  included_segments: ['All'],
  isAndroid: true,
  headings: { en: 'Thông báo' },
};
// sendNotification(message);
// --                                       test them thong bao them thong bao
app.get('/themthongbao', function (req, res) {
  sendNotification(messageWeb);
  sendNotification(messageAndroid);
  res.send({ aa: 'ok' });
});
//-----------------------UP HINH LEN CLOUD

// cloudinary.uploader.upload("./public/logobu.jpg", function(result) {
//     console.log(result)
//   });
//-----------------dat ten
// cloudinary.uploader.upload(
//     "./public/logobu.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'default',
//       crop: 'limit',
//       width: 2000,
//       height: 2000,

//     }
//   )
//------------------------xóa 1 hình, muốn edit thì cứ đặt tên trùng thôi
// cloudinary.uploader.destroy('qfjixtwodb2oumqocnam', function(result) { console.log(result) });

// cloudinary.uploader.upload(
//     "./cty2.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'cty2',

//     }
//   )

//   cloudinary.uploader.upload(
//     "./cty3.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'cty3',

//     }
//   )
//   cloudinary.uploader.upload(
//     "./cty1.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'cty1',

//     }
//   )
//--- gui thu cai hinh
// app.get('/cloudinary', (req, res) => {
//     res.send({ 'aa': cloudinary.image("default.jpg", { alt: "Sample Image" }) });
// });
//middleware
app.use((req, res, next) => {
  console.log('middleware ne');
  next();
});
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//----------------------------------------test------------------------
app.get('/', (req, res) => {
  res.send('Nam dang yeu ahihhihi');
});

//test gui hinh
// const hinh = require('./public/logobu.jpg')
app.get('/testcaihinh', function (req, res) {
  // res.sendFile(path.resolve(__dirname, './public/dangnhap.png'));
  res.send({ 'duong dan ne hihi': __dirname });
});

//test lay tong danh sasch cong viec
app.get('/tatcacongviec', (req, res) => {
  CongViec.find()
    .count()
    .then(
      (congviec) => {
        res.send({ tongcongviec3: congviec });
      },
      (e) => {
        res.status(400).send(e);
      }
    );
});
//test lấy 1 cong viec theo id
app.get('/testcongviec/:id', (req, res) => {
  const id = req.params.id;

  CongViec.findById(id)
    .then((congviec) => {
      if (!congviec) {
        return res.status(404).send({ thongbao: 'Không tìm thấy công việc' });
      }

      res.send({ congviec });
    })
    .catch((e) => {
      res.status(400).send({ thongbao: 'Lỗi CSDL' });
    });
});

//-------------------CRUD(create- read - update- delete)----------------

//quen mat khau
app.post('/quenmatkhau', (req, res) => {
  const { email } = req.body;

  TaiKhoan.findOne({ email: req.body.email }).exec(function (err, taikhoan) {
    if (!taikhoan) {
      return res.send({ loi: 'Có đâu ba' });
    }
    guiMailQuenMatKhau(taikhoan.email, taikhoan._id, taikhoan.hoten);
    res.send({ thongbao: 'thành công' });
  });
  // res.send({email,matkhau})
});
//rs lại mat khau
app.get('/rsmatkhau/:id', (req, res) => {
  var charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < 6; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(randomString, salt, (err, hash) => {
      const randomStringDaMaHoa = hash;
      TaiKhoan.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { matkhau: randomStringDaMaHoa } }
      ).then((tk) => {
        guiRsMatKhau(tk.email, randomString, tk.hoten);
        res.send({ 'Mật khẩu mới của bạn là': randomString });
      });
    });
  });
  //TaiKhoan.findOneAndUpdate({ _id: req.params.id }, {  $set: { matkhau: true } })
});
///doi mat khau

app.post('/doimatkhau', (req, res) => {
  const { email, matkhau, matkhaumoi } = req.body;
  if (!matkhau) {
    return res.status(204).send();
  }
  TaiKhoan.findOne({ email }).exec(function (err, taikhoan) {
    if (!taikhoan) {
      return res.status(204).send();
    }
    bcrypt.compare(req.body.matkhau, taikhoan.matkhau, (err, result) => {
      if (result) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.matkhaumoi, salt, (err, hash) => {
            const matkhaumoi = hash;
            TaiKhoan.findOneAndUpdate(
              { email: req.body.email },
              { $set: { matkhau: matkhaumoi } }
            ).then((tk) => {
              res.send({ thongbao: 'ok' });
            });
          });
        });
      } else {
        return res.send({ loi: 'Khong tim thay' });
      }
    });
  });
  // res.send({email,matkhau})
});

//them 1 tai khoan
app.post('/dangky', (req, res) => {
  const taikhoan = new TaiKhoan({
    email: req.body.email,
    hoten: req.body.hoten,
    matkhau: req.body.matkhau,
    sodienthoai: req.body.sodienthoai,
    gioithieu: '<p></p>',
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(taikhoan.matkhau, salt, (err, hash) => {
      taikhoan.matkhau = hash;
      console.log(taikhoan);
      taikhoan.save().then(
        (doc) => {
          res.send({ taikhoan });
        },
        (e) => {
          res.status(400).send(e);
        }
      );
    });
  });
});

//dang nhap
app.post('/dangnhap', (req, res) => {
  const { email, matkhau } = req.body;
  if (!matkhau) {
    return res.status(204).send();
  }
  TaiKhoan.findOne({ email: req.body.email }).exec(function (err, taikhoan) {
    if (!taikhoan) {
      return res.status(204).send();
    }
    bcrypt.compare(req.body.matkhau, taikhoan.matkhau, (err, result) => {
      if (result) {
        if (taikhoan.khoa) {
          return res.send({ thongbao: 'Tài khoản đã bị khóa' });
        }
        res.send({ taikhoan });
      } else {
        return res.status(204).send();
      }
    });
  });
  // res.send({email,matkhau})
});

// lay viec theo id

app.get('/testtimviec/:id', (req, res) => {
  CongViec.findOne({ _id: req.params.id })
    .populate('_nguoidang')
    .exec(function (err, cv) {
      if (err) throw err;
      console.log(cv);
      res.send(cv);
    });
});

//tim viec theo dia diem

app.get('/testtimviecdiadiem', (req, res) => {
  CongViec.find({ diadiem: /test/ })
    .populate('_nguoidang')
    .then((data) => {
      res.send(data);
    });
});

//tim VIEC trang chu

app.post('/timviectrangchu', (req, res) => {
  const { tuKhoa } = req.body;
  // Product.find({"name": { $regex: /Máy tính/ }})
  //     CongViec.find({ 'diadiem': { $regex:/Binh Duong/ }}).populate('_nguoidang').then((data) => {
  //         res.send(data);
  //     })
  // CongViec.find({$text: {$search: tuKhoa}}).then(data=> res.send(data))
  CongViec.find({ tieude: { $regex: tuKhoa, $options: 'i' } })
    .populate('_nguoidang')
    .then((data) => {
      if (data.length < 1) {
        return res.send({ thongbao: 'Hết dữ liệu' });
      }
      res.send(data);
    });
});

//tim VIEC trang danh sach

app.post('/timviectrangdanhsach', (req, res) => {
  const { chuyennganh, kieu, sotrang } = req.body;
  if (!chuyennganh && !kieu) {
    const skip = (sotrang - 1) * 5;
    return CongViec.find()
      .sort({ ngaydang: -1 })
      .limit(5)
      .skip(skip)
      .populate('_nguoidang')
      .then((data) => {
        if (data.length < 1) {
          return res.send({ thongbao: 'Hết dữ liệu' });
        }
        res.send(data);
      });
  }
  if (chuyennganh && !kieu) {
    const skip = (sotrang - 1) * 5;
    return CongViec.find({ chuyennganh: chuyennganh })
      .sort({ ngaydang: -1 })
      .limit(5)
      .skip(skip)
      .populate('_nguoidang')
      .then((data) => {
        if (data.length < 1) {
          return res.send({ thongbao: 'Hết dữ liệu' });
        }
        res.send(data);
      });
  }
  if (!chuyennganh && kieu) {
    const skip = (sotrang - 1) * 5;
    return CongViec.find({ kieu: kieu })
      .sort({ ngaydang: -1 })
      .limit(5)
      .skip(skip)
      .populate('_nguoidang')
      .then((data) => {
        if (data.length < 1) {
          return res.send({ thongbao: 'Hết dữ liệu' });
        }
        res.send(data);
      });
  }
  if (chuyennganh && kieu) {
    const skip = (sotrang - 1) * 5;
    return CongViec.find({ kieu: kieu })
      .find({ chuyennganh: chuyennganh })
      .sort({ ngaydang: -1 })
      .limit(5)
      .skip(skip)
      .populate('_nguoidang')
      .then((data) => {
        if (data.length < 1) {
          return res.send({ thongbao: 'Hết dữ liệu' });
        }
        res.send(data);
      });
  }
});

///lay tai khoan theo id
app.get('/laythongtintaikhoan/:id', (req, res) => {
  TaiKhoan.findOne({ _id: req.params.id })
    .populate('_congviecdadang')
    .exec(function (err, cv) {
      if (err) throw err;
      res.send(cv);
    });
});

//lay danh sach dang ky nha tuyen dung
app.get('/danhsachdangkynhatuyendung', (req, res) => {
  TaiKhoan.find()
    .where('trangthai')
    .equals('dangduyet')
    .then((cv) => res.send(cv));
});

//duyet nha tuyen dung
app.get('/duyetnhatuyendung/:id', (req, res) => {
  const { id } = req.params;
  TaiKhoan.findByIdAndUpdate(
    id,
    {
      $push: {
        noidungthongbao: {
          loai: 'duyetdangkynhatuyendung',
          thoigian: new Date().getTime(),
        },
      },
      $set: {
        trangthai: 'daduyet',
        kichhoatnhatuyendung: true,
        thongbao: true,
      },
    },
    { new: true }
  )
    .then((cv) => {
      guiMailDuyetDangKyNhaTuyenDung(cv.nhatuyendung.email, cv.hoten);
      io.emit('TAI_KHOAN_DA_DUOC_KICH_HOAT', id);
    })
    .then(() => {
      TaiKhoan.find()
        .where('trangthai')
        .equals('dangduyet')
        .then((cv) => res.send(cv));
    });
});

// TaiKhoan.update({ _id: _idTaiKhoan }, { $push: { _congviecdaungtuyen: _idCongViec } })
// .then((result) => {
//     CongViec.findOneAndUpdate({ _id: _idCongViec }, { $push: { _danhsachungtuyen: _idTaiKhoan }, $inc: { danop: 1 } })
//     .then(data => {
//         TaiKhoan.update({ _id: data._nguoidang }, {
//             $push: {
//                 noidungthongbao: {
//                     "loai": "conguoiungtuyen",
//                     "thoigian": new Date().getTime()
//                 }
//             },
//             $set: { thongbao: true }
//         }).then(data => res.send({ "thongbao": "OK" }))
//     })
// })

//cap nhat ho so
app.post('/capnhatthongtin', (req, res) => {
  const {
    chuyennganh,
    diachi,
    hinhanh,
    hoten,
    gioithieu,
    sodienthoai,
    truongdaihoc,
    _id,
    cv,
  } = req.body;
  if (cv) {
    if (hinhanh) {
      return TaiKhoan.findByIdAndUpdate(
        _id,
        {
          $set: {
            hotenthat: hoten,
            truongdaihoc: truongdaihoc,
            chuyennganh: chuyennganh,
            gioithieu: gioithieu,
            diachi: diachi,
            anhdaidien: hinhanh,
            sodienthoai: sodienthoai,
            hoanthienhoso: true,
            cv: cv,
          },
        },
        { new: true },
        function (err, tk) {
          if (err) return handleError(err);
          res.send(tk);
        }
      );
    } else {
      TaiKhoan.findByIdAndUpdate(
        _id,
        {
          $set: {
            hotenthat: hoten,
            truongdaihoc: truongdaihoc,
            chuyennganh: chuyennganh,
            gioithieu: gioithieu,
            diachi: diachi,
            sodienthoai: sodienthoai,
            hoanthienhoso: true,
            cv: cv,
          },
        },
        { new: true },
        function (err, tk) {
          if (err) return handleError(err);
          res.send(tk);
        }
      );
    }
  } else {
    if (hinhanh) {
      return TaiKhoan.findByIdAndUpdate(
        _id,
        {
          $set: {
            hotenthat: hoten,
            truongdaihoc: truongdaihoc,
            chuyennganh: chuyennganh,
            gioithieu: gioithieu,
            diachi: diachi,
            anhdaidien: hinhanh,
            sodienthoai: sodienthoai,
            hoanthienhoso: true,
          },
        },
        { new: true },
        function (err, tk) {
          if (err) return handleError(err);
          res.send(tk);
        }
      );
    } else {
      TaiKhoan.findByIdAndUpdate(
        _id,
        {
          $set: {
            hotenthat: hoten,
            truongdaihoc: truongdaihoc,
            chuyennganh: chuyennganh,
            gioithieu: gioithieu,
            diachi: diachi,
            sodienthoai: sodienthoai,
            hoanthienhoso: true,
          },
        },
        { new: true },
        function (err, tk) {
          if (err) return handleError(err);
          res.send(tk);
        }
      );
    }
  }
});

//------------DANG-KY-NHA-TUYEN-DUNG
app.post('/dangkynhatuyendung', (req, res) => {
  const {
    tencongty,
    trangthai,
    sodienthoai,
    email,
    diachi,
    website,
    linhvuchoatdong,
    gioithieu,
    _id,
    logo,
  } = req.body;
  if (!trangthai) {
    if (!logo) {
      return TaiKhoan.findByIdAndUpdate(
        _id,
        {
          $set: {
            'nhatuyendung.tencongty': tencongty,
            'nhatuyendung.sodienthoai': sodienthoai,
            'nhatuyendung.email': email,
            'nhatuyendung.diachi': diachi,
            'nhatuyendung.website': website,
            'nhatuyendung.linhvuchoatdong': linhvuchoatdong,
            'nhatuyendung.gioithieu': gioithieu,
            trangthai: 'dangduyet',
          },
        },
        { new: true }
      ).then((tk) => {
        guiMailDangKyNhaTuyenDung(tk.hoten, tk.nhatuyendung.tencongty);
        res.send(tk);
      });
    }
    if (logo) {
      return TaiKhoan.findByIdAndUpdate(
        _id,
        {
          $set: {
            'nhatuyendung.tencongty': tencongty,
            'nhatuyendung.sodienthoai': sodienthoai,
            'nhatuyendung.email': email,
            'nhatuyendung.diachi': diachi,
            'nhatuyendung.website': website,
            'nhatuyendung.linhvuchoatdong': linhvuchoatdong,
            'nhatuyendung.gioithieu': gioithieu,
            'nhatuyendung.logo': logo,
            trangthai: 'dangduyet',
          },
        },
        { new: true }
      ).then((tk) => {
        guiMailDangKyNhaTuyenDung(tk.hoten, tk.nhatuyendung.tencongty);
        res.send(tk);
      });
    }
  }
  if (!logo) {
    return TaiKhoan.findByIdAndUpdate(
      _id,
      {
        $set: {
          'nhatuyendung.tencongty': tencongty,
          'nhatuyendung.sodienthoai': sodienthoai,
          'nhatuyendung.email': email,
          'nhatuyendung.diachi': diachi,
          'nhatuyendung.website': website,
          'nhatuyendung.linhvuchoatdong': linhvuchoatdong,
          'nhatuyendung.gioithieu': gioithieu,
        },
      },
      { new: true }
    ).then((tk) => {
      guiMailDangKyNhaTuyenDung(tk.hoten, tk.nhatuyendung.tencongty);
      res.send(tk);
    });
  }
  if (logo) {
    return TaiKhoan.findByIdAndUpdate(
      _id,
      {
        $set: {
          'nhatuyendung.tencongty': tencongty,
          'nhatuyendung.sodienthoai': sodienthoai,
          'nhatuyendung.email': email,
          'nhatuyendung.diachi': diachi,
          'nhatuyendung.website': website,
          'nhatuyendung.linhvuchoatdong': linhvuchoatdong,
          'nhatuyendung.gioithieu': gioithieu,
          'nhatuyendung.logo': logo,
        },
      },
      { new: true }
    ).then((tk) => {
      guiMailDangKyNhaTuyenDung(tk.hoten, tk.nhatuyendung.tencongty);
      res.send(tk);
    });
  }
});

//them nguoi theo doi
app.get(
  '/themnguoitheodoi',
  (req, res) => {
    TaiKhoan.update(
      { _id: '5a5d55c4c9532a05ccfe051c' },
      { $push: { _congviecdanop: '5a5d6c9426e21714384ff1e6' } },
      (err, cv) => {
        console.log(cv);
        res.send({ thongbao: 'ok' });
      }
    );
  },
  (e) => {
    res.status(400).send(e);
  }
);

//---------------------------------nop ung tuyên

app.post('/ungtuyen', (req, res) => {
  const { _idCongViec, _idTaiKhoan } = req.body;
  var cv;
  TaiKhoan.findOneAndUpdate(
    { _id: _idTaiKhoan },
    { $push: { _congviecdaungtuyen: _idCongViec } }
  ).then((result) => {
    cv = result.cv;
    CongViec.findOneAndUpdate(
      { _id: _idCongViec },
      { $push: { _danhsachungtuyen: _idTaiKhoan }, $inc: { danop: 1 } }
    ).then((data) => {
      TaiKhoan.findOneAndUpdate(
        { _id: data._nguoidang },
        {
          $push: {
            noidungthongbao: {
              loai: 'conguoiungtuyen',
              thoigian: new Date().getTime(),
              idCongViec: data._id,
              idNguoiUngTuyen: _idTaiKhoan,
            },
          },
          $set: { thongbao: true },
        }
      ).then((data) => {
        guiMailCoNguoiUngTuyen(
          data.nhatuyendung.email,
          _idCongViec,
          _idTaiKhoan,
          data.hoten,
          cv
        );
        io.emit('CO_NGUOI_UNG_TUYEN', data._id);
        res.send({ thongbao: 'OK' });
      });
    });
  });
});

/////////////////////CONGVIEC HERE-------------------------

// them 1 cong viec
app.post('/themcongviec', (req, res) => {
  //tao va luu cong viec
  const congviec = new CongViec({
    tieude: req.body.tieude,
    diadiem: req.body.diadiem,
    chuyennganh: req.body.chuyennganh,
    kieu: req.body.kieu,
    chucvu: req.body.chucvu,
    luong: req.body.luong,
    trinhdo: req.body.trinhdo,
    kinhnghiem: req.body.kinhnghiem,
    soluong: req.body.soluong,
    thoihan: req.body.thoihan,
    mota: req.body.mota,
    _nguoidang: req.body._nguoidang,
    hinhanh: req.body.hinhanh,
  });
  console.log(congviec);
  congviec.save().then(
    (cv) => {
      //them id cua cong viec vao  _congviecdadang cua colection taikhoan
      TaiKhoan.update(
        { _id: req.body._nguoidang },
        { $push: { _congviecdadang: cv._id } },
        (err, cv) => {
          res.send({ thongbao: 'ok' });
        }
      );
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

//lay 3 cong viec trang chu

app.get('/trangchu', (req, res) => {
  CongViec.find()
    .sort({ ngaydang: -1 })
    .limit(3)
    .populate('_nguoidang')
    .then((data) => {
      res.send(data);
    });
});

//lay cong viec tuong tu
app.post('/congviectuongtu/', (req, res) => {
  CongViec.find({
    chuyennganh: req.body.chuyennganh,
  })
    .limit(3)
    .populate('_nguoidang')
    .then((data) => res.send(data));
});

//lay danh sach cong viec moi nhat theo trang
app.get('/danhsachcongviec/:sotrang', (req, res) => {
  const skip = (req.params.sotrang - 1) * 5;
  // CongViec.find().sort({ ngaydang: -1 }).limit(5).skip(skip).then((data) => {
  //     if(data.length < 1){
  //         return res.send({ thongbao: 'Hết dữ liệu' })
  //     }
  //     res.send(data);
  // })
  CongViec.find()
    .sort({ ngaydang: -1 })
    .limit(5)
    .skip(skip)
    .populate('_nguoidang')
    .then((data) => {
      if (data.length < 1) {
        return res.send({ thongbao: 'Hết dữ liệu' });
      }
      res.send(data);
    });
});

//lay danh sach cong viec moi nhat theo trang
app.get('/danhsachcongviecadmin/:sotrang', (req, res) => {
  const skip = (req.params.sotrang - 1) * 10;
  // CongViec.find().sort({ ngaydang: -1 }).limit(5).skip(skip).then((data) => {
  //     if(data.length < 1){
  //         return res.send({ thongbao: 'Hết dữ liệu' })
  //     }
  //     res.send(data);
  // })
  CongViec.find()
    .sort({ ngaydang: -1 })
    .limit(10)
    .skip(skip)
    .then((data) => {
      if (data.length < 1) {
        return res.send({ thongbao: 'Hết dữ liệu' });
      }
      res.send(data);
    });
});

///lay cong viec theo id

app.get('/congviec/:id', (req, res) => {
  CongViec.findOneAndUpdate({ _id: req.params.id }, { $inc: { luotxem: 1 } })
    .populate('_nguoidang')
    .then((data) => {
      res.send(data);
    });
});
//sua cong viec
app.post('/suacongviec', (req, res) => {
  const {
    tieude,
    diadiem,
    chuyennganh,
    kieu,
    chucvu,
    luong,
    trinhdo,
    kinhnghiem,
    soluong,
    thoihan,
    mota,
    _id,
  } = req.body;
  CongViec.findByIdAndUpdate(
    _id,
    {
      $set: {
        tieude,
        diadiem,
        chuyennganh,
        kieu,
        chucvu,
        luong,
        trinhdo,
        kinhnghiem,
        soluong,
        thoihan,
        mota,
      },
    },
    { new: true }
  )
    .then((data) =>
      CongViec.find()
        .where('_nguoidang')
        .equals(data._nguoidang)
        .sort({ ngaydang: -1 })
    )
    .then((data) => res.send(data));
});

//lay danh sach tin tuc admin
app.get('/danhsachtintuc', (req, res) => {
  TinTuc.find()
    .sort({ ngaydang: -1 })
    .then((data) => {
      res.send(data);
    });
});

//lay danh sach tin tuc da dang
app.get('/danhsachtintucdadang/:id', (req, res) => {
  TinTuc.find({ _nguoidang: req.params.id })
    .sort({ ngaydang: -1 })
    .then((data) => {
      res.send(data);
    });
});
//lay danh sach cong viec da dang
app.get('/danhsachcongviecdadang/:id', (req, res) => {
  CongViec.find({ _nguoidang: req.params.id })
    .populate('_nguoidang')
    .sort({ ngaydang: -1 })
    .then((data) => {
      res.send(data);
    });
});
//lay danh sach cong da nop
app.get('/danhsachcongviecdanop/:id', (req, res) => {
  const { id } = req.params;
  TaiKhoan.findById(id)
    .populate({ path: '_congviecdaungtuyen', populate: { path: '_nguoidang' } })
    .then((congviec) => {
      const data = congviec._congviecdaungtuyen;
      res.send(data);
    })
    .catch((e) => {
      res.status(400).send({ thongbao: 'Lỗi CSDL' });
    });
});
//lay danh sach ung vien da nop
app.get('/danhsachungtuyen/:id', (req, res) => {
  CongViec.findOne({ _id: req.params.id })
    .populate('_danhsachungtuyen')
    .then((data) => {
      res.send(data);
    });
});

//lay danh sach thành viên
app.get('/danhsachtaikhoan/', (req, res) => {
  TaiKhoan.find({}, {}, { sort: { created_at: -1 } }).then((data) => {
    res.send(data);
  });
});

//sửa khóa
app.post('/suakhoa', (req, res) => {
  const { _id, khoa } = req.body;
  if (khoa) {
    return TaiKhoan.findByIdAndUpdate(
      _id,
      {
        $set: {
          khoa: false,
        },
      },
      { new: true }
    )
      .then((data) => TaiKhoan.find().sort({ created_at: -1 }))
      .then((data) => res.send(data));
  }
  TaiKhoan.findByIdAndUpdate(
    _id,
    {
      $set: {
        khoa: true,
      },
    },
    { new: true }
  )
    .then((data) => TaiKhoan.find().sort({ created_at: -1 }))
    .then((data) => {
      io.emit('TAI_KHOAN_DA_BI_KHOA', _id);
      res.send(data);
    });
});

///lay tin tuc theo id

app.get('/tintuc/:id', (req, res) => {
  TinTuc.findOneAndUpdate({ _id: req.params.id }, { $inc: { luotxem: 1 } })
    .populate('_nguoidang')
    .then((data) => {
      res.send(data);
    });
});

// lay data tin tuc

app.get('/tintuc', (req, res) => {
  TinTuc.find()
    .sort({ ngaydang: -1 })
    .populate('_nguoidang')
    .then((data) => {
      res.send(data);
    });
});

//sửa tin tu
app.post('/suatintuc', (req, res) => {
  const { tieude, noidung, hinhanh, _id } = req.body;
  if (hinhanh) {
    return TinTuc.findByIdAndUpdate(
      _id,
      {
        $set: {
          tieude,
          noidung,
          hinhanh,
        },
      },
      { new: true }
    )
      .then((data) =>
        TinTuc.find()
          .where('_nguoidang')
          .equals(data._nguoidang)
          .sort({ ngaydang: -1 })
      )
      .then((data) => res.send(data));
  }
  TinTuc.findByIdAndUpdate(
    _id,
    {
      $set: {
        tieude,
        noidung,
      },
    },
    { new: true }
  )
    .then((data) =>
      TinTuc.find()
        .where('_nguoidang')
        .equals(data._nguoidang)
        .sort({ ngaydang: -1 })
    )
    .then((data) => res.send(data));
});

//xoa tin tuc
app.get('/xoatintuc/:id', (req, res) => {
  const id = req.params.id;
  TinTuc.findByIdAndRemove(id).then((data) => {
    TinTuc.find({ _nguoidang: data._nguoidang })
      .sort({ ngaydang: -1 })
      .then((data) => {
        res.send(data);
      });
  });
});
//xoa tin tuc admin
app.get('/xoatintucadmin/:id', (req, res) => {
  const id = req.params.id;
  TinTuc.findByIdAndRemove(id).then((data) => {
    TinTuc.find()
      .sort({ ngaydang: -1 })
      .then((data) => {
        res.send(data);
      });
  });
});

//xoa cong viec
app.get('/xoacongviec/:id', (req, res) => {
  const id = req.params.id;
  CongViec.findByIdAndRemove(id).then((data) => {
    CongViec.find({ _nguoidang: data._nguoidang })
      .sort({ ngaydang: -1 })
      .then((data) => {
        res.send(data);
      });
  });
});

//xoa cong viec admnin
app.get('/xoacongviecadmin/:id', (req, res) => {
  const id = req.params.id;
  CongViec.findByIdAndRemove(id).then((data) => {
    res.send(data);
  });
});

//them tin tuc
app.post('/themtintuc', (req, res) => {
  //tao va luu cong viec
  const tintuc = new TinTuc({
    tieude: req.body.tieude,
    noidung: req.body.noidung,
    hinhanh: req.body.hinhanh,
    _nguoidang: req.body._nguoidang,
  });
  console.log(tintuc);
  tintuc.save().then(
    (cv) => {
      //them id cua cong viec vao  _congviecdadang cua colection taikhoan
      TaiKhoan.update(
        { _id: req.body._nguoidang },
        { $push: { _tintucdadang: cv._id } },
        (err, cv) => {
          sendNotification(messageAndroid);
          sendNotification(messageWeb);

          res.send({ thongbao: 'ok' });
        }
      );
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

//lay danh sach thong bao
app.get('/xemthongbao/:id', (req, res) => {
  const { id } = req.params;
  TaiKhoan.findOneAndUpdate(
    { _id: id },
    { $set: { thongbao: false } },
    { new: true }
  ).then((taikhoan) => {
    res.send({ taikhoan });
  });
});

// TaiKhoan.find({}, {}, { sort: { 'created_at': -1 } }).then((data) => {
//     res.send(data);
// }){ sort: { 'noidungthongbao.thoigian': -1 } }

//-----------------------------------chay server----------------------------
server.listen(PORT, () => console.log('from 1995 with love'));
