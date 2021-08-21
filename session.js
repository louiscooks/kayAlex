const session = require('express-session')
const secret = process.env.SECRET || "thisisnotagoodsecret";

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
module.exports = session(sessionConfig)