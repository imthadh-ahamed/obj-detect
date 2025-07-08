import React from 'react';
import './globals.css';

export const metadata = {
  title: 'YOLOv5 Object Detection',
  description: 'Upload images and detect objects using YOLOv5',
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
