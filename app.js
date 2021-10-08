if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const { session, sessionConfig } = require("./session");
const helmet = require("./helmet");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const app = express();
const orderRoutes = require("./router/orders");
const contactRoutes = require("./router/contact");
const usersRoutes = require("./router/users");
const productRoutes = require("./router/products");

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// app.use(helmet.helmet());
// app.use(helmet.contentSecurity);
app.use(session(sessionConfig));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.url = req.originalUrl;
	next();
});

//home
app.get("/", (req, res) => {
	const imgs = [
		"https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		"https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		"https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjR8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		"https://images.unsplash.com/photo-1541544741938-0af808871cc0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Njh8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
	];
	res.render("home", { imgs });
});
//orders
app.use("/order", orderRoutes);
//contact
app.use("/contact", contactRoutes);
//users
app.use("/api/products", productRoutes);

//error handling middleware
app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Oh No, Something Went Wrong!";
	res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on port ${port}!`);
});
