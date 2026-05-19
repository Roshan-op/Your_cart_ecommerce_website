import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin">
        <div className="w-16 h-16 border-4 border-beige border-t-accent rounded-full"></div>
      </div>
    </div>
  );
};

export default Loading;
