export function success() {
	return {
		type: "success",
		title: "SUCCESS",
		message: "Modification succeeded!",
		offset: 70
	}
}
export function error() {
	return {
		type: "error",
		title: "ERROR",
		message: "Modification failed!",
		offset: 70
	}
}
export function cancel() {
	return {
		type: "info",
		title: "INFO",
		message: "Operation cancelled.",
		offset: 70
	}
}
export function confirmWarn() {
	return {
		confirmButtonText: "O K",
		cancelButtonText: "CANCEL",
		type: "warning"
	}
}