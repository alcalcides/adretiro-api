import { StatusCodes } from "http-status-codes";
import errorMessages from "./utils/errorMessages.js";
const { credentialError, termsOfUse, alreadyEnrolled, userWrong, passwordWrong } = errorMessages
import { getDBTimes } from "./utils/getDBTimes.js";
import { generateJWT } from "./utils/generateJWT.js";
import { listColumn, findRegister } from "../database/interface/read.js";
import { createRegister } from "../database/interface/create.js";
import { updateRegisterWithID } from "../database/interface/update.js";
import { findByID, createPeople, findByUsername, updatePeople } from "./PeopleController.js";
import { validatePassword, generatePassword, deletePassword, findByID as _findByID, mirrorPasswords } from "./PasswordsController.js";
import { enrollInDepartments, cancelEnrollments } from "./EnrollmentsController.js";
import { findByFKPeople } from "./ManagersController.js";
const table = "contributors";
const amountInitial = 0;
const accountBalanceInitial = 0;

export async function list(req, res) {
  const fkPeopleList = await listColumn("fk_people", table);

  const data = await Promise.all(
    fkPeopleList.map(async ({ fk_people: peopleID }) => {
      const peopleData = await findByID(peopleID);
      const data = {
        fullName: peopleData.full_name,
        username: peopleData.username,
      };
      return data;
    })
  );

  return res.status(StatusCodes.OK).json(data);
}
export async function read(req, res) {
  const peopleID = Number(req.params.id);
  if (peopleID !== req.id && req.sub !== "manager") {
    const feedback = {
      success: false,
      message: credentialError,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const contributorData = await findRegister(table, "fk_people", peopleID);

  return res.status(StatusCodes.OK).json(contributorData);
}
export async function create(req, res) {
  const {
    fullName, username, birthday, mothersFullName, email, phoneNumber, enrolledDepartments, password, hasAcceptedTermsOfUse, } = req.body;

  // minimum data validation
  if (!hasAcceptedTermsOfUse) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: termsOfUse });
  }

  const isPasswordOK = validatePassword(password);
  if (isPasswordOK !== true) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: isPasswordOK.error });
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
    deletePassword(dbResponsePassword.id);
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: alreadyEnrolled,
      log: error,
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

  await createRegister(table, dataForContributor);

  const token = await generateJWT({
    id: dbResponsePeople.id,
    username,
    sub: "contributor",
  });

  return res.status(StatusCodes.OK).json({ token });
}
export async function update(req, res) {
  const {
    fullName, username, birthday, mothersFullName, email, phoneNumber, enrolledDepartments, password, hasAcceptedTermsOfUse, } = req.body;

  // minimum data validation
  if (!hasAcceptedTermsOfUse) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: termsOfUse });
  }

  const isTheSamePerson = req.username === username ? true : false;
  if (!isTheSamePerson) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: credentialError,
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
  const peopleData = await findByUsername(req.username);
  if (!peopleData || peopleData.id != req.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: userWrong,
    });
  }

  const { hash } = await _findByID(peopleData.fk_password);
  const isTruth = await mirrorPasswords(password, hash);
  if (!isTruth) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: passwordWrong });
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
    await updatePeople(newData, req.id);
  } catch (error) {
    const tip = error.toString().split(" - ")[1].replace(/\"/g, "");
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, tip });
  }

  // atualizar enrollments
  await cancelEnrollments(req.id);
  if (enrolledDepartments !== undefined) {
    await enrollInDepartments(req.id, enrolledDepartments, created_at);
  }

  const isManager = await findByFKPeople(peopleData.id);
  const level = isManager ? { sub: "manager" } : { sub: "contributor" };
  const token = await generateJWT({
    id: req.id,
    username,
    ...level,
  });

  return res.status(StatusCodes.OK).json({ token });
}
export async function getAccountBalance(contributorID) {
  return findRegister(table, "id", contributorID)
    .then((value) => {
      const { account_balance } = value;
      return account_balance;
    })
    .catch((err) => {
      return { success: false, message: userWrong, err };
    });
}
export async function findByPeopleID(peopleID) {
  return await findRegister(table, "fk_people", peopleID);
}
export async function updateContributor(newData, id) {
  return await updateRegisterWithID(table, newData, id);
}

