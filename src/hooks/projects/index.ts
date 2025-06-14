import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRequest, putRequest, postRequest, getRequest } from '@/services/apiServices';
import { ProjectFormData, ApiResponse } from "@/types"
import { toast } from 'react-hot-toast';

export const useProjectActions = (token?: string | null) => {
  const queryClient = useQueryClient();

  const useGetProjects = (token?: string | null) => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        const response = await getRequest(`/project`, undefined, token);
        return response.data;
      },

    });
  };


  const useGetSpecificProject = (
    id: string | undefined,
    token?: string | null,
    enabled: boolean = true // Default to true if not provided
  ) => {
    return useQuery({
      queryKey: ['projects', id],
      queryFn: async () => {
        if (!id) return null; // Prevent API calls if id is undefined
        const response = await getRequest(`/project/${id}`, undefined, token);
        return response.data;
      },
      enabled: !!id && enabled, // Only fetch if id is valid and enabled is true
    });
  };


  const createProjectMutation = useMutation({
    mutationFn: async (projectData: ProjectFormData) => {
      const response = await postRequest(`/project`, projectData, undefined, token);
      const data = response.data as ApiResponse;
      console.log('response', response);
      if (response?.status === 200) {
        toast.success(data?.message)
      }
      else toast.error(data?.message)
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ projectId, updatedData }: { projectId: string | undefined; updatedData: ProjectFormData }) => {
      console.log('updateProjectMutation----------------------------', projectId)
      const response = await putRequest(`/project/${projectId}`, updatedData, undefined, token);
      const data = response.data as ApiResponse;
      toast.success(data?.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })
    }
  });

  const deleteProjectMutation = useMutation<void, Error, string | undefined>({
    mutationFn: async (projectId: string | undefined) => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await deleteRequest(`/project/${projectId}`, undefined, token);
      const data = response.data as ApiResponse;
      toast.success(data?.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });


  return {
    useGetProjects,
    useGetSpecificProject,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  };
};
