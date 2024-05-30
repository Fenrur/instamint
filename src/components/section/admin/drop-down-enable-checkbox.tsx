import { Checkbox } from "@/components/ui/checkbox"
import {useState} from "react"
import {enableOrDisableUser} from "@/repository"


interface IdSectionProps {
    activate: boolean,
    id: number
}

const DropDownEnableCheckbox = ({...props} : IdSectionProps) => {
  const [activated, setActivated] = useState(props.activate)
  const enableActivate = async() => {
    await enableOrDisableUser(props.id)
    setActivated(!activated)
  }

  return (
    <Checkbox checked={activated} onClick={enableActivate} />
  )
}

export default DropDownEnableCheckbox
