import React from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';

// Inline SVG icons – no external CDN dependency
const icons = {
  files: (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <rect x="6" y="10" width="22" height="28" rx="2" fill="#5c9bd6"/>
      <rect x="6" y="10" width="22" height="28" rx="2" fill="url(#folderGrad)"/>
      <path d="M6 10 Q6 6 10 6 L20 6 L24 10 Z" fill="#4a8bc4"/>
      <defs>
        <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6cb4f5"/>
          <stop offset="100%" stopColor="#2b7fd4"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <rect x="4" y="8" width="40" height="32" rx="3" fill="#300a24"/>
      <rect x="4" y="8" width="40" height="6" rx="3" fill="#3d1235"/>
      <circle cx="10" cy="11" r="1.5" fill="#ff5f57"/>
      <circle cx="16" cy="11" r="1.5" fill="#ffbd2e"/>
      <circle cx="22" cy="11" r="1.5" fill="#28c840"/>
      <text x="8" y="28" fontFamily="monospace" fontSize="10" fill="#4e9a06" fontWeight="bold">$</text>
      <rect x="14" y="22" width="14" height="2" rx="1" fill="#e95420" opacity="0.8"/>
      <rect x="8" y="30" width="20" height="2" rx="1" fill="#888" opacity="0.6"/>
    </svg>
  ),
  firefox: (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <circle cx="24" cy="24" r="18" fill="#0060df"/>
      <circle cx="24" cy="24" r="18" fill="url(#ffGrad)"/>
      <path d="M24 6 C32 6 38 10 41 16 C38 12 34 10 30 10 C26 10 22 12 20 16 C18 20 18 26 22 30 C26 34 32 34 36 30 C33 36 28 40 22 40 C14 40 8 34 8 26 C8 18 14 10 22 8 Z" fill="#ff9500" opacity="0.9"/>
      <defs>
        <radialGradient id="ffGrad" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#2394ff"/>
          <stop offset="100%" stopColor="#0060df"/>
        </radialGradient>
      </defs>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <circle cx="24" cy="24" r="8" fill="#bbb"/>
      <path d="M24 4 L27 10 L33 8 L34 14 L40 16 L38 22 L44 24 L38 26 L40 32 L34 34 L33 40 L27 38 L24 44 L21 38 L15 40 L14 34 L8 32 L10 26 L4 24 L10 22 L8 16 L14 14 L15 8 L21 10 Z" fill="#7a7a7a" fillRule="evenodd"/>
      <circle cx="24" cy="24" r="7" fill="#2d2d2d"/>
      <circle cx="24" cy="24" r="4" fill="#555"/>
    </svg>
  ),
  vscode: (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <path d="M6 14 L18 24 L6 34 L2 30 L10 24 L2 18 Z" fill="#007acc"/>
      <path d="M26 10 L38 2 L46 8 L18 26 Z" fill="#007acc"/>
      <path d="M26 38 L38 46 L46 40 L18 22 Z" fill="#007acc"/>
      <path d="M38 2 L46 8 L46 40 L38 46 Z" fill="#005f9e"/>
    </svg>
  ),
  calculator: (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#4a90d9"/>
      <rect x="12" y="8" width="24" height="10" rx="2" fill="#72b3f5"/>
      <rect x="12" y="24" width="6" height="5" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="21" y="24" width="6" height="5" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="30" y="24" width="6" height="5" rx="1" fill="#e95420" opacity="0.9"/>
      <rect x="12" y="32" width="6" height="5" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="21" y="32" width="6" height="5" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="30" y="32" width="6" height="9" rx="1" fill="#e95420" opacity="0.9"/>
    </svg>
  ),
};

const apps = [
  { id: 'files',    icon: icons.files,      title: 'Files'       },
  { id: 'terminal', icon: icons.terminal,   title: 'Terminal'    },
  { id: 'firefox',  icon: icons.firefox,    title: 'Firefox'     },
  { id: 'settings', icon: icons.settings,   title: 'Settings'    },
];

const Dock = () => {
  const { openWindow, windows } = useWindowStore();
  const openIds = new Set(windows.map(w => w.id));
  const activeIds = new Set(windows.filter(w => !w.minimized).map(w => w.id));

  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-40 py-3 px-1.5 gap-1
                    bg-black/40 backdrop-blur-xl border border-white/10 rounded-r-2xl shadow-2xl">
      {/* App grid button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/15 transition-colors mb-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
        </svg>
      </motion.div>

      <div className="w-8 h-px bg-white/10 mb-1" />

      {apps.map(app => (
        <div key={app.id} className="relative group flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.18, x: 3 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-colors
              ${activeIds.has(app.id) ? 'bg-white/20' : 'hover:bg-white/12'}`}
            onClick={() => openWindow(app.id)}
          >
            {app.icon}
          </motion.div>

          {/* Running indicator */}
          {openIds.has(app.id) && (
            <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />
          )}

          {/* Tooltip */}
          <div className="absolute left-14 top-1/2 -translate-y-1/2 pointer-events-none
                          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            <div className="bg-black/90 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
              {app.title}
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dock;
