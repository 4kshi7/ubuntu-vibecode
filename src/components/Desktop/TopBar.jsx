import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';
import { useWindowStore } from '../../store/windowStore';

const TopBar = () => {
  const [time, setTime] = useState(new Date());
  const [panel, setPanel] = useState(null); // null | 'system'
  const { wifiEnabled, toggleWifi, bluetoothEnabled, toggleBluetooth, volume, setVolume } = useSettingsStore();
  const { windows } = useWindowStore();
  const panelRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setPanel(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeApps = windows.filter(w => !w.minimized);

  const Toggle = ({ value, onToggle }) => (
    <div
      onClick={onToggle}
      className={`w-10 h-5 rounded-full cursor-pointer relative flex items-center px-0.5 transition-colors duration-200 ${value ? 'bg-[#e95420]' : 'bg-white/20'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="h-7 w-full bg-[#1a1a1a]/90 backdrop-blur-md text-white text-sm flex items-center justify-between px-3 fixed top-0 z-50 select-none border-b border-white/5">
      {/* Left: Activities */}
      <div className="flex items-center gap-3">
        <button className="font-semibold text-white/90 hover:text-white hover:bg-white/10 px-2 py-0.5 rounded-full transition-colors text-xs">
          Activities
        </button>
        {/* Active app names */}
        {activeApps.slice(0,3).map(w => (
          <span key={w.id} className="text-white/60 text-xs hidden lg:inline capitalize">{w.id}</span>
        ))}
      </div>

      {/* Center: Clock (clickable) */}
      <button
        className="absolute left-1/2 -translate-x-1/2 font-medium text-white/90 hover:bg-white/10 px-3 py-0.5 rounded-full transition-colors text-xs"
        onClick={() => setPanel(panel === 'system' ? null : 'system')}
      >
        {format(time, 'EEE MMM d  HH:mm')}
      </button>

      {/* Right: System tray */}
      <div className="flex items-center gap-0.5">
        {/* Wifi icon */}
        <button
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setPanel(panel==='system'?null:'system')}
          title="Network"
        >
          {wifiEnabled ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
              <path d="M5 12.55a11 11 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <circle cx="12" cy="20" r="1" fill="currentColor"/>
            </svg>
          )}
        </button>

        {/* Volume */}
        <button
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setPanel(panel==='system'?null:'system')}
          title="Sound"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {volume === 0 ? (
              <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>
            ) : volume < 50 ? (
              <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></>
            ) : (
              <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></>
            )}
          </svg>
        </button>

        {/* Battery */}
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors" title="Power">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="18" height="12" rx="2"/><path d="M23 13v-2"/>
            <rect x="3" y="8" width="10" height="8" rx="1" fill="currentColor" stroke="none"/>
          </svg>
        </button>

        {/* System menu arrow */}
        <button
          onClick={() => setPanel(panel==='system'?null:'system')}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>

      {/* ── System Panel dropdown ── */}
      {panel === 'system' && (
        <div
          ref={panelRef}
          className="absolute top-8 right-2 w-80 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[200]"
        >
          {/* Profile */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Ubuntu User</div>
              <div className="text-xs text-gray-400">user@ubuntu-desktop</div>
            </div>
          </div>

          {/* Quick toggles */}
          <div className="px-3 py-3 grid grid-cols-3 gap-2 border-b border-white/10">
            {[
              { label:'Wi-Fi', icon:'📶', value:wifiEnabled, toggle:toggleWifi },
              { label:'Bluetooth', icon:'🔵', value:bluetoothEnabled, toggle:toggleBluetooth },
              { label:'Night Light', icon:'🌙', value:false, toggle:()=>{} },
            ].map(({label,icon,value,toggle}) => (
              <button
                key={label}
                onClick={toggle}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs transition-colors ${value?'bg-[#e95420]/80 text-white':'bg-white/8 text-gray-400 hover:bg-white/15'}`}
              >
                <span className="text-xl">{icon}</span>
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Volume slider */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <input
                type="range" min={0} max={100} value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="flex-1 h-1.5 accent-[#e95420] rounded-full"
              />
              <span className="text-xs text-gray-400 w-7 text-right">{volume}%</span>
            </div>
          </div>

          {/* System actions */}
          <div className="px-3 py-2">
            {[
              { label: 'Settings', icon: '⚙️' },
              { label: 'Lock Screen', icon: '🔒' },
            ].map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors"
                onClick={() => setPanel(null)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 px-3 py-2 flex justify-between">
            {[{ label:'Suspend', icon:'💤' },{ label:'Restart', icon:'🔄' },{ label:'Power Off', icon:'⏻' }].map(a=>(
              <button key={a.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors" onClick={()=>setPanel(null)}>
                <span>{a.icon}</span><span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
