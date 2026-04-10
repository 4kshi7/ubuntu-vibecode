import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowStore } from '../../store/windowStore';
import Terminal from '../Apps/Terminal/Terminal';
import Firefox from '../Apps/Firefox/Firefox';
import Files from '../Apps/Files/Files';
import Settings from '../Apps/Settings/Settings';

const appComponents = {
  terminal: Terminal,
  files:    Files,
  firefox:  Firefox,
  settings: Settings,
};

const appTitles = {
  terminal: 'Terminal',
  files:    'Files',
  firefox:  'Firefox Web Browser',
  settings: 'Settings',
};

const appIcons = {
  terminal: <span className="text-[10px] font-bold font-mono text-green-400 bg-[#300a24] px-0.5 rounded">$_</span>,
  files:    <span className="text-xs">📁</span>,
  firefox:  <span className="text-xs">🌐</span>,
  settings: <span className="text-xs">⚙️</span>,
};

const Window = ({ app }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, activeWindow } = useWindowStore();
  const isActive = activeWindow === app.id;
  const AppComponent = appComponents[app.id];

  const [rndState, setRndState] = useState({
    x: Math.max(60, window.innerWidth / 2 - 400 + (Math.random() * 80 - 40)),
    y: Math.max(36, window.innerHeight / 2 - 275 + (Math.random() * 80 - 40)),
    width: 800,
    height: 550,
  });

  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  React.useEffect(() => {
    const h = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  if (app.minimized) return null;

  const maxSize = { width: vp.w, height: vp.h - 28 };

  return (
    <Rnd
      size={app.maximized ? maxSize : { width: rndState.width, height: rndState.height }}
      position={app.maximized ? { x: 0, y: 28 } : { x: rndState.x, y: rndState.y }}
      onDragStop={(_, d) => {
        if (!app.maximized) setRndState(s => ({ ...s, x: d.x, y: Math.max(28, d.y) }));
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        if (!app.maximized) setRndState({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: pos.x,
          y: Math.max(28, pos.y),
        });
      }}
      minWidth={320}
      minHeight={220}
      bounds="parent"
      dragHandleClassName="win-drag"
      style={{ zIndex: app.zIndex, position: 'absolute' }}
      onMouseDown={() => focusWindow(app.id)}
      disableDragging={app.maximized}
      enableResizing={!app.maximized}
      className={`flex flex-col overflow-hidden border ${
        app.maximized
          ? '!rounded-none border-0 shadow-none'
          : `rounded-xl border-black/60 ${isActive ? 'shadow-[0_20px_60px_rgba(0,0,0,0.7)]' : 'shadow-[0_8px_32px_rgba(0,0,0,0.5)]'}`
      }`}
    >
      {/* Title bar */}
      <div
        className={`win-drag h-8 flex items-center px-3 gap-2.5 flex-shrink-0 select-none border-b border-black/40 ${
          isActive
            ? 'bg-[#3a3a3a]'
            : 'bg-[#2a2a2a]'
        } ${app.maximized ? '' : 'rounded-t-xl'}`}
        onDoubleClick={() => toggleMaximize(app.id)}
      >
        {/* macOS/Ubuntu-style left-side traffic light buttons */}
        <div className="flex items-center gap-1.5 group/btns">
          {/* Close – red */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); closeWindow(app.id); }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/60 flex items-center justify-center hover:brightness-90 transition-all flex-shrink-0"
            title="Close"
          >
            <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover/btns:opacity-100 transition-opacity" viewBox="0 0 8 8">
              <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Minimize – yellow */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); minimizeWindow(app.id); }}
            className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d9a012]/60 flex items-center justify-center hover:brightness-90 transition-all flex-shrink-0"
            title="Minimize"
          >
            <svg className="w-1.5 h-1.5 text-[#995700] opacity-0 group-hover/btns:opacity-100 transition-opacity" viewBox="0 0 8 2">
              <line x1="0.5" y1="1" x2="7.5" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Maximize – green */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); toggleMaximize(app.id); }}
            className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab2c]/60 flex items-center justify-center hover:brightness-90 transition-all flex-shrink-0"
            title={app.maximized ? 'Restore' : 'Maximize'}
          >
            <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover/btns:opacity-100 transition-opacity" viewBox="0 0 8 8" fill="none">
              {app.maximized
                ? <path d="M2 6L6 2M4 2h2v2M2 4V6h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                : <path d="M1 1h6v6H1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              }
            </svg>
          </button>
        </div>

        {/* Centered title */}
        <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
          <span className="flex-shrink-0">{appIcons[app.id]}</span>
          <span className={`text-xs font-medium truncate ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
            {appTitles[app.id] || app.id}
          </span>
        </div>

        {/* Right spacer to balance left buttons */}
        <div className="w-12 flex-shrink-0" />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative bg-[#1e1e1e]">
        {AppComponent && <AppComponent />}
      </div>
    </Rnd>
  );
};

export default Window;
