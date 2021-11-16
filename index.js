require("dotenv").config({ path: __dirname + "/.env" });
require('newrelic');
const app = require("./server.js");
let port = process.env.PORT || 3000;
const server = app.listen(port)
server.on('listening', (e) => {
	console.log(`Development environment listening on port ${port}!`)
	setTimeout(() => {
		server.emit("app_started")
	}, 200);
})
module.exports = server