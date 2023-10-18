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
module.exports = db