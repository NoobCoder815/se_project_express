const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const Error = require("../errors/error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res
          .status(201)
          .send({ name: user.name, avatar: user.avatar, email: user.email }),
      )
      .catch((err) => {
        if (err.name === "ValidationError") {
          // return res
          //   .status(BAD_REQUEST_ERROR)
          //   .send({ message: "Invalid data" });
          return next(new BadRequestError("Invalid data"));
        }
        if (err.code === 11000) {
          // return res
          //   .status(CONFLICT_ERROR)
          //   .send({ message: "A user with this e-mail already exists!" });
          return next(
            new ConflictError("A user with this e-mail already exists!"),
          );
        }
        // return res
        //   .status(SERVER_ERROR)
        //   .send({ message: "An error has occured on the server" });
        next(err);
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "our-little-secret",
          {
            expiresIn: "7d",
          },
        );
        return res.status(200).send({ token });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        // return res.status(UNAUTHORIZED_ERROR).send({ message: "Invalid data" });
        return next(new UnauthorizedError("Unauthorized"));
      }
      // return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    // .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      // if (err.name === "DocumentNotFoundError") {
      //   return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        return next(
          new BadRequestError("The ID string is in an invalid format"),
        );
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    // .orFail()
    .then((users) => {
      if (!users) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      // if (err.name === "DocumetNotFound") {
      //   return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // }
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

module.exports = { login, updateUser, createUser, getCurrentUser };
