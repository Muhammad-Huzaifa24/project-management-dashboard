import { FormData, Errors, RegisterData, RegisterError } from '../types';

const getStatusDotColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500';
    case 'in progress':
      return 'bg-yellow-500';
    case 'pending':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const validateForm = (
  data: FormData | RegisterData
): Errors | RegisterError => {
  const newErrors: Errors | RegisterError = {};

  if (!data.email.trim()) {
    newErrors.email = 'Please provide your email.';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    newErrors.email = 'Please provide a valid email address.';
  }

  if (!data.password.trim()) {
    newErrors.password = 'Password is required.';
  }

  if ('name' in data) {
    if (!data.name.trim()) {
      (newErrors as RegisterError).name = 'Please provide your name.';
    }
    if (data.confirmPassword !== data.password) {
      (newErrors as RegisterError).confirmPassword = 'Passwords do not match.';
    }
    if (!data.role) {
      (newErrors as RegisterError).role = 'Please choose your role.';
    }
  }

  return newErrors;
};

const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border border-green-900';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 border border-yellow-900';
      case 'Pending': return 'bg-orange-100 text-orange-700 border border-orange-900';
      default: return 'bg-gray-100 text-gray-700 border border-gray-900';
    }
  };


export { getStatusDotColor, validateForm, statusBadgeClass };
