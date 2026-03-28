import React, { useState } from 'react';

const Firefox = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');

  const handleNavigate = (e) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1c1b22] text-white">
      {/* Firefox Toolbar */}
      <div className="flex items-center px-2 py-2 space-x-2 bg-[#2b2a33] border-b border-[#3b3a43]">
        <button className="p-1.5 hover:bg-[#3b3a43] rounded-md text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <button className="p-1.5 hover:bg-[#3b3a43] rounded-md text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
        <button onClick={() => setUrl(url + '?reload')} className="p-1.5 hover:bg-[#3b3a43] rounded-md text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#1c1b22] rounded-md px-3 py-1 border border-transparent focus-within:border-blue-500">
          <input
            type="text"
            className="w-full bg-transparent outline-none text-sm"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </form>

        <button className="p-1.5 hover:bg-[#3b3a43] rounded-md text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Browser View */}
      <div className="flex-1 bg-white">
        <iframe
          src={url}
          className="w-full h-full border-none bg-white"
          title="browser"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
};

export default Firefox;