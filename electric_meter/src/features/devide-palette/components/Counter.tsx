import { Button } from "@/components/ui/button";
import useCounterdewff, { useCounter2 } from "../hooks/useCounter";



const Counter = () => {
    const {counter, updateCounter} = useCounterdewff()


    return (<div className="flex gap-2">
        <p>
            {counter}
        </p>
        <Button
            type="button"
            onClick={updateCounter}
        >
            Click me!
        </Button>
    </div>)
}

export default Counter;