import React from "react";
import { useTheme } from '../../contexts/ThemeContext';

interface LeadershipCardProps {
  name: string;
  title: string;
  image: string;
  isActive: boolean;
}

const LeadershipCard: React.FC<LeadershipCardProps> = ({
  name,
  title,
  image,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="group flex flex-col items-center text-center">
      {/* Clean minimal image container */}
      <div className="relative mb-6 w-64 h-64 overflow-hidden bg-gray-200 rounded-lg shadow-sm">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/256x256/e5e7eb/6b7280?text=Team+Member';
          }}
        />
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      {/* Clean text layout */}
      <div className="space-y-1">
        <h3 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {name}
        </h3>
        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default LeadershipCard;
