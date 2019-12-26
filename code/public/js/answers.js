function validateAnswerForm(form)
{
	var question_id = $(form).find("#question_id").val();
	var body = $(form).find("#body").val();
	var is_correct = $(form).find("#is_correct").val();
	var errors = [];

	if(!question_id) {
		errors.push("Question is required");
	}

	if(!body.length) {
		errors.push("Answer body is required");
	}
	console.log(is_correct);
	if(is_correct != "0" && is_correct != "1") {
		errors.push("You must define if the answer is correct or not");
	}

	if(errors.length) {
		$(form).find(".alert-danger").remove();
		$.each(errors, (index, error) => {
			$(form).append(errorMessage(error));	
		});
		return false;
	}

	return true;
}