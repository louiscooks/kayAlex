const mongoose = require("mongoose");
const dbUrl = process.env.xz || "mongodb://localhost:27017/kayalex";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

module.exports = { dbUrl };
