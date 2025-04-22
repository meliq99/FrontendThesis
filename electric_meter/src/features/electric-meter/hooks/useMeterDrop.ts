import { useDrop } from "react-dnd";

export const useMeterDrop = () => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "device",
    drop: () => ({ name: "EnergyMeter" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const dropRef = (element: HTMLDivElement | null) => {
    drop(element);
  };

  return { isOver, dropRef };
}; 