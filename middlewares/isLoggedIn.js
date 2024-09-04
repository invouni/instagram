const jwt = require('jsonwebtoken');
let config = require('../src/config/config.js');
const JWT_SECRET = config["JWT_SECRET"]; 
// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).redirect('/error?code=401&message=No Token Authorization Denied');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.cookie("user",decoded.username)
    next(); 
  } catch (err) {
    res.status(401).redirect('/error?code=401&message=Token Authorization Denied');
    return ;
  }
};

module.exports = isLoggedIn;