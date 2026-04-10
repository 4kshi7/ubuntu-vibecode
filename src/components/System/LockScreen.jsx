import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [time, setTime] = useState(new Date());
  const wallpaper = useSettingsStore(s => s.wallpaper);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const getBg = () => {
    if (wallpaper.startsWith('http') || wallpaper.startsWith('url('))
      return { backgroundImage: wallpaper.startsWith('url') ? wallpaper : `url(${wallpaper})` };
    return { background: wallpaper };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ubuntu') {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      className="absolute inset-0 z-[100] flex flex-col items-center select-none bg-cover bg-center"
      style={getBg()}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />

      {/* Clock */}
      <div className="relative z-10 flex flex-col items-center mt-16">
        <div className="text-8xl font-thin text-white drop-shadow-lg tracking-tight">
          {format(time, 'HH:mm')}
        </div>
        <div className="text-xl font-light text-white/80 mt-3">
          {format(time, 'EEEE, MMMM d')}
        </div>
      </div>

      {/* User card */}
      <div className="relative z-10 flex flex-col items-center mt-20">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 border-2 border-white/30 shadow-2xl mb-4 flex items-center justify-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white/90" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-lg font-medium text-white mb-5">Ubuntu User</div>

        <form onSubmit={handleLogin} className="flex flex-col items-center gap-2">
          <div className={`relative transition-transform ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              className={`w-56 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md text-white placeholder-white/50 outline-none border transition-all text-sm text-center tracking-widest ${
                error ? 'border-red-400 bg-red-500/20' : 'border-white/30 focus:border-white/60 focus:bg-white/20'
              }`}
              autoComplete="current-password"
            />
            {error && (
              <div className="absolute -bottom-6 w-full text-center text-xs text-red-300">
                Wrong password
              </div>
            )}
          </div>
          <button
            type="submit"
            className="mt-3 w-56 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-all backdrop-blur-md border border-white/20 hover:border-white/40"
          >
            Unlock
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default LockScreen;
