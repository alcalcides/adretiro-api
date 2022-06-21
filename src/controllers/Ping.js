import { StatusCodes } from "http-status-codes";

export function helloWorld(req, res) {
  return res.status(StatusCodes.OK).send("<h1>Hello World</h1>");
}
