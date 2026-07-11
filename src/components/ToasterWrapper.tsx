'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterWrapper() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: {
          background: '#4b0000',
          color: '#fffff0',
          borderRadius: '12px',
        },
      }} 
    />
  );
}
