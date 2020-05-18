const usersModel = require("../users/users.models");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const CustomError = require("../utils/errors");
const otpControllers = require("../otp/otp.controllers");

require("dotenv").config();

function validateRegisterUser(req, res, next) {
  const registerUserRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
  });
  const validationResult = Joi.validate(req.body, registerUserRules);
  if (validationResult.error) {
    next(new CustomError(422, "Missing required fields"));
  }
  next();
}

async function sendOTP(userEmail, userOTP) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_LOGIN,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: `${process.env.MAIL_LOGIN}@gmail.com`,
    to: userEmail,
    subject: "Please, verify your email",
    html: `<div>
  <h1>Please, verify your Email adress</h1>
  <p>Your can do it by sending POST to <a href='http://localhost:3000/otp/${userOTP}'>page</a> including your email adress</p>
<h2>${userOTP}</h2>
  </div>`,
  };

  const result = await transporter.sendMail(mailOptions);
}

async function registerUser(req, res, next) {
  try {
    let { email, password, subscription } = req.body;
    const existingUser = await usersModel.findOne({ email });

    if (existingUser) {
      next(new CustomError(400, "Email in use"));
    } else {
      const costFactor = 4;
      password = await bcrypt.hash(password, costFactor);

      const otpCode = otpGenerator.generate(4, {
        digits: true,
        upperCase: false,
        alphabets: false,
        specialChars: false,
      });

      const newUser = await usersModel.create({
        email,
        password,
        subscription,
        avatarURL: `http://localhost:${process.env.PORT}/${req.file.path}`,
        token: null,
        otpCode,
      });

      const emailResult = await sendOTP(email, otpCode, next);
      console.log(emailResult);

      res.status(201).json({
        id: newUser._id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      });
    }
  } catch (error) {
    next(new CustomError(400, error.message));
  }
}

function validateLogIn(req, res, next) {
  const registerUserRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const validationResult = Joi.validate(req.body, registerUserRules);
  if (validationResult.error) {
    next(new CustomError(400, validationResult.error.details[0].message));
  }
  next();
}

async function LogIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const existingUser = await usersModel.findOne({ email });
    if (!existingUser) {
      next(new CustomError(400, "User not found"));
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      next(new CustomError(400, "Неверный логин или пароль"));
    }
    const token = await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET
    );

    await usersModel.findByIdAndUpdate(existingUser._id, { token });

    res.status(200).json(token);
  } catch (error) {
    next(new CustomError(400, error.message));
  }
}

async function LogOut(req, res, next) {
  try {
    await usersModel.findOneAndUpdate(req.user.token, { token: null });
    res.status(200).send("Logout success");
  } catch (error) {
    next(new CustomError(400, error.message));
  }
}

async function checkToken(req, res, next) {
  try {
    let { authorization: token } = req.headers;
    if (!token) {
      next(new CustomError(401, "Not authorized"));
    }
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token);
    const existingUser = await usersModel.findById(decoded.id);
    if (!existingUser) {
      next(new CustomError(400, "User not found"));
    }

    req.user = existingUser;
    next();
  } catch (error) {
    next(new CustomError(401, "Not authorized"));
  }
}

function handleUserErrors(error, req, res, next) {
  res.status(error.status).send(error.message);
}

module.exports = {
  validateRegisterUser,
  registerUser,
  validateLogIn,
  LogIn,
  LogOut,
  checkToken,
  handleUserErrors,
};
