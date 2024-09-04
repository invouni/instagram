var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/error',(req,res) => {
  const errorCode = req.query.code;
  const errorMessage = req.query.message;
  res.render('error',{
    code: errorCode,
    message: errorMessage
  })
})
module.exports = router;
