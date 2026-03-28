import React, { useState } from 'react';
import { useSettingsStore } from '../../../store/settingsStore';

const SidebarItems = [
  { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'network', name: 'Network', icon: '🌐' },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'ᛒ' },
  { id: 'background', name: 'Background', icon: '🖼️' },
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
  { id: 'displays', name: 'Displays', icon: '🖥️' },
  { id: 'about', name: 'About', icon: 'ℹ️' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('background');
  
  const { 
    theme, setTheme, 
    wallpaper, setWallpaper,
    wifiEnabled, toggleWifi,
    bluetoothEnabled, toggleBluetooth
  } = useSettingsStore();

  const wallpapers = [
    { id: 'jammy', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Ubuntu_22.04_Jammy_Jellyfish_default_wallpaper.svg/2560px-Ubuntu_22.04_Jammy_Jellyfish_default_wallpaper.svg.png' },
    { id: 'focal', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Ubuntu_20.04_Focal_Fossa_default_wallpaper.svg/2560px-Ubuntu_20.04_Focal_Fossa_default_wallpaper.svg.png' },
    { id: 'gradient-orange', url: 'linear-gradient(135deg, #E95420 0%, #77216F 100%)' },
    { id: 'dark-solid', url: '#1e1e1e' },
  ];

  return (
    <div className={`flex w-full h-full text-white ${theme === 'dark' ? 'bg-[#252525]' : 'bg-gray-100 text-black'}`}>
      {/* Sidebar */}
      <div className={`w-1/3 max-w-[250px] flex flex-col py-2 border-r overflow-y-auto ${theme === 'dark' ? 'bg-[#1e1e1e] border-black/30' : 'bg-white border-gray-200'}`}>
        <div className="px-4 py-3 pb-4">
          <div className="relative">
            <input type="text" placeholder="Search settings" className={`w-full rounded-md px-8 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ubuntu-orange ${theme === 'dark' ? 'bg-[#2d2d2d] text-white' : 'bg-gray-100 text-black'}`} />
            <svg className="w-4 h-4 absolute left-2.5 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        {SidebarItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-4 py-2 text-sm cursor-pointer mx-2 rounded-md ${activeTab === item.id ? (theme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-gray-200') : (theme === 'dark' ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100')}`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col items-center pt-8 px-8 overflow-y-auto ${theme === 'dark' ? 'bg-[#252525]' : 'bg-gray-50'}`}>
        <h2 className={`text-2xl font-semibold mb-8 self-start ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{SidebarItems.find(i=>i.id === activeTab)?.name}</h2>

        {activeTab === 'background' && (
          <div className="w-full max-w-2xl flex flex-col">
            <h3 className="text-lg mb-4 text-gray-400">Current Background</h3>
            <div 
              className="w-full h-64 rounded-xl mb-8 border-4 border-gray-600 shadow-lg bg-cover bg-center"
              style={{ background: wallpaper.startsWith('url') || wallpaper.startsWith('http') ? (wallpaper.startsWith('http') ? `url(${wallpaper})` : wallpaper) : wallpaper, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            
            <h3 className="text-lg mb-4 text-gray-400">Wallpapers</h3>
            <div className="grid grid-cols-2 gap-4">
              {wallpapers.map((wp) => (
                <div 
                  key={wp.id}
                  onClick={() => setWallpaper(wp.url)}
                  className={`h-32 rounded-xl cursor-pointer border-4 hover:opacity-90 bg-cover bg-center ${wallpaper === wp.url ? 'border-orange-500' : 'border-transparent'}`}
                  style={{ background: wp.url.startsWith('url') || wp.url.startsWith('http') ? (wp.url.startsWith('http') ? `url(${wp.url})` : wp.url) : wp.url, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wifi' && (
          <div className="w-full max-w-2xl flex flex-col">
            <div className={`w-full rounded-lg overflow-hidden border p-4 flex justify-between items-center ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#1e1e1e]' : 'bg-white border-gray-200'}`}>
              <div>
                <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Wi-Fi</h3>
                <p className="text-sm text-gray-400">Connect to wireless networks</p>
              </div>
              <div 
                className={`w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-colors ${wifiEnabled ? 'bg-orange-500' : 'bg-gray-400'}`}
                onClick={toggleWifi}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${wifiEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            {wifiEnabled && (
              <div className="mt-8 flex flex-col space-y-2">
                <div className={`p-3 rounded-md flex justify-between items-center ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
                  <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Home Network (Connected)</span>
                  <span className="text-orange-500">📶</span>
                </div>
                <div className={`p-3 rounded-md flex justify-between items-center opacity-70 ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
                  <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Guest Network</span>
                  <span>🔒</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bluetooth' && (
          <div className="w-full max-w-2xl flex flex-col">
            <div className={`w-full rounded-lg overflow-hidden border p-4 flex justify-between items-center ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#1e1e1e]' : 'bg-white border-gray-200'}`}>
              <div>
                <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Bluetooth</h3>
                <p className="text-sm text-gray-400">Connect to devices</p>
              </div>
              <div 
                className={`w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-colors ${bluetoothEnabled ? 'bg-orange-500' : 'bg-gray-400'}`}
                onClick={toggleBluetooth}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${bluetoothEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <svg className="w-32 h-32 text-orange-500 mb-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-14c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>
            <h1 className="text-3xl font-light mb-1">Ubuntu 22.04.3 LTS</h1>
            <p className="text-gray-400 mb-8">64-bit</p>
            
            <div className="w-full bg-[#2d2d2d] rounded-lg overflow-hidden border border-[#1e1e1e]">
              <div className="px-4 py-3 flex justify-between border-b border-[#1e1e1e]">
                <span className="text-gray-400">Hardware Model</span>
                <span>VMware Virtual Platform</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-b border-[#1e1e1e]">
                <span className="text-gray-400">Memory</span>
                <span>8.0 GiB</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-b border-[#1e1e1e]">
                <span className="text-gray-400">Processor</span>
                <span>AMD Ryzen 7 5800X 8-Core Processor x 16</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-b border-[#1e1e1e]">
                <span className="text-gray-400">OS Name</span>
                <span>Ubuntu 22.04 LTS</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-b border-[#1e1e1e]">
                <span className="text-gray-400">OS Type</span>
                <span>64-bit</span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-gray-400">Windowing System</span>
                <span>Wayland</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="w-full max-w-2xl flex flex-col">
            <h3 className="text-lg mb-4">Style</h3>
            <div className="flex space-x-6 mb-8">
              <div 
                className={`flex flex-col items-center cursor-pointer ${!darkMode ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                onClick={() => setDarkMode(false)}
              >
                <div className={`w-32 h-24 bg-gray-200 rounded-lg mb-2 border-4 ${!darkMode ? 'border-orange-500' : 'border-transparent'}`}></div>
                <span>Light</span>
              </div>
              <div 
                className={`flex flex-col items-center cursor-pointer ${darkMode ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                onClick={() => setDarkMode(true)}
              >
                <div className={`w-32 h-24 bg-gray-800 rounded-lg mb-2 border-4 ${darkMode ? 'border-orange-500' : 'border-transparent'}`}></div>
                <span>Dark</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'appearance' && (
          <div className="w-full max-w-2xl flex flex-col">
            <h3 className="text-lg mb-4 text-gray-400">Style</h3>
            <div className="flex space-x-6 mb-8">
              <div 
                className={`flex flex-col items-center cursor-pointer ${theme === 'light' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                onClick={() => setTheme('light')}
              >
                <div className={`w-32 h-24 bg-gray-200 rounded-lg mb-2 border-4 ${theme === 'light' ? 'border-orange-500' : 'border-transparent'}`}></div>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Light</span>
              </div>
              <div 
                className={`flex flex-col items-center cursor-pointer ${theme === 'dark' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                onClick={() => setTheme('dark')}
              >
                <div className={`w-32 h-24 bg-gray-800 rounded-lg mb-2 border-4 ${theme === 'dark' ? 'border-orange-500' : 'border-transparent'}`}></div>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Dark</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <svg className="w-32 h-32 text-orange-500 mb-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-14c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>
            <h1 className={`text-3xl font-light mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Ubuntu 22.04.3 LTS</h1>
            <p className="text-gray-400 mb-8">64-bit</p>
            
            <div className={`w-full rounded-lg overflow-hidden border ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#1e1e1e]' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 flex justify-between border-b ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-gray-200'}`}>
                <span className="text-gray-400">Hardware Model</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>VMware Virtual Platform</span>
              </div>
              <div className={`px-4 py-3 flex justify-between border-b ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-gray-200'}`}>
                <span className="text-gray-400">Memory</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>8.0 GiB</span>
              </div>
              <div className={`px-4 py-3 flex justify-between border-b ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-gray-200'}`}>
                <span className="text-gray-400">Processor</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>AMD Ryzen 7 5800X 8-Core Processor x 16</span>
              </div>
              <div className={`px-4 py-3 flex justify-between border-b ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-gray-200'}`}>
                <span className="text-gray-400">OS Name</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Ubuntu 22.04 LTS</span>
              </div>
              <div className={`px-4 py-3 flex justify-between border-b ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-gray-200'}`}>
                <span className="text-gray-400">OS Type</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>64-bit</span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-gray-400">Windowing System</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Wayland</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;