import Cryptr from "cryptr";
// const secretKey = process.env.CRYPTR_SECRET_KEY;
// const cryptr = new Cryptr(`${secretKey}`);
import bcrypt from "bcrypt";

export const encryptPassword = (password: string) => {
  const secretKey = process.env.CRYPTR_SECRET_KEY;
  const cryptr = new Cryptr(`${secretKey}`);
  const encryptedPassword = cryptr.encrypt(password);
  return encryptedPassword;
};

export const decryptPassword = (encryptedPassword: string) => {
  const secretKey = process.env.CRYPTR_SECRET_KEY;
  const cryptr = new Cryptr(`${secretKey}`);
  const decryptedPassword = cryptr.decrypt(encryptedPassword);
  return decryptedPassword;
};

// Function to hash a password using bcrypt
export const hashPassword = async (password: string) => {
  const saltRounds = 10; // Number of salt rounds to use
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with its hash using bcrypt
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  console.log("password,hashedPassword", password, hashedPassword);
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const encryptEmail = (email) => {
  const splitData = email.split("@");

  let name = splitData[0];

  let maskedName = name.slice(0, -2);

  let encryptedName = maskedName + "**";
  return `${encryptedName}@${splitData[1]}`;
};
