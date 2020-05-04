const usersModel = require("../users/users.models");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CustomError = require("../utils/errors");

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

async function registerUser(req, res, next) {
  try {
    let { email, password, subscription } = req.body;
    const existingUser = await usersModel.findOne({ email });

    if (existingUser) {
      next(new CustomError(400, "Email in use"));
    }

    const costFactor = 4;
    password = await bcrypt.hash(password, costFactor);
    const newUser = await usersModel.create({
      email,
      password,
      subscription,
      token: null,
    });

    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      subscription: newUser.subscription,
    });
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
      console.log("hoy");
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
