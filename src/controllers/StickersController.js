const { StatusCodes } = require("http-status-codes");
const stickerPrice = require("../adm");
const { findRegister } = require("../database/interface/read");
const { updateRegisterWithID } = require("../database/interface/update");
const ContributorsController = require("./ContributorsController");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
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

    const { updated_at } = getDBTimes();

    const contributorData = await ContributorsController.findByPeopleID(
      peopleID
    );

    const qtdOfStickersDeserved = Math.floor(
      contributorData.account_balance / stickerPrice
    );
    let cycles = 0;
    for (cycles = 1; cycles <= qtdOfStickersDeserved; cycles++) {
      try {
        const stickerData = await lookForAvailableSticker();
        if (!stickerData) {
          throw new Error(ErrorMessage.lackOfStickers);
        }

        await reserverSticker(stickerData.id, contributorData.id, updated_at);
        await updateContributorAfterObtainSticker(
          contributorData.id,
          contributorData.account_balance,
          cycles,
          updated_at
        );
      } catch (error) {
        if (error.message === ErrorMessage.lackOfStickers) {
          console.error("[WARN]", error.message);
          return res
            .status(StatusCodes.CONFLICT)
            .json({ success: false, message: error.message });
        } else {
          throw new Error(error);
        }
      }
    }

    return res.status(StatusCodes.OK).json({ success: true });
  },
};

async function lookForAvailableSticker() {
  return await findRegister(table, "fk_sticker_status", 1);
}

async function reserverSticker(stickerID, fk_contributor, updated_at) {
  const newStickerData = {
    fk_contributor,
    fk_sticker_status: 2,
    updated_at,
  };
  return await updateRegisterWithID(table, newStickerData, stickerID);
}

async function updateContributorAfterObtainSticker(
  contributorID,
  contributorAccountBalance,
  cycles,
  updated_at
) {
  const newAccountBalance = contributorAccountBalance - cycles * stickerPrice;

  const newContributorData = {
    updated_at,
    account_balance: newAccountBalance,
  };

  return await ContributorsController.updateContributor(
    newContributorData,
    contributorID
  );
}
