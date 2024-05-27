const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-error");
const {
  validateUserLogin,
  validateCreateUser,
} = require("../middleware/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use((req, res, next) => {
  // res
  //   .status(NOT_FOUND_ERROR)
  //   .send({ message: "Requested resource not found." });
  next(new NotFoundError("Requested resource not found."));
});

module.exports = router;
