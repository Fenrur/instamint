"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect, useState} from "react"

import {RightPanel} from "../search/right-panel"
import {Button} from "@/components/ui/button"
import {profileService} from "@/services"
import {useQuery} from "@tanstack/react-query"

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

interface ProfileData {
    username: string;
    bio: string;
    profileImage: string;
    link: string;
}

export default function MePage(props: SignupPageProps) {
    const error = parseError(props)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        link: ""
    })
    const {data, isLoading, isError} = useQuery(["profileData"], fetchProfileData)

    useEffect(() => {
        if (data && data.profile) {
            const profile = data.profile as ProfileData
            setFormData({
                username: profile.username,
                bio: profile.bio,
                uniqueLink: profile.link
            })
        }
    }, [data])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formDataWithImage = {
            ...formData,
            profileImage
        }

        // Send formDataWithImage to your API endpoint using fetch or axios
        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify(formDataWithImage),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log("Success:", response)
        } catch (error) {
            console.error("Error:", error)
        }
    }

    return (
        <RightPanel title="Profile" text="You can edit your profile details" width="w-[350px]">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="flex justify-center items-center flex-col">
                        {profileImage && (
                            <div className="rounded-full overflow-hidden border-2 border-gray-300 w-36 h-36">
                                <img
                                    alt="profile image"
                                    src={profileImage}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        {!profileImage && (
                            <div
                                className="rounded-full overflow-hidden border-2 border-gray-300 w-36 h-36 flex justify-center items-center">
                                <span className="text-gray-400">No image selected</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-4"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className={error ? "text-destructive" : ""}>Username</Label>
                        <Input
                            name="username"
                            id="username"
                            type="text"
                            required
                            defaultValue={formData.username}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio" className={error ? "text-destructive" : ""}>Bio</Label>
                        <textarea
                            name="bio"
                            id="bio"
                            required
                            defaultValue={formData.bio}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="justify-around" style={{display: "flex", justifyContent: "space-around"}}>
                        <Button type="submit" className="w-1/3">
                            Validate
                        </Button>
                        <Button className="w-1/3">
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </RightPanel>
    )
}
