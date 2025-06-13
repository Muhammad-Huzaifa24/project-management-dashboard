import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRequest, putRequest, postRequest, getRequest } from '@/services/apiServices';
import { TaskSubmitData } from '@/Components/TaskCard';
import toast from 'react-hot-toast';

export const useTaskActions = (token?: string | null) => {
  const queryClient = useQueryClient();

  const useProjectTasks = (projectId: string | undefined, token?: string | null) => {
    return useQuery({
        queryKey: ['project-tasks', projectId],
        queryFn: async () => {
        if (!projectId) return []; 
            const response = await getRequest(`/project/${projectId}/tasks`, undefined, token);
            return response.data;
        },
        
    });
  };

  const useGetAssignedTasks = (token?: string | null) => {
    return useQuery({
        queryKey: ['assigned-tasks'],
        queryFn: async () => {
            const response = await getRequest(`/task`, undefined, token);
            return response.data;
        },
        
    });
  };

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: TaskSubmitData) => {
      const response = await postRequest(`/task`, taskData, undefined, token);
      if(response?.statusText === "OK"){
        toast.success(response?.data?.message)
      }
      else toast.error(response?.data?.message)
      
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['project-tasks'],})
    }
  });

  const updateTaskMutation = useMutation({  
    mutationFn: async ({ taskId, updatedData }: { taskId: string | undefined; updatedData: TaskSubmitData }) => {
      const response = await putRequest(`/task/${taskId}`, updatedData, undefined, token);
      if(response?.statusText === "OK"){
        toast.success(response?.data?.message)
      }
      else toast.error(response?.data?.message)
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['project-tasks'],})
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string | undefined) => {
      const response = await deleteRequest(`/task/${taskId}`, undefined, token);
      if(response?.statusText === "OK"){
        toast.success(response?.data?.message)
      }
      else toast.error(response?.data?.message)
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['project-tasks'],})
    }
  });

  return {
    useProjectTasks,
    useGetAssignedTasks,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};
