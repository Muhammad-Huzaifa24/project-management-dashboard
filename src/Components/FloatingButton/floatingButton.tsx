import React from 'react';

type PlusIconProps = React.SVGProps<SVGSVGElement>;

const PlusIcon: React.FC<PlusIconProps> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

interface FloatingButtonProps {
  onClick?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <div className="group/button fixed bottom-4 right-4 z-50">
      <button
        onClick={onClick}
        className="group flex items-center bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg overflow-hidden 
                  duration-300 hover:px-6"
        aria-label="Add"
      >
        {/* Plus Icon */}
        <p>
          <PlusIcon className="h-6 w-6" />
        </p>

        {/* Text (Initially Hidden, Appears on Hover) */}
        <p className="ml-2 hidden group-hover/button:inline duration-200">
          Create Project
        </p>
      </button>
    </div>
  );
};

export { FloatingButton };
