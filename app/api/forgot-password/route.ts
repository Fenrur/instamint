import {NextRequest, NextResponse} from "next/server"
import {invalidContentTypeProblem, problem} from "@/http/problem"
import {SignupCredentials} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {DateTime} from "luxon"
import {transporter} from "@/mail/mailer"
import {render} from "@react-email/render"
import {env} from "@/env"
import * as u from "node:url"
import {passwordResetService, userService} from "@/services"
import ResetPassword from "@/mail/templates/reset-password";

async function createVerificationAndSendEmail(formData: SignupCredentials, createdAt: DateTime<true>, userId: number) {
    const resetId = await passwordResetService.create(userId, createdAt)

    const verificationLink = u.format({
        host: env.BASE_URL,
        pathname: "/api/forgot-password/verification-email",
        query: {resetId: resetId},
    })

    const emailHtml = render(ResetPassword({
        baseUrl: env.BASE_URL,
        contactEmail: env.CONTACT_EMAIL,
        instamintImageUrl: `${env.BASE_URL}/instamint.svg`,
        verificationLink,
    }))

    await transporter.sendMail({
        to: formData.email,
        subject: "Reset your password Instamint",
        html: emailHtml,
    })
}

export async function POST(req: NextRequest) {
    if (!isContentType(req, "form")) {
        return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
    }

    const createdAt = DateTime.now();
    const formData = await req.formData();
    let parsedFormData = null;
    const url = req.nextUrl.clone();

    try {
        parsedFormData = SignupCredentials.parse(formData);
    } catch (e: any) {
        url.pathname = "/signup";
        return NextResponse.redirect(url);
    }

    const user = await userService.findByEmail(parsedFormData.email);

    if (!user) {
        url.pathname = "/forgot-password";
        url.searchParams.set("error", "email_not_exists");
        return NextResponse.redirect(url);
    }

    url.pathname = "/verification-email-reset-password/sent"
    url.searchParams.set("email", parsedFormData.email)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createVerificationAndSendEmail(parsedFormData, createdAt, user.id)

    return NextResponse.redirect(url)
}
