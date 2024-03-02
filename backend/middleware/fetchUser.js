//add jwt = token generation
var jwt = require("jsonwebtoken");
// Secret ID for token generation
require("dotenv").config();
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET;

const fetchUser = (req, res, next) => {
  //get user from the jwt token and add id to request object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }

  try {
    // if validated, this would return decoded object
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchUser;
