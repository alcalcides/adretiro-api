import { StatusCodes } from "http-status-codes";
import { createRegister } from "../database/interface/create.js";
import { deleteRegister } from "../database/interface/delete.js";
import { findRegister, findRegisters, findRegister2 } from "../database/interface/read.js";
import { getDepartment } from "./DepartmentsController.js";
import errorMessages from "./utils/errorMessages.js";
const { alreadyEnrolled, credentialError, lackOfData } = errorMessages

const table = "enrollments";

export async function enrollInDepartments(peopleID, departments, created_at) {
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
      return console.warn({ warn: alreadyEnrolled });
    } else {
      return createRegister(table, data);
    }
  });
}
export async function cancelEnrollments(peopleID) {
  return await deleteRegister(table, 'fk_people', peopleID);
}
export async function enrollmentsOfPerson(req, res) {
  const { id } = req.params;
  const idAuth = req.id;
  const sub = req.sub;

  if (sub === "contributor" && id != idAuth) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: credentialError });
  }

  const enrollments = await findRegisters(table, "fk_people", id);
  if (enrollments.length === 0) {
    return res
      .status(StatusCodes.NO_CONTENT)
      .send({ success: true, message: lackOfData });
  }

  const ids = enrollments.map((v) => v.fk_department);
  const list = [];
  for (const id in ids) {
    const { name } = await getDepartment(ids[id]);
    list.push(name);
  }

  return res.status(StatusCodes.OK).json(list);
}
