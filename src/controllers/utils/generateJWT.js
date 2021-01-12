var jwt = require("jsonwebtoken");

const issuer = {"iss": "adretiro"}

function generateJWT(payload, privateKey = process.env.JWT_PRIVATE_KEY, timeoutInHours = 3) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {...payload, ...issuer},
      privateKey,
      { expiresIn: `${timeoutInHours}h` },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

function generateJWTAsync(payload, privateKey = process.env.JWT_PRIVATE_KEY) {
  return jwt.sign(payload, privateKey);
}

exports.generateJWT = generateJWT;
exports.generateJWTAsync = generateJWTAsync;
