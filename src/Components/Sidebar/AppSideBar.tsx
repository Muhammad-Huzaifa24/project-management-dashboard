import { useEffect, useState } from 'react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  ScrollArea,
} from '../ui';

import { FloatingButton } from '../FloatingButton';

import { ProjectDialog } from '../CreateProjectDialogue';

import { Hourglass, CircleCheck, LucideLoaderPinwheel } from 'lucide-react';

import { SideBarFooter, SideBarHeader, ContentSection } from '.';


export function AppSidebar() {
  const userRole = localStorage.getItem('userRole');
  const [statusCount, setStatusCount] = useState({ "In Progress": 0, Completed: 0, Pending: 0 });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const updateStatusCount = () => {
    const i = localStorage.getItem('statusCount');
    if (i !== null && i !== undefined && i.trim() !== '') {
      try {
        const storedStatusCount = JSON.parse(i);
        
        setStatusCount({
          "In Progress": storedStatusCount?.statusCount?.["In Progress"] || 0,
          Completed: storedStatusCount?.statusCount?.Completed || 0,
          Pending: storedStatusCount?.statusCount?.Pending || 0,
        });
      } catch (error) {
        console.error('Error parsing statusCount from localStorage:', error);
        setStatusCount({ "In Progress": 0, Completed: 0, Pending: 0 });
      }
    } else {
      setStatusCount({ "In Progress": 0, Completed: 0, Pending: 0 });
    }
  };

  useEffect(() => {
    updateStatusCount();
  }, []); 

  return (
    <>
      <SidebarHeader>
        <SideBarHeader updateStatusCount={updateStatusCount}/>
      </SidebarHeader>

      <ScrollArea className="group/sidebar relative h-full">
        <SidebarContent>
          <ContentSection
            Icons={LucideLoaderPinwheel}
            color="yellow"
            projectCategory="In Progress"
            count={statusCount["In Progress"] || 0}          
          />
          <ContentSection
            Icons={CircleCheck}
            color="teal"
            projectCategory="Completed"
            count = {statusCount?.Completed || 0}
          />
          <ContentSection
            Icons={Hourglass}
            color="red"
            projectCategory="Pending"
            count = {statusCount?.Pending|| 0}
          />
        </SidebarContent>
      </ScrollArea>

      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>

      {userRole === 'Manager' && <FloatingButton onClick={handleButtonClick} />}

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
