const { StatusCodes } = require("http-status-codes");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const { generateJWT } = require("./utils/generateJWT");
const { readTable, findRegister } = require("../database/interface/read");
const { validatePassword, generatePassword } = require("./PasswordsController");
const { createRegister } = require("../database/interface/create");
const { createPeople } = require("./PeopleController");
const { enrollInDepartments } = require("./EnrollmentsController");
const table = "contributors";
const amountInitial = 0;
const accountBalanceInitial = 0;

module.exports = {
  async read(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const {
      fullName,
      username,
      birthday,
      mothersFullName,
      email,
      phoneNumber,
      enrolledDepartments,
      password,
      hasAcceptedTermsOfUse,
    } = req.body;

    // minimum data validation
    if (!hasAcceptedTermsOfUse) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessage.termsOfUse });
    }

    const isPasswordOK = validatePassword(password);
    if (isPasswordOK !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: isPasswordOK });
    }

    // user registration
    const { created_at, updated_at } = getDBTimes();

    const dbResponsePassword = await generatePassword(
      password,
      created_at,
      updated_at
    );

    const dataForPeople = {
      fk_password: dbResponsePassword.id,
      full_name: fullName,
      username,
      birthday,
      mothers_full_name: mothersFullName,
      email,
      whatsapp: phoneNumber,
      created_at,
      updated_at,
    };
    const dbResponsePeople = await createPeople(dataForPeople);

    await enrollInDepartments(
      dbResponsePeople.id,
      enrolledDepartments,
      created_at
    );

    const dataForContributor = {
      fk_people: dbResponsePeople.id,
      amount: amountInitial,
      account_balance: accountBalanceInitial,
      created_at,
      updated_at,
    };

    const { id } = await createRegister(table, dataForContributor);

    const token = await generateJWT({ id, sub: "contributor" });

    return res.status(StatusCodes.OK).json({ token });
  },
  async getAccountBalance(id) {
    return findRegister(table, "id", id)
      .then((value) => {
        const { account_balance } = value;
        return account_balance;
      })
      .catch((err) => {
        return { success: false, message: ErrorMessage.userWrong, err };
      });
  },
};
