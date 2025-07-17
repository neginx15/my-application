import React from 'react';

interface LinkProps {
  text: string;
  url: string;
  variant?: 'default' | 'button';
}

export const Link: React.FC<LinkProps> = ({ 
  text, 
  url,
  variant = 'default'
}) => {
  const getLinkStyle = () => {
    const baseStyle = {
      textDecoration: 'none',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'button':
        return {
          ...baseStyle,
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        };
      default:
        return {
          ...baseStyle,
          color: '#007bff',
          '&:hover': {
            textDecoration: 'underline',
          },
        };
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={getLinkStyle()}
    >
      {text}
    </a>
  );
}; 