const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const contactsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes("@"),
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => value.length >= 10,
  },
});

const contactsModel = mongoose.model("Contacts", contactsSchema);

module.exports = contactsModel;
