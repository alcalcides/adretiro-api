import cryptoRandomString from "crypto-random-string";

import { getDBTimes } from "../../controllers/utils/getDBTimes.js";
import { createRegister } from "../interface/create.js";
import { raffle } from "../utils/numberLuck.js";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const labelSize = 5;

async function fillTableStickers() {
  const jacobsSonsList = raffle().chosens;
  for (var i = 0; i < jacobsSonsList.length; i++) {
    const { created_at, updated_at } = getDBTimes();

    var label = String(i * 10);
    if (label.length < 5) {
      label = cryptoRandomString({
        length: labelSize - label.length,
        characters: alphabet,
      }) + label;
    }

    const data = {
      fk_jacobs_son: jacobsSonsList[i],
      fk_sticker_status: 1,
      label,
      created_at,
      updated_at,
    };
    const dbResponse = await createRegister("stickers", data);
    console.log(dbResponse);
  }
  console.log("done")
  return true;
}

fillTableStickers();
process.exit(0);