const fs = require("fs");
const path = require("path");
const Joi = require("joi");

const { promises: fsPromises } = fs;

const contactsPath = path.resolve("db/contacts.json");

async function getUsersList(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    res.send(contacts);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    const contact = parsedContacts.filter(
      (elem) => elem.id === Number(req.params.contactId)
    );
    if (contact.length === 0) {
      res.status(404).send("No such contact");
    }
    res.send(contact[0]);
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
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    const newContact = {
      ...req.body,
      id: Math.floor(Math.random() * 100 + 10),
    };
    parsedContacts.push(newContact);
    console.log(parsedContacts);
    await fsPromises.writeFile(contactsPath, JSON.stringify(parsedContacts));
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    const index = parsedContacts.findIndex(
      (elem) => elem.id === Number(req.params.contactId)
    );
    if (index === -1) {
      next("No such contact");
    }
    parsedContacts.splice(index, 1);
    await fsPromises.writeFile(contactsPath, JSON.stringify(parsedContacts));
    res.status(201).send("Deleted sucsessfully");
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
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    const index = parsedContacts.findIndex(
      (elem) => elem.id === Number(req.params.contactId)
    );

    if (index === -1) {
      res.status(404).send("No such contact");
    }
    parsedContacts[index] = { ...parsedContacts[index], ...req.body };

    await fsPromises.writeFile(contactsPath, JSON.stringify(parsedContacts));
    res.status(201).send("Updated successfully");
  } catch (error) {
    next(error);
  }
}

function handleError(req, res, next) {
  const newError = new CustomError(req);
  return res.status(404).send(newError);
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
