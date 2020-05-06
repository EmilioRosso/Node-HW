const imagemin = require("imagemin");
const imageminJpegTran = require("imagemin-jpegtran");
const fs = require("fs");
const { promises: fsPromises } = fs;

const CustomError = require("./errors");

async function minifyImage(req, res, next) {
  try {
    await imagemin([req.file.path], {
      destination: "public/images",
      plugins: [imageminJpegTran()],
    });
    await fsPromises.unlink(req.file.path);
    req.file.destination = "images";
    req.file.path = `images/${req.file.filename}`;
    next();
  } catch (error) {
    next(new CustomError(500, "Image minification error"));
  }
}

module.exports = minifyImage;
