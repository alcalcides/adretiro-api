const { Router } = require("express");
const routes = Router();

routes.get("/ping", (req, res) => {
    res.send("Hello World");
})

module.exports = routes;