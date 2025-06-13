import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequest, putRequest } from '@/services/apiServices';
// import { useNotificationStore } from '@/store';

export const useNotification = (userId: string | undefined, token: string | null) => {
  // const { setNotifications, clearNotifications } = useNotificationStore();
  const queryClient = useQueryClient();

   const useGetnotifications = (token?: string | null) => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
        try {
            const response = await getRequest(`/notification/${userId}`, undefined, token);
            return response.data;
        } catch (error) {
            throw error;
        } 
        },
        
    });
  };

  const updateNotificationStatus = useMutation({  
      mutationFn: async ({ notificationId }: { notificationId: string | undefined}) => {
        await putRequest(`/notification/${notificationId}`, undefined, undefined, token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['notifications'],
        })
      }
    });

  return {
   useGetnotifications,
   updateNotificationStatus
  };
};
