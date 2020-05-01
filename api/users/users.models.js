const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes("@"),
  },
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

const usersModel = mongoose.model("Users", usersSchema);

module.exports = usersModel;
