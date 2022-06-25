import { StatusCodes } from "http-status-codes";
import {stickerPrice} from "../adm.js";
import dbConnect from "../database/connection.js";
import { findRegister } from "../database/interface/read.js";
import { updateRegisterWithID, updateRegisterWhereAndWhere } from "../database/interface/update.js";
import { findByPeopleID, updateContributor } from "./ContributorsController.js";
import { getStatusCodeOf } from "./StickersStatusController.js";
import errorMessages from "./utils/errorMessages.js";
const { credentialError, lowAccountBalance, lackOfStickers, stickerAlreadyRevealed } = errorMessages
import { getDBTimes } from "./utils/getDBTimes.js";
const table = "stickers";

export async function read(req, res) {
  const peopleID = Number(req.params.id);
  if (peopleID !== req.id && req.sub !== "manager") {
    const feedback = {
      success: false,
      message: credentialError,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const contributorData = await findByPeopleID(
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
}
export async function reserve(req, res) {
  const peopleID = Number(req.params.id);

  if (peopleID !== req.id) {
    const feedback = {
      success: false,
      message: credentialError,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const { updated_at } = getDBTimes();

  const contributorData = await findByPeopleID(
    peopleID
  );

  const qtdOfStickersDeserved = Math.floor(
    contributorData.account_balance / stickerPrice
  );

  if (qtdOfStickersDeserved === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: lowAccountBalance });
  }

  let cycles = 0;
  for (cycles = 1; cycles <= qtdOfStickersDeserved; cycles++) {
    try {
      const stickerData = await lookForAvailableSticker();
      if (!stickerData) {
        throw new Error(lackOfStickers);
      }

      await reserverSticker(stickerData.id, contributorData.id, updated_at);
      await updateContributorAfterObtainSticker(
        contributorData.id,
        contributorData.account_balance,
        cycles,
        updated_at
      );
    } catch (error) {
      if (error.message === lackOfStickers) {
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
}
export async function reveal(req, res) {
  const peopleID = req.id;
  const { id: contributorID } = await findByPeopleID(
    peopleID
  );

  const label = req.params.label;
  const stickerData = await getStickerByLabel(label);

  if (stickerData.fk_contributor !== contributorID) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: credentialError });
  } else if (stickerData.fk_sticker_status !== 2) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ success: false, message: stickerAlreadyRevealed });
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
}
export async function getDistincts(req, res) {
  const peopleID = Number(req.params.id);
  if (peopleID !== req.id && req.sub !== "manager") {
    const feedback = {
      success: false,
      message: credentialError,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const contributorData = await findByPeopleID(
    peopleID
  );

  const distinctsJacobsSons = await listDistinctJacobsSonsOf(contributorData);

  return res.status(StatusCodes.OK).json(distinctsJacobsSons);
}
export async function listDistinctJacobsSonsOf(contributorData) {
  const temp = await getDistinctJacobsSonsOf(contributorData);
  const listOfSons = temp.map((value) => value.name);
  return listOfSons;
}
export async function archiveStickersOf(contributorID, updated_at) {
  return await achiveSticker(contributorID, updated_at);
}
export async function getStickersAccount(req, res) {
  const { status } = req.query;
  if (!status) {

    const [{ count: stickerAccount }] = await dbConnect(table).count("id");
    return res.status(StatusCodes.OK).json({ stickerAccount });

  } else {

    const { id: statusID } = await getStatusCodeOf(
      String(status).toUpperCase()
    );

    const [{ count: stickerAccount }] = await dbConnect(table)
      .count("id")
      .where("fk_sticker_status", statusID);

    return res.status(StatusCodes.OK).json({ stickerAccount });
  }
}
export async function getRank(req, res) {
  const { rows, rowCount } = await dbConnect.raw(`
      select username, full_name, count(*) 
      from (select distinct fk_contributor, fk_jacobs_son, fk_sticker_status from stickers ) 
        as subset 
      join contributors on fk_contributor = contributors.id
      join people on contributors.fk_people = people.id
      where fk_sticker_status = 3 
      group by fk_contributor, username, full_name 
      order by count desc;`);

  const rank = [];
  await Promise.all(
    rows.map((value, index) => {
      rank.push({ ...value, place: index + 1 });
    })
  );

  return res.status(StatusCodes.OK).json({ rank, playerCount: rowCount });
}

async function getDistinctJacobsSonsOf(contributorData) {
  return await dbConnect(table)
    .distinct("jacobs_sons.name")
    .join("jacobs_sons", `${table}.fk_jacobs_son`, "jacobs_sons.id")
    .where(`${table}.fk_contributor`, contributorData.id)
    .where(`${table}.fk_sticker_status`, 3);
}

// duplicated function in line 152
// async function listDistinctJacobsSonsOf(contributorData) {
//   const temp = await getDistinctJacobsSonsOf(contributorData);

//   return temp.map((value) => value.name);
// }

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

async function achiveSticker(fk_contributor, updated_at) {
  return await updateRegisterWhereAndWhere(
    table,
    { fk_sticker_status: 4 },
    "fk_contributor", "=", fk_contributor,
    "fk_sticker_status", "=", 3
  );
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

  return await updateContributor(
    newContributorData,
    contributorID
  );
}

async function getStickerByLabel(label) {
  return await findRegister(table, "label", label);
}
