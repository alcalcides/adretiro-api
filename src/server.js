require('dotenv').config();
const app = require("./app");

const port = process.env.PORT || 3333;

app.listen(port);

console.log(`Starting on ${new Date()}`);
console.log(`App running in the port ${port}`);