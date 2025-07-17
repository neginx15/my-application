import React from 'react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({ 
  text, 
  variant = 'primary',
  size = 'medium'
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      padding: size === 'small' ? '8px 16px' : size === 'medium' ? '12px 24px' : '16px 32px',
      fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#007bff',
          color: 'white',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#6c757d',
          color: 'white',
          '&:hover': {
            backgroundColor: '#545b62',
          },
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: '#007bff',
          border: '2px solid #007bff',
          '&:hover': {
            backgroundColor: '#f8f9fa',
          },
        };
      default:
        return baseStyle;
    }
  };

  return (
    <button style={getButtonStyle()}>
      {text}
    </button>
  );
}; 