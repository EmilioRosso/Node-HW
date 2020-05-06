const { Router } = require("express");
const authController = require("./auth.controllers");
const upload = require("../utils/multerMiddleware");
const minifyImage = require("../utils/imageminMiddleware");

const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  minifyImage,
  authController.validateRegisterUser,

  authController.registerUser,
  authController.handleUserErrors
);

authRouter.post(
  "/login",
  authController.validateLogIn,
  authController.LogIn,
  authController.handleUserErrors
);

authRouter.post(
  "/logout",
  authController.checkToken,
  authController.LogOut,
  authController.handleUserErrors
);

module.exports = authRouter;
