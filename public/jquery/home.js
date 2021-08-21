$(function () {
	let minus = $(".minus");
	let plus = $(".plus");
	let qty = $(".qty");
	let num = parseInt($(".qty").html());
	minus.click(function () {
		if (num > 1) {
			num--;
			let qtyText = qty.html(num);
		}
	});
	plus.click(function () {
		num++;
		let qtyText = qty.html(num);
	});

	let menu = $("#menu");
	$(".menu-toggler").click(function (e) {
		menu.toggle("slide");
	});
});
