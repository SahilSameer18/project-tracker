import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '', color }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  const bgColor = color || 'bg-gray-500';

  return (
    <div className={`inline-flex items-center justify-center rounded-full ${bgColor} text-white font-medium ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
};