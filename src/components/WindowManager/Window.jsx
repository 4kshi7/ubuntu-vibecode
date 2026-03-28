import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import Terminal from '../Apps/Terminal/Terminal';
import Firefox from '../Apps/Firefox/Firefox';
import Files from '../Apps/Files/Files';
import Settings from '../Apps/Settings/Settings';

// Map app IDs to their components
const appComponents = {
  terminal: <Terminal />,
  files: <Files />,
  firefox: <Firefox />,
  settings: <Settings />
};

const appTitles = {
  terminal: 'Terminal',
  files: 'Files',
  firefox: 'Firefox',
  settings: 'Settings'
};

const Window = ({ app }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, activeWindow } = useWindowStore();
  const isActive = activeWindow === app.id;

  const [rndState, setRndState] = useState({
    x: Math.max(0, window.innerWidth / 2 - 350 + (Math.random() * 50)),
    y: Math.max(28, window.innerHeight / 2 - 250 + (Math.random() * 50)),
    width: 700,
    height: 500
  });

  if (app.minimized) return null;

  return (
    <Rnd
      size={app.maximized ? { width: '100vw', height: 'calc(100vh - 28px)' } : { width: rndState.width, height: rndState.height }}
      position={app.maximized ? { x: 0, y: 28 } : { x: rndState.x, y: rndState.y }}
      onDragStop={(e, d) => {
        if (!app.maximized) {
          setRndState(prev => ({ ...prev, x: d.x, y: Math.max(28, d.y) }));
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!app.maximized) {
          setRndState({
            width: ref.style.width,
            height: ref.style.height,
            x: position.x,
            y: Math.max(28, position.y)
          });
        }
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      style={{ zIndex: app.zIndex }}
      onMouseDown={() => focusWindow(app.id)}
      disableDragging={app.maximized}
      enableResizing={!app.maximized}
      className={`absolute flex flex-col rounded-lg shadow-2xl overflow-hidden border border-[#1e1e1e] bg-[#252525] ${app.maximized ? '!rounded-none border-0' : ''}`}
    >
      {/* Title Bar */}
      <div 
        className={`window-drag-handle h-9 flex justify-between items-center px-4 select-none ${isActive ? 'bg-[#3d3d3d]' : 'bg-[#2d2d2d]'}`}
        onDoubleClick={() => toggleMaximize(app.id)}
      >
        <div className="text-sm font-medium text-gray-200">
          {appTitles[app.id] || 'App'}
        </div>
        
        {/* Window Controls (Ubuntu style circles on right, though modern Ubuntu has varying styles, let's use standard right-aligned buttons) */}
        <div className="flex space-x-3 items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(app.id); }}
            className="w-4 h-4 rounded-full bg-gray-500 hover:bg-gray-400 flex items-center justify-center text-black"
          >
            <div className="w-2 h-[2px] bg-black bg-opacity-70"></div>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(app.id); }}
            className="w-4 h-4 rounded-full bg-gray-500 hover:bg-gray-400 flex items-center justify-center"
          >
            {app.maximized ? (
               <div className="w-2 h-2 border border-black border-opacity-70"></div>
            ) : (
               <div className="w-2 h-2 border-2 border-black border-opacity-70"></div>
            )}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(app.id); }}
            className="w-4 h-4 rounded-full bg-orange-600 hover:bg-orange-500 flex items-center justify-center text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* App Content */}
      <div className="flex-1 overflow-hidden relative">
        {appComponents[app.id]}
      </div>
    </Rnd>
  );
};

export default Window;
