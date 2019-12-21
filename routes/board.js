var express = require('express');
var router = express.Router();
const mysql = require('../database/mysql.js');
const multer = require('multer');
const path = require('path');

// 기타 express 코드

// 모든 게시물 불러오기
router.get('/', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  console.log(req.user);
  try {
    // const users = await userService.getUsers();

    db.query('SELECT * FROM board WHERE user_email = ? ', [req.user], (err, rt, fields) => {
      if (err) {
        result.status = true;
        result.message = err;
        console.log(err);
        res.status(500).json(result);
      }
      result.status = true;
      result.message = rt;
      console.log(result);
      res.status(200).json(result);
    })
  } catch (err) {
    result.status = true;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/img');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

// 글쓰기
router.post('/', upload.array('img', 10), async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {

    let idx = new Date().valueOf();
    let userEmail = req.user;
    let title = req.body.title;
    let description = req.body.description;
    let goalTime = req.body.goalTime;
    let fileLength = req.files.length;
    let imgList = ""
    for (let i = 0; i < fileLength; i++) {
      if (i == fileLength - 1) {
        imgList += req.files[i].filename;
      } else {
        imgList += req.files[i].filename + ",";
      }
    }

    console.log(idx);
    console.log(userEmail);
    console.log(title);
    console.log(description);
    console.log(goalTime);
    console.log(req.files);
    // 글 쓰고
    db.query('INSERT INTO board (idx,user_email,title,description,goal_time,img) values (?,?,?,?,?,?)', [idx, userEmail, title, description, goalTime, imgList], (err, rt, fields) => {
      if (err) {
        result.status = false;
        result.message = err;
        console.log(err);
        res.status(500).json(result);
      }
      // 글의 목표 시간을 파싱
      let goalTimeSpl = goalTime.split(":");
      let goalSec = (+goalTimeSpl[0]) * 60 * 60 + (+goalTimeSpl[1]) * 60 + (+goalTimeSpl[2]);
      console.log("goalSec :", goalSec);

      db.query('SELECT together_time FROM user ', (err, rt, fields) => {
        // 나의 함께한 시간 파싱
        let togetTime = rt[0].together_time;
        let togetTImeSpl = togetTime.split(":");
        let togetSec = (+togetTImeSpl[0]) * 60 * 60 + (+togetTImeSpl[1]) * 60 + (+togetTImeSpl[2]);
        console.log("togetSec :", togetSec);

        console.log(togetTImeSpl);

        let totalSec = goalSec + togetSec;
        console.log("totalSec :", totalSec);


        let totalDate = new Date(totalSec * 1000).toISOString().substr(11, 8);

        console.log(totalDate);


        db.query('UPDATE user SET together_time = ? where email = ?', [totalDate, req.user], (err, rt, fields) => {

          if (err) {
            result.status = false;
            result.message = err;
            console.log(err);
            res.status(500).json(result);
          }

          result.status = true;
          result.message = idx;
          res.status(200).json(result);

        });
      });
    });

  } catch (err) {
    result.status = false;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

// 특정 게시물 불러오기
router.get('/:board_idx', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  console.log(req.user);
  try {
    // const users = await userService.getUsers();
    let boardIdx = req.params.board_idx;

    db.query('SELECT * FROM board WHERE user_email = ? AND idx = ?', [req.user, boardIdx], (err, rt, fields) => {
      if (err) {
        result.status = true;
        result.message = err;
        console.log(err);
        res.status(500).json(result);
      }
      result.status = true;
      result.message = rt;
      console.log(result);
      res.status(200).json(result);
    })
  } catch (err) {
    result.status = true;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});



module.exports = router;