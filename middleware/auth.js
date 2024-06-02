const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
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
    next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;
  return next();
};
