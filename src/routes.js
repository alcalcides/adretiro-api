const { Router } = require("express");
const route = Router();

route.get("/ping", (req, res) => {
    res.send("Hello World");
})

module.exports = route;