const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
// const { UNAUTHORIZED_ERROR } = require("../utils/errors");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res
    //   .status(UNAUTHORIZED_ERROR)
    //   .send(console.log({ message: "Authorization Required" }));
    throw new (UnauthorizedError("Authoriztion Required"))();
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "our-little-secret",
    );
  } catch (err) {
    console.error(err);
    // return res
    //   .status(UNAUTHORIZED_ERROR)
    //   .send(console.log({ message: "Authorization Required" }));
    next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;
  return next();
};
