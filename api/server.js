const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const loggedInCheck = require("./auth/logInCheckMiddlware.js");

const sessionConfig = {
  name: "chads session cookie",
  secret: "i have the best cats",
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false, // NOTE this is normally true if you are using https
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require("../database/connection.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60 * 60 * 1000,
  }),
};

const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", loggedInCheck, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
