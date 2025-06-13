import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-white border-dotted rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
