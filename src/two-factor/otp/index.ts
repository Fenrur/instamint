import { authenticator as authenticatorFromOtplib } from "otplib"

export function authenticator() {
  authenticatorFromOtplib.options = { window: 1 }

  return authenticatorFromOtplib
}
