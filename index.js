require("dotenv").config({ path: __dirname + "/.env" });

const app = require("./server.js");
let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Development environment listening on port ${port}!`));
