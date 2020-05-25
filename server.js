const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const usersRouter = require("./api/users/users.routers");
const authRouter = require("./api/auth/auth.routers");
const contactsRouter = require("./api/contacts/contacts.router");
const otpRouter = require("./api/otp/otp.routers");

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
    this.server.use(express.static("public"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
    this.server.use("/auth", authRouter);
    this.server.use("/users", usersRouter);
    this.server.use("/otp", otpRouter);
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
