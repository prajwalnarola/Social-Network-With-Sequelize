const express = require("express");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const db = require("./app/config/db.config");
//Create table if not exists
db.sequelize.sync();

// app.use("/demo", (req, res)=>{
//     console.log("Recieved request");
//     res.status(200).send("As an captain of team India/Bharat Rohit sharma lifted ICC 2023 ODI worldcup trophy");
// });

// ENABLE ALL ROUTES FROM OTHER FILE WHICH IS LOCATED IN app/index.js
app.use("/", require("./app/routes"));

// SERVER WITH PORT
const PORT = 3000
const Server = app.listen(PORT, ()=>{
    console.log(`Server Started on http://localhost:${PORT}/`);
});