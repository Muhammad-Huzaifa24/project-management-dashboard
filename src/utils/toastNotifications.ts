import { useToast } from '@/hooks/use-toast';

export const useNotify = () => {
  const { toast } = useToast();

  const notifySuccess = (title: string, description: string) => {
    toast({
      className: 'bg-green-500 text-white',
      title,
      description,
    });
  };

  const notifyError = (title: string, description: string) => {
    toast({
      className: 'bg-red-500 text-white',
      title,
      description,
    });
  };

  const notifyWarning = (title: string, description: string) => {
    toast({
      className: 'bg-yellow-500 text-white',
      title,
      description,
    });
  };

  const notifyInfo = (title: string, description: string) => {
    toast({
      className: 'bg-blue-500 text-white',
      title,
      description,
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
};
