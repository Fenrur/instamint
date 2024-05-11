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
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {DateTime} from "luxon";
import {toast} from "sonner";
import MultiSelect from "@/components/ui/multi-select";

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

async function fetchUsers(): Promise<ValueLabel[]> {
    const response = await fetch("/api/user")
    if (response.ok) {
        return response.json()
    }

    throw new Error("Network response was not ok")
}

async function fetchNFTs(): Promise<ValueLabel[]> {
    const response = await fetch("/api/tea-bag/nft")
    if (response.ok) {
        return response.json()
    }

    throw new Error("Network response was not ok")
}

interface ValueLabel {
    _value: number;
    _label: string
}

export interface TeaBag {
    username: string;
    bio: string;
    nCooks: number;
    nFollowed: number;
    nFollowers: number;
    link: string;
    nftIds: number[];
    whitelistUserIds: number[];
    whitelistStart: DateTime;
    whitelistEnd: DateTime;
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
        nFollowers: 10,
        nftIds: [],
        whitelistUserIds: [],
        whitelistStart: DateTime.now(),
        whitelistEnd: DateTime.now()
    })
    const {
        data: profileData,
        isSuccess: isProfileDataLoaded
    } = useQuery(["profileData"], fetchProfileData, {enabled: false})
    const {data: teaBags, isSuccess: isTeaBagsLoaded} = useQuery(["teaBags"], fetchTeaBags)
    const {data: users, isSuccess: isUsersLoaded} = useQuery(["users"], fetchUsers)
    const {data: NFTs, isSuccess: isNFTsLoaded} = useQuery(["NFTs"], fetchNFTs)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (profileData && profileData.profile) {
            const profile = profileData.profile;
            setFormData(profile);
        }
    }, [profileData])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("/api/tea-bag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            toast.success("Successfully created", {description: "Your Tea Bag has been created."});
            setIsOpen(false);
            console.log("Success:", await response.json());
        } else {
            toast.error("Error", {description: "Failed to create Tea Bag"});
            throw new Error('Failed to create Tea Bag');
        }

    }

    const handleFormOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <>
            <RightPanel title="Profile" text="You can edit your profile details" width="w-[350px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>nFollowed</TableCell>
                            <TableCell>nFollowers</TableCell>
                            <TableCell>nCooks</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isTeaBagsLoaded &&
                            teaBags.map(item => (
                                    <TableRow key={item.username}>
                                        <TableCell>{item.username}</TableCell>
                                        <TableCell>{item.nFollowed}</TableCell>
                                        <TableCell>{item.nFollowers}</TableCell>
                                        <TableCell>{item.nCooks}</TableCell>
                                    </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </RightPanel>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="Button violet">Create Tea Bag</Button>
                </DialogTrigger>

                <DialogPortal>
                    <DialogOverlay className="DialogOverlay"/>
                    <DialogContent className="DialogContent">
                        <DialogTitle className="DialogTitle">Add TEA BAG</DialogTitle>
                        <DialogDescription className="DialogDescription">
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>

                        <form onSubmit={handleSubmit} className="grid gap-4" onChange={handleFormOnChange}>
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
                                <Label htmlFor="nFollowers" className={error ? "text-destructive" : ""}>Number of
                                    followers</Label>
                                <Input
                                    name="nFollowers"
                                    id="nFollowers"
                                    type="number"
                                    required
                                    defaultValue={formData.nFollowers}
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
                                <Label htmlFor="nftIds" className={error ? "text-destructive" : ""}>NFTs list</Label>
                                {isNFTsLoaded && <MultiSelect name={"nftIds"} onValueChange={(values) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        nftIds: values.map(item => +item)
                                    }))
                                }}
                                                              options={NFTs.map(item => ({
                                                                  value: item._value.toString(),
                                                                  label: item._label
                                                              }))}
                                                              defaultValue={formData.nftIds.map(item => item.toString())}
                                                              placeholder="Select NFTs"/>}
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="whitelistUserIds" className={error ? "text-destructive" : ""}>Whitelist
                                    Users</Label>
                                {isUsersLoaded && <MultiSelect name={"whitelistUserIds"} onValueChange={(values) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        whitelistUserIds: values.map(item => +item)
                                    }))
                                }}
                                                               options={users.map(item => ({
                                                                   value: item._value.toString(),
                                                                   label: item._label
                                                               }))}
                                                               defaultValue={formData.whitelistUserIds.map(item => item.toString())}
                                                               placeholder="Users"/>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-full">
                                    <Label htmlFor="whitelistStart" className={error ? "text-destructive" : ""}>Whitelist
                                        start date</Label>
                                    <Input
                                        defaultValue={formData.whitelistStart}
                                        name="whitelist.start"
                                        id="whitelistStart"
                                        type="date"
                                        required
                                    />
                                </div>

                                <div className="w-full">
                                    <Label htmlFor="whitelistEnd" className={error ? "text-destructive" : ""}>Whitelist
                                        end date</Label>
                                    <Input
                                        defaultValue={formData.whitelistEnd}
                                        name="whitelist.end"
                                        id="whitelistEnd"
                                        type="date"
                                        required
                                    />
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
