const { StatusCodes } = require("http-status-codes");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const { generateJWT } = require("./utils/generateJWT");
const { listColumn, findRegister } = require("../database/interface/read");
const { createRegister } = require("../database/interface/create");
const { updateRegisterWithID } = require("../database/interface/update");
const PeopleController = require("./PeopleController");
const PasswordsController = require("./PasswordsController");
const EnrollmentsController = require("./EnrollmentsController");
const ManagersController = require("./ManagersController");
const table = "contributors";
const amountInitial = 0;
const accountBalanceInitial = 0;

module.exports = {
  async list(req, res) {
    const fkPeopleList = await listColumn("fk_people", table);

    const data = await Promise.all(
      fkPeopleList.map(async ({ fk_people: peopleID }) => {
        const peopleData = await PeopleController.findByID(peopleID);
        const data = {
          fullName: peopleData.full_name,
          username: peopleData.username,
        };
        return data;
      })
    );

    return res.status(StatusCodes.OK).json(data);
  },
  async read(req, res) {
    const peopleID = Number(req.params.id);
    if (peopleID !== req.id && req.sub !== "manager") {
      const feedback = {
        success: false,
        message: ErrorMessage.credentialError,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const contributorData = await findRegister(table, "fk_people", peopleID);

    return res.status(StatusCodes.OK).json(contributorData);
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

    const isPasswordOK = PasswordsController.validatePassword(password);
    if (isPasswordOK !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: isPasswordOK.error });
    }

    // user registration
    const { created_at, updated_at } = getDBTimes();

    const dbResponsePassword = await PasswordsController.generatePassword(
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
      dbResponsePeople = await PeopleController.createPeople(dataForPeople);
    } catch (error) {
      PasswordsController.deletePassword(dbResponsePassword.id);
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: ErrorMessage.alreadyEnrolled,
        log: error,
      });
    }

    await EnrollmentsController.enrollInDepartments(
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

    await createRegister(table, dataForContributor);

    const token = await generateJWT({
      id: dbResponsePeople.id,
      username,
      sub: "contributor",
    });

    return res.status(StatusCodes.OK).json({ token });
  },
  async update(req, res) {
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

    const isPasswordOK = PasswordsController.validatePassword(password);
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
    const isTruth = await PasswordsController.mirrorPasswords(password, hash); 
    if (!isTruth) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessage.passwordWrong });
    }

    const { created_at, updated_at } = getDBTimes();
    const newData = {
      full_name: fullName,
      username,
      birthday,
      mothers_full_name: mothersFullName,
      email,
      whatsapp: phoneNumber,
      updated_at,
    };

    try {
      await PeopleController.updatePeople(newData, req.id);
    } catch (error) {
      const tip = error.toString().split(" - ")[1].replace(/\"/g, "");
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, tip });
    }

    // atualizar enrollments
    await EnrollmentsController.cancelEnrollments(req.id);
    if (enrolledDepartments !== undefined) {
      await EnrollmentsController.enrollInDepartments(req.id, enrolledDepartments, created_at);
    }

    const isManager = await ManagersController.findByFKPeople(peopleData.id);
    const level = isManager ? { sub: "manager" } : { sub: "contributor" };
    const token = await generateJWT({
      id: req.id,
      username,
      ...level,
    });

    return res.status(StatusCodes.OK).json({ token });
  },
  async getAccountBalance(contributorID) {
    return findRegister(table, "id", contributorID)
      .then((value) => {
        const { account_balance } = value;
        return account_balance;
      })
      .catch((err) => {
        return { success: false, message: ErrorMessage.userWrong, err };
      });
  },
  async findByPeopleID(peopleID) {
    return await findRegister(table, "fk_people", peopleID);
  },
  async updateContributor(newData, id) {
    return await updateRegisterWithID(table, newData, id);
  },
};

