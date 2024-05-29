import {useRouter} from "next/navigation"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface IdSectionProps {
    id: number,
}

const DropDownEnable = ({id} : IdSectionProps) => {
  const router = useRouter()
  const enableAndReload = () => {
    router.push(`/api/admin/users/user?id=${id}`)
    location.reload()
  }

  return (
    <DropdownMenuItem onClick={() => {enableAndReload()}} className="text-primary">
      Revert enabled
    </DropdownMenuItem>
  )
}

export default DropDownEnable
