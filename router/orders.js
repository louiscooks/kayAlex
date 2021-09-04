const express = require("express");
const stripe = require("stripe")(
	"sk_test_51JUBZDG72pKMNak9237V1dg8WThCznq63Putf6OdFKvtYvvi4Sym8Rt08Rsemvn57wZxWA02lt3g6E4IYZT05Mxn00rU21Tu64"
);
const router = express.Router();
const dateformat = require("../date/DateFormat");
const timeFromNow = require("../utils/timeFromNow");

router.get("", (req, res) => {
	res.render("orders/create");
});

router.get("/checkout", (req, res) => {
	res.render("orders/checkout");
});

router.post("/testing", async (req, res) => {
	res.json({ foo: "bar" });
});

module.exports = router;
