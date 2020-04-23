const fs = require("fs");
const path = require("path");
const Joi = require("joi");

const { promises: fsPromises } = fs;

const contactsPath = path.resolve("api/contacts/contacts.json");

async function getUsersList(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    res.json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const contact = contacts.filter((elem) => elem.id === req.params.id);
    res.json(contact);
  } catch (error) {
    next(error);
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
    next(error.message);
  }
  next();
}

async function createContact(req, res, next) {
  try {
    const newContact = JSON.stringify({
      ...req.body,
      id: Math.floor(Math.random() * 100 + 10),
    });
    await fsPromises.appendFile(contactsPath, newContact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const index = contacts.indexOf((elem) => elem.id === req.params.id);
    const newContacts = contacts.splice(index, 1);
    await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
  } catch (error) {
    next(error);
  }
}

function validateUpdateContact(req, res, next) {
  const updateContactRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });
  const validationResult = Joi.validate(req.body, updateContactRules);
  if (validationResult.error) {
    next(error.message);
  }
  next();
}

async function updateContact(req, res, next) {
  try {
    const contacts = fsPromises.readFile(contactsPath, "utf-8");
    const index = contacts.indexOf((elem) => elem.id === req.params.id);
    contacts[index] = { ...contacts[index], ...req.body };
    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (error) {
    next(error);
  }
}

function handleError(req, res, next) {
  // console.log(req.status);
  // console.log(error);
  const newError = new CustomError(error.message);
  return res.status(404).send(newError.message);
}

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports = {
  getUsersList,
  getContactById,
  validateCreateContact,
  createContact,
  deleteContact,
  validateUpdateContact,
  updateContact,
  handleError,
};
