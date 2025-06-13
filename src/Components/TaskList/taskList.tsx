import {useState, useEffect} from "react"

import { Task } from '../../types';

import { TaskCard } from '../TaskCard';

import { ClipboardList, Loader2, PlusCircle } from "../../icons"

import { useTaskActions } from "@/hooks/tasks"

import {useProjectActions} from "@/hooks/projects"

import { useParams } from 'react-router-dom';

import {FaStar} from "react-icons/fa"

import { TaskCreateDialog } from '@/Components/createTaskDialogue';

import { useQueryClient } from '@tanstack/react-query';

import {useProjectStore, useTaskStore} from "@/store"

import { 
  Button, 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent,
  SelectItem
 } from "../ui";

import {FaListAlt, FaCheckCircle, FaSpinner, FaHourglassHalf  } from 'react-icons/fa';

import animations from "@/assets/animations/noDataFound.json"

import Lottie from "lottie-react";


const TaskList: React.FC<{ filter: string }> = ({ filter }) => {
  const queryClient = useQueryClient();

  const {projectId } = useParams();

  const token = localStorage.getItem('accessToken')
  const userRole = localStorage.getItem('userRole');

  const { useProjectTasks, createTask } = useTaskActions(token);
  const {useGetSpecificProject} = useProjectActions(token)

  const {data: projectTasks, isLoading, isError, error} = useProjectTasks(projectId, token);
  const {data: project} = useGetSpecificProject(projectId, token)

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {setFilterStatus} = useProjectStore();
  const getTaskCounts = useTaskStore((state) => state.getTaskCount);
  const {setTasks} = useTaskStore();
  const taskCounts = getTaskCounts();

  useEffect(() => {
    if (projectTasks?.data) {
     setTasks(projectTasks?.data)
    }
  }, [projectTasks]);

  const filteredTasks = projectTasks?.data?.filter((task: Task) => {
    if (filter === 'All') return true;
    return task.status === filter;
  })

  const handleCreateTaskClick = () => {
    setIsDialogOpen(true);
  };

  const handleFilterChange = (value: 'All' | 'Pending' | 'In Progress' | 'Completed') => {
    setFilterStatus(value);
  };

  const successHandle = () => {
		queryClient.invalidateQueries({
			queryKey: ["project-tasks"],
		});
	};

  const handleTaskSubmit = async (taskData: {
    title: string;
    description: string;
    status: 'Assigned' | 'In Progress' | 'Completed' | 'Pending';
    assignedTo: string;
  }) => {
    const newTask = {
        ...taskData,
        projectId: projectId,
    };
    createTask(newTask);
    successHandle();
  };

   const handleTotalTaskCount = () => {
    return Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  }

  if(isError) return <div>{`An error occured: ${error}`}</div>

  return (
    <>
      <div className="flex items-center justify-between py-3 pr-1 bg-white shadow sticky top-0 z-40">
        {userRole === 'Manager' && projectId ? (
          <Button onClick={handleCreateTaskClick} className="bg-blue-600 text-white">
             <PlusCircle size={20} />
            Create Task
          </Button>
        ) : <p></p>}
        <p className="flex items-center gap-2 text-xl font-semibold border-b pb-2  text-gray-700">
            <FaStar className='text-red-600'/>
            Active Project: <p className="text-teal-600">{project?.data?.title}</p>
        </p>
        {projectId && ( 
          <Select onValueChange={handleFilterChange} value={filter}>    
            <SelectTrigger className="w-[180px] border-0 outline-none focus:ring-0">
                <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" onClick={handleTotalTaskCount}>
                <div className='flex items-center'>
                  <FaListAlt className='w-4 h-4 text-blue-500 mr-2'/>
                  All tasks 
                  <p className='ml-3'>{handleTotalTaskCount() || 0}</p>
                </div>
              </SelectItem>
              <SelectItem value="Pending">
                <div className='flex items-center'>
                  <FaHourglassHalf className="w-4 h-4 mr-2 text-orange-500"/>
                  Pending 
                  <p className='ml-3'>{taskCounts["Pending"] || 0}</p>
                </div>
              </SelectItem>
              <SelectItem value="In Progress">
                <div className='flex items-center'>
                  <FaSpinner className="w-4 h-4 mr-2 text-yellow-500"/>
                  In Progress 
                 <p className='ml-2'> {taskCounts["In Progress"] || 0}</p>
                </div>
              </SelectItem>
              <SelectItem value="Completed">
                <div className='flex items-center'>
                  <FaCheckCircle className="w-4 h-4 mr-2 text-green-500"/> 
                  Completed 
                  <p className='ml-2'>{taskCounts["Completed"] || 0}</p>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-40 flex-1 overflow-auto bg-gray-50 rounded-md">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="ml-2 text-gray-600">Loading tasks...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 bg-gray-50 rounded-md">
          {/* <p className="flex items-center gap-2 text-xl font-semibold border-b pb-2 mb-4 text-gray-700">
              <FaStar className='text-red-600'/>
              Active Project: <p className="text-teal-600">{project?.data?.title}</p>
          </p> */}
          {filteredTasks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTasks?.map((task: Task, index: number) => (
                <TaskCard key= {task._id || `task-${index}`} task={task}/>
              ))}
            </div>
          ) : (
            <div className="gap-1 flex items-center justify-center text-gray-400 p-40 flex-1 overflow-auto bg-gray-50 rounded-md">
              {/* <ClipboardList size={25} /> */}
              <Lottie 
                animationData={animations} 
                className="w-[300px] h-[100px] md:w-[600px] md:h-[150px] lg:w-[500px] lg:h-[170px]" 
              />
              {/* <p>No tasks yet</p> */}
            </div>
          )}
        </div>
      )}
      
      <TaskCreateDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSubmit={handleTaskSubmit} />
    </>
  );
};

export { TaskList };
