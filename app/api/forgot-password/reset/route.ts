import {NextRequest, NextResponse} from "next/server";
import {passwordResetService, userService} from "@/services";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
    const url = req.nextUrl.clone();

    const resetId = url.searchParams.get("resetId");
    if (!resetId) {
        url.pathname = "/verification-email/invalid/url";
        return NextResponse.redirect(url);
    }

    const passwordReset = await passwordResetService.findByResetId(resetId)
    if (!passwordReset) {
        url.pathname = "/verification-email/invalid/url"
        return NextResponse.redirect(url)
    }

    const body = await req.formData();
    const pass  = body.get('password') as string
    await userService.updateUserById(passwordReset.userId+'', pass)

    url.pathname = "/login"
    //url.searchParams.set("email", passwordReset.email)
    return NextResponse.redirect(url)
}
