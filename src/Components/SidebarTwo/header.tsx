import {useNavigate} from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  SidebarMenuButton,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui";

import { Settings } from "@/icons";

import { useProjectStore, useTaskStore } from "@/store";

import { Project } from "@/types";

import Loader from "../Loader";

import { getStatusDotColor } from "@/utils/helperFunction";

import { useProjectActions } from "@/hooks/projects";


const SideBarHeader = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("accessToken");
  const { useGetProjects } = useProjectActions();
  const { setTasks } = useTaskStore();
  const { setSelectedProject } = useProjectStore();
  const {data, isLoading, isError} = useGetProjects(token)


  const handleProjectSelect = (project: Project) => {
    console.log('project', project)
    navigate(`/dashboard/project/${project?._id}`)
    setSelectedProject(project);
    setTasks([]);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="flex justify-between items-center w-full py-5 border border-teal-600 bg-teal-950 hover:bg-teal-950 hover:text-white">
              <div className="flex items-center gap-2">
                <Settings />
                Manage Tasks
              </div>
              {/* Project Count Badge */}
               <p className="bg-blue-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {(!isLoading && !isError && data?.data?.length > 0 ) ? data?.data?.length : 0}
              </p>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width] max-h-60 overflow-auto scrollbar-none hide-scrollbar bg-gray-700 text-white border-none">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader />
                <p>Loading</p>
              </div>
            ) : isError ? (
              <div>Error loading projects</div>
            ) : (
              <div>
                {data?.data?.length > 0 ? (
                  data?.data?.map((project) => (
                    <DropdownMenuItem
                      key={project?._id}
                      onClick={() => handleProjectSelect(project)}
                      className="cursor-pointer !bg-transparent !text-white hover:!bg-gray-600 flex items-center "
                    >
                      <p
                        className={`w-2.5 h-2.5 rounded-full mr-2 ${getStatusDotColor(project?.status)}`}
                      ></p>
                      <p>{project?.title}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div>No projects available.</div>
                )}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export { SideBarHeader };
