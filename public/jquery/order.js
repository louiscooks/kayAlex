$(function () {
	$(".menu-toggler").click(function (e) {
		$("#menu").toggle("slide");
	});

	// $.ajax({
	// 	type: "GET",
	// 	url: "/api/products",
	// 	success: function (products) {
	// 		// console.log("success", products);
	// 		$.each(products, function (i, product) {
	// 			$("#productsList").append(`
	// 				<div class="col-12 col-xl-4">
	// 					<div
	// 						class="card food_item shadow-sm py-1"
	// 						data-bs-toggle="modal"
	// 						data-bs-target="#product${i}model"
	// 					>
	// 						<div class="card-body">
	// 							<h5 class="card-title">${product.name}</h5>
	// 							<p class="text-dark mb-0">$${product.price.toFixed(2)}</p>
	// 						</div>
	// 					</div>
	// 					<div
	// 					class="modal fade"
	// 					id="product${i}model"
	// 					tabindex="-1"
	// 					aria-labelledby="product${i}modelLabel"
	// 					aria-hidden="true"
	// 				>
	// 					<div class="modal-dialog-centered modal-dialog">
	// 						<div class="modal-content">
	// 							<div class="modal-header">
	// 								<h5 class="modal-title" id="product${i}modelLabel">${product.name}</h5>
	// 								<button
	// 									type="button"
	// 									class="btn-close"
	// 									data-bs-dismiss="modal"
	// 									aria-label="Close"
	// 								></button>
	// 							</div>
	// 							<div class="modal-body">${product.description}</div>
	// 							<div
	// 								class="
	// 									modal-footer
	// 									justify-content-start
	// 									flex-column
	// 									p-2
	// 									flex-wrap
	// 								"
	// 								style="width: 100%"
	// 							>
	// 								<div class="row row-cols-12 w-100">
	// 									<div class="col-auto">
	// 										<button class="minus bg-body" style="border: none">
	// 											<i data-feather="minus" id="icon-purple"></i>
	// 										</button>
	// 										<span class="qty p-2 border">1</span>
	// 										<button class="plus bg-body" style="border: none">
	// 											<i data-feather="plus" id="icon-purple"></i>
	// 										</button>
	// 									</div>
	// 									<form class="col" action="/order/add-to-cart/${product._id}" method="POST">
	// 									<button
	// 										class="btn btn-primary cart text-start ps-3 border-0"
	// 										style="width: 100%"
	// 									>
	// 										<span class="pe-1"
	// 											><i data-feather="shopping-cart"></i
	// 										></span>
	// 										Add to cart <span class="float-end pe-2" id="${
	// 											product._id
	// 										}price">$${product.price}</span>
	// 									</button>
	// 									</form>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 				</div>

	// 				`);
	// 		});
	// 	},
	// 	error: function () {
	// 		$("#productsList").append(`<div class="col-12 card">
	// 		<div class="card-body">
	// 		<p class="card-text text-center fs-5">No products available!</p>
	// 		</div>
	// 		</div>`);
	// 	}
	// });

	$.ajax({
		type: "GET",
		url: "/api/products",
		success: function (products) {
			$.each(products, function (i, product) {
				$("");
			});
		}
	});

	function operationHours(date) {
		let day = parseInt(date.getDay());
		let hoursObj = {};
		if (day === 0) return null;
		if (day >= 1 || day <= 4) {
			hoursObj.closed = 21;
			hoursObj.openTime = "11:00 am";
			hoursObj.closeTime = "9:00 pm";
		}
		if (day > 4) {
			hoursObj.closed = 23;
			hoursObj.openTime = "3:00 pm";
			hoursObj.closeTime = "11:00 pm";
		}
		if (hoursObj.closed === 21) hoursObj.open = 11;
		if (hoursObj.closed === 23) hoursObj.open = 15;
		return hoursObj;
	}
	function formatTime(a, hour) {
		if (hour === 12) {
			return `${hour}:${a < 10 ? "0" : ""}${a} pm`;
		}
		if (hour > 12) {
			let temp = hour - 12;
			return `${temp}:${a < 10 ? "0" : ""}${a} pm`;
		} else {
			return `${hour}:${a < 10 ? "0" : ""}${a} am`;
		}
	}

	function timeFromNow() {
		let date = new Date();
		let storeHours = operationHours(date);
		let arr = [];
		if (!storeHours) return null;
		let hour = parseInt(date.getHours());
		let min = parseInt(date.getMinutes());
		let a = 0;
		let currentTime = true;
		while (hour < storeHours.closed) {
			if (hour < storeHours.open) {
				hour = storeHours.open;
				currentTime = false;
			}
			if (currentTime) {
				if (min < 25) a = 30;
				else if (min >= 25 && min < 55) a = 60;
				else if (min > 55) {
					a = 30;
					hour++;
				}
				currentTime = false;
			}
			if (a === 60) {
				a = 0;
				hour++;
			}
			if (!arr.length && hour === storeHours.closed)
				return { arr: [], storeHours };
			arr.push(formatTime(a, hour));
			a += 30;
		}
		return { arr, storeHours };
	}

	const times = timeFromNow();
	if (times && times.arr.length) {
		$("#appendTimeBanner").html(
			`Open ${times.storeHours.openTime} - ${times.storeHours.closeTime}`
		);
		times.arr.map((element) => {
			return $("#appendTimes").append(
				`<option value="${element}">${element}</option>`
			);
		});
	} else {
		$("#appendTimeBanner").html(`Closed`);
		$("#appendTimes").append(
			`	<option value="null">No times available</option>`
		);
	}

	let qty = $(".qty");
	let num = qty.val();
	$(".minus").click(function (e) {
		e.preventDefault();
		if (num > 1) {
			num--;
			let qtyText = qty.val(num);
		}
	});
	$(".plus").click(function (e) {
		e.preventDefault();
		num++;
		let qtyText = qty.val(num);
	});

	let cartQty = $(".cartQty");
	let cartNum = cartQty.val();
	$(".cartMinus").click(function (e) {
		e.preventDefault();
		if (cartNum > 1) {
			cartNum--;
			let cartQtyText = cartQty.val(cartNum);
		}
	});
	$(".cartPlus").click(function (e) {
		e.preventDefault();
		cartNum++;
		let cartQtyText = cartQty.val(cartNum);
	});
});
