import { StatusCodes } from "http-status-codes";
import { validatePassword, findByID } from "./PasswordsController.js";
import { findByFKPeople } from "./ManagersController.js";
import { validateUsername, findByUsername } from "./PeopleController.js";
import errorMessages from "./utils/errorMessages.js";
const { userWrong, passwordWrong } = errorMessages
import { encryption }  from "./utils/encryption.js";
const { matchHash } = encryption
import { generateJWT } from "./utils/generateJWT.js";

export async function authenticate(req, res) {
  const { username, password } = req.body;

  // validations
  const isPasswordOK = validatePassword(password);
  if (isPasswordOK !== true) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: isPasswordOK });
  }

  const isUsernameOK = validateUsername(username);
  if (isUsernameOK !== true) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: isUsernameOK });
  }
  // authenticate
  const peopleData = await findByUsername(username)
    .then(({ fk_password, id }) => ({ fk_password, id }))
    .catch((reason) => ({ reason }));

  if (peopleData.reason) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: userWrong,
    });
  }

  const { hash } = await findByID(peopleData.fk_password);
  const isTruth = await matchHash(password, hash);
  if (!isTruth) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: passwordWrong });
  }

  const isManager = await findByFKPeople(peopleData.id);
  const level = isManager ? { sub: "manager" } : { sub: "contributor" };
  const token = await generateJWT({
    id: peopleData.id,
    username,
    ...level,
  });

  return res.status(StatusCodes.OK).json({ token });
}
