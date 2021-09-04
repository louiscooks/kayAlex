$(function () {
	//hang on event of form with id=myform
	$("#myform").submit(function (e) {
		//prevent Default functionality
		e.preventDefault();

		//get the action-url of the form
		var actionurl = e.currentTarget.action;

		//do your own request an handle the results
		$.ajax({
			url: actionurl,
			type: "post",
			dataType: "application/json",
			data: $("#myform").serialize(),
			success: function (data) {
				console.log("success", data);
			}
		});
	});
});
