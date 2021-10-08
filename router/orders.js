const express = require("express");
// const stripe = require("stripe")(
// 	"sk_test_51JUBZDG72pKMNak9237V1dg8WThCznq63Putf6OdFKvtYvvi4Sym8Rt08Rsemvn57wZxWA02lt3g6E4IYZT05Mxn00rU21Tu64"
// );
const router = express.Router();
const dateformat = require("../date/DateFormat");
const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");

function updateOneCartDetails(req, product, qty) {
	let temp = req.session.cart.subtotal;
	req.session.cart.subtotal = temp + qty * product.price;
	req.session.cart.tax = req.session.cart.subtotal * 0.075;
	req.session.cart.total = req.session.cart.tax + req.session.cart.subtotal;
	let tempQty = 0;
	for (let i = 0; i < req.session.cart.cartItems.length; i++) {
		let a = req.session.cart.cartItems[i].qty;
		tempQty += a;
	}
	req.session.cart.totalQty = tempQty;
	req.session.save(function (err) {
		if (err) console.log("Error adding product to cart", err);
		console.log("product successfully added to cart!", req.session.cart);
		return;
	});
}
function removeOneCartDetails(req, removedProduct) {
	let temp = req.session.cart.subtotal;
	req.session.cart.subtotal = temp - removedProduct.price;
	req.session.cart.tax = req.session.cart.subtotal * 0.075;
	req.session.cart.total = req.session.cart.tax + req.session.cart.subtotal;
	let tempQty = 0;
	for (let i = 0; i < req.session.cart.cartItems.length; i++) {
		let a = req.session.cart.cartItems[i].qty;
		tempQty += a;
	}
	req.session.cart.totalQty = tempQty;
	req.session.save(function (err) {
		if (err) console.log("Error adding product to cart", err);
		console.log("product successfully added to cart!", req.session.cart);
		return;
	});
}
function updateProductDetails(req, product, qty) {
	let subtotal = 0;
	let totalQty = 0;
	for (let i = 0; i < req.session.cart.cartItems.length; i++) {
		if (req.session.cart.cartItems[i]._id === product._id) {
			req.session.cart.cartItems[i].qty = qty;
			req.session.cart.cartItems[i].price = qty * product.price;
		}
		let a = req.session.cart.cartItems[i].qty;
		totalQty += a;
		subtotal += req.session.cart.cartItems[i].price;
		console.log("updateProductDetails loop");
		console.log(i, subtotal);
	}
	req.session.cart.subtotal = subtotal;
	req.session.cart.totalQty = totalQty;
	req.session.cart.tax = req.session.cart.subtotal * 0.075;
	req.session.cart.total = req.session.cart.tax + req.session.cart.subtotal;
	req.session.save(function (err) {
		if (err) console.log("Error saveing cart", err);
		console.log("successfully product and cart!", req.session.cart);
		return;
	});
}

router.get("/checkout", (req, res) => {
	res.render("orders/checkout");
});

router.get("/view-cart", (req, res) => {
	if (!req.session.cart) {
		req.session.cart = {
			cartItems: [],
			totalQty: 0,
			subtotal: 0,
			tax: 0,
			total: 0
		};
		req.session.save(function (err) {
			if (err) console.log("Error creating cart!", err);
			console.log("cart created successfully!", req.session.cart);
		});
	}
	const cart = req.session.cart;
	res.render("orders/viewCart", { cart });
});

router.get(
	"",
	catchAsync(async (req, res) => {
		const products = await Product.find();
		if (!req.session.cart) {
			req.session.cart = {
				cartItems: [],
				totalQty: 0,
				subtotal: 0,
				tax: 0,
				total: 0
			};
			req.session.save(function (err) {
				if (err) console.log("Error creating cart!", err);
				console.log("cart created successfully!", req.session.cart);
			});
		}
		const cart = req.session.cart;
		res.render("orders/create", { cart, products });
	})
);

router.post(
	"/add-to-cart/:id",
	catchAsync(async (req, res) => {
		console.log("add to cart triggered");
		const { id } = req.params;
		const qty = parseInt(req.body.qty);
		const product = await Product.findById(id);
		if (product) {
			let itemFound = false;
			req.session.cart.cartItems.forEach((el) => {
				if (el._id === id) {
					console.log("before el.qty", el.qty);
					el.qty += qty;
					console.log("after el.qty", el.qty);
					el.price = el.qty * product.price;
					console.log("this is el", el);
					itemFound = true;
					updateOneCartDetails(req, product, qty);
				}
			});
			if (!itemFound) {
				const productObj = {
					_id: product._id,
					name: product.name,
					description: product.description,
					price: qty * product.price,
					qty: qty
				};
				req.session.cart.cartItems.push(productObj);
				updateOneCartDetails(req, product, qty);
			}
		}
		res.redirect("/order");
	})
);

router.delete(
	"/:id/action",
	catchAsync(async (req, res) => {
		const returnUrl = req.body.returnPage;
		console.log("delete triggered");
		const { id } = req.params;
		const product = await Product.findById(id);
		if (product) {
			let itemRemoved = false;
			for (let i = 0; i < req.session.cart.cartItems.length; i++) {
				if (req.session.cart.cartItems[i]._id === id) {
					let removedProduct = req.session.cart.cartItems.splice(i, 1)[0];
					console.log("this is removed product", removedProduct);
					removeOneCartDetails(req, removedProduct);
					itemRemoved = true;
					break;
				}
			}
			if (!itemRemoved) {
				console.log("failed to remove item!");
			}
		}

		res.redirect(returnUrl);
	})
);

router.patch(
	"/:id/action",
	catchAsync(async (req, res) => {
		console.log("update triggered");
		const { id } = req.params;
		const qty = parseInt(req.body.qty);
		const product = await Product.findById(id);
		if (product) {
			let itemFound = false;
			req.session.cart.cartItems.forEach((el) => {
				if (el._id === id) {
					el.qty = qty;
					el.price = el.qty * product.price;
					console.log("this is el", el);
					itemFound = true;
					updateProductDetails(req, product, qty);
				}
			});
			if (!itemFound) {
				const productObj = {
					_id: product._id,
					name: product.name,
					description: product.description,
					price: qty * product.price,
					qty: qty
				};
				req.session.cart.cartItems.push(productObj);
				updateOneCartDetails(req, product, qty);
			}
		}
		res.redirect("/order");
	})
);

module.exports = router;
