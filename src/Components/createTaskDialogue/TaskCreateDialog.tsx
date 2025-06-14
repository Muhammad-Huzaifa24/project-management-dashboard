import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  // DialogFooter,
  Input,
  // Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DialogTitle,
  Button,
} from '@/Components/ui';
import ReactSelect from 'react-select'
import { useStore } from "@/store"
import * as Yup from 'yup';
import { useUserActions } from "@/hooks/user"
import { User } from '@/types';




interface TaskCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    status: 'Assigned' | 'In Progress' | 'Completed' | 'Pending';
    assignedTo: string;
  }) => void;
}


const projectValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().oneOf(['Pending', 'In Progress', 'Completed', 'Assigned']).required('Status is required').optional(),
  assignedTo: Yup.string().optional(),
});

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const token = useStore?.getState()?.getToken();
  const { useGetAllUsers } = useUserActions(token)
  const { data } = useGetAllUsers();
  const users = data as any;

  // const { users = [] } = useUsers();
  const userOptions = users?.data?.map((user: User) => ({
    value: user._id,
    label: user.name,
  }));
  const [taskData, setTaskData] = useState<{
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Assigned';
    assignedTo: string;
  }>({
    title: '',
    description: '',
    status: 'Pending',
    assignedTo: '',
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: string;
  }>({});

  const handleTaskChange = (field: keyof typeof taskData, value: string | string[]) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));

    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectValidationSchema.validate(taskData, { abortEarly: false });
      onSubmit(taskData);
      setTaskData({
        title: '',
        description: '',
        status: 'Pending',
        assignedTo: '',
      });
      onClose();
      // const createdProjectResponse = await addNewProject(taskData);
      // const createdProject = createdProjectResponse?.data;
      // if (createdProject) {
      //   onSubmit(createdProject.data);
      // }
      // onSubmit(taskData);
      // setTaskData({
      //   title: '',
      //   description: '',
      //   status: 'Pending',
      //   assignedTo: [] as string[],
      // });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
    }
    // onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg md:max-w-xl lg:max-w-2xl p-6 rounded-2xl shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Create a New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <Input
                name="title"
                value={taskData.title}
                onChange={(e) => handleTaskChange('title', e.target.value)}
                placeholder="Task Title"
                className="col-span-3"
              />
              {errors?.title && <p className="text-red-600 text-sm">{errors?.title}</p>}
            </div>
            <div>
              <Input
                name="description"
                value={taskData.description}
                onChange={(e) => handleTaskChange('description', e.target.value)}
                placeholder="Task Description"
                className="col-span-3"
              />
              {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
            </div>
            <div >
              <Select
                value={taskData.status}
                onValueChange={(value) => handleTaskChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="col-span-3">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>

                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-600 text-sm">{errors.status}</p>}
            </div>
            <div>
              <ReactSelect
                options={userOptions}
                value={userOptions?.filter((user: { value: string; label: string }) => taskData.assignedTo === user.value)}
                onChange={(selectedOption) => handleTaskChange('assignedTo', selectedOption ? selectedOption.value : '')}
                placeholder="Select users"
              />
              {errors.assignedTo && <p className="text-red-600 text-sm">{errors.assignedTo}</p>}
            </div>
            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateDialog;
