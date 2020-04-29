const contactsModel = require("./contacts.models");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

async function getAllContacts(req, res, next) {
  try {
    const contacts = await contactsModel.find();
    res.status(200).json(contacts);
  } catch (error) {
    const newError = new CustomError(error.message);
    return res.status(404).send(newError.message);
  }
}

function validateGetContactById(req, res, next) {
  const getContactByIdRules = Joi.objectId(req.params.contactId);
  const validationResult = Joi.validate(
    req.params.contactId,
    getContactByIdRules
  );
  if (validationResult.error) {
    const newError = new CustomError(validationResult.error.details[0].message);
    return res.status(400).send(newError.message);
  }
  next();
}

async function getContactById(req, res, next) {
  try {
    const contact = await contactsModel.findById(req.params.contactId);
    res.status(200).json(contact);
  } catch (error) {
    const newError = new CustomError(error.message);
    return res.status(404).send(newError.message);
  }
}

function validateCreateContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const validationResult = Joi.validate(req.body, createContactRules);
  if (validationResult.error) {
    const newError = new CustomError(validationResult.error.details[0].message);
    return res.status(400).send(newError.message);
  }
  next();
}

async function createContact(req, res, next) {
  try {
    const newContact = await contactsModel.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    const newError = new CustomError(error.message);
    return res.status(400).send(newError.message);
  }
}

function validateUpdateContact(req, res, next) {
  const getContactByIdRules = Joi.objectId(req.params.contactId);
  const validationResult = Joi.validate(
    req.params.contactId,
    getContactByIdRules
  );
  if (validationResult.error) {
    const newError = new CustomError(validationResult.error.details[0].message);
    return res.status(400).send(newError.message);
  }
  next();
}

async function updateContact(req, res, next) {
  try {
    const updatedContact = await contactsModel.findByIdAndUpdate(
      req.params.contactId,
      { $set: req.body },
      { new: true }
    );
    res.status(201).json(updatedContact);
  } catch (error) {
    const newError = new CustomError(error.message);
    return res.status(400).send(newError.message);
  }
}

function validateDeleteContactById(req, res, next) {
  const getContactByIdRules = Joi.objectId(req.params.contactId);
  const validationResult = Joi.validate(
    req.params.contactId,
    getContactByIdRules
  );
  if (validationResult.error) {
    const newError = new CustomError(validationResult.error.details[0].message);
    return res.status(400).send(newError.message);
  }
  next();
}

async function deleteContactById(req, res, next) {
  try {
    const contact = await contactsModel.findByIdAndDelete(req.params.contactId);
    res.status(200).json(contact);
  } catch (error) {
    const newError = new CustomError(error.message);
    return res.status(404).send(newError.message);
  }
}

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports = {
  getAllContacts,
  validateCreateContact,
  createContact,
  validateGetContactById,
  getContactById,
  validateUpdateContact,
  updateContact,
  validateDeleteContactById,
  deleteContactById,
};
