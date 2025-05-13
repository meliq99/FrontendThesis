import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const CreateNewDeviceHeader = () => {
    return (
        <DialogHeader>
            <DialogTitle>Create New Device</DialogTitle>
            <DialogDescription>
            Add a custom device to the palette. Fill in the details below.
            </DialogDescription>
        </DialogHeader>
    )
}

export default CreateNewDeviceHeader;