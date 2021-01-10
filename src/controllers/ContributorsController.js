const dbConnect = require("../database/connection");
const { StatusCodes } = require("http-status-codes");
const table = "contributors";
const bcrypt = require("bcrypt");
const { getDBTimes } = require("./utils/getDBTimes");
const { ErrorMessages } = require("./utils/errosMessages");
const { readTable } = require("../database/interface/read");
const numberOfCycles = parseInt(process.env.PASSWORD_ENCRYPTION_ROUNDS, 10);

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

    if (!hasAcceptedTermsOfUse) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessages.termsOfUse });
    }

    const isPasswordOK = validatePassword(password);

    if (isPasswordOK !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: isPasswordOK });
    }

    bcrypt.genSalt(numberOfCycles, async (err, salt) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: err });
      }

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: err });
        }

        const { created_at, updated_at } = getDBTimes();

        const dataForPassword = {
          hash,
          salt,
          number_of_cycles: numberOfCycles,
          created_at,
          updated_at,
        };

        const [passwordID] = await dbConnect("passwords")
          .insert(dataForPassword)
          .returning("id");

        let dataForPeople = {
          fk_password: passwordID,
          full_name: fullName,
          username,
          birthday,
          mothers_full_name: mothersFullName,
          email,
          whatsapp: phoneNumber,
          created_at,
          updated_at,
        };

        const peopleID = await dbConnect("people")
          .insert(dataForPeople)
          .returning("id");

        const amount = 0;
        const account_balance = 0;
        const fk_people = peopleID[0];

        const contributorsData = {
          fk_people,
          amount,
          account_balance,
          created_at,
          updated_at,
        };

        const [dbResponseContributors] = await dbConnect(table)
          .insert(contributorsData)
          .returning("*");
        // refatorar e processar departamentos

        return res.status(StatusCodes.OK).json(dbResponseContributors);
      });
    });
  },
};

function validatePassword(password) {
  if (!password) {
    return { error: ErrorMessages.lackOfPassword };
  }

  length = String(password).length;
  if (length < 8 || length > 25) {
    return { error: ErrorMessages.passwordSize };
  }

  return true;
}
