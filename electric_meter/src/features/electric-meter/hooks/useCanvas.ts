import { useEffect, useRef, useState } from "react";

interface CanvasSize {
  width: number;
  height: number;
}

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = Math.min(400, window.innerHeight * 0.5);
          setCanvasSize({ width, height });
          canvas.width = width;
          canvas.height = height;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { canvasRef, canvasSize };
}; 