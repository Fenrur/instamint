"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect, useState} from "react"

import {Button} from "@/components/ui/button"
import {useQuery} from "@tanstack/react-query"
import {RightPanel} from "../signup/right-panel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle
} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {SelectViewport} from "@radix-ui/react-select";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";

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

async function fetchProfileData(): Promise<any> {
    const response = await fetch("/api/profile")
    if (response.ok) {
        return response.json()
    }

    throw new Error("Network response was not ok")
}
async function fetchTeaBags(): Promise<TeaBag[]> {
    const response = await fetch("/api/tea-bag")
    if (response.ok) {
        return response.json()
    }

    throw new Error("Network response was not ok")
}

interface TeaBag {
    username: string;
    bio: string;
    nCooks: number;
    nFollowed: number;
    link: string;
    whitelistUserIds: string[];
    whitelist: {
        start: Date;
        end: Date;
    }
}

export default function MePage(props: SignupPageProps) {
    const error = parseError(props)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [formData, setFormData] = useState<TeaBag>({
        username: "",
        bio: "",
        link: "",
        nCooks: 10,
        nFollowed: 10,
        whitelistUserIds: [],
        whitelist: {
            start: new Date(),
            end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
        }
    })
    const {data:profileData} = useQuery(["profileData"], fetchProfileData)
    const {data:teaBags} = useQuery(["teaBags"], fetchTeaBags)
    const [isOpen, setIsOpen] =useState(true);

    useEffect(() => {
        if (profileData && profileData.profile) {
            const profile = profileData.profile;
            setFormData(profile);
        }
    }, [profileData])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("/api/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
    }
    return (
        <>
            <RightPanel title="Profile" text="You can edit your profile details" width="w-[350px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>Full name</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {teaBags.map(item => (
                            <TableRow key={item}>
                                <TableCell>{item}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </RightPanel>


            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="DialogOverlay"/>
                    <DialogContent className="DialogContent">
                        <DialogTitle className="DialogTitle">Add TEA BAG</DialogTitle>
                        <DialogDescription className="DialogDescription">
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>

                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username" className={error ? "text-destructive" : ""}>Username</Label>
                                <Input
                                    name="username"
                                    id="username"
                                    type="text"
                                    required
                                    defaultValue={formData.username}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="link" className={error ? "text-destructive" : ""}>Link</Label>
                                <Input
                                    name="link"
                                    id="link"
                                    type="text"
                                    required
                                    defaultValue={formData.link}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio" className={error ? "text-destructive" : ""}>Bio</Label>
                                <textarea
                                    name="bio"
                                    id="bio"
                                    required
                                    defaultValue={formData.bio}
                                />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="nFollowed" className={error ? "text-destructive" : ""}>Number of
                                    followed</Label>
                                <Input
                                    name="nFollowed"
                                    id="nFollowed"
                                    type="number"
                                    required
                                    defaultValue={formData.nFollowed}
                                />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="nCooks" className={error ? "text-destructive" : ""}>Number of
                                    Cook's</Label>
                                <Input
                                    name="nCooks"
                                    id="nCooks"
                                    type="text"
                                    required
                                    defaultValue={formData.nCooks}
                                />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="whitelistUsers" className={error ? "text-destructive" : ""}>Whitelist
                                    Users</Label>
                                <Select defaultValue="orange" name={"whitelistUsers"}>
                                    <SelectTrigger/>
                                    <SelectContent>
                                        <SelectViewport>
                                            <SelectItem value="orange">Orange</SelectItem>
                                        </SelectViewport>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1">
                                <div className="flex flex-wrap gap-2">
                                    <div className="w-1/2">
                                        <Label htmlFor="whitelistStart" className={error ? "text-destructive" : ""}>Whitelist
                                            start date</Label>
                                        <Input
                                            name="whitelist.start"
                                            id="whitelistStart"
                                            type="date"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <Label htmlFor="whitelistEnd" className={error ? "text-destructive" : ""}>Whitelist
                                            end date</Label>
                                        <Input
                                            name="whitelist.end"
                                            id="whitelistEnd"
                                            type="date"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-around">
                                <Button type="submit" className="w-1/2">
                                    Validate
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>

    )
}
