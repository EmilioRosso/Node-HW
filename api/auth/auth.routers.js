const { Router } = require("express");
const authController = require("./auth.controllers");

const authRouter = Router();

authRouter.post(
  "/register",
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
