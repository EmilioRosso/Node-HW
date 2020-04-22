const fs = require("fs");
const path = require("path");
const Joi = require("joi");

const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "api/contacts/contacts.json");

function getUsersList(req, res, next) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => res.json(data))
    .catch((error) => error);
}

function getContactById(req, res, next) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((contacts) => contacts.filter((elem) => elem.id === req.params.id))
    .then((data) => res.json(data))
    .catch((error) => error);
}

function validateCreateContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phoe: Joi.number().required(),
  });
  const validationResult = WebKitPoint.validate(req.body, createContactRules);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }
  next();
}

function createContact(req, res, next) {
  fsPromises
    .appendFile(contactsPath, {
      ...req.body,
      id: Math.floor(Math.random() * 100 + 10),
    })
    .then(res.status(201).send())
    .catch((error) => error);
}

function deleteContact(req, res, next) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((contacts) => {
      const index = contacts.indexOf((elem) => elem.id === req.params.id);
      const newContacts = contacts.splice(index, 1);
      fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
    })
    .catch((error) => error);
}

function validateUpdateContact(req, res, next) {
  const updateContactRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.number(),
  });
  const validationResult = WebKitPoint.validate(req.body, updateContactRules);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }
  next();
}

function updateContact(req, res, next) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((contacts) => {
      const index = contacts.indexOf((elem) => elem.id === req.params.id);
      contacts[index] = { ...contacts[index], ...req.body };
      fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
    })
    .catch((error) => error);
}

module.exports = {
  getUsersList,
  getContactById,
  validateCreateContact,
  createContact,
  deleteContact,
  validateUpdateContact,
  updateContact,
};
