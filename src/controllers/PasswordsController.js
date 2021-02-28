const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { deleteRegister } = require("../database/interface/delete");
const { findRegister } = require("../database/interface/read");
const { generateSalt, generateHash } = require("./utils/encryption");
const ErrorMessage = require("./utils/errorMessages");
const numberOfCycles = parseInt(process.env.PASSWORD_ENCRYPTION_ROUNDS, 10);
const table = "passwords";
const PeopleControler = require("./PeopleController");
const { emailFormBuilder } = require("./mail/emailFormBuilder");
const { sendEMail } = require("./mail/sendEmail");
const { isAValidOrigin } = require("./utils/isAValidOrigin");

module.exports = {
  async generatePassword(password, created_at, updated_at) {
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
  },
  validatePassword(password) {
    if (!password) {
      return { error: ErrorMessage.lackOfPassword };
    }

    length = String(password).length;
    if (length < 8 || length > 25) {
      return { error: ErrorMessage.passwordSize };
    }

    return true;
  },
  async findByID(id) {
    const dbResponse = await findRegister(table, "id", id);
    return dbResponse;
  },
  async deletePassword(passwordID) {
    return await deleteRegister(table, "id", passwordID);
  },
  async sendPasswordRecoveryForm(req, res) {
    const { origin } = req.headers;
    if (!isAValidOrigin(origin)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: ErrorMessage.strangeOrigin });
    }

    const { username } = req.params;
    if (!username) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: ErrorMessage.lackOfUsername });
    }

    const peopleData = await PeopleControler.findByUsername(username);
    if (!peopleData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: ErrorMessage.userNotFound });
    }

    const { email } = peopleData;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: ErrorMessage.lackOfEmail });
    }

    const emailForm = await emailFormBuilder(email, username, origin);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Check your email" });

    sendEMail(emailForm);
  },
};
