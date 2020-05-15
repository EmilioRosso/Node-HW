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
  } else {
    try {
      await usersModel.findByIdAndUpdate(req.user._id, {
        email: req.body.email || req.user.email,
        subscription: req.body.subscription || req.user.subscription,
      });
      if (req.file) {
        await usersModel.findByIdAndUpdate(req.user._id, {
          avatarURL: req.file.path || req.user.avatarURL,
        });
      }
      res.status(201).send("Updated successfully");
    } catch (error) {
      next(new CustomError(400, error.message));
    }
  }
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
