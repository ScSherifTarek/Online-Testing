function validatePositionForm(form)
{
	var title = $(form).find("#title").val();
	var details = $(form).find("#details").val();
	var errors = [];

	if(!title.length) {
		errors.push("Title is required");
	}

	if(!details.length) {
		errors.push("Details is required");
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