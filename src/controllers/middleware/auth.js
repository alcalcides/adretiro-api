const { StatusCodes } = require("http-status-codes");
const ErrorMessage = require("../utils/errorMessages");
const { verifyJWT } = require("../utils/verifyJWT");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // validations
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: ErrorMessage.noToken });
  }

  const parts = authHeader.split(" ");
  if (!parts.length === 2) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: ErrorMessage.tokenError });
  }

  const [scheme, token] = parts;
  if (scheme !== "Bearer" || (!!token && token.length < 1)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: ErrorMessage.tokenError });
  }

  verifyJWT(token)
    .then((decoded) => {
      req.id = decoded.id;
      req.sub = decoded.sub;
      return next();
    })
    .catch((err) => {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ success: false, message: ErrorMessage.tokenError, err });
    });
};
