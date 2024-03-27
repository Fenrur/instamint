import {NextRequest, NextResponse} from "next/server"
import {transporter} from "@/mail/mailer"
import {env} from "@/env"
import {render} from "@react-email/render"
import Email from "@/mail/templates/hello-world"

export async function POST(req: NextRequest) {
  const link = "https://blog.tinnirello-livio.me/"

  try {
    await transporter.sendMail({
      from: env.GMAIL_EMAIL,
      to: "tinnirellolivio@gmail.com",
      subject: "Reset Password",
      text: "Reset Password Messsage",
      html: render(Email())
    })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, {status: 400})
  }

  return NextResponse.json({ success: true }, {status: 200})
}
