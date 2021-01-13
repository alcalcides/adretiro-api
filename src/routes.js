const { Router } = require("express");
const AuthenticationController = require("./controllers/AuthenticationController");
const ContributionsController = require("./controllers/ContributionsController");
const ContributorsController = require("./controllers/ContributorsController");
const DepartmentsController = require("./controllers/DepartmentsController");
const JacobsSonsController = require("./controllers/JacobsSonsController");
const ManagersController = require("./controllers/ManagersController");
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

routes.get("/managers", ManagersController.read);

routes.get("/contributions", ContributionsController.read);

routes.post("/authenticate", AuthenticationController.authenticate);

module.exports = routes;
