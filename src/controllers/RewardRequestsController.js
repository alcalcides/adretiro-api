const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { readTable } = require("../database/interface/read");
const ContributorsController = require("./ContributorsController");
const StickersController = require("./StickersController");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "reward_requests";

module.exports = {
  async read(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const peopleID = Number(req.params.id);

    if (peopleID !== req.id) {
      const feedback = {
        success: false,
        message: ErrorMessage.credentialError,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const contributorData = await ContributorsController.findByPeopleID(
      peopleID
    );

    const distinctsStickers = await StickersController.listDistinctJacobsSonsOf(
      contributorData
    );

    const numberOfDistinctsStickers = distinctsStickers.length;
    if (numberOfDistinctsStickers < 12) {
      const feedback = {
        success: false,
        message: ErrorMessage.collectionUncompleted,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(feedback);
    }

    const { created_at, updated_at } = getDBTimes();

    const data = { fk_contributor: contributorData.id, created_at, updated_at };
    await createRegister(table, data);

    const numberOfStickersArchived = await StickersController.archiveStickersOf(
      contributorData.id,
      updated_at
    );

    res.status(StatusCodes.OK).json({
      success: true,
      numberOfStickersArchived
    });
  },
};
