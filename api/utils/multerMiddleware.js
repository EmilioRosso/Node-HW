const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "temp",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, file.fieldname + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
