const express = require("express");

const app = express();

app.get("/ping", (request, response) => {
  response.send('Hello World')
})

app.listen(process.env.PORT || 3333);
