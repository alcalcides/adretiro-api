import nodemailer from "nodemailer"

import { setup } from "./mail-config.js"

export function sendEMail(emailForm) {
  const remetente = nodemailer.createTransport(setup);
  return remetente.sendMail(emailForm);
}
