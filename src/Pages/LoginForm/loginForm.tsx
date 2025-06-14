import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import '@/style.css';
import { useUserActions } from '@/hooks/user';
import { FormData, Errors, LoginResponse } from '@/types';
import { useStore } from '@/store';
import { validateForm } from '@/utils/helperFunction';
import { LogIn, Lock, Mail } from '@/icons';
import Loader from '@/Components/Loader';
import {
  Input,
  Button,
  Card,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/Components/ui';

// const LazyImage = React.lazy(() => import('@/Components/lazyImage'));

const LoginForm: React.FC = () => {
  const token = useStore.getState().getToken();
  const { useLogin } = useUserActions(token);
  const { mutateAsync: login, isPending : loading } = useLogin();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await login(formData) as { data: LoginResponse };
        console.log('login response', response)
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          navigate('/dashboard');
        }
      } catch (error: any) {
        const errorMessage = error?.data?.message;
        toast.error(errorMessage);
      }
    } else {
      toast.error('Please correct the form errors.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="flex min-h-screen min-w-[400px]">
      {/* Left side image */}
      <div className="hidden md:flex lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img src='/planning.png' className="object-contain w-1/2 h-1/2"  alt="Login"/>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-6 gap-2">
            <LogIn className='w-10 h-10 text-blue-600'/>
            <p className="text-2xl font-semibold text-center text-blue-600">
              Login
            </p>
          </div>
          {/* Email Field */}
          <form onSubmit={handleSubmit}>
            <div className={`flex items-center relative ${!errors.email && 'mb-4'}`}>
              <Mail className="absolute left-4 text-blue-500" size={20} />
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full p-4 pl-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.email && (
                <p className="text-red-600 mb-3 text-sm">{errors.email}</p>
              )}

            {/* Password Field */}
            <div className="flex items-center mb-4 relative">
              <Lock className="absolute left-4 text-blue-500" size={20} />
              <Input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full p-3 pl-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? '🙈' : '👁️'}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Password Visibility</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Error Message */}
              <p
                className={`text-red-600 text-sm absolute -bottom-6 left-0 ${
                  errors.password ? 'visible' : 'invisible'
                }`}
              >
                {errors.password}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-4 h-12 w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? <Loader /> : 'Login'}
            </Button>
          </form>

          {/* Link to create account */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Button
              variant={'link'}
              onClick={handleRegister}
              className="text-blue-500 hover:underline"
            >
              Create an account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
