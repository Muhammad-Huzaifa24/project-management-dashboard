import React, { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  // Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';
// import ReactSelect from 'react-select'
import * as Yup from 'yup';
import { ProjectFormData } from '../../types';
import {useProjectActions} from "@/hooks/projects"
import { useQueryClient } from '@tanstack/react-query';
import {Loader2} from "@/icons"

const projectValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().oneOf(['Pending', 'In Progress', 'Completed']).required('Status is required'),
});


interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string | undefined; // Optional for edit mode
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onOpenChange,
  projectId
})=> {

  const token = useMemo(() => localStorage.getItem('accessToken'), []);

  const queryClient = useQueryClient();
  const { createProjectMutation, updateProjectMutation, useGetSpecificProject } = useProjectActions(token);
  const { mutate: createProject, isPending: creating } = createProjectMutation;
  const { mutate: updateProject, isPending: updating } = updateProjectMutation;

  const { data: projectData, isLoading } = useGetSpecificProject(projectId, token, open);
  const project = projectData as any;

 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>();  

  // const userOptions = users.map((user) => ({
  //   value: user._id,
  //   label: user.name,
  // }));

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});

  useEffect(() => {
    if(!open) {
      setTitle('');
      setDescription('');
      setStatus(undefined);
      setErrors({});
    }
     else if(project){
      setTitle(project?.data?.title);
      setDescription(project?.data?.description);
      setStatus(project?.data?.status);
    }
  },[open, project]);

  interface FormErrors {
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: string;
  }

  const handleChange = (field: keyof ProjectFormData, value: string | string[]) => {
    setErrors((prevErrors: FormErrors) => ({ ...prevErrors, [field]: undefined }));
    if (field === 'title') setTitle(value as string);
    if (field === 'description') setDescription(value as string);
    if (field === 'status') setStatus(value as 'Pending' | 'In Progress' | 'Completed');
  };

  const successHandle = () => {
    console.log('-----------------------')
		queryClient.invalidateQueries({
			queryKey: ["projects"],
		});
	};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) {
      setErrors((prevErrors) => ({ ...prevErrors, status: 'Status is required' }));
      return;
    }
    const newProject: ProjectFormData = { title, description, status };
    try {
      await projectValidationSchema.validate(newProject, { abortEarly: false });
      if(project){
        console.log('newProject', newProject, project?.data?._id)
        updateProject({ projectId: project?.data?._id, updatedData: newProject })
        successHandle();
      }
      else {
        createProject(newProject);
        successHandle();
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-lg md:max-w-xl lg:max-w-2xl p-6 rounded-2xl shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {project ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className='flex items-center gap-2 relative justify-center'>
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p>loading project details. . .</p>
          </div>
        ) : (       
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                {/* <Label htmlFor="title">Title</Label> */}
                <Input id="title" value={title} onChange={(e) => handleChange('title', e.target.value)}  className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" required placeholder='Project title'/>
                {errors?.title && <p className="text-red-600 text-sm">{errors?.title}</p>}
              </div>

              <div>
                {/* <Label htmlFor="description">Description</Label> */}
                <Input id="description" value={description} onChange={(e) => handleChange('description', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" required  placeholder='Description'/>
                {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
              </div>

              <div>
                {/* <Label htmlFor="status">Status</Label> */}
                <Select value={status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-600 text-sm">{errors.status}</p>}
              </div>
              <Button type="submit" className="w-full">
                {creating || updating ? 'Processing...' : project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>         
          </form>
        ) }
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
