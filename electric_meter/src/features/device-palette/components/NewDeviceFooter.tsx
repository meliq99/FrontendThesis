import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CreateNewDeviceFooterProps {
    onCancel: () => void;
    isEditMode?: boolean;
}

const CreateNewDeviceFooter = ({ onCancel, isEditMode = false }: CreateNewDeviceFooterProps) => {
    return (
        <DialogFooter className="flex justify-center">
            <div className="flex gap-5">
                <Button 
                    type="button" 
                    onClick={onCancel}
                    className="bg-red-50 text-red-700 ring-red-500 hover:bg-red-200 px-4 py-2 rounded-full text-sm font-medium ring-1 transition"
                > 
                    Cancel 
                </Button>

                <Button 
                    type="submit" 
                    className="bg-green-50 text-green-700 ring-green-200 hover:bg-green-200 px-4 py-2 rounded-full text-sm font-medium ring-2 transition"
                > 
                    {isEditMode ? "Update Device" : "Create Device"}
                </Button>
            </div>
        </DialogFooter>
    )
}

export default CreateNewDeviceFooter;