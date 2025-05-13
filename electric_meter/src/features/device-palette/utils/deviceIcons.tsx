import React from "react";
import { Lightbulb, Tv, Refrigerator, Fan, Laptop, Smartphone, Coffee, Wifi } from "lucide-react";

type IconName =
  | "lightbulb"
  | "tv"
  | "refrigerator"
  | "fan"
  | "laptop"
  | "smartphone"
  | "coffee"
  | "wifi";

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
    case "lightbulb":
      return <Lightbulb {...props} />;
    case "tv":
      return <Tv {...props} />;
    case "refrigerator":
      return <Refrigerator {...props} />;
    case "fan":
      return <Fan {...props} />;
    case "laptop":
      return <Laptop {...props} />;
    case "smartphone":
      return <Smartphone {...props} />;
    case "coffee":
      return <Coffee {...props} />;
    case "wifi":
      return <Wifi {...props} />;
    default:
      return <Lightbulb {...props} />;
  }
};

/**
 * Maps device types to their appropriate icons
 */
export const DEVICE_ICON_MAPPING: Record<string, IconName> = {
  lightbulb: "lightbulb",
  television: "tv",
  refrigerator: "refrigerator",
  fan: "fan",
  laptop: "laptop",
  smartphone: "smartphone",
  coffee_maker: "coffee",
  wifi_router: "wifi",
}; 