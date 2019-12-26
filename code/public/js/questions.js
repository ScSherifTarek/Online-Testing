function validateQuestionForm(form)
{
	var body = $(form).find("#body").val();
	var exam_type_id = $(form).find("#exam_type_id").val();
	var errors = [];

	if(!body.length) {
		errors.push("Question body is required");
	}

	if(!exam_type_id) {
		errors.push("Exam type is required");
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