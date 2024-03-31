const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
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
          return res
            .status(BAD_REQUEST_ERROR)
            .send({ message: "Invalid data" });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "A user with this e-mail already exists!" });
        }
        return res
          .status(SERVER_ERROR)
          .send({ message: "An error has occured on the server" });
      });
  });
};

const login = (req, res) => {
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
        return res.status(UNAUTHORIZED_ERROR).send({ message: "Invalid data" });
      }
      return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumetNotFound") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { login, updateUser, createUser, getCurrentUser };
