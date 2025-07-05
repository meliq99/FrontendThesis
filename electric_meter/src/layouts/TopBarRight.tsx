import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings, Tv } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

const TopBarRight = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: Home,
      activeColor: "bg-indigo-600 hover:bg-indigo-700 border-indigo-500", // Blue for home/dashboard
    },
    {
      path: "/statistics",
      label: "Statistics",
      icon: BarChart3,
      activeColor: "bg-indigo-600 hover:bg-indigo-700 border-indigo-500", // Green for statistics/growth
    },
    {
      path: "/devices",
      label: "Devices",
      icon: Tv,
      activeColor: "bg-indigo-600 hover:bg-indigo-700 border-indigo-500", // Indigo to match the theme
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
      activeColor: "bg-indigo-600 hover:bg-indigo-700 border-indigo-500", // Gray for settings/configuration
    },
  ];

  return (
    <div className="flex items-center justify-end space-x-2 w-full">
      <nav className="flex items-center space-x-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isActive 
                    ? `${item.activeColor} text-white` 
                    : "text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TopBarRight; 