// INPORT LIBRARY
const Router = require("express").Router();

// INPORT CHILD ROUTES AND ASSETS
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth.routes");
const postRoutes = require("./posts.routes");
const userRoutes = require("./user.routes");
const commentRoutes = require("./comments.routes");
const storyRoutes = require("./story.routes");

// BIND ROUTES FROM DFFRENT FILE
Router.use("/auth/", authRoutes);
Router.use("/posts", authMiddleware, postRoutes);
Router.use("/user", authMiddleware, userRoutes);
Router.use("/comments", authMiddleware,commentRoutes );
Router.use("/story", authMiddleware, storyRoutes);

module.exports = Router;
