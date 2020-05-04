const usersModel = require("../users/users.models");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");

const CustomError = require("../utils/errors");

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

async function getCurrentUser(req, res, next) {
  res
    .status(200)
    .json({ email: req.user.email, subscription: req.user.subscription });
}

async function updateCurrentUser(req, res, next) {
  if (req.body.password || req.body.token || req.body._id) {
    next(new CustomError(400, "You cannot change this properties"));
  }
  await usersModel.findByIdAndUpdate(req.user._id, {
    email: req.body.email || req.user.email,
    subscription: req.body.subscription || req.user.subscription,
  });

  res.status(201).send("Updated successfully");
}

function handleUserErrors(error, req, res, next) {
  res.status(error.status).send(error.message);
}

module.exports = {
  checkToken,
  getCurrentUser,
  updateCurrentUser,
  handleUserErrors,
};
