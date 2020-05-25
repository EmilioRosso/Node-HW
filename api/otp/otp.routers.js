const { Router } = require("express");
const otpController = require("./otp.controllers");

const otpRouter = Router();

otpRouter.post("/:otpCode", otpController.validateOtp, otpController.verifyOtp);

module.exports = otpRouter;
