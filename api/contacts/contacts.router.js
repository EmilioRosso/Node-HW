const { Router } = require("express");
const contactsController = require("./contacts.controllers");

const contactsRouter = Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get(
  "/:contactId",
  contactsController.validateGetContactById,
  contactsController.getContactById
);

contactsRouter.post(
  "/",
  contactsController.validateCreateContact,
  contactsController.createContact
);

contactsRouter.delete(
  "/:contactId",
  contactsController.validateDeleteContactById,
  contactsController.deleteContactById
);

contactsRouter.patch(
  "/:contactId",
  contactsController.validateUpdateContact,
  contactsController.updateContact
);

module.exports = contactsRouter;
