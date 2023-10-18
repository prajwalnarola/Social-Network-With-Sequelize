// INPORT LIBRARY
const Router = require("express").Router();

// INPORT CHILD ROUTES AND ASSETS
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

// BIND ROUTES FROM DFFRENT FILE
Router.use("/auth/", authRoutes);
Router.use("/user", userRoutes);

module.exports = Router;
