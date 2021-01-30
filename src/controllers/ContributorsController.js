const { StatusCodes } = require("http-status-codes");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const { generateJWT } = require("./utils/generateJWT");
const { readTable, findRegister } = require("../database/interface/read");
const { validatePassword, generatePassword } = require("./PasswordsController");
const { createRegister } = require("../database/interface/create");
const { createPeople } = require("./PeopleController");
const { enrollInDepartments } = require("./EnrollmentsController");
const PeopleController = require("./PeopleController");
const PasswordsController = require("./PasswordsController");
const { matchHash } = require("./utils/encryption");
const EnrollmentsController = require("./EnrollmentsController");
const ManagersController = require("./ManagersController");
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

    var dbResponsePeople;

    try {
      dbResponsePeople = await createPeople(dataForPeople);
    } catch (error) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error,
        tip: ErrorMessage.alreadyEnrolled,
      });
    }

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

    const token = await generateJWT({ id, username, sub: "contributor" });

    return res.status(StatusCodes.OK).json({ token });
  },
  async update(req, res) {
    const idToken = req.id;
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

    const isTheSamePerson = req.username === username ? true : false;
    if (!isTheSamePerson) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: ErrorMessage.credentialError,
        tip: "This user already exists",
      });
    }

    const isPasswordOK = validatePassword(password);
    if (isPasswordOK !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: isPasswordOK.error });
    }

    // verificar senha correta
    const peopleData = await PeopleController.findByUsername(req.username);
    if (!peopleData || peopleData.id != req.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: ErrorMessage.userWrong,
      });
    }

    const { hash } = await PasswordsController.findByID(peopleData.fk_password);
    const isTruth = await matchHash(password, hash);
    if (!isTruth) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessage.passwordWrong });
    }

    const { created_at, updated_at } = getDBTimes();
    newData = {
      full_name: fullName,
      username,
      birthday,
      mothers_full_name: mothersFullName,
      email,
      whatsapp: phoneNumber,
      updated_at,
    };

    try {
      const peopleUpdating = await PeopleController.updatePeople(
        newData,
        req.id
      );
    } catch (error) {
      const tip = error.toString().split(" - ")[1].replace(/\"/g, "");
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, tip });
    }

    // atualizar enrollments
    const enrollmentsRespond = await EnrollmentsController.cancelEnrollments(
      req.id
    );
    await enrollInDepartments(req.id, enrolledDepartments, created_at);

    const isManager = await ManagersController.findByFKPeople(peopleData.id);
    const level = isManager ? { sub: "manager" } : { sub: "contributor" };
    const token = await generateJWT({
      id: req.id,
      username,
      ...level,
    });

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
