const subject = "Recuperação de Senha";
import { setup } from "./mail-config.js";
import { getMessage } from "./content.js";
import { generateJWT } from "../utils/generateJWT.js";

async function loadMessage(origin, username) {
  const passwordRecoveryLink = await PasswordRecoveryLinkBuilder(origin, username);
  return getMessage(passwordRecoveryLink);
}

async function PasswordRecoveryLinkBuilder(origin, username) {
  const auth = await generateJWT({username});
  return `${origin}/reset-password?auth=${auth}`;
}

export async function emailFormBuilder(email, username, origin) {  
  return {
    from: setup.auth.user,
    to: email,
    subject,
    html: await loadMessage(origin, username),
  };
}
