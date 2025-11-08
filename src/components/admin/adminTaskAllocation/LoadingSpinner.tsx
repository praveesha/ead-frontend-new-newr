import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{ 
            borderColor: 'var(--color-primary)',
            borderTopColor: 'transparent' 
          }}
        />
        {/* Inner ring */}
        <div 
          className="absolute inset-2 rounded-full border-4 border-b-transparent animate-spin"
          style={{ 
            borderColor: 'var(--color-primary-light)',
            borderBottomColor: 'transparent',
            animationDirection: 'reverse',
            animationDuration: '1.5s'
          }}
        />
      </div>
      {text && (
        <p 
          className="mt-4 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;