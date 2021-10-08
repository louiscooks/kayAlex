const session = require("express-session");
const { dbUrl } = require("./database");
// const MongoStore = require("connect-mongo");

const secret = process.env.SECRET || "thisisnotagoodsecret";

// const store = MongoStore.create({
// 	mongoUrl: dbUrl,
// 	secret,
// 	touchAfter: 24 * 60 * 60
// });

// store.on("error", function (e) {
// 	console.log("SESSION STORE ERROR", e);
// });

const sessionConfig = {
	name: "sess",
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

module.exports = { session, sessionConfig };
