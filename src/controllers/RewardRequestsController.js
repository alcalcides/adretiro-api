import { StatusCodes } from "http-status-codes";
import dbConnect from "../database/connection.js";
import { createRegister } from "../database/interface/create.js";
import { findByPeopleID } from "./ContributorsController.js";
import { listDistinctJacobsSonsOf, archiveStickersOf } from "./StickersController.js";
import errorMessages from "./utils/errorMessages.js";
const { credentialError, collectionUncompleted } = errorMessages
import { getDBTimes } from "./utils/getDBTimes.js";
const table = "reward_requests";

export async function read(req, res) {
  const dbResponse = await dbConnect(table)
    .join("contributors", "reward_requests.fk_contributor", "contributors.id")
    .join("people", "contributors.id", "people.id")
    .select(
      "reward_requests.id",
      "people.username",
      "reward_requests.created_at",
      "reward_requests.updated_at"
    );
  return res.status(StatusCodes.OK).json(dbResponse);
}
export async function create(req, res) {
  const peopleID = Number(req.params.id);

  if (peopleID !== req.id) {
    const feedback = {
      success: false,
      message: credentialError,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const contributorData = await findByPeopleID(
    peopleID
  );

  const distinctsStickers = await listDistinctJacobsSonsOf(
    contributorData
  );

  const numberOfDistinctsStickers = distinctsStickers.length;
  if (numberOfDistinctsStickers < 12) {
    const feedback = {
      success: false,
      message: collectionUncompleted,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const { created_at, updated_at } = getDBTimes();

  const data = { fk_contributor: contributorData.id, created_at, updated_at };
  await createRegister(table, data);

  const numberOfStickersArchived = await archiveStickersOf(
    contributorData.id,
    updated_at
  );

  res.status(StatusCodes.OK).json({
    success: true,
    numberOfStickersArchived
  });
}
