const Joi = require("joi");
const otpGenerator = require("otp-generator");

const usersModel = require("../users/users.models");
const CustomError = require("../utils/errors");

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
  next();
}

async function verifyOtp(req, res, next) {
  const { email } = req.body;

  const existingUser = await usersModel.findOne({ email });

  if (!existingUser) {
    next(new CustomError(404, "No such user"));
  }
  const isOTPvalid = existingUser.otpCode === parseInt(req.params.otpCode);

  if (isOTPvalid) {
    await usersModel.findByIdAndUpdate(existingUser._id, { registered: true });
  } else {
    await usersModel.findByIdAndUpdate(existingUser._id, { otpCode: otpCode });
    next(new CustomError(40, "Your OTP code is invalid"));
  }

  res.status(200).send("User email confirmed");
}

module.exports = { validateOtp, verifyOtp };
