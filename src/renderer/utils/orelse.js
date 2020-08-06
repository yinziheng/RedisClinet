
export function orelse(val, other) {
	if (val === undefined
		|| val === null
		|| val === ''
	) {
		return other
	}
	return val
}