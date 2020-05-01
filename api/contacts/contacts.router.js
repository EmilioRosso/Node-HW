const { Router } = require("express");
const contactsController = require("./contacts.controllers");

const contactsRouter = Router();

contactsRouter.get(
  "/",
  contactsController.getAllContacts,
  contactsController.handleErrors
);

contactsRouter.get(
  "/:contactId",
  contactsController.validateGetContactById,
  contactsController.getContactById,
  contactsController.handleErrors
);

contactsRouter.post(
  "/",
  contactsController.validateCreateContact,
  contactsController.createContact,
  contactsController.handleErrors
);

contactsRouter.delete(
  "/:contactId",
  contactsController.validateDeleteContactById,
  contactsController.deleteContactById,
  contactsController.handleErrors
);

contactsRouter.patch(
  "/:contactId",
  contactsController.validateUpdateContact,
  contactsController.updateContact,
  contactsController.handleErrors
);

module.exports = contactsRouter;
