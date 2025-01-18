import { useCallback } from "react"
import { toaster } from "../components/Misc/toaster"

const useShowToast = () => {
    const showToast = useCallback((title, description, status) => {
    toaster.create({
        title: title,
        description: description,
        status: status,
        duration: 3000,
        action: {
            label: "Close",
            onClick: () => console.log("Undo"),
          }
    })
  }, [toaster])
  
  return showToast
}

export default useShowToast