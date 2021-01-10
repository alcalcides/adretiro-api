const { createRegister } = require("../database/interface/create");
const { findRegister, findRegister2 } = require("../database/interface/read");
const table = "enrollments";

module.exports = {
  async enrollInDepartments(peopleID, departments, created_at) {
    return await departments.map(async (department) => {
      const knownDepartaments = await findRegister("departments", "name", department);

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
};
