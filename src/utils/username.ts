import {generateUsername as generate} from "unique-username-generator"

export function generateUsername() {
  return generate("_", 3, 18)
    .replace("-", "_")
}
