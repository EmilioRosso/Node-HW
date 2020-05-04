const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
  subscription: {
    type: String,
  },
});

contactsSchema.plugin(mongoosePaginate);

const contactsModel = mongoose.model("Contacts", contactsSchema);

module.exports = contactsModel;
