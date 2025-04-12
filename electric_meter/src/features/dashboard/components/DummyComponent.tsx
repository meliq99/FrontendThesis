import { Button } from "@/components/ui/button";
import { JSX, useCallback, useEffect, useState } from "react";


interface DummyComponentProps {
    text: string;
    color: string;
    consumption: number;
    icon: JSX.Element;
}

const DeviceItem = ({ text, color, consumption, icon }: DummyComponentProps) => {
    const [isOn, setIsOn] = useState(false);
    
    const handleTurnOnOff = useCallback(() => {
       setIsOn(!isOn);
    }, [isOn]);

    useEffect(() => {
        console.log(isOn);
    }, [isOn]);

    return (
        <div className={`bg-${color}-${isOn ? '400' : '500'} flex flex-col items-center justify-center p-2 rounded-md border cursor-move transition-colors`}>
            <div className="p-2 rounded-full bg-primary/10 text-primary">
                {icon}
            </div>
            <p>{text}</p>
            <p>{consumption}</p>
            <Button onClick={handleTurnOnOff} className="hover:cursor-pointer">
                {isOn ? 'Turn Off' : 'Turn On'}
            </Button>
        </div>
    );
};

export default DeviceItem;


