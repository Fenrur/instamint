import crypto from "crypto"

const ALGORITHM = "aes256"
const INPUT_ENCODING = "utf8"
const OUTPUT_ENCODING = "hex"
const IV_LENGTH = 16

export function symmetricEncrypt(text: string, key: string) {
  const hash = crypto.createHash("sha256")
  hash.update(key)
  const bufferedKey = hash.digest()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, bufferedKey, iv)
  let ciphered = cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING)
  ciphered += cipher.final(OUTPUT_ENCODING)
  const ciphertext = `${iv.toString(OUTPUT_ENCODING)}:${ciphered}`

  return ciphertext
}

export function symmetricDecrypt(text: string, key: string) {
  const hash = crypto.createHash("sha256")
  hash.update(key)
  const bufferedKey = hash.digest()
  const components = text.split(":")
  const ivFromCipherText = Buffer.from(components.shift() || "", OUTPUT_ENCODING)
  const decipher = crypto.createDecipheriv(ALGORITHM, bufferedKey, ivFromCipherText)
  let deciphered = decipher.update(components.join(":"), OUTPUT_ENCODING, INPUT_ENCODING)
  deciphered += decipher.final(INPUT_ENCODING)

  return deciphered
}
