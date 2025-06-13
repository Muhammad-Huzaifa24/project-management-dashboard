import React from 'react';
import {FaUser, FaChevronCircleUp   } from 'react-icons/fa';
import {Bell, XIcon} from "lucide-react"
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const Notification: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
    const navigate = useNavigate();
    const handleGotoNotificationPage = () => {
        navigate("/notifications")
        onClose()
    }
  return (
    <div className="absolute top-0 right-4 z-50 w-[500px] bg-white pt-4 px-4 rounded-lg shadow-lg border border-gray-300">
        <div className=' flex items-center justify-between mb-2 pb-4 border-b border-b-gray-300'>
            <div className='flex items-center gap-2'>
                <Bell className='size-7 '/>
                <p className='text-lg font-semibold'>Notifications</p>
                <p className="bg-blue-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{notifications?.length}</p>
            </div>
            <button onClick={onClose} className=" text-gray-500 hover:text-gray-700">
                <XIcon className='size-6 text-gray-400 font-light'/>
            </button>
        </div>
        {/* Notification List */}
        <div className="space-y-2 overflow-auto h-96 custom-scrollbar">

            {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center px-3 py-3 border border-gray-300 rounded-md cursor-pointer" onClick={handleGotoNotificationPage}>

                    {/* Icon */}
                    <div className={`flex-shrink-0 size-8 text-gray-400  flex items-center justify-center border border-black rounded-full`}>
                        <FaUser className={`size-5 ${notification.isRead ? 'text-gray-500' : 'text-gray-800'}`}/>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1  mx-2">
                    <div className="flex items-center justify-between ">
                        <p className={`font-semibold ${notification.isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                        {notification.title}
                        </p>
                    </div>
                        <p
                            className={`text-sm ${notification.isRead ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}
                        >
                            {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>

                    <p className={`h-2 w-2 rounded-full ${notification.isRead ? 'bg-gray-400' : 'bg-blue-500'}`} />
                </div>
            ))}
        </div>
        {notifications.length > 4 &&  
            <div className=' flex items-center justify-center gap-2 py-1'>
                <FaChevronCircleUp /> 
                <p className='m-0 p-0'>See more notifications</p>
            </div>
        }
    </div>
  );
};

export  {Notification};
