const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-error");
const NoAccessError = require("../errors/no-access-error");
const NotFoundError = require("../errors/not-found-error");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    // .populate("owner")
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        // return res
        //   .status(NO_ACCESS_ERROR)
        //   .send({ message: "Can not delete this item!" });
        return next(new NoAccessError("Can not delete this item!"));
      }
      return clothingItem
        .findByIdAndRemove(itemId)
        .then(() =>
          res.status(200).send({ message: `${itemId} has been deleted` }),
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found!"));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

const likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    // .populate("owner")
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found!"));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    // .populate("owner")
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found!"));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
