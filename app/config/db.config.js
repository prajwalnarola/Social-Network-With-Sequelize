require("dotenv").config();
const Sequelize = require("sequelize");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = ""

const sequelize = new Sequelize(dbName, dbUser, dbPassword,{
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model")(sequelize, Sequelize);
db.userProfile = require("../models/userProfile.model")(sequelize, Sequelize);
db.post = require("../models/posts.model")(sequelize, Sequelize);
db.comment = require("../models/comments.model")(sequelize, Sequelize);
db.like = require("../models/likes.model")(sequelize, Sequelize);
db.story = require("../models/story.model")(sequelize, Sequelize);
db.storyLikes = require("../models/storylikes.model")(sequelize, Sequelize);
db.storyViewers = require("../models/storyViewers.model")(sequelize, Sequelize);
db.savedPosts = require("../models/savedPosts.model")(sequelize,Sequelize);
db.follow = require("../models/follow.model")(sequelize, Sequelize);

// has RELATIONS (HasMany / HasOne)
db.user.hasMany(db.post, { as: "posts", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasOne(db.userProfile, { as: "userProfile", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.comment, { as: "comments", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.post.hasMany(db.comment, { as: "comments", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.like, { as: "like", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.post.hasMany(db.like, { as: "like", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.story, { as: "story", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.storyLikes, { as: "storyLikes", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.story.hasMany(db.storyLikes, { as: "storyLikes", foreignKey: "story_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.storyViewers, { as: "storyViewers", foreignKey: "viewer_user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.story.hasMany(db.storyViewers, { as: "storyViewers", foreignKey: "story_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.savedPosts, { as: "savedPosts", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.post.hasMany(db.savedPosts, { as: "savedPosts", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.follow, { as: "followers", foreignKey: "follower_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.follow, { as: "following", foreignKey: "following_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

// belongsTO RELATION (BelongsTo / BelongsToMany)(foreign-key)
db.post.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.comment.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.comment.belongsTo(db.post, { as: "post", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.like.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.like.belongsTo(db.post, { as: "post", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.story.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.storyLikes.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.storyLikes.belongsTo(db.story, { as: "story", foreignKey: "story_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.storyViewers.belongsTo(db.user, { as: "user", foreignKey: "viewer_user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.storyViewers.belongsTo(db.story, { as: "story", foreignKey: "story_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.savedPosts.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.savedPosts.belongsTo(db.post, { as: "post", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.follow.belongsTo(db.user, { as: "follower", foreignKey: "follower_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.follow.belongsTo(db.user, { as: "following", foreignKey: "following_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });


module.exports = db