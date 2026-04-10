import React, { useState } from 'react';
import { useSettingsStore } from '../../../store/settingsStore';

const wallpapers = [
  { id: 'ubuntu-gradient', label: 'Jammy', url: 'linear-gradient(135deg, #E95420 0%, #77216F 100%)' },
  { id: 'dark-purple', label: 'Aubergine', url: 'linear-gradient(135deg, #2C001E 0%, #5B0F47 100%)' },
  { id: 'blue-ocean', label: 'Ocean', url: 'linear-gradient(135deg, #0d1b2a 0%, #1b4f72 50%, #2e86ab 100%)' },
  { id: 'forest', label: 'Forest', url: 'linear-gradient(135deg, #0b3d0b 0%, #1a6b1a 50%, #2e8b2e 100%)' },
  { id: 'dark-solid', label: 'Dark', url: '#1e1e1e' },
  { id: 'slate', label: 'Slate', url: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { id: 'sunrise', label: 'Sunrise', url: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
  { id: 'focal-wp', label: 'Focal', url: 'linear-gradient(to bottom right, #E95420, #772953, #2C001E)' },
];

const sidebar = [
  { id: 'wifi',       name: 'Wi-Fi',       icon: '📶' },
  { id: 'bluetooth',  name: 'Bluetooth',   icon: '🔵' },
  { id: 'background', name: 'Background',  icon: '🖼️' },
  { id: 'appearance', name: 'Appearance',  icon: '🎨' },
  { id: 'sound',      name: 'Sound',       icon: '🔊' },
  { id: 'displays',   name: 'Displays',    icon: '🖥️' },
  { id: 'about',      name: 'About',       icon: 'ℹ️' },
];

const Toggle = ({ value, onChange }) => (
  <div
    className={`w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-all duration-200 ${value ? 'bg-[#e95420]' : 'bg-gray-500'}`}
    onClick={onChange}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
  </div>
);

const Row = ({ label, sub, right, theme }) => (
  <div className={`flex items-center justify-between px-4 py-3 ${theme==='dark'?'border-[#1e1e1e]':'border-gray-200'} border-b last:border-0`}>
    <div>
      <div className={theme==='dark'?'text-white':'text-black'}>{label}</div>
      {sub && <div className="text-sm text-gray-400">{sub}</div>}
    </div>
    {right}
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('background');
  const [search, setSearch] = useState('');
  const { theme, setTheme, wallpaper, setWallpaper, wifiEnabled, toggleWifi, bluetoothEnabled, toggleBluetooth, volume, setVolume } = useSettingsStore();

  const dark = theme === 'dark';
  const card = dark ? 'bg-[#2d2d2d] border-[#1e1e1e]' : 'bg-white border-gray-200';
  const bg = dark ? 'bg-[#252525]' : 'bg-gray-50';
  const sidebarBg = dark ? 'bg-[#1e1e1e] border-black/30' : 'bg-white border-gray-200';
  const text = dark ? 'text-white' : 'text-gray-900';

  const filteredSidebar = search
    ? sidebar.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : sidebar;

  const WpPreview = ({ url }) => {
    const style = url.startsWith('http') ? { backgroundImage: `url(${url})`, backgroundSize:'cover', backgroundPosition:'center' }
      : url.startsWith('url(') ? { backgroundImage: url, backgroundSize:'cover', backgroundPosition:'center' }
      : { background: url };
    return (
      <div
        style={style}
        className={`h-28 rounded-xl cursor-pointer border-4 transition-all hover:scale-105 ${wallpaper===url?'border-[#e95420]':'border-transparent'}`}
        onClick={() => setWallpaper(url)}
      />
    );
  };

  return (
    <div className={`flex w-full h-full ${text} ${bg}`}>
      {/* Sidebar */}
      <div className={`w-56 flex-shrink-0 flex flex-col py-2 border-r overflow-y-auto ${sidebarBg}`}>
        <div className="px-3 pt-2 pb-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search settings"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full rounded-md pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#e95420] ${dark?'bg-[#2d2d2d] text-white':'bg-gray-100 text-black'}`}
            />
          </div>
        </div>
        {filteredSidebar.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-3 py-2 mx-2 text-sm rounded-md text-left transition-colors ${
              activeTab===item.id
                ? (dark?'bg-[#3d3d3d] text-white':'bg-gray-200 text-black')
                : (dark?'hover:bg-[#2d2d2d] text-gray-300':'hover:bg-gray-100 text-gray-700')
            }`}
          >
            <span className="mr-3 text-base">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className={`flex-1 overflow-y-auto p-8 ${bg}`}>
        <h2 className={`text-2xl font-semibold mb-6 ${text}`}>
          {sidebar.find(i=>i.id===activeTab)?.name}
        </h2>

        {/* ── Background ── */}
        {activeTab === 'background' && (
          <div className="max-w-2xl">
            {/* Preview */}
            <div
              className="w-full h-40 rounded-2xl mb-6 shadow-lg border border-black/20"
              style={wallpaper.startsWith('http')||wallpaper.startsWith('url(')
                ? { backgroundImage: wallpaper.startsWith('url(')?wallpaper:`url(${wallpaper})`, backgroundSize:'cover', backgroundPosition:'center' }
                : { background: wallpaper }}
            />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Wallpapers</h3>
            <div className="grid grid-cols-4 gap-3">
              {wallpapers.map(wp => <WpPreview key={wp.id} url={wp.url} />)}
            </div>
          </div>
        )}

        {/* ── Appearance ── */}
        {activeTab === 'appearance' && (
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Style</h3>
            <div className={`rounded-xl border ${card} overflow-hidden mb-6`}>
              <div className="flex gap-6 p-5">
                {['light','dark'].map(t => (
                  <div key={t} onClick={() => setTheme(t)} className="cursor-pointer flex flex-col items-center gap-2">
                    <div className={`w-32 h-20 rounded-xl border-4 transition-all ${t==='light'?'bg-gray-100':'bg-gray-800'} ${theme===t?'border-[#e95420]':'border-transparent'}`} />
                    <span className={`text-sm capitalize ${theme===t?'text-[#e95420] font-medium':''}`}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Wi-Fi ── */}
        {activeTab === 'wifi' && (
          <div className="max-w-2xl">
            <div className={`rounded-xl border ${card} overflow-hidden mb-4`}>
              <Row label="Wi-Fi" sub="Connect to wireless networks" theme={theme}
                right={<Toggle value={wifiEnabled} onChange={toggleWifi} />} />
            </div>
            {wifiEnabled && (
              <div className={`rounded-xl border ${card} overflow-hidden`}>
                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${dark?'text-gray-400 bg-[#252525]':'text-gray-500 bg-gray-50'}`}>Visible Networks</div>
                {[{name:'Home Network',signal:4,lock:false,connected:true},{name:'Office-5G',signal:3,lock:true,connected:false},{name:'Guest Network',signal:2,lock:true,connected:false},{name:'Neighbor_WiFi',signal:1,lock:true,connected:false}].map((n,i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 border-b last:border-0 ${dark?'border-[#1e1e1e]':'border-gray-100'} cursor-pointer ${dark?'hover:bg-[#333]':'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{'📶'.slice(0,1)}</span>
                      <div>
                        <div className={`text-sm ${dark?'text-white':'text-black'} ${n.connected?'font-semibold':''}`}>{n.name}</div>
                        {n.connected && <div className="text-xs text-[#e95420]">Connected</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {n.lock && <span className="text-gray-400 text-sm">🔒</span>}
                      <div className="flex items-end gap-0.5 h-4">
                        {[1,2,3,4].map(b => (
                          <div key={b} className={`w-1 rounded-sm ${b<=n.signal?'bg-[#e95420]':'bg-gray-500'}`} style={{height:`${b*4}px`}} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Bluetooth ── */}
        {activeTab === 'bluetooth' && (
          <div className="max-w-2xl">
            <div className={`rounded-xl border ${card} overflow-hidden mb-4`}>
              <Row label="Bluetooth" sub="Connect to devices" theme={theme}
                right={<Toggle value={bluetoothEnabled} onChange={toggleBluetooth} />} />
            </div>
            {bluetoothEnabled && (
              <div className={`rounded-xl border ${card} overflow-hidden`}>
                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${dark?'text-gray-400 bg-[#252525]':'text-gray-500 bg-gray-50'}`}>Nearby Devices</div>
                {[{name:'Galaxy Buds Pro',type:'headphones',paired:true},{name:'Logitech MX Master 3',type:'mouse',paired:false}].map((d,i)=>(
                  <div key={i} className={`flex items-center justify-between px-4 py-3 border-b last:border-0 ${dark?'border-[#1e1e1e]':'border-gray-100'}`}>
                    <div>
                      <div className={`text-sm ${dark?'text-white':'text-black'}`}>{d.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{d.type}</div>
                    </div>
                    {d.paired && <span className="text-xs bg-[#e95420] text-white px-2 py-0.5 rounded-full">Connected</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Sound ── */}
        {activeTab === 'sound' && (
          <div className="max-w-2xl">
            <div className={`rounded-xl border ${card} overflow-hidden`}>
              <Row label="Output Volume" sub="Built-in Audio" theme={theme} right={
                <div className="flex items-center gap-3 w-40">
                  <span className="text-gray-400">🔈</span>
                  <input type="range" min={0} max={100} value={volume} onChange={e=>setVolume(Number(e.target.value))}
                    className="flex-1 accent-[#e95420]" />
                  <span className="text-sm w-8 text-right">{volume}%</span>
                </div>
              } />
              <Row label="Input" sub="Microphone" theme={theme} right={<span className={`text-sm ${dark?'text-gray-400':'text-gray-500'}`}>Built-in</span>} />
            </div>
          </div>
        )}

        {/* ── Displays ── */}
        {activeTab === 'displays' && (
          <div className="max-w-2xl">
            <div className={`rounded-xl border ${card} overflow-hidden`}>
              <Row label="Built-in Display" sub="1920 × 1080 @ 60Hz" theme={theme} right={<span className="text-xs text-[#e95420] bg-[#e95420]/10 px-2 py-0.5 rounded-full">Primary</span>} />
              <Row label="Scale" sub="Display scaling" theme={theme} right={
                <select className={`text-sm rounded px-2 py-1 outline-none ${dark?'bg-[#1e1e1e] text-white':'bg-gray-100 text-black'}`}>
                  <option>100%</option><option>125%</option><option>150%</option><option>200%</option>
                </select>
              } />
              <Row label="Night Light" sub="Reduces blue light" theme={theme} right={<Toggle value={false} onChange={()=>{}} />} />
            </div>
          </div>
        )}

        {/* ── About ── */}
        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="flex flex-col items-center mb-8">
              <svg className="w-20 h-20 text-[#e95420] mb-4" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6"/>
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="6"/>
                <circle cx="50" cy="14" r="8" fill="currentColor"/>
                <circle cx="80" cy="67" r="8" fill="currentColor"/>
                <circle cx="20" cy="67" r="8" fill="currentColor"/>
              </svg>
              <h1 className={`text-3xl font-light ${text}`}>Ubuntu 22.04.3 LTS</h1>
              <p className="text-gray-400 mt-1">Jammy Jellyfish</p>
            </div>
            <div className={`rounded-xl border ${card} overflow-hidden`}>
              {[
                ['Hardware Model', 'QEMU Standard PC (Q35)'],
                ['Memory',         '8.0 GiB'],
                ['Processor',      'AMD Ryzen 7 5800X × 16'],
                ['Graphics',       'llvmpipe (LLVM 15.0.7, 256 bits)'],
                ['OS Name',        'Ubuntu 22.04.3 LTS'],
                ['OS Type',        '64-bit'],
                ['Kernel',         'Linux 5.15.0-91-generic'],
                ['Windowing',      'Wayland'],
              ].map(([k,v]) => (
                <div key={k} className={`flex justify-between px-4 py-3 border-b last:border-0 ${dark?'border-[#1e1e1e]':'border-gray-100'}`}>
                  <span className="text-gray-400 text-sm">{k}</span>
                  <span className={`text-sm ${text}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
