"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect} from "react"
import {NFTData,} from "@/components/NFT/NFTList"

import {RightPanel} from "../search/right-panel";
import {Button} from "@/components/ui/button";

type SignupPageError = "email_verification_limit_exceeded" | "email_exists";

interface SignupPageProps {
    searchParams: {

        error?: SignupPageError;
    };
}

function parseError(props: SignupPageProps): SignupPageError | null {
    const error = props.searchParams.error
    if (error === "email_verification_limit_exceeded") {
        return "email_verification_limit_exceeded"
    }
    return null
}


export default function SignupPage(props: SignupPageProps) {
    const error = parseError(props);

    return (
        <RightPanel title="Profile" text="you can edite your profile details" width="w-[350px]">
            <form action="/api/profile/update" method="POST">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <img alt="profil image" src={""} height={150} width={150}/>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className={error ? "text-destructive" : ""}>Username</Label>
                        <Input
                            name="username"
                            id="username"
                            type="text"
                            required
                            defaultValue={""}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio" className={error ? "text-destructive" : ""}>Bio</Label>
                        <Input
                            multiple
                            max={10}
                            name="bio"
                            id="bio"
                            type="text"
                            required
                            defaultValue={""}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="uniqueLink" className={error ? "text-destructive" : ""}>Link</Label>
                        <Input
                            name="uniqueLink"
                            id="uniqueLink"
                            type="text"
                            required
                            defaultValue={""}
                        />
                    </div>
                    <div className="justify-around" style={{display: "flex", justifyContent: "space-around"}}>
                        <Button type="submit" className="w-1/3">
                            Validate
                        </Button>
                        <Button type="" className="w-1/3">
                            Cancel
                        </Button>
                    </div>

                </div>
            </form>
        </RightPanel>
    )
}
