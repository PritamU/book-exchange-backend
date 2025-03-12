const bip39 = require("bip39");
import crypto from "crypto";

// function generateRandomString(length: number) {
//   const randomBytes = crypto.randomBytes(length);
//   return crypto
//     .createHash("sha256")
//     .update(randomBytes)
//     .digest("hex")
//     .substring(0, length);
// }

function generateOtp(length: number) {
  let randomSixDigitCharacter = "";
  let codeLength = length ? length : 6;
  for (let i = 0; i < codeLength; i++) {
    randomSixDigitCharacter += generateRandomNumbers();
  }
  return randomSixDigitCharacter;
}

function generateRandomNumbers() {
  const characters = "0123456789";
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateSecretKey = (length?: number) => {
  let fixLength = length ? length : 32;
  return crypto.randomBytes(fixLength).toString("hex");
};

const generateHash = (number: number) => {
  //generate unique winning number
  const secretKey = generateSecretKey();
  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(number.toString().toUpperCase())
    .digest("hex");

  return { secretKey, hash };
};

const generateMnemonic = () => {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
};

function generateRandomInt(min: number, max: number, exclude: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  generateHash,
  generateMnemonic,
  generateOtp,
  generateRandomInt,
  generateRandomNumbers,
  // generateRandomString,
  generateSecretKey,
  getRandomNumber,
};
