import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DropDownEnable from "@/components/ui/dropDownEnable"
import { MoreHorizontal } from "lucide-react"
import Modal from "react-modal"
import {useState} from "react"
import { Button } from "@/components/ui/button"

interface AdminSectionProps {
  enable : boolean
  id : number
}

const AdminDropDownMenu = ({...props} : AdminSectionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Modal isOpen={isOpen} className="h-screen flex flex-col items-center justify-center">
        <h3 className="text-5xl mb-32">
          Do you want to remove this element ?
        </h3>
        <form className="flex" method="post" action={`/api/admin/users/user/delete?id=${props.id}`}>
          <Button
            type="submit"
            className="w-24 h-16 ml-8 mr-8 bg-red-600 w-100 hover:bg-red-500 text-3xl">
            yes
          </Button>
          <Button
            onClick={() => {setIsOpen(false)}}
            className="w-24 h-16 ml-8 w-100 border border-black text-black bg-white hover:bg-black hover:text-white
               text-3xl">
            No
          </Button>
        </form>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {props.enable ? (
          <DropDownEnable id={props.id} />) : (
            <></>
          )
          }
          <DropdownMenuItem onClick={() => {setIsOpen(true)}} className="text-destructive w-100 bg-white border-none">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default AdminDropDownMenu
