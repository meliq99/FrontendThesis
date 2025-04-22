import { useDrop } from "react-dnd";

interface UseDropTargetProps {
  dropName?: string;
  onDrop?: (item: any) => void;
}

interface UseDropTargetResult {
  isOver: boolean;
  dropRef: (node: HTMLElement | null) => void;
}

export function useDropTarget({ 
  dropName = "ElectricMeter",
  onDrop
}: UseDropTargetProps = {}): UseDropTargetResult {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "device",
    drop: (item, monitor) => {
      console.log(`🎯 Device dropped on ${dropName}:`, item);
      
      if (onDrop) {
        onDrop(item);
      }
      
      return { name: dropName };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [dropName, onDrop]);

  // This fixes the TypeScript ref issue
  const dropRef = (node: HTMLElement | null) => {
    drop(node);
  };

  return {
    isOver,
    dropRef,
  };
} 