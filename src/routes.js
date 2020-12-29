const { Router } = require("express");
const Ping = require("./controllers/Ping");
const routes = Router();

routes.get("/ping", Ping.helloWorld);

module.exports = routes;
