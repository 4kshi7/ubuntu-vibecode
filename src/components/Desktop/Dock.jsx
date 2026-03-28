import React from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';

const apps = [
  { id: 'files', icon: 'https://img.icons8.com/color/256/mac-folder.png', title: 'Files' },
  { id: 'terminal', icon: 'https://img.icons8.com/fluency/256/console.png', title: 'Terminal' },
  { id: 'firefox', icon: 'https://img.icons8.com/color/256/firefox.png', title: 'Firefox' },
  { id: 'settings', icon: 'https://img.icons8.com/color/256/settings--v1.png', title: 'Settings' }
];

const Dock = () => {
  const { openWindow } = useWindowStore();

  return (
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/40 backdrop-blur-md rounded-r-2xl py-2 px-1 flex flex-col items-center space-y-2 z-40 border border-white/10 shadow-lg">
      <div className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center cursor-pointer mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      {apps.map(app => (
        <motion.div
          key={app.id}
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
          onClick={() => openWindow(app.id)}
        >
          <div className="w-12 h-12 rounded-lg p-1 hover:bg-white/10 transition-colors flex items-center justify-center">
            <img 
              src={app.icon} 
              alt={app.title} 
              className="w-10 h-10 object-contain drop-shadow-lg filter"
            />
          </div>
          <div className="absolute left-14 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-medium shadow-md">
            {app.title}
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Dock;
