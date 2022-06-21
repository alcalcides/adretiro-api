import { StatusCodes } from "http-status-codes";
import errorMessages from "../utils/errorMessages.js";
const { noToken, tokenError } = errorMessages;
import { verifyJWT } from "../utils/verifyJWT.js";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  // validations
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: noToken });
  }

  const parts = authHeader.split(" ");
  if (!parts.length === 2) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: tokenError });
  }

  const [scheme, token] = parts;
  if (scheme !== "Bearer" || (!!token && token.length < 1)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ success: false, message: tokenError });
  }

  verifyJWT(token)
    .then((decoded) => {
      req.id = decoded.id;
      req.sub = decoded.sub;
      req.username = decoded.username;
      return next();
    })
    .catch((err) => {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ success: false, message: tokenError, err });
    });
};
