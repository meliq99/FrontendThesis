import { useState } from "react";

const useCounter = () => {
    const [counter, setCounter] = useState(0);

    const updateCounter = () => {
        setCounter(counter + 1)
    }

    return {
        counter,
        updateCounter
    }
}

export const useCounter2 = () => {
    const [counter, setCounter] = useState(0);

    const updateCounter = () => {
        setCounter(counter + 1)
    }

    return {
        counter,
        updateCounter
    }
}


export default useCounter;