import { useNavigate } from 'react-router-dom';
import { postRequest } from '@/services/apiServices';
import toast from 'react-hot-toast';
import useStore from '@/store/user.store';

const useLogout = () => {
  const navigate = useNavigate();
  const clearUser = useStore((state) => state.clearUser);

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        await postRequest('/user/logout', {}, undefined, token);
      }

      clearUser();

      toast.success('Logged out successfully!');

      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error while logging out');
    }
  };

  return logout;
};

export { useLogout };
