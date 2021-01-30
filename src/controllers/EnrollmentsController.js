const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { deleteRegister } = require("../database/interface/delete");
const {
  findRegister,
  findRegisters,
  findRegister2,
} = require("../database/interface/read");
const { getDepartment } = require("./DepartmentsController");
const ErrorMessage = require("./utils/errorMessages");
const table = "enrollments";

module.exports = {
  async enrollInDepartments(peopleID, departments, created_at) {
    return await departments.map(async (department) => {
      const knownDepartaments = await findRegister(
        "departments",
        "name",
        department
      );

      const data = {
        fk_department: knownDepartaments.id,
        fk_people: peopleID,
        created_at,
        updated_at: created_at,
      };
      const [isAlreadyEnrolled] = await findRegister2(
        "enrollments",
        "fk_people",
        peopleID,
        "fk_department",
        knownDepartaments.id
      );

      if (isAlreadyEnrolled) {
        return console.warn({ warn: ErrorMessage.alreadyEnrolled });
      } else {
        return createRegister(table, data);
      }
    });
  },
  async cancelEnrollments(peopleID){
    return await deleteRegister(table, 'fk_people', peopleID);
  },
  async enrollmentsOfPerson(req, res) {
    const { id } = req.params;
    const idAuth = req.id;
    const sub = req.sub;

    if (sub === "contributor" && id != idAuth) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ success: false, message: ErrorMessage.credentialError });
    }

    const enrollments = await findRegisters(table, "fk_people", id);
    if (enrollments.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ success: false, message: ErrorMessage.userNotFound });
    }

    const ids = enrollments.map((v) => v.fk_department);
    const list = [];
    for (const id in ids) {
      const { name } = await getDepartment(ids[id]);
      list.push(name);
    }

    return res.status(StatusCodes.OK).json(list);
  },
};
