const contacts = require("./contacts");

const argv = require("yargs")
  .command(
    "list",
    "list of all contacts",
    (yargs) => {},
    (args) => {}
  )
  .command(
    "get",
    "get contact by ID",
    (yargs) => {},
    (args) => {}
  )
  .command(
    "add",
    "add new contact",
    (yargs) => {},
    (args) => {}
  )
  .command(
    "remove",
    "remove contact",
    (yargs) => {},
    (args) => {}
  ).argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contacts.listContacts();
      break;

    case "get":
      console.log(contacts.getContactById(id));
      break;

    case "add":
      console.log(contacts.addContact(name, email, phone));
      break;

    case "remove":
      console.table(contacts.removeContact(id));
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
