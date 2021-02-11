const { StatusCodes } = require("http-status-codes");
const ContributorsController = require("./ContributorsController");
const ErrorMessage = require("./utils/errorMessages");
const table = "stickers";

module.exports = {
  async reserve(req, res) {
    peopleID = Number(req.params.id);

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
    
    return res.status(StatusCodes.OK).json(contributorData);
  },
};
