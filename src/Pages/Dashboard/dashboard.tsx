import React from 'react';

import {
  FolderOpen
} from '@/icons';

import Lottie from "lottie-react";

import animations from "@/assets/animations/folderAnimation1.json"

const Dashboard: React.FC = () => {

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-auto p-4 bg-gray-100">  
          <div className="flex flex-col items-center justify-center h-full">
          <Lottie 
            animationData={animations} 
            className="w-[300px] h-[300px]" 
          />
            {/* <img src={animations} alt="" /> */}
           <div className='flex items-center justify-center gap-2'>
             <FolderOpen className="size-7 text-teal-500"/>
              <p className="text-teal-600">Start organizing your work—select a project now.</p>
           </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;


