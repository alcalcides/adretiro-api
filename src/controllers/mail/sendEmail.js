const nodemailer = require("nodemailer");
const { setup } = require("./mail-config.js");

function sendEMail(emailForm) {
  const remetente = nodemailer.createTransport(setup);
  return remetente.sendMail(emailForm);
}

module.exports = { sendEMail }
