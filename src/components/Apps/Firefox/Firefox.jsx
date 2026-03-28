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
    <div className="flex flex-col w-full h-full bg-[#1c1b22]">
      {/* Top Navbar */}
      <div className="flex items-center space-x-2 px-2 py-1.5 bg-[#2b2a33] text-gray-300 border-b border-black">
        <button className="p-1.5 hover:bg-[#42414d] rounded-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <button className="p-1.5 hover:bg-[#42414d] rounded-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
        <button className="p-1.5 hover:bg-[#42414d] rounded-sm" onClick={() => setUrl(url + '?reload')}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
        <form onSubmit={handleNavigate} className="flex-1">
          <input
            type="text"
            className="w-full bg-[#1c1b22] text-white px-4 py-1.5 rounded-[4px] outline-none focus:ring-1 focus:ring-[#00ddff] text-sm"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </form>
        <button className="p-1.5 hover:bg-[#42414d] rounded-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>
      
      {/* Browser View */}
      <div className="flex-1 flex w-full bg-white">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title="browser"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
};

export default Firefox;