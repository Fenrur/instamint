"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect, useState} from "react"

import {Button} from "@/components/ui/button"
import {toast} from "sonner"
import {RightPanel} from "../../signup/right-panel"
import {useGetProfileData, useUpdateProfile} from "@/repository/hooks"
import {Textarea} from "@/components/ui/textarea"


export interface ProfileData {
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
  const {profileData, profileDataMutate, errorProfileData} = useGetProfileData()
  const {updateProfile, dataUpdateProfile} = useUpdateProfile()
  void profileDataMutate()


  useEffect(() => {
    if (errorProfileData) {
      switch (errorProfileData) {
        case "not_authenticated":
          toast.error("Not authenticated", {description: "you are not authenticated"})

          break

        case "bad_session":
          toast.error("bad session", {description: "your session is not available pleas try to login again"})

          break

        default:
          toast.error("fetching your profile data", {description: "an error happened while we try to load your profile data"})

          break
      }
    }
  }, [errorProfileData])

  useEffect(() => {
    if (profileData) {
      const data = {
        username: profileData.username,
        bio: profileData.bio,
        link: profileData.link,
        avatarUrl: profileData.avatarUrl
      }
      setFormData(data)
    }
  }, [profileData])

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

    const formDataWithImage = {
      ...formData,
      "avatar": profileImage as string
    }
    await updateProfile(formDataWithImage)
  }

  useEffect(() => {
    if (dataUpdateProfile) {
      switch (dataUpdateProfile) {
        case "invalid_query_params":
          toast.error("Invalid query parameters", {description: "Please check the parameters and try again."})

          break

        case "not_authenticated":
          toast.error("Not authenticated", {description: "You need to be logged in to perform this action."})

          break

        case "bad_session":
          toast.error("Session expired", {description: "Your session has expired. Please log in again."})

          break

        case "link_already_used":
          toast.error("Link already used", {description: "The link you are trying to use has already been used."})

          break

        case "username_already_used":
          toast.error("Username already used", {description: "The username you have chosen is already taken. Please choose a different username."})

          break

        default:
          toast.success("Updated", {description: "your profile updated successfully "})

          break
      }
    }
  }, [dataUpdateProfile])

  return (
    <RightPanel title="Profile" text="You can edit your profile details" width="w-[350px]" className="mt-4">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex justify-center items-center flex-col">
            <div className="rounded-full overflow-hidden border-2 border-gray-300 w-36 h-36">
              <img
                alt="Profile Image"
                src={profileImage ?? formData.avatarUrl}
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="fileInput"
              className="hidden"
            />
            <label htmlFor="fileInput" className="mt-4 text-blue-500 cursor-pointer underline">
              Choose avatar
            </label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              id="username"
              type="text"
              required
              placeholder="username"
              defaultValue={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Link</Label>
            <Input
              name="link"
              id="link"
              type="text"
              required
              placeholder="your unique link"
              defaultValue={formData.link}
              onChange={handleInputChange}
            />

          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              placeholder="Tell us a little bit about yourself"
              className="resize-none"
              name="bio"
              id="bio"
              onChange={handleInputChange}
            />
          </div>

          <div className="justify-around" style={{display: "flex", justifyContent: "space-around"}}>
            <Button
              variant="default"
              size="sm"
              className="mt-2 w-1/2"
              type="submit"
            >
              Validate
            </Button>

          </div>
        </div>
      </form>
    </RightPanel>
  )
}
