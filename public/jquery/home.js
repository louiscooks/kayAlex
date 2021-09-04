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

	console.log("times", times);
});
