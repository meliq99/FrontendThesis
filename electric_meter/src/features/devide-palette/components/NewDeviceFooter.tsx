import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const CreateNewDeviceFooter = () => {
    return (
        <DialogFooter className="flex justify-center">
            <DialogClose className="flex gap-5">
            <Button type="submit" className="bg-green-50 text-green-700 ring-green-200 hover:bg-green-200 px-4 py-2 rounded-full text-sm font-medium ring-2 transition" > Save </Button>
                <Button type="button" className="bg-red-50 text-red-700 ring-red-500 hover:bg-red-200 px-4 py-2 rounded-full text-sm font-medium ring-1 transition" > Cancel </Button>
                
            </DialogClose>

        </DialogFooter>
    )

}

export default CreateNewDeviceFooter;