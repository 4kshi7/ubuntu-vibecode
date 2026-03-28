import React from 'react';
import { useWindowStore } from '../../store/windowStore';
import Window from './Window';

const WindowManager = () => {
  const windows = useWindowStore((state) => state.windows);

  return (
    <>
      {windows.map((windowState) => (
        <Window key={windowState.id} app={windowState} />
      ))}
    </>
  );
};

export default WindowManager;
