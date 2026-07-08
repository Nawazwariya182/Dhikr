import CryptoJS from "crypto-js";

const PASSWORD = "";
const SALT = "";

function getKey() {
  return CryptoJS.PBKDF2(PASSWORD, SALT, {
    keySize: 256 / 32,
    iterations: 100000,
  });
}

export function encrypt(text:any) {
  const key = getKey();

  return CryptoJS.AES.encrypt(text, key.toString()).toString();
}

export function decrypt(cipher:any) {
  const key = getKey();

  const bytes = CryptoJS.AES.decrypt(cipher, key.toString());

  return bytes.toString(CryptoJS.enc.Utf8);
}

let a = encrypt("a")
let b = decrypt(a)

console.log({a,b});