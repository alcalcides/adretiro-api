const { getDBTimes } = require("../../controllers/utils/getDBTimes");
const { createRegister } = require("../interface/create");
const { raffle } = require("../utils/numberLuck");
const cryptoRandomString = require("crypto-random-string");
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
}

fillTableStickers();
