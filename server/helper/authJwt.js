const jwt = require("jsonwebtoken");
const config = require("../config.json");

verifyToken = (req, res, next) => {
    console.log(" verify token function is called !!!!")
    let token = req.headers["x-access-token"];
    console.log(" verify token: ", token)
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.user = decoded.email;
      next();
    });
};

  const authJwt = {
    verifyToken: verifyToken,
  };
  module.exports = authJwt;