import bcrypt from "bcrypt";

export const encryption = {
  generateSalt(numberOfCycles) {
    return bcrypt.genSalt(numberOfCycles).then((salt) => salt);
  },
  generateHash(data, salt) {
    return bcrypt.hash(data, salt).then((hash) => hash);
  },
  matchHash(password, hash){
    return bcrypt.compare(password, hash).then((value) => value);
  }
};
