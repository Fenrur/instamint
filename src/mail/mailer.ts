import { env } from "@/env"
import nodemailer from "nodemailer"

const email = env.GMAIL_EMAIL
const pass = env.GMAIL_PASS

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass,
  },
})
