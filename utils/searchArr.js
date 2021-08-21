function search(arr, query) {
	let matchfound = false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === query) {
			matchfound = true;
			break;
		}
	}
	if (matchfound) return true;
	else return false;
}

module.exports = search;
