const { Router } = require("express");
const AuthenticationController = require("./controllers/AuthenticationController");
const ContributionsController = require("./controllers/ContributionsController");
const ContributorsController = require("./controllers/ContributorsController");
const DepartmentsController = require("./controllers/DepartmentsController");
const EnrollmentsController = require("./controllers/EnrollmentsController");
const JacobsSonsController = require("./controllers/JacobsSonsController");
const ManagersController = require("./controllers/ManagersController");
const auth = require("./controllers/middleware/auth");
const authManager = require("./controllers/middleware/authManager");
const PeopleController = require("./controllers/PeopleController");
const Ping = require("./controllers/Ping");
const RewardRequestsController = require("./controllers/RewardRequestsController");
const StickersController = require("./controllers/StickersController");
const StickersStatusController = require("./controllers/StickersStatusController");

const routes = Router();

routes.get("/ping", Ping.helloWorld);

routes.get("/jacobs-sons", JacobsSonsController.read);

routes.get("/stickers-status", authManager, StickersStatusController.list);

routes.post("/stickers/:id", auth, StickersController.reserve);
routes.get("/stickers/:id", auth, StickersController.read);

routes.get("/departments", DepartmentsController.read);
routes.get("/list-departments", DepartmentsController.listDepartments);
routes.get("/list-departments/:id", auth, EnrollmentsController.enrollmentsOfPerson);

routes.get("/people", authManager, PeopleController.read);
routes.get("/people/:id", auth, PeopleController.findByID_REST);

routes.get("/contributors", authManager, ContributorsController.list);
routes.get("/contributors/:id", auth, ContributorsController.read);
routes.post("/contributors", ContributorsController.create);
routes.put("/contributors", auth, ContributorsController.update);


routes.get("/contributions", authManager, ContributionsController.read);
routes.get("/contributions/:username", auth, ContributionsController.getContributionsOf);
routes.post("/contributions", authManager, ContributionsController.create);

routes.post("/authenticate", AuthenticationController.authenticate);

routes.get("/managers", authManager, ManagersController.read);

routes.get("/reward-requests", authManager, RewardRequestsController.read);
routes.post("/reward-requests", auth, RewardRequestsController.create);

module.exports = routes;
