const jwt = require("jsonwebtoken");

module.exports = {
  authentication: (req, res, next) => {
    if (req.headers.token) {
      const decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);

      if (decoded) {
        req.decoded = decoded;
        next();
      } else {
        res.status(401).json({
          message: "User not authenticated!",
        });
      }
    } else {
      res.status(401).json({
        message: "User not authenticated!",
      });
    }
  },
};
