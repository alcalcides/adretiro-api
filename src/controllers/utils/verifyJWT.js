import jwt from "jsonwebtoken";

export function verifyJWT(token, privateKey = process.env.JWT_PRIVATE_KEY) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, null, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

