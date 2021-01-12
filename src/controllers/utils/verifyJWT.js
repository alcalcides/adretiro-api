var jwt = require("jsonwebtoken");

function verifyJWT(token, privateKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, null, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
exports.verifyJWT = verifyJWT;
