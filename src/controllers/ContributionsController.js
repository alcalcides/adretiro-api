import { StatusCodes } from "http-status-codes";
import dbConnect from "../database/connection.js";
import { createRegister } from "../database/interface/create.js";
import { findByPeopleID, updateContributor } from "./ContributorsController.js";
import { findByUsername } from "./PeopleController.js";
import errorMessages from "./utils/errorMessages.js";
const { credentialError, userWrong } = errorMessages;
import { getDBTimes } from "./utils/getDBTimes.js";
const table = "contributions";

export async function read(req, res) {
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
}
export async function create(req, res) {
  const { username, value } = req.body;

  const peopleData = await findByUsername(username);
  const peopleID = peopleData.id;
  if (peopleID === req.id) {
    const feedback = {
      success: false,
      message: credentialError,
    };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const contributorData = await findByPeopleID(
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
    const feedback = { success: false, message: userWrong };
    return res.status(StatusCodes.BAD_REQUEST).json(feedback);
  }

  const contributorNewData = {
    amount: contributorData.amount + value,
    account_balance: contributorData.account_balance + value,
    updated_at: updated_at,
  };

  await updateContributor(
    contributorNewData,
    contributorData.id
  );
  return res.status(StatusCodes.CREATED).json(contributionResponse);
}
export async function getContributionsOf(req, res) {
  const { username } = req.params;

  const peopleData = await findByUsername(username);
  const peopleID = peopleData.id;
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
}
export async function getContributionTotal(req, res) {
  const [{ sum }] = await dbConnect(table).sum("value");
  let contributionTotal = sum;
  if (!sum)
    contributionTotal = 0;

  res.status(StatusCodes.OK).json({ contributionTotal });
}
