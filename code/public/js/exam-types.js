function validateExamTypeForm(form)
{
	var type = $(form).find("#type").val();
	var errors = [];

	if(!type.length) {
		errors.push("Type is required");
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