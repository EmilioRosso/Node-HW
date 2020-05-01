const { Router } = require("express");
const usersController = require("./users.controllers");

const usersRouter = Router();

usersRouter.get(
  "/current",
  usersController.checkToken,
  usersController.getCurrentUser,
  usersController.handleUserErrors
);

usersRouter.patch(
  "/",
  usersController.checkToken,
  usersController.updateCurrentUser,
  usersController.handleUserErrors
);

module.exports = usersRouter;
