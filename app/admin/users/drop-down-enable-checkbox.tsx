import { Checkbox } from "@/components/ui/checkbox"
import {useState} from "react"
import {useEnableOrDisable} from "@/repository/hooks"

interface IdSectionProps {
  activate: boolean
  id: number
  changeActivateToFalse: () => void
  changeActivateToTrue: () => void
}

const DropDownEnableCheckbox = ({...props} : IdSectionProps) => {
  const [activated, setActivated] = useState(props.activate)
  const {enableOrDisable} = useEnableOrDisable(props.id)
  const enableActivate = async() => {
    const result = await enableOrDisable()

    if (result === "disabled") {
      props.changeActivateToFalse()
      setActivated(false)
    }
    else if (result === "enabled") {
      props.changeActivateToTrue()
      setActivated(true)
    }
  }

  return (
    <Checkbox checked={activated} onClick={enableActivate} />
  )
}

export default DropDownEnableCheckbox
