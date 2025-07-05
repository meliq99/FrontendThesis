import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CreateNewDeviceHeaderProps {
    isEditMode?: boolean;
}

const CreateNewDeviceHeader = ({ isEditMode = false }: CreateNewDeviceHeaderProps) => {
    return (
        <DialogHeader>
            <DialogTitle>
                {isEditMode ? "Edit Device" : "Create New Device"}
            </DialogTitle>
            <DialogDescription>
                {isEditMode 
                    ? "Update the device details below." 
                    : "Add a custom device to the palette. Fill in the details below."
                }
            </DialogDescription>
        </DialogHeader>
    )
}

export default CreateNewDeviceHeader;