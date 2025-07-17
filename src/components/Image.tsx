import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

interface ImageProps {
  width?: number;
  height?: number;
  onImageUpload?: (file: File) => void;
}

export const Image: React.FC<ImageProps> = ({ 
  width = 300, 
  height = 200,
  onImageUpload 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);

    // Call the onImageUpload callback if provided
    if (onImageUpload) {
      onImageUpload(file);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: width }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: '10px' }}
      />
      
      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
      )}

      {previewUrl && (
        <div style={{ 
          width: '100%', 
          height: height,
          overflow: 'hidden',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
    </div>
  );
};
