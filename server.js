const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const contactsRouter = require("./api/contacts/contacts.router.js");

dotenv.config();

module.exports = class UserServer {
  constructor() {
    this.server = null;
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(cors({ orign: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
  }

  initListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  }

  start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    this.initListening();
  }
};
