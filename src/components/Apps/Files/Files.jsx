import React from 'react';

const Folders = [
  { name: 'Desktop', icon: '📁' },
  { name: 'Documents', icon: '📄' },
  { name: 'Downloads', icon: '⬇️' },
  { name: 'Music', icon: '🎵' },
  { name: 'Pictures', icon: '🖼️' },
  { name: 'Videos', icon: '🎥' }
];

const Files = () => {
  return (
    <div className="flex w-full h-full bg-[#353535] text-white">
      {/* Sidebar */}
      <div className="w-48 bg-[#2d2d2d] flex flex-col py-2 border-r border-[#1e1e1e] select-none">
        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Home</div>
        {Folders.map(folder => (
          <div key={folder.name} className="flex items-center px-4 py-2 hover:bg-[#3d3d3d] cursor-pointer text-sm">
            <span className="mr-3 text-lg">{folder.icon}</span>
            {folder.name}
          </div>
        ))}
        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">Other Locations</div>
        <div className="flex items-center px-4 py-2 hover:bg-[#3d3d3d] cursor-pointer text-sm">
          <span className="mr-3 text-lg">💿</span>
          Other Locations
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center px-4 h-12 bg-[#353535] border-b border-[#1e1e1e]">
          <div className="flex space-x-2">
            <button className="p-1 hover:bg-[#4d4d4d] rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <button className="p-1 hover:bg-[#4d4d4d] rounded text-gray-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
          </div>
          <div className="ml-4 font-bold text-sm tracking-wide bg-[#2d2d2d] px-3 py-1 rounded border border-[#1e1e1e]">Home</div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 p-6 grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-4 content-start overflow-y-auto bg-[#1e1e1e] pb-20">
          {Folders.map(folder => (
            <div key={folder.name} className="flex flex-col items-center p-2 rounded hover:bg-[#3d3d3d] cursor-pointer group">
              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">📁</div>
              <span className="text-xs text-center break-words">{folder.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Files;