import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [time, setTime] = useState(new Date());
  const wallpaper = useSettingsStore(state => state.wallpaper);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getBackgroundStyle = () => {
    if (wallpaper.startsWith('http') || wallpaper.startsWith('url(')) {
      return { backgroundImage: wallpaper.startsWith('url') ? wallpaper : `url(${wallpaper})` };
    }
    return { background: wallpaper };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ubuntu') {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div 
      className="absolute inset-0 z-[100] flex flex-col items-center select-none bg-cover bg-center transition-all duration-500"
      style={getBackgroundStyle()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      
      <div className="relative z-10 flex flex-col items-center mt-20">
        <div className="text-7xl font-light text-white drop-shadow-md tracking-wider">
          {format(time, 'HH:mm')}
        </div>
        <div className="text-2xl font-medium text-white drop-shadow-md mt-2">
          {format(time, 'EEEE, MMMM d')}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center mt-32">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 border-4 border-gray-400 shadow-xl mb-4 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-2xl font-medium text-white shadow-sm mb-6 pb-2">Ubuntu User</div>
        
        <form onSubmit={handleLogin} className="relative flex flex-col items-center">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if(error) setError(false);
            }}
            placeholder="Password is 'ubuntu'"
            className={`px-4 py-2 rounded-md bg-[#2d2d2d]/80 text-white outline-none focus:ring-2 focus:ring-ubuntu-orange border shadow-lg ${error ? 'border-red-500 animate-bounce' : 'border-gray-500'}`}
          />
          {error && <span className="absolute -bottom-6 text-sm text-red-400 font-medium">Incorrect password.</span>}
        </form>
      </div>
    </div>
  );
};

export default LockScreen;
