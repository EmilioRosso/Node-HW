const { Router } = require("express");
const usersController = require("./users.controllers");
const upload = require("../utils/multerMiddleware");
const minifyImage = require("../utils/imageminMiddleware");

const usersRouter = Router();

usersRouter.get(
  "/current",
  usersController.checkToken,
  usersController.getCurrentUser,
  usersController.handleUserErrors
);

usersRouter.patch(
  "/",
  upload.single("avatar"),
  minifyImage,
  usersController.checkToken,
  usersController.updateCurrentUser,
  usersController.handleUserErrors
);

module.exports = usersRouter;
