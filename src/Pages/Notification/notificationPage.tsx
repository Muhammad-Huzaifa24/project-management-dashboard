import React, { useState } from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationCircle, FaChevronCircleUp, FaRegBell } from 'react-icons/fa';


// Sample Notification data
interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  { id: '1', icon: <FaBell />, title: 'Task Assigned', description: 'You have been assigned a new task.', time: '2 minutes ago', isRead: false },
  { id: '2', icon: <FaExclamationCircle />, title: 'Warning', description: 'Your subscription is about to expire.', time: '1 hour ago', isRead: false },
  { id: '3', icon: <FaCheckCircle />, title: 'Success', description: 'Your payment was successful.', time: '5 hours ago', isRead: true },
  { id: '4', icon: <FaExclamationCircle />, title: 'Error', description: 'There was an error processing your request.', time: '1 day ago', isRead: true },
];

const NotificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Unread', 'Read'

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'Unread') return !notification.isRead;
    if (activeTab === 'Read') return notification.isRead;
    return true; // 'All'
  });

// Count for each tab
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const readCount = notifications.filter((notification) => notification.isRead).length;
  const allCount = notifications.length;

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b pb-4 mb-6 ">
        <button
          onClick={() => setActiveTab('All')}
          className={`flex items-center gap-2 text-lg font-semibold ${activeTab === 'All' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
            <FaBell/>
            All
            <span className="ml-2 text-sm text-gray-500">{allCount}</span>
        </button>
        <button
          onClick={() => setActiveTab('Unread')}
          className={`flex items-center gap-2 text-lg font-semibold ${activeTab === 'Unread' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
            <FaRegBell/>
            Unread
            <span className="ml-2 text-sm text-gray-500">{unreadCount}</span>
        </button>
        <button
          onClick={() => setActiveTab('Read')}
          className={` flex items-center gap-2 text-lg font-semibold ${activeTab === 'Read' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
            <FaCheckCircle />
          Read
        <span className="ml-2 text-sm text-gray-500">{readCount}</span>
        </button>
        <p></p>
      </div>

      {/* Notifications */}
      <div className="space-y-4 h-96 overflow-auto custom-scrollbar">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 text-gray-400 bg-gray-100 rounded-full">
                {notification.icon}
              </div>

              {/* Notification Content */}
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{notification.title}</p>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaTimes />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>

              {/* Read/Unread Indicator */}
              <span
                className={`h-2 w-2 rounded-full ${notification.isRead ? 'bg-blue-500' : 'bg-red-500'}`}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No notifications to display.</p>
        )}
      </div>

      {activeTab === "All" && allCount > 3 && (
        <div className=' flex items-center justify-center gap-2 py-1'>
            <FaChevronCircleUp /> 
            <p className='m-0 p-0'>See more notifications</p>
        </div>
      )}
      {activeTab === "Unread" && unreadCount > 3 && (
        <div className=' flex items-center justify-center gap-2 py-1'>
            <FaChevronCircleUp /> 
            <p className='m-0 p-0'>See more notifications</p>
        </div>
      )}
      {activeTab === "Read" && readCount > 3 && (
        <div className=' flex items-center justify-center gap-2 py-1'>
            <FaChevronCircleUp /> 
            <p className='m-0 p-0'>See more notifications</p>
        </div>
      )}
        
    </div>
  );
};

export { NotificationPage };
