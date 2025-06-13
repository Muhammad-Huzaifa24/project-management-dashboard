import {
  Collapsible,
  SidebarGroup,
  SidebarGroupLabel,
  CollapsibleTrigger,
  CollapsibleContent,
  ScrollArea,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  DropdownMenu,
  DropdownMenuTrigger,
  SidebarMenuAction,
  DropdownMenuContent,
  DropdownMenuItem,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from '../../Components/ui';

import { useState } from 'react';

import { ChevronDown, MoreHorizontal, Trash2, Pencil } from '../../icons';

import { PROJECT_CATEGORY } from '@/utils/constants';

import {LucideIcon } from 'lucide-react';

import { useProjectStore } from '@/store';

import { ProjectDialog } from '../CreateProjectDialogue';

// import { useEditProject } from '@/hooks/useEditProject';

import {useProjectActions} from "@/hooks/projects"

import Loader from '../Loader';

interface HelpSectionProps {
  projectCategory: PROJECT_CATEGORY;
  Icons: LucideIcon;
  color: string;
}

const ContentSection: React.FC<HelpSectionProps> = ({
  projectCategory,
  Icons,
  color,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const token = localStorage.getItem('accessToken');
  const {deleteProjectMutation} = useProjectActions(token);
   const { mutate: deleteProject, isPending } = deleteProjectMutation;
  const userRole = localStorage.getItem('userRole');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [deletingProjectId, setDeletingProjectId] = useState<string | undefined>(
    undefined
  );
  const [editingProjectId, setEditingProjectId] = useState<string | undefined>();

  const filter = projectCategory;

  const { projects } = useProjectStore();

  const filteredProjects = projects.filter(
    (project) => project.status === filter
  );

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleDelete = async (projectId: string | undefined) => {
    deleteProject(projectId);
    setDeletingProjectId(undefined);
  };

  const handleOpenDeleteDialog = (projectId: string | undefined) => {
    setDeletingProjectId(projectId); // ✅ Store the project ID before opening the modal
    setDeleteDialogOpen(true);
  };

  // const handleOpenEditDialog = (projectId: string | undefined) => {
  //   setDeletingProjectId(projectId); // ✅ Store the project ID before opening the modal
  //   setDeleteDialogOpen(true);
  // };


  const handleEdit = async (projectId: string) => {
    console.log('projectId', projectId)
    setIsDialogOpen(true);
    setEditingProjectId(projectId)
  };

  const getCount = (status: string) => {
    return projects.filter((project) => project.status === status).length;
  }

  return (

    <>
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="group/collapsible"
    >
      <SidebarGroup className='px-2'>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger
            className="hover:text-white hover:bg-gray-900 py-4 bg-green-950 justify-between"
            onClick={toggleCollapse}
          >
            <div className="flex items-center gap-3">
              <Icons className={`w-5 h-5`} style={{ color }} />
              {projectCategory}
            </div>
            <div className='flex items-center gap-2'>
              <p className="bg-green-900 text-gray text-xs font-semibold px-2 py-0.5 rounded-full">{getCount(projectCategory)}</p>
              <ChevronDown
                className={`ml-auto transition-transform size-4 ${
                  isCollapsed ? '' : 'rotate-180'
                }`}
              />
            </div>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <ScrollArea
            className={`transition-[max-height] duration-300 overflow-auto bg-gray-900 rounded-sm mt-2 hide-scrollbar ${
              isCollapsed ? 'max-h-60' : 'max-h-0'
            }`}
          >

            <SidebarGroupContent className="px-2">
              {filteredProjects.map((project) => (
                <SidebarMenuItem
                  key={project._id}
                  className="list-none mb-1 mt-1"
                >
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex items-center space-x-1">
                      {/* {deletingProjectId === project._id ? (
                        <Loader />
                      ) : (
                        <p>{project.title}</p>
                      )} */}
                      <p>{project.title}</p>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {userRole === 'Manager' && (
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem
                      onClick={()=> handleEdit(project?._id)}
                      // onClick={() => {setIsDialogOpen(true); setEditingProjectId(project?._id)}}
                      >
                        <Pencil className="text-green-700" />
                        <p className="text-green-700">Edit Project</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDeleteDialog(project?._id)}
                      >
                        <Trash2 className="text-red-700" />
                        <p className="text-red-700">Delete Project</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </ScrollArea>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
    
    {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Confirm Delete</h2>
          </DialogHeader>
          <p>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                if (deletingProjectId) {
                  handleDelete(deletingProjectId); // ✅ Only call delete if ID exists
                }
                setDeleteDialogOpen(false); // Close modal after deleting
              }}
            >
              {isPending ? <Loader/> : 'Delete'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectId={editingProjectId}
      />
    </>
  );
};

export { ContentSection };
