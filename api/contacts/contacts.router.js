const { Router } = require("express");
const contactsController = require("./contacts.controller");

const contactsRouter = Router();

contactsRouter.get(
  "/",
  contactsController.getUsersList,
  contactsController.handleError
);

contactsRouter.get(
  "/:contactId",
  contactsController.getContactById,
  contactsController.handleError
);

contactsRouter.post(
  "/",
  contactsController.validateCreateContact,
  contactsController.createContact,
  contactsController.handleError
);

contactsRouter.delete(
  "/:contactId",
  contactsController.deleteContact,
  contactsController.handleError
);

contactsRouter.patch(
  "/:contactId",
  contactsController.validateUpdateContact,
  contactsController.updateContact,
  contactsController.handleError
);

module.exports = contactsRouter;
