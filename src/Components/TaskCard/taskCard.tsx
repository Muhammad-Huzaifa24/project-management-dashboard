import React, { useState } from 'react';
import { Task, User } from '@/types';
// import { useTaskActions } from '@/hooks/useTaskActions';
import {
  // Card,
  // CardHeader,
  // CardTitle,
  // CardDescription,
  // CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  DialogTitle,
} from '@/Components/ui';
import { MoreHorizontal } from 'lucide-react';
import { useTaskActions } from "@/hooks/tasks"
import { useStore } from "@/store"
import { FaUser } from "react-icons/fa"
import { statusBadgeClass } from "@/utils/helperFunction"
import { useUserActions } from "@/hooks/user"

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

interface TaskSubmitData {
  title: string;
  description: string;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Pending';
  assignedTo: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {

  const { user: CurrentUser } = useStore();
  const token = useStore?.getState()?.getToken();
  const { useGetAllUsers, useGetUser } = useUserActions(token)
  const { deleteTask, updateTask } = useTaskActions(token);
  const [status, setStatus] = useState<
    'Assigned' | 'In Progress' | 'Completed'
  >(task.status);
  const [assignedTo, setAssignedTo] = useState<string>(task.assignedTo);
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data : users, isPending: usersLoading } = useGetAllUsers();
  const usersData = users as any;

  const { data } = useGetUser(task?.assignedTo)
  const user = data as any;

  const handleStatusChange = (newStatus: 'In Progress' | 'Completed') => {
    setStatus(newStatus);
  };

  const handleUpdateClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: TaskSubmitData = {
      title,
      description,
      status,
      assignedTo,
    };
    console.log('submitData', submitData, 'task._id', task._id);
    updateTask({ taskId: task._id, updatedData: submitData });
    setDialogOpen(false);
  };

  const handleDeleteClick = async () => {
    deleteTask(task._id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className={` relative group border border-gray-200 rounded-lg hover:border-gray-400 ${CurrentUser?.role === 'Manager' ? 'cursor-pointer p-8' : 'pl-6 pr-3 py-4'}`}>
        {/* Dropdown Menu (Edit/Delete) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="hover:bg-gray-100 rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!isDropdownOpen);
                }}
              >
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDialogOpen(true);
                  setDropdownOpen(false);
                }}
              >
                Edit
              </DropdownMenuItem>
              {CurrentUser?.role === 'Manager' && (
                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  onSelect={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title & Status Badge */}
        <div className="flex justify-between items-start">
          <p className="text-lg font-semibold">{task.title}</p>
          <p className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusBadgeClass(task.status)}`}>
            {task.status}
          </p>
        </div>

        {/* Description (Truncated if Long) */}
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {task.description}
        </p>

        {CurrentUser?.role === "Manager" && (
          <div className='flex items-center justify-end gap-2 mt-4'>
            <FaUser className='text-fuchsia-500' />
            <p className=" text-gray-600 text-sm line-clamp-2">
              {user?.data?.name}
            </p>
          </div>
        )}
      </div>



      {/* Update task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg md:max-w-xl lg:max-w-2xl p-6 rounded-2xl shadow-lg bg-white">
          <DialogHeader>
            <DialogTitle>{CurrentUser?.role === "Manager" ? "Update Task" : "Update Task Status"}</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              {/* Title */}

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="title">
                  Title
                </label>
                <Input
                  id="title"
                  className="sm:col-span-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={CurrentUser?.role !== "Manager"}
                />
              </div>

              {/* Description */}

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="description">
                  Description
                </label>
                <Input
                  id="description"
                  className="sm:col-span-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={CurrentUser?.role !== "Manager"}
                />
              </div>

              {/* Assigned User */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="assignedUser">
                  Assigned User
                </label>
                <div className="sm:col-span-3">
                  {/* {!user && userLoading && <p>Loading assigned user...</p>} */}
                  {/* {!user && userError && <p>{userError}</p>} */}
                  {user?.data && (
                    <Input
                      id="assignedUser"
                      value={CurrentUser?.name}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      disabled
                    />
                  )}
                </div>

              </div>
              {/* Available Users */}
              {CurrentUser?.role === "Manager" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="availableUsers">
                    Available Users
                  </label>
                  <div className="sm:col-span-3">
                    {!usersData && usersLoading && <p>Loading users...</p>}
                    {/* {!users && usersError && <p>{usersError}</p>} */}
                    {usersData?.data && (
                      <Select
                        value={assignedTo}
                        onValueChange={(newUserId) => setAssignedTo(newUserId)}
                      >
                        <SelectTrigger className="w-full">
                          <p>
                            {assignedTo
                              ? usersData?.data?.find((u: User) => u._id === assignedTo)?.name
                              : 'Select a user'}
                          </p>
                        </SelectTrigger>
                        <SelectContent>
                          {usersData?.data?.map((u: User) => (
                            <SelectItem key={u._id} value={u._id}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="status">
                  Status
                </label>
                <Select
                  value={status}
                  onValueChange={(newValue) =>
                    handleStatusChange(newValue as 'In Progress' | 'Completed')
                  }
                >
                  <SelectTrigger className="sm:col-span-3">
                    <p>{status}</p>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                  </SelectContent>
                </Select>

                <DialogFooter className="mt-6 flex justify-end space-x-4">
                  <Button
                    type="reset"
                    variant={'outline'}
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateClick}>Update</Button>
                </DialogFooter>
              </div>
            </div>
          </form>

        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Confirm Delete</h2>
          </DialogHeader>
          <p>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { TaskCard };
export type { TaskSubmitData };
