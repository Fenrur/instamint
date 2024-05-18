"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect, useState} from "react"

import {Button} from "@/components/ui/button"
import {useQuery} from "@tanstack/react-query"
import {toast} from "sonner"
import {cn} from "@/lib/utils"
import {ErrorCode} from "@/http/error-code"
import {RightPanel} from "../../signup/right-panel"


async function fetchProfileData(): Promise<ProfileData> {
  const response = await fetch("/api/profile")

  if (response.ok) {
    const resp = await response.json()

    return resp.profile
  }

  throw new Error("Network response was not ok")
}

interface ProfileData {
  username: string;
  bio: string;
  avatarUrl: string;
  link: string;
}

export default function MePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    bio: "",
    link: "",
    avatarUrl: ""
  })
  const [errors, setErrors] = useState<any>({
    username: "",
    link: ""
  })
  const {data: profile, isLoading, isError} = useQuery(["profileData"], fetchProfileData)

  useEffect(() => {
    if (profile) {
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
          .catch(() => {
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
  }, [profile])

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
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formDataWithImage
        // No Content-Type header needed, browser will set the correct multipart/form-data boundary
      })

      if (response.ok) {
        setErrors({
          username: "",
          link: ""
        })
        toast.success("Successfully updated", {description: "Your profile has been updated."})
      } else {
        const error = await response.json()
        setErrors({
          username: error.errorCode === ErrorCode.USERNAME_ALREADY_USED ? error.title : "",
          link: error.errorCode === ErrorCode.LINK_ALREADY_USED ? error.title : ""
        })
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
            <Label htmlFor="username" className={errors.username ? "text-destructive" : ""}>Username</Label>
            <Input
              name="username"
              id="username"
              type="text"
              required
              defaultValue={formData.username}
              onChange={handleInputChange}
            />
            <div hidden={errors.username === ""}
                 className={cn("text-sm", errors.username ? "text-destructive" : "")}>{errors.username}</div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link" className={errors.link ? "text-destructive" : ""}>Link</Label>
            <Input
              name="link"
              id="link"
              type="text"
              required
              defaultValue={formData.link}
              onChange={handleInputChange}
            />
            <div hidden={errors.link === ""}
                 className={cn("text-sm", errors.link ? "text-destructive" : "")}>{errors.link}</div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio" className={errors.bio ? "text-destructive" : ""}>Bio</Label>
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