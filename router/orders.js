const express = require("express");
const router = express.Router();
const dateformat = require("../date/DateFormat");
const timeFromNow = require("../utils/timeFromNow");
router.get("", (req, res) => {
	const times = timeFromNow();
	res.render("orders/create", { times });
});

module.exports = router;
