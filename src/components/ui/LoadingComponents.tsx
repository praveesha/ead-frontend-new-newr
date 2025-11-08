import React from 'react';

export const ChatListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index}
          className="p-3 rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: 'var(--color-border-secondary)' }}
            />
            <div className="flex-1 space-y-2">
              <div 
                className="h-4 rounded"
                style={{ 
                  backgroundColor: 'var(--color-border-secondary)',
                  width: '70%'
                }}
              />
              <div 
                className="h-3 rounded"
                style={{ 
                  backgroundColor: 'var(--color-border-tertiary)',
                  width: '90%'
                }}
              />
            </div>
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-border-secondary)' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MessageSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index} 
          className={`flex ${index % 3 === 0 ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg animate-pulse ${
              index % 3 === 0 ? 'rounded-br-none' : 'rounded-bl-none'
            }`}
            style={{ 
              backgroundColor: index % 3 === 0 
                ? 'var(--color-bg-tertiary)' 
                : 'var(--color-border-secondary)' 
            }}
          >
            <div 
              className="h-4 rounded mb-2"
              style={{ 
                backgroundColor: 'var(--color-border-tertiary)',
                width: `${60 + Math.random() * 40}%`
              }}
            />
            <div 
              className="h-3 rounded"
              style={{ 
                backgroundColor: 'var(--color-border-subtle)',
                width: '40%'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatHeaderSkeleton: React.FC = () => {
  return (
    <div 
      className="p-4 border-b animate-pulse"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border-primary)'
      }}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: 'var(--color-border-secondary)' }}
        />
        <div className="flex-1">
          <div 
            className="h-4 rounded mb-2"
            style={{ 
              backgroundColor: 'var(--color-border-secondary)',
              width: '50%'
            }}
          />
          <div 
            className="h-3 rounded"
            style={{ 
              backgroundColor: 'var(--color-border-tertiary)',
              width: '30%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex justify-center">
      <svg 
        className={`animate-spin ${sizeClasses[size]}`}
        style={{ color: 'var(--color-primary)' }}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const ErrorBoundary: React.FC<{ 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  onRetry?: () => void;
}> = ({ children, fallback, onRetry }) => {
  return (
    <div>
      {fallback || (
        <div 
          className="text-center py-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <div 
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
          >
            <svg 
              className="w-6 h-6" 
              style={{ color: 'var(--color-primary)' }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <p className="text-sm mb-4">Something went wrong</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'white'
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};