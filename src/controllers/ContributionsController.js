const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { readTable } = require("../database/interface/read");
const ContributorsController = require("./ContributorsController");
const PeopleController = require("./PeopleController");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "contributions";

module.exports = {
  async read(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const { username, value } = req.body;
    const { created_at, updated_at } = getDBTimes();

    const peopleData = await PeopleController.findByUsername(username);
    if (peopleData.id === req.id) {
      const feedback = {
        success: false,
        message: ErrorMessage.credentialError,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const peopleID = peopleData.id;
    const contributorData = await ContributorsController.findByPeopleID(
      peopleID
    );

    const contributionData = {
      fk_contributor: contributorData.id,
      fk_manager: req.id,
      value,
      created_at,
      updated_at,
    };

    const contributionResponse = await createRegister(table, contributionData);
    if (contributionResponse.success === false) {
      const feedback = { success: false, message: ErrorMessage.userWrong };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const contributorNewData = {
      amount: contributorData.amount + value,
      account_balance: contributorData.account_balance + value,
      updated_at: updated_at,
    };

    await ContributorsController.updateContributor(
      contributorNewData,
      contributorData.id
    );

    return res.status(StatusCodes.CREATED).json(contributionResponse);
  },
};
