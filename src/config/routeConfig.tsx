import { FaUser, FaProjectDiagram, FaUserCircle } from "react-icons/fa";
import { Bell } from "lucide-react";

interface RouteConfig {
  icon: JSX.Element;
  heading: string;
  subText: string;
}

export const routeConfig: Record<string, RouteConfig> = {
  "/dashboard": {
    icon: <FaUser className="size-7 text-blue-600" />,
    heading: "Welcome, User!",
    subText: "Your projects are ready to be tracked. Let's get started!",
  },
  "/project": {
    icon: <FaProjectDiagram className="size-7 text-teal-600" />,
    heading: "Project Dashboard",
    subText: "Manage tasks",
  },
  "/notifications": {
    icon: <Bell className="size-7 text-blue-600" />,
    heading: "Notifications",
    subText: "Manage Notifications",
  },
  "/profile": {
    icon: <FaUserCircle className="size-8 text-gray-600" />,
    heading: "Profile",
    subText: "Manage your profile",
  },
};

export const getRouteConfig = (pathname: string) => {
  if (pathname.includes("/project")) return routeConfig["/project"];
  return routeConfig[pathname] || routeConfig["/notifications"];
};
