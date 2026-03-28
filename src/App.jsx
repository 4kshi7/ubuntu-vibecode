import React, { useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import LockScreen from './components/System/LockScreen';

function App() {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="w-screen h-screen overflow-hidden text-white font-ubuntu bg-black relative">
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
      <Desktop />
    </div>
  );
}

export default App;
