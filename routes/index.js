var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/web/board/:board_idx', function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {
    // const users = await userService.getUsers();
    let boardIdx = req.params.board_idx;

    db.query('SELECT * FROM board WHERE idx = ?', [boardIdx], (err, rt, fields) => {
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

router.get('/web/board', function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {
    // const users = await userService.getUsers();
    let boardIdx = req.params.board_idx;

    db.query('SELECT * FROM board WHERE user_email = ?', ["admin"], (err, rt, fields) => {
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