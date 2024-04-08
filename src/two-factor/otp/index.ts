import { authenticator as a } from "otplib"

export function authenticator() {
  a.options = { window: 1 }

  
return a
}
