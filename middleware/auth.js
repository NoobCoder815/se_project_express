const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const { UNAUTHORIZED_ERROR } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.err;
    res.status(UNAUTHORIZED_ERROR).send({ message: "Authorization Required" });
  }

  req.user = payload;
  next();
};
