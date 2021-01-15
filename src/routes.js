const { Router } = require("express");
const AuthenticationController = require("./controllers/AuthenticationController");
const ContributionsController = require("./controllers/ContributionsController");
const ContributorsController = require("./controllers/ContributorsController");
const DepartmentsController = require("./controllers/DepartmentsController");
const JacobsSonsController = require("./controllers/JacobsSonsController");
const ManagersController = require("./controllers/ManagersController");
const auth = require("./controllers/middleware/auth");
const authManager = require("./controllers/middleware/authManager");
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

routes.get("/people", authManager, PeopleController.read);
routes.get("/people/:id", auth, PeopleController.findByID);

routes.get("/passwords/:id", PasswordsController.read);

routes.get("/contributors", authManager, ContributorsController.read);
routes.post("/contributors", ContributorsController.create);


routes.get("/contributions", authManager, ContributionsController.read);
routes.post("/contributions", authManager, ContributionsController.create);

routes.post("/authenticate", AuthenticationController.authenticate);

routes.get("/managers", authManager, ManagersController.read);

module.exports = routes;
