import { Router } from "express";
import { authenticate } from "./controllers/AuthenticationController.js";
import { read, getContributionsOf, create, getContributionTotal } from "./controllers/ContributionsController.js";
import { list, read as Contributors_Read, create as Contributors_Create, update } from "./controllers/ContributorsController.js";
import { read as Departments_Read, listDepartments } from "./controllers/DepartmentsController.js";
import { enrollmentsOfPerson } from "./controllers/EnrollmentsController.js";
import { read as JacobsSons_Read } from "./controllers/JacobsSonsController.js";
import { read as Managers_Read } from "./controllers/ManagersController.js";
import auth from "./controllers/middleware/auth.js";
import authManager from "./controllers/middleware/authManager.js";
import { sendPasswordRecoveryForm, update as _update } from "./controllers/PasswordsController.js";
import { read as People_Read, findByID_REST } from "./controllers/PeopleController.js";
import { helloWorld } from "./controllers/Ping.js";
import { read as RewardRequests_Read, create as RewardRequests_Create } from "./controllers/RewardRequestsController.js";
import { read as Stickers_Read, getStickersAccount, getRank, reserve, reveal, getDistincts } from "./controllers/StickersController.js";
import { list as _list } from "./controllers/StickersStatusController.js";

const routes = Router();

routes.get("/ping", helloWorld);

routes.get("/jacobs-sons", JacobsSons_Read);

routes.get("/stickers-status", authManager, _list);

routes.get("/stickers/:id", auth, Stickers_Read);
routes.get("/stickers", authManager, getStickersAccount);
routes.get("/stickers-rank", authManager, getRank);
routes.post("/stickers/:id", auth, reserve);
routes.post("/stickers/reveal/:label", auth, reveal);
routes.get("/stickers/distincts/:id", auth, getDistincts);

routes.get("/departments", Departments_Read);
routes.get("/list-departments", listDepartments);
routes.get("/list-departments/:id", auth, enrollmentsOfPerson);

routes.get("/people", authManager, People_Read);
routes.get("/people/:id", auth, findByID_REST);

routes.get("/contributors", authManager, list);
routes.get("/contributors/:id", auth, Contributors_Read);
routes.post("/contributors", Contributors_Create);
routes.put("/contributors", auth, update);

routes.get("/contributions", authManager, read);
routes.get("/contributions/:username", auth, getContributionsOf);
routes.post("/contributions", authManager, create);
routes.get("/contribution-total", authManager, getContributionTotal)

routes.post("/authenticate", authenticate);

routes.get("/managers", authManager, Managers_Read);

routes.get("/reward-requests", authManager, RewardRequests_Read);
routes.post("/request-reward/:id", auth, RewardRequests_Create);

routes.post("/request-password-recovery/:username",
  sendPasswordRecoveryForm
);

routes.post("/update-password", _update);

export default routes;
