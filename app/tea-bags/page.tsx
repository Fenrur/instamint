"use client"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table"
import {DateTime} from "luxon"
import {toast} from "sonner"
import MultiSelect from "@/components/ui/multi-select"
import {EditIcon, FlagTriangleRight, Trash} from "lucide-react"
import {useFetchNFTs, useFetchTeaBags, useFetchUsers} from "@/repository/hooks"
import {useState} from "react"

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


export interface ValueLabel {
  value: number;
  label: string;
}

export interface TeaBag {
  id?: number;
  cooks_count?: number;
  followed_count?: number;
  followers_count?: number;

  username: string;
  bio: string;
  link: string;
  nftIds: number[];
  whitelistUserIds: number[];
  whitelistStart: DateTime;
  whitelistEnd: DateTime;
}

export default function TeaBagPage(props: SignupPageProps) {
  const error = parseError(props)
  const [formData, setFormData] = useState<TeaBag>({
    username: "",
    bio: "",
    link: "",
    nftIds: [],
    whitelistUserIds: [],
    whitelistStart: DateTime.now(),
    whitelistEnd: DateTime.now(),
  })

  //const {teaBagsData, teaBagsDataMutate} = useFetchTeaBags()
  void teaBagsDataMutate()

  const {usersData, usersDataMutate} = useFetchUsers()
  void usersDataMutate()

  const {nftsData, nftsDataMutate} = useFetchNFTs()
  void nftsDataMutate()

  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch("/api/tea-bag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      toast.success("Successfully created", {description: "Your Tea Bag has been created."})
      setIsOpen(false)
    } else {
      toast.error("Error", {description: "Failed to create Tea Bag"})
      throw new Error("Failed to create Tea Bag")
    }
  }
  const handleFormOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  async function handleOnClickDelete(id: number) {
    try {
      const response = await fetch(`/api/tea-bag/delete?id=${id}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Successfully deleted", {description: "The Tea Bag has been deleted."})
      } else {
        toast.error("Error", {description: "Failed to delete Tea Bag"})
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  async function handleOnClickReport(id: number) {
    try {
      const response = await fetch(`/api/tea-bag/report?id=${id}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Successfully Reported", {description: "The Tea Bag has been Reported."})
      } else {
        toast.error("Error", {description: "Failed to report Tea Bag"})
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  function handleOnClickEdite(id: number) {
    setSelectedId(id)
  }

  return (
    <>
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

            <form onSubmit={handleSubmit} className="grid gap-4"
                  onChange={handleFormOnChange}>
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
                <Label htmlFor="nftIds" className={error ? "text-destructive" : ""}>NFTs list</Label>
                {nftsData && <MultiSelect name={"nftIds"} onValueChange={(values) => {
                  setFormData(prevState => ({
                    ...prevState,
                    nftIds: values.map(item => Number(item))
                  }))
                }}
                                          options={nftsData.map(item => ({
                                            value: item.value.toString(),
                                            label: item.label
                                          }))}
                                          defaultValue={formData.nftIds.map(item => item.toString())}
                                          placeholder="Select NFTs"/>}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="whitelistUserIds" className={error ? "text-destructive" : ""}>Whitelist
                  Users</Label>
                {usersData && <MultiSelect name={"whitelistUserIds"} onValueChange={(values) => {
                  setFormData(prevState => ({
                    ...prevState,
                    whitelistUserIds: values.map(item => Number(item))
                  }))
                }}
                                           options={usersData.map(item => ({
                                             value: item.value.toString(),
                                             label: item.label
                                           }))}
                                           defaultValue={formData.whitelistUserIds.map(item => item.toString())}
                                           placeholder="Users"/>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
                  <Label htmlFor="whitelistStart" className={error ? "text-destructive" : ""}>Whitelist
                    start date</Label>
                  <Input
                    defaultValue={formData.whitelistStart.toString()}
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
                    defaultValue={formData.whitelistEnd.toString()}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Followed number</TableCell>
            <TableCell>Followers number</TableCell>
            <TableCell>Cooks number</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teaBagsData &&
            teaBagsData.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.followed_count}</TableCell>
                <TableCell>{item.followers_count}</TableCell>
                <TableCell>{item.cooks_count}</TableCell>
                <TableCell>

                  <EditIcon className={"hover:cursor-pointer"} color="green" size={20} onClick={() => {
                    handleOnClickEdite(item.id)
                  }}/>

                  <FlagTriangleRight className={"hover:cursor-pointer"} color="blue" size={20} onClick={() => {
                    void handleOnClickReport(item.id)
                  }}/>

                  <Trash className={"hover:cursor-pointer"} color="red" size={20} onClick={() => {
                    void handleOnClickDelete(item.id)
                  }}/>

                </TableCell>
              </TableRow>
            ))}
        </TableBody>

      </Table>

    </>

  )
}
