const subject = "Recuperação de Senha";
const { setup } = require("./mail-config");
const { getMessage } = require("./content");
const { generateJWT } = require("../utils/generateJWT");

async function loadMessage(origin, username) {
  const passwordRecoveryLink = await PasswordRecoveryLinkBuilder(origin, username);
  return getMessage(passwordRecoveryLink);
}

async function PasswordRecoveryLinkBuilder(origin, username) {
  const auth = await generateJWT({username});
  return `${origin}/reset-password?auth=${auth}`;
}

async function emailFormBuilder(email, username, origin) {  
  return {
    from: setup.auth.user,
    to: email,
    subject,
    html: await loadMessage(origin, username),
  };
}

module.exports = { emailFormBuilder };
