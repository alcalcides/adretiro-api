const { Router } = require("express");
const ContributorsController = require("./controllers/ContributorsController");
const DepartmentsController = require("./controllers/DepartmentsController");
const JacobsSonsController = require("./controllers/JacobsSonsController");
const PasswordsController = require("./controllers/PasswordsController");
const PeopleController = require("./controllers/PeopleController");
const Ping = require("./controllers/Ping");
const StickersStatusController = require("./controllers/StickersStatusController");

const routes = Router();

routes.get("/ping", Ping.helloWorld);

routes.get("/jacobs-sons", JacobsSonsController.read);

routes.get("/stickers-status", StickersStatusController.read);

routes.get("/departments", DepartmentsController.read);
routes.get("/list-departments", DepartmentsController.listDepartments);

routes.get("/people", PeopleController.read);
routes.get("/people/:id", PeopleController.findByID);

routes.get("/passwords/:id", PasswordsController.read);

routes.get("/contributors", ContributorsController.read);
routes.post("/contributors", ContributorsController.create);

module.exports = routes;
