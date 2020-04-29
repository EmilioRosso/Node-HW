const express = require("express");
const contactsRouter = require("./api/contacts/contacts.router");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

class ContactsServer {
  constructor() {
    this.server = null;
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(bodyParser.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
  }

  async initDB() {
    try {
      await mongoose.connect(process.env.MONGODB_LINK);
      console.log("Database connection successful");
    } catch (error) {
      console.log("Database connection ERROR");
      process.exit(1);
    }
  }

  initListening() {
    this.server.listen(process.env.PORT, () =>
      console.log(`Srever started at ${process.env.PORT}`)
    );
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initDB();
    this.initRoutes();
    this.initDB();
    this.initListening();
  }
}

module.exports = ContactsServer;
