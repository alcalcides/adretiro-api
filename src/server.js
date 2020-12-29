const express = require("express");
const route = require("./routes");

const app = express();

app.use(route);

app.listen(process.env.PORT || 3333);
