import React from "react";
import { Lightbulb, Tv, Refrigerator, Fan, Laptop, Smartphone, Coffee, Wifi } from "lucide-react";

type IconName =
  | "Lightbulb"
  | "Tv"
  | "Refrigerator"
  | "Fan"
  | "Laptop"
  | "Smartphone"
  | "Coffee"
  | "Wifi";

interface IconProps {
  name: IconName | string;
  size?: number;
  className?: string;
}

/**
 * Gets the appropriate icon component based on the icon name
 */
export const getDeviceIcon = ({ name, size = 24, className = "" }: IconProps): React.ReactNode => {
  const props = {
    size,
    className: `h-${size / 4} w-${size / 4} ${className}`,
  };

  switch (name as IconName) {
    case "Lightbulb":
      return <Lightbulb {...props} />;
    case "Tv":
      return <Tv {...props} />;
    case "Refrigerator":
      return <Refrigerator {...props} />;
    case "Fan":
      return <Fan {...props} />;
    case "Laptop":
      return <Laptop {...props} />;
    case "Smartphone":
      return <Smartphone {...props} />;
    case "Coffee":
      return <Coffee {...props} />;
    case "Wifi":
      return <Wifi {...props} />;
    default:
      return <Lightbulb {...props} />;
  }
};

/**
 * Maps device types to their appropriate icons
 */
export const DEVICE_ICON_MAPPING: Record<string, IconName> = {
  lightbulb: "Lightbulb",
  television: "Tv",
  refrigerator: "Refrigerator",
  fan: "Fan",
  laptop: "Laptop",
  smartphone: "Smartphone",
  coffee_maker: "Coffee",
  wifi_router: "Wifi",
}; 