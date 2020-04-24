const fs = require("fs");
const path = require("path");

const { promises: fsPromises } = fs;

const contactsPath = path.resolve("./db/contacts.json");

// TODO: задокументировать каждую функцию
function listContacts() {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => console.table(data))
    .catch((err) => err);
}

function getContactById(contactId) {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => data.filter((elem) => elem.id === contactId))
    .then((res) => console.log(res[0]))
    .catch((err) => err);
}

function removeContact(contactId) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => data.filter((elem) => elem.id !== contactId))
    .then((res) => fsPromises.writeFile(contactsPath, JSON.stringify(res)))
    .catch((err) => err);
}

function addContact(name, email, phone) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => {
      data.push({
        id: Math.floor(Math.random() * 100 + 10),
        name,
        email,
        phone,
      });
      return data;
    })
    .then((res) => fsPromises.writeFile(contactsPath, JSON.stringify(res)));
}

module.exports = {
  contactsPath,
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
