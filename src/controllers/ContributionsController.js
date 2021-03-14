const { StatusCodes } = require("http-status-codes");
const dbConnect = require("../database/connection");
const { createRegister } = require("../database/interface/create");
const ContributorsController = require("./ContributorsController");
const PeopleController = require("./PeopleController");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "contributions";

module.exports = {
  async read(req, res) {
    const dbResponse = await dbConnect(table)
      .join("managers", "contributions.fk_manager", "managers.id")
      .join("people as peopleManager", "peopleManager.id", "managers.fk_people")
      .join("contributors", "contributions.fk_contributor", "contributors.id")
      .join("people as peopleContributor", "peopleContributor.id", "contributors.id")
      .orderBy("contributions.id")
      .select(
        "contributions.id",
        "peopleManager.username as managerUsername",
        "peopleContributor.username as contributorUsername",
        "contributions.value",
        "contributions.created_at"
      );
    
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const { username, value } = req.body;

    const peopleData = await PeopleController.findByUsername(username);
    const peopleID = peopleData.id;
    if (peopleID === req.id) {
      const feedback = {
        success: false,
        message: ErrorMessage.credentialError,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const contributorData = await ContributorsController.findByPeopleID(
      peopleID
    );

    const contributorID = contributorData.id;
    const { created_at, updated_at } = getDBTimes();
    const contributionData = {
      fk_contributor: contributorID,
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
  async getContributionsOf(req, res) {
    const { username } = req.params;

    const peopleData = await PeopleController.findByUsername(username);
    const peopleID = peopleData.id;
    if (peopleID !== req.id && req.sub !== "manager") {
      const feedback = {
        success: false,
        message: ErrorMessage.credentialError,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const contributorData = await ContributorsController.findByPeopleID(
      peopleID
    );

    const contributionsResponse = await dbConnect(table)
      .join("managers", `${table}.fk_manager`, "managers.id")
      .join("people", "people.id", "managers.fk_people")
      .where(`${table}.fk_contributor`, contributorData.id)
      .orderBy("contributions.id")
      .select(
        "contributions.id",
        "contributions.fk_contributor",
        "people.username",
        "contributions.value",
        "contributions.created_at"
      );

    const feedback = contributionsResponse.map((register) => ({
      id: register.id,
      contributor: username,
      manager: register.username,
      value: register.value,
      date: register.created_at,
    }));

    res.status(StatusCodes.OK).json(feedback);
  },
};
