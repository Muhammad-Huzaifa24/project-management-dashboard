import { useState } from 'react';

import {
  SidebarHeader,
  // SidebarContent,
  SidebarFooter,
  ScrollArea,
} from '../ui';

import { ProjectDialog } from '../CreateProjectDialogue';

import { 
  SideBarFooter, 
  SideBarHeader, 
  // ContentSection 
} from '.';


export function AppSidebarTwo() {
  // const userRole = localStorage.getItem('userRole');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const handleButtonClick = () => {
  //   setIsDialogOpen(true);
  // };

  return (
    <>
      <SidebarHeader>
        <SideBarHeader />
      </SidebarHeader>

      <ScrollArea className="h-full">
        {/* <SidebarContent>
          <ContentSection
            Icons={LucideLoaderPinwheel}
            color="yellow"
            projectCategory="In Progress"
          />
          <ContentSection
            Icons={CircleCheck}
            color="teal"
            projectCategory="Completed"
          />
          <ContentSection
            Icons={Hourglass}
            color="red"
            projectCategory="Pending"
          />
        </SidebarContent> */}
      </ScrollArea>

      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
