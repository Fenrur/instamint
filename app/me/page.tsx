"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect, useState} from "react"

import {Button} from "@/components/ui/button"
import {useQuery} from "@tanstack/react-query"
import {RightPanel} from "../signup/right-panel"
import {toast} from "sonner"

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
    avatarUrl: string;
    link: string;
}

export default function MePage(props: SignupPageProps) {
    const error = parseError(props)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [formData, setFormData] = useState<ProfileData>({
        username: "",
        bio: "",
        link: "",
        avatarUrl: ""
    })
    const {data, isLoading, isError} = useQuery(["profileData"], fetchProfileData)

    useEffect(() => {
        if (data && data.profile) {
          const profile = data.profile
            const updatedFormData = {
                username: profile.username,
                bio: profile.bio,
                link: profile.link,
                avatarUrl: profile.avatarUrl || "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Willow"
            }

            if (profile.avatarUrl) {
                // Check if avatarUrl exists
              fetch(profile.avatarUrl, {method: "HEAD"})
                    .then(response => {
                        if (response.ok) {
                          setFormData(updatedFormData)
                        } else {
                            // If avatarUrl doesn't exist, set default
                            setFormData({
                                ...updatedFormData,
                                avatarUrl: "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Willow"
                            })
                        }
                    })
                    .catch(error => {
                      console.error("Error checking avatar URL:", error)
                        // If there's an error, set default
                        setFormData({
                            ...updatedFormData,
                            avatarUrl: "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Willow"
                        })
                    })
            } else {
                // If avatarUrl doesn't exist, set default
              setFormData(updatedFormData)
            }
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

        // Assume profileImage is already in base64 format if it's included in formData
      const formDataWithImage = new FormData()
      formDataWithImage.append("username", formData.username)
      formDataWithImage.append("bio", formData.bio)
      formDataWithImage.append("link", formData.link)
      formDataWithImage.append("avatar", profileImage as string)

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
              body: formDataWithImage
              // No Content-Type header needed, browser will set the correct multipart/form-data boundary
            })

            if (response.ok) {
              toast.success("Successfully updated", {description: "Your profile has been updated."})
            } else {
              toast.error("Error", {description: "Failed to update profile"})
            }
        } catch (error) {
          toast.error("Error", {description: "Failed to update profile"})
        }
    }


  return (
        <RightPanel title="Profile" text="You can edit your profile details" width="w-[350px]">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="flex justify-center items-center flex-col">

                        <div className="rounded-full overflow-hidden border-2 border-gray-300 w-36 h-36">
                            <img
                                src={profileImage ?? formData.avatarUrl}
                                className="w-full h-full object-cover"
                            />
                        </div>

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
                        <Button type="submit" className="w-1/2">
                            Validate
                        </Button>
                    </div>
                </div>
            </form>
        </RightPanel>
    )
}
