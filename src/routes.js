const { Router } = require("express");
const JacobsSonsController = require("./controllers/JacobsSonsController");
const Ping = require("./controllers/Ping");
const StickersStatusController = require("./controllers/StickersStatusController");

const routes = Router();

routes.get("/ping", Ping.helloWorld);

routes.get("/jacobs-sons", JacobsSonsController.read);
routes.get("/stickers-status", StickersStatusController.read);

module.exports = routes;
