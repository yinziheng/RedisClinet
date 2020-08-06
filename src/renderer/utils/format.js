export function formatJson(val) {
	if (val === "") {
		return
	}

	try {
		if (typeof val === "string") {
			val = JSON.parse(val);
		}
	} catch (error) {
		return val;
	}
	val = JSON.stringify(val, null, 2);
	return val
}