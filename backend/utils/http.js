const http = require('https');

exports.getText = url => {
	return new Promise(resolve => {
		// todo: handle errors
		http.get(url, res => {
			if (Math.floor(res.statusCode / 100) == 3) {
				return resolve(exports.getText(res.headers.location));
			}

			const parts = [];
			res.on('data', chunk => parts.push(chunk));
			res.on('end', () => resolve(Buffer.concat(parts).toString()));
		});
	});
}
