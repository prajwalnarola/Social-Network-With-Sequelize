// INPORT LIBRARY
const Router = require("express").Router();

// INPORT CHILD ROUTES AND ASSETS
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth.routes");
const postRoutes = require("./posts.routes");
const userRoutes = require("./user.routes");
const commentRoutes = require("./comments.routes");
const storyRoutes = require("./story.routes");
const savedPostsRoutes = require("./savedPosts.routes");
const followRoutes = require("./follow.routes")

// BIND ROUTES FROM DFFRENT FILE
Router.use("/auth/", authRoutes);
Router.use("/posts", authMiddleware, postRoutes);
Router.use("/user", authMiddleware, userRoutes);
Router.use("/comments", authMiddleware,commentRoutes );
Router.use("/story", authMiddleware, storyRoutes);
Router.use("/savedPosts", authMiddleware, savedPostsRoutes);
Router.use("/follow", authMiddleware, followRoutes);

module.exports = Router;
