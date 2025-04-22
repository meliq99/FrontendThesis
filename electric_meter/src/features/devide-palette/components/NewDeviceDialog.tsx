import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateNewDeviceHeader from "./NewDeviceHeader"
import CreateNewDeviceFooter from "./NewDeviceFooter"

export const NewDeviceDialog = () => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"> Create New Devices</Button>
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