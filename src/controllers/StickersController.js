const { StatusCodes } = require("http-status-codes");
const stickerPrice = require("../adm");
const dbConnect = require("../database/connection");
const { findRegister } = require("../database/interface/read");
const { updateRegisterWithID } = require("../database/interface/update");
const ContributorsController = require("./ContributorsController");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "stickers";

module.exports = {
  async read(req, res) {
    const peopleID = Number(req.params.id);
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

    const stickersResponse = await dbConnect(table)
      .join("jacobs_sons", `${table}.fk_jacobs_son`, "jacobs_sons.id")
      .join(
        "stickers_status",
        `${table}.fk_sticker_status`,
        "stickers_status.id"
      )
      .where(`${table}.fk_contributor`, contributorData.id)
      .whereNot(`${table}.fk_sticker_status`, 4)
      .orderBy(`${table}.fk_sticker_status`, "desc")
      .select(`${table}.label`, "jacobs_sons.name", "stickers_status.status");

    return res.status(StatusCodes.OK).json(stickersResponse);
  },
  async reserve(req, res) {
    const peopleID = Number(req.params.id);

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

    if (qtdOfStickersDeserved === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessage.lowAccountBalance });
    }

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
  async reveal(req, res) {
    const peopleID = req.id;
    const { id: contributorID } = await ContributorsController.findByPeopleID(
      peopleID
    );

    const label = req.params.label;
    const stickerData = await getStickerByLabel(label);

    if (stickerData.fk_contributor !== contributorID) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessage.credentialError });
    } else if (stickerData.fk_sticker_status !== 2) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: ErrorMessage.stickerAlreadyRevealed });
    }

    const { updated_at } = getDBTimes();
    const newStickerData = {
      fk_sticker_status: 3,
      updated_at,
    };

    const updateResponse = await updateRegisterWithID(
      table,
      newStickerData,
      stickerData.id
    );
    if (updateResponse === 1) {
      const feedback = { success: true };
      return res.status(StatusCodes.OK).json(feedback);
    } else {
      const feedback = { success: false, ...updateResponse };
      return res.status(StatusCodes.CONFLICT).json(feedback);
    }
  },
  async getDistincts(req, res) {
    const peopleID = Number(req.params.id);
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

    const stickersResponse = await dbConnect(table)
      .distinct("jacobs_sons.name")
      .join("jacobs_sons", `${table}.fk_jacobs_son`, "jacobs_sons.id")
      .where(`${table}.fk_contributor`, contributorData.id)
      .where(`${table}.fk_sticker_status`, 3)

    const distinctsJacobsSons = stickersResponse.map((value) => value.name);

    return res.status(StatusCodes.OK).json(distinctsJacobsSons);
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

async function getStickerByLabel(label) {
  return await findRegister(table, "label", label);
}
