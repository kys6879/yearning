var express = require('express');
var router = express.Router();
const mysql = require('../database/mysql.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ip = require("ip");
// 기타 express 코드

// 모든 유저 불러오기
router.get('/', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {
    // const users = await userService.getUsers();
    db.query('SELECT * FROM user', (err, rt, fields) => {
      result.status = true;
      result.message = rt;

      let data = {
        "data": rt[0]
      }
      res.status(200).json(data);
    })

  } catch (err) {
    result.status = true;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

const profileUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profile');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

// 유저 프사 가져오기
// 버퍼로 반환함
router.get('/profile', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {

    // 유저 프로필사진 파일 이름 불러오기
    db.query("SELECT profile_img FROM user WHERE email = ?", [req.user], (err, rt, fields) => {
      if (err) {
        result.status = false;
        result.message = err;
        console.log(err);
        res.status(500).json(result);
      }

      let fileName = rt[0].profile_img;
      let localAddress = ip.address();
      let resultPath = `http://${localAddress}:3000/${fileName}`;

      result.status = true;
      result.message = resultPath;
      res.status(200).json(result);
    });
  } catch (err) {
    result.status = false;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

// 프로필 사진 수정하기 
router.put('/upload/profile', profileUpload.single('img'), async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {
    console.log(req.file);
    db.query("UPDATE user SET  profile_img = ?  where email = ?", [req.file.filename, req.user], (err, rt, fields) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      res.status(200).json(req.file);
    })
  } catch (err) {
    result.status = false;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

// 목표시간 설정하기
router.put('/goaltime', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {

    let goalTime = req.body.goalTime
    console.log(goalTime);
    let userEmail = req.user;
    db.query("UPDATE user SET  goal_time = ? WHERE email = ?", [goalTime, userEmail], (err, rt, fields) => {
      if (err) {
        result.status = false;
        result.message = err;
        console.log(err);
        res.status(500).json(result);
      }

      result.status = true;
      result.message = "success";
      res.status(200).json(result);
    })
  } catch (err) {
    result.status = false;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

router.get('/token', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let email = req.user;
  console.log(email);
  try {
    const user = await userService.getUserByEmail(email);
    console.log(user);

    if (user.length == 0) {
      result.status = false;
      result.message = "Can't find User " + email;
      return res.status(409).json(result);
    } else {
      result.status = true;
      result.message = user[0];
      return res.status(200).json(result);
    }

  } catch (err) {
    console.log(err);
    result.status = true;
    result.message = err;
    return res.status(500).json(result);
  }
});

module.exports = router;