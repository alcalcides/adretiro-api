const { Router } = require("express");
const JacobsSonsController = require("./controllers/JacobsSonsController");
const Ping = require("./controllers/Ping");

const routes = Router();

routes.get("/ping", Ping.helloWorld);

routes.get("/jacobs-sons", JacobsSonsController.read);

module.exports = routes;
