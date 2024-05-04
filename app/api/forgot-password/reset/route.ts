import {NextRequest, NextResponse} from "next/server";
import {emailVerificationService, userService} from "@/services";
import {isContentType} from "@/http/content-type";
import {invalidContentTypeProblem, problem} from "@/http/problem";
import {RegisterUserRequest} from "@/http/rest/types";

export const dynamic = "force-dynamic";


export const POST = async (req: NextRequest) => {
    const url = req.nextUrl.clone();

    const verificationId = url.searchParams.get("vid");
    if (!verificationId) {
        url.pathname = "/verification-email/invalid/url";
        return NextResponse.redirect(url);
    }

    const emailVerification = await emailVerificationService.findByVerificationId(verificationId)
    if (!emailVerification) {
        url.pathname = "/verification-email/invalid/url"
        return NextResponse.redirect(url)
    }

    const body = await req.formData();
    const pass  = body.get('password') as string
    await userService.updateUserPasswordByEmail(emailVerification.email, pass)

    url.pathname = "/login"
    url.searchParams.set("email", emailVerification.email)
    return NextResponse.redirect(url)
}
