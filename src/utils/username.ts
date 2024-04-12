import {generateUsername as generate} from "unique-username-generator"

export function generateUsername() {
  let username = null
  do {
    username = generate("_", 3, 18)
  }
  while (username.includes("-"))

  return username
}
