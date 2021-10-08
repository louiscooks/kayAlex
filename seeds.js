const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose.connect("mongodb://localhost:27017/kayalex");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const seedDB = async () => {
	await Product.deleteMany({});
	const i = Product.insertMany([
		{
			name: "Chicken Parmasean",
			price: 15,
			description: "Fried chicken breast topped with parmesean cheese"
		},
		{
			name: "Lobster Bisque",
			price: 10.5,
			description:
				"Lobster chunks, heavy cream, tomato sauce, topped with parsley, salt and pepper."
		},
		{
			name: "Califlower Rice and Impossible Meatballs",
			price: 17.2,
			description:
				"chopped and fried cali flower, green onions, with impossible meat in the shape of meatballs."
		}
	]).then((res) => {
		console.log(res);
	});
	await i.save();
};
seedDB().then(() => {
	mongoose.connection.close();
});
