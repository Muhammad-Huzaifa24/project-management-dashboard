import React , {useState} from 'react';

import {
  SidebarProvider,
} from './Components/ui/sidebar';

import { AppSidebar } from './Components/Sidebar/AppSideBar';

import { AppSidebarTwo } from './Components/SidebarTwo';

import { cn } from '@/lib/utils';

import { Toaster, Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/Components/ui';

import { useStore } from '@/store';

import {BellRing, Home, MenuIcon} from "lucide-react"

import  {Notification}  from "@/Components/Notification"

import { notifications } from '@/Components/Notification/data'; // Import the hardcoded notifications

import { useLocation, useNavigate } from 'react-router-dom';

import { getRouteConfig } from "@/config/routeConfig";


interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();
  const [dropDownOpen, setIsDropDownOpen] = useState(false)
   
  const handleNotificationDropDown = () =>{
    setIsDropDownOpen(true);
  }

   const handleCloseNotification = () => {
    setIsDropDownOpen(false);
  };

  const { icon, heading, subText } = getRouteConfig(location.pathname);

  return (
     <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen w-screen">
        {/* app sidebar here */}
        {/* <Sidebar className="hidden sm:flex sm:flex-col w-72 h-screen bg-background p-1">
              {user?.role === "Manager" ? <AppSidebar /> : <AppSidebarTwo/> }
        </Sidebar> */}
        <div className="hidden bg-black text-white sm:flex sm:flex-col w-80 bg-background p-1">
          {user?.role === "Manager" ? <AppSidebar /> : <AppSidebarTwo/> }
        </div>
        <div className="flex flex-col border w-full border-black bg-white">
          <header className="bg-[rgb(215_210_220_/_1)] p-4 border ">
            <div className="flex items-center justify-between">
              <MenuIcon className='md:hidden block cursor-pointer'/>
              <div className="flex items-center gap-2">
                {icon}
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  {heading.replace("User", user?.name || "User")}
                </p>
              </div>
             <div className="relative flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="border border-gray-400 hover:bg-gray-200 rounded-full p-2 cursor-pointer relative" onClick={()=> {navigate("/")}}>
                      <Home className="size-5" />
                    </div>
                  </TooltipTrigger>
                   <TooltipContent>
                    <p>Go to home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="border border-gray-400 hover:bg-gray-200 rounded-full p-2 cursor-pointer relative " onClick={handleNotificationDropDown}>
                      <BellRing className="size-5" />
                      {notifications.length > 0 && (
                        <p className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                          {notifications.length}
                        </p>
                      )}
                    </div>  
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>notifications</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            </div>
           <p className="text-gray-600 mt-1">{subText}</p>
          </header>

          {dropDownOpen && (
            <div
              className={`absolute top-16 right-4 z-50 transform transition-transform duration-300 ease-in-out ${
                dropDownOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <Notification notifications={notifications} onClose={handleCloseNotification} />
            </div>
          )}
          
          <main className={cn("flex-1 px-4 pb-4 overflow-hidden", className)}>
            <div className="h-full overflow-auto custom-scrollbar">{children}</div>
          </main>
          <Toaster />
        </div>
      </div>
    </SidebarProvider>
  );
}
