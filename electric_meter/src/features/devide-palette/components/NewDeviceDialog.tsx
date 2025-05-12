import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateNewDeviceHeader from "./NewDeviceHeader"
import CreateNewDeviceFooter from "./NewDeviceFooter"
import { Plus } from "lucide-react"

export const NewDeviceDialog = () => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Custom Device
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <CreateNewDeviceHeader />

                {/* <NewDeviceForm/> */}
                <CreateNewDeviceFooter/>

            </DialogContent>
        </Dialog>
    )
}

export default NewDeviceDialog;