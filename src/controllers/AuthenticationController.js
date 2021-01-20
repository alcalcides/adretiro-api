const { StatusCodes } = require("http-status-codes");
const PasswordsController = require("./PasswordsController");
const ManagersController = require("./ManagersController");
const PeopleController = require("./PeopleController");
const ErrorMessage = require("./utils/errorMessages");
const { matchHash } = require("./utils/encryption");
const { generateJWT } = require("./utils/generateJWT");

module.exports = {
  async authenticate(req, res) {
    const { username, password } = req.body;

    // validations
    const isPasswordOK = PasswordsController.validatePassword(password);
    if (isPasswordOK !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: isPasswordOK });
    }

    const isUsernameOK = PeopleController.validateUsername(username);
    if (isUsernameOK !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: isUsernameOK });
    }
    // authenticate
    const peopleData = await PeopleController.findByUsername(username)
      .then(({ fk_password, id }) => ({ fk_password, id }))
      .catch((reason) => ({ reason }));

    if (peopleData.reason) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: ErrorMessage.userWrong,
      });
    }

    const { hash } = await PasswordsController.findByID(peopleData.fk_password);
    const isTruth = await matchHash(password, hash);
    if (!isTruth) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: ErrorMessage.passwordWrong });
    }

    const isManager = await ManagersController.findByFKPeople(peopleData.id);
    const level = isManager ? { sub: "manager" } : { sub: "contributor" };
    const token = await generateJWT({
      id: peopleData.id,
      username,
      ...level,
    });

    return res.status(StatusCodes.OK).json({ token });
  },
};
