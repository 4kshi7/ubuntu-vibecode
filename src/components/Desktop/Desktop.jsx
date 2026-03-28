import React from 'react';
import TopBar from './TopBar';
import Dock from './Dock';
import WindowManager from '../WindowManager/WindowManager';
import { useSettingsStore } from '../../store/settingsStore';

const Desktop = () => {
  const wallpaper = useSettingsStore(state => state.wallpaper);

  const getBackgroundStyle = () => {
    if (wallpaper.startsWith('http') || wallpaper.startsWith('url(')) {
      return { backgroundImage: wallpaper.startsWith('url') ? wallpaper : `url(${wallpaper})` };
    }
    return { background: wallpaper };
  };

  return (
    <div 
      className="relative w-full h-full bg-cover bg-center transition-all duration-500 overflow-hidden"
      style={getBackgroundStyle()}
    >
      <TopBar />
      <Dock />
      <WindowManager />
    </div>
  );
};

export default Desktop;
