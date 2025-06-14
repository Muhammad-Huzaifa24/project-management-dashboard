import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import '@/style.css';

// import { useRegister } from '@/hooks';
import {useUserActions} from "@/hooks/user"
import { RegisterData, RegisterError , SignUpResponse} from '@/types';
import { validateForm } from '@/utils/helperFunction';
import Loader from '@/Components/Loader';
import {useStore} from "@/store"
import {
  Input,
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/Components/ui';

import {UserPlus, Mail, Lock, User} from "../../icons"

// const LazyImage = React.lazy(() => import('../../Components/lazyImage'));

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const token = useStore.getState().getToken();
  const {useRegister} = useUserActions(token)
  const [errors, setErrors] = useState<RegisterError>({});
  const navigate = useNavigate();
  const { mutateAsync: register, isPending } = useRegister();

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

  const handleDropdownChange = (name: string, value: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await register(formData) as { data: SignUpResponse };;
        console.log('response', response);
        
        if (response?.data?.success) {
          toast.success(response?.data?.message || 'Registration successful. Please login.');
          navigate('/login');
        }
      } catch (err: any) {
        console.error('SignUp form error', err);
        const errorMessage = err?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      }
    } else {
      toast.error('Please correct the form errors.');
    }
};

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen min-w-[400px]">
      {/* Left side image */}

      <div className="hidden md:flex lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img src='/planning.png' className="object-contain w-1/2 h-1/2"  alt="Login"/>
        {/* <Suspense
          fallback={
            <div>
              <Loader />
            </div>
          }
        >
          <LazyImage
            src="/planning.png"
            alt="Login"
            className="object-contain w-1/2 h-1/2"
          />
        </Suspense> */}
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-6 gap-2 ">
            <UserPlus className='w-7 h-7 text-teal-600'/>
            <p className="text-2xl font-semibold text-center text-teal-600">
              SignUp
            </p>
          </div>

          {/* name field */}
          <div className= {`flex items-center relative ${!errors.name && 'mb-4'}`}>
            <User className="absolute left-4 text-teal-500" size={20} />
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Name"
              className={`w-full p-4 pl-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
            {errors.name && (
              <p className="text-red-600 text-sm mt-1 mb-1">{errors.name}</p>
            )}

          {/* Email field */}
          <div className= {`flex items-center relative ${!errors.email && 'mb-4'}`}>
            <Mail className="absolute left-4 text-teal-500" size={20} />
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className={`w-full p-4 pl-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 mb-1">{errors.email}</p>
            )}

          {/* Password Field */}
          <div className="flex items-center mb-4 relative">
            <Lock className="absolute left-4 text-teal-500" size={20} />
            <Input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className={`w-full p-3 pl-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
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

          {/* Confirm password field */}
          <div className={`flex items-center mb-4 relative ${errors.password && 'mt-10'}`}>
            <Lock className="absolute left-4 text-teal-500" size={20} />
            <Input
              type={passwordVisible ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className="w-full p-4 pl-11 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm absolute -bottom-6 left-0">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role selection */}
          <div className={`relative flex items-center w-full ${errors.confirmPassword && 'mt-8'} ${!errors.role && 'mb-4'}`}>
            <User className="absolute left-4 text-teal-500" size={20} />
            <Select onValueChange={(value) => handleDropdownChange('role', value)}>
              <SelectTrigger
                className={`h-12 w-full text-sm p-3 pl-11 border border-gray-300 rounded-full text-left bg-white ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              >
                <SelectValue placeholder="Choose Your Role" />
              </SelectTrigger>
              <SelectContent
                className={`${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              >
                <SelectGroup>
                  <SelectLabel>Choose Your Role</SelectLabel>
                  <SelectItem
                    value="Developer"
                  >
                    Developer
                  </SelectItem>
                  <SelectItem
                    value="QA"
                  >
                    QA
                  </SelectItem>
                  <SelectItem
                    value="Manager"
                  >
                    Manager
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role}</p>
            )}

          {/* Register button */}
          <Button
            type="submit"
            className="mt-1 h-12 w-full py-3 bg-teal-600 text-white rounded-full hover:bg-blue-700 transition"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? <Loader /> : 'Register'}
          </Button>

          {/* Login button */}
          <div className="mt-2 text-center text-sm">
            <p className="text-gray-600 m-0 p-0">Already have an account?</p>
            <Button
              variant={'link'}
              onClick={handleLogin}
              className="text-teal-500 hover:underline"
            >
              Login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
