const contactsModel = require("./contacts.models");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const CustomError = require("../utils/errors");

async function getAllContacts(req, res, next) {
  try {
    let { page, limit, sub } = req.query;

    let contacts;
    if (page && limit) {
      const options = {
        page: page,
        limit: limit,
      };

      if (sub) {
        contacts = await contactsModel.paginate({ subscription: sub }, options);
      } else {
        contacts = await contactsModel.paginate({}, options);
      }
    } else {
      contacts = await contactsModel.find();

      if (sub) {
        contacts = await contactsModel.find({ subscription: sub });
      } else {
        contacts = await contactsModel.find();
      }
    }

    res.status(200).json(contacts);
  } catch (error) {
    next(new CustomError(404, error.message));
  }
}

function validateGetContactById(req, res, next) {
  const getContactByIdRules = Joi.objectId(req.params.contactId);
  const validationResult = Joi.validate(
    req.params.contactId,
    getContactByIdRules
  );
  if (validationResult.error) {
    next(new CustomError(400, validationResult.error.details[0].message));
  }
  next();
}

async function getContactById(req, res, next) {
  try {
    const contact = await contactsModel.findById(req.params.contactId);
    res.status(200).json(contact);
  } catch (error) {
    next(new CustomError(404, error.message));
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
    next(new CustomError(400, validationResult.error.details[0].message));
  }
  next();
}

async function createContact(req, res, next) {
  try {
    const newContact = await contactsModel.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(new CustomError(400, error.message));
  }
}

function validateUpdateContact(req, res, next) {
  const getContactByIdRules = Joi.objectId(req.params.contactId);
  const validationResult = Joi.validate(
    req.params.contactId,
    getContactByIdRules
  );
  if (validationResult.error) {
    next(new CustomError(400, validationResult.error.details[0].message));
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
    next(new CustomError(400, error.message));
  }
}

function validateDeleteContactById(req, res, next) {
  const getContactByIdRules = Joi.objectId(req.params.contactId);
  const validationResult = Joi.validate(
    req.params.contactId,
    getContactByIdRules
  );
  if (validationResult.error) {
    next(new CustomError(400, validationResult.error.details[0].message));
  }
  next();
}

async function deleteContactById(req, res, next) {
  try {
    const contact = await contactsModel.findByIdAndDelete(req.params.contactId);
    res.status(200).json(contact);
  } catch (error) {
    next(new CustomError(404, error.message));
  }
}

function handleErrors(error, req, res, next) {
  res.status = error.status;
  res.send(error.message);
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
  handleErrors,
};
