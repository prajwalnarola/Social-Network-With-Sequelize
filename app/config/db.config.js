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

// has RELATIONS (HasMany / HasOne)
db.user.hasMany(db.post, { as: "posts", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasOne(db.userProfile, { as: "userProfile", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.comment, { as: "comments", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.post.hasMany(db.comment, { as: "comments", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });


// belongsTO RELATION (BelongsTo / BelongsToMany)(foreign-key)
db.post.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.comment.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.comment.belongsTo(db.post, { as: "post", foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

module.exports = db