import { StatusCodes } from "http-status-codes";
import { createRegister } from "../database/interface/create.js";
import { deleteRegister } from "../database/interface/delete.js";
import { findRegister } from "../database/interface/read.js";
import { encryption } from "./utils/encryption.js";
const { generateSalt, generateHash, matchHash } = encryption
import { getDBTimes } from "./utils/getDBTimes.js";
import errorMessages from "./utils/errorMessages.js";
const { lackOfPassword, passwordSize, strangeOrigin, lackOfUsername, userNotFound, lackOfEmail, termsOfUse, lackOfData } = errorMessages
import { findByUsername } from "./PeopleController.js";
import { emailFormBuilder } from "./mail/emailFormBuilder.js";
import { sendEMail } from "./mail/sendEmail.js";
import { isAValidOrigin } from "./utils/isAValidOrigin.js";
import { verifyJWT } from "./utils/verifyJWT.js";
import { updateRegisterWithID } from "../database/interface/update.js";

const numberOfCycles = parseInt(process.env.PASSWORD_ENCRYPTION_ROUNDS, 10);
const table = "passwords";

export async function generatePassword(password, created_at, updated_at) {
  const salt = await generateSalt(numberOfCycles);
  const hash = await generateHash(password, salt);

  const dataToCreatePassword = {
    hash,
    salt,
    number_of_cycles: numberOfCycles,
    created_at,
    updated_at,
  };
  const dbResponsePassword = await createRegister(
    "passwords",
    dataToCreatePassword
  );
  return dbResponsePassword;
}
export function validatePassword(password) {
  if (!password) {
    return { error: lackOfPassword };
  }

  length = String(password).length;
  if (length < 8 || length > 25) {
    return { error: passwordSize };
  }

  return true;
}
export async function mirrorPasswords(password, hash) {
  return await matchHash(password, hash);
}
export async function findByID(id) {
  const dbResponse = await findRegister(table, "id", id);
  return dbResponse;
}
export async function deletePassword(passwordID) {
  return await deleteRegister(table, "id", passwordID);
}
export async function sendPasswordRecoveryForm(req, res) {
  const { origin } = req.headers;
  if (!isAValidOrigin(origin)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: strangeOrigin });
  }

  const { username } = req.params;
  if (!username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: lackOfUsername });
  }

  const peopleData = await findByUsername(username);
  if (!peopleData) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: userNotFound });
  }

  const { email } = peopleData;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: lackOfEmail });
  }

  const emailForm = await emailFormBuilder(email, username, origin);

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Check your email" });

  sendEMail(emailForm);
}
export async function update(req, res) {
  const { token, newPassword, hasAcceptedTermsOfUse } = req.body;
  if (!hasAcceptedTermsOfUse) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: termsOfUse });
  }

  if (!token || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: lackOfData });
  }

  try {
    const tokenDecoded = await verifyJWT(token);

    const { username } = tokenDecoded;
    const peopleData = await findByUsername(username);
    const { fk_password, id: peopleID } = peopleData;

    const currentPasswordData = await findRegister(table, "id", fk_password);

    const newSalt = await generateSalt(numberOfCycles);
    const newHash = await generateHash(newPassword, newSalt);
    const { updated_at } = getDBTimes();

    const data = {
      hash: newHash,
      salt: newSalt,
      updated_at
    };

    await updateRegisterWithID(table, data, currentPasswordData.id);

    return res
      .status(StatusCodes.OK)
      .json({ success: true });

  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message, error });
  }
}
