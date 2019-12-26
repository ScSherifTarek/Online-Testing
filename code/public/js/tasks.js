function loadTasks()
{
	$.get("/tasks", function(data) {
		fetchTasks(data);
	})	
}

function fetchTasks(tasks) {
	var tableBody = $("#tasks-table tbody").html("");
	tasksToTableRows(tasks, tableBody);
}

function tasksToTableRows(tasks, tableBody) {
	$.each(tasks, (index, task) => {
		tableBody.append(
			'<tr><th scope="row">' + (index+1) + 
			'</th><td><a href="/tasks/'+task.id+'/edit" >' +task.task + '</a></td><td>' + 
			task.status + '</td><td>' + 
			task.created_at + '</td><tr>');
	})
}

function validateTaskForm(form)
{
	var task = $(form).find("#task").val();
	var status = $(form).find("#status").val();
	var errors = [];

	if(!task.length) {
		errors.push("Task is required");
	}
	if(status < 1)
	{
		errors.push("Status must be at least 1");
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