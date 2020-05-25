const Joi = require("joi");
import { authenticator } from "otplib";

const usersModel = require("../users/users.models");
const CustomError = require("../utils/errors");

require("dotenv").config();

const otpCode = otpGenerator.generate(4, {
  digits: true,
  upperCase: false,
  alphabets: false,
  specialChars: false,
});

function validateOtp(req, res, next) {
  const otpRules = Joi.object({
    email: Joi.string().required(),
  });

  const validationResult = Joi.validate(req.body, otpRules);
  if (validationResult.error) {
    next(new CustomError(404, "Email required"));
  }

  try {
    const isValid = authenticator.check(
      req.params.otpCode,
      process.env.OTP_SECRET
    );
  } catch (error) {
    next(new CustomError(400, "Your OTP code is invalid"));
  }
  next();
}

async function verifyOtp(req, res, next) {
  try {
    const { email } = req.body;

    const existingUser = await usersModel.findOne({ email });

    if (!existingUser) {
      next(new CustomError(404, "No such user"));
    }

    const isOTPvalid = existingUser.otpCode === parseInt(req.params.otpCode);

    if (isOTPvalid) {
      await usersModel.findByIdAndUpdate(existingUser._id, {
        registered: true,
        otpCode: null,
      });
    } else {
      await usersModel.findByIdAndUpdate(existingUser._id, {
        otpCode: otpCode,
      });
      next(new CustomError(400, "Your OTP code is invalid"));
    }

    res.status(200).send("User email confirmed");
  } catch (err) {
    next(new CustomError(400, "Your OTP code is invalid"));
  }
}

module.exports = { validateOtp, verifyOtp };
