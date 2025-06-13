import {
  SidebarMenu,
  SidebarMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  SidebarMenuButton,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../../Components/ui';

import { BellIcon, ChevronUp, LogOutIcon, UserRound } from '../../icons';

import { useStore } from '@/store';

import { useLogout } from '@/hooks';

import { useNavigate } from "react-router-dom";

import { AiOutlineUserSwitch } from "react-icons/ai";



const SideBarFooter = () => {
  const { user } = useStore();
  const logout = useLogout();
  const navigate  = useNavigate();

  return (
    <SidebarMenu className="text-black ">
      <SidebarMenuItem>
        <DropdownMenu >
          <DropdownMenuTrigger asChild className='border-none  bg-teal-950  text-white'>
            <SidebarMenuButton variant={'outline'}>
              <div
                role="user-photo"
                className="w-6 h-6 border rounded-full flex items-center justify-center font-semibold"
              >
                <p>{user?.name?.charAt(0)}</p>
              </div>
              {user?.name}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuLabel className="flex items-center gap-1 text-sm text-gray-400">
              <AiOutlineUserSwitch size={16} />
              {user?.role}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/notifications")}>
              <BellIcon />
              <p>Notifications</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
              <UserRound />
              <p>Profile</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              <LogOutIcon />
              <p>Sign out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export { SideBarFooter };
