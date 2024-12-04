import React from 'react';
import { FaCrown } from 'react-icons/fa';

const ToolCard = ({ name, description, icon: Icon, onClick, isPro }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer relative"
    >
      {isPro && (
        <span className="absolute top-4 right-4 text-yellow-500 flex items-center">
          <FaCrown className="mr-1" />
          PRO
        </span>
      )}
      
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
        
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Try Now
        </button>
      </div>
    </div>
  );
};

export default ToolCard;
