const express = require("express");
const contactsRouter = require("./api/contacts/contacts.router");
const cors = require("cors");

require("dotenv").config();

class ContactsServer {
  constructor() {
    this.server = null;
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    //this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
  }

  initListening() {
    this.server.listen(process.env.PORT, () =>
      console.log(`Srever started at ${process.env.PORT}`)
    );
  }

  start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    this.initListening();
  }
}

module.exports = ContactsServer;
