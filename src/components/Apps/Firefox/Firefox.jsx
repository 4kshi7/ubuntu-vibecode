import React, { useState, useRef, useCallback } from 'react';

const BOOKMARKS = [
  { title: 'Ubuntu', url: 'https://ubuntu.com', icon: '🟠' },
  { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { title: 'MDN', url: 'https://developer.mozilla.org', icon: '📖' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
];

const Firefox = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [urlHistory, setUrlHistory] = useState(['https://www.wikipedia.org']);
  const [histIdx, setHistIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const iframeRef = useRef(null);
  const loadTimerRef = useRef(null);

  const simulateLoad = useCallback(() => {
    setLoading(true);
    setLoadPct(0);
    clearInterval(loadTimerRef.current);
    loadTimerRef.current = setInterval(() => {
      setLoadPct(p => {
        if (p >= 95) { clearInterval(loadTimerRef.current); return p; }
        return p + Math.random() * 15 + 5;
      });
    }, 100);
  }, []);

  const finishLoad = useCallback(() => {
    setLoadPct(100);
    setTimeout(() => { setLoading(false); setLoadPct(0); }, 300);
  }, []);

  const navigate = useCallback((newUrl) => {
    let final = newUrl.trim();
    if (!final) return;
    if (!final.includes('.') && !final.startsWith('http')) {
      final = `https://www.google.com/search?q=${encodeURIComponent(final)}`;
    } else if (!final.startsWith('http')) {
      final = 'https://' + final;
    }
    setUrl(final);
    setInputUrl(final);
    const newHist = urlHistory.slice(0, histIdx+1).concat(final);
    setUrlHistory(newHist);
    setHistIdx(newHist.length-1);
    simulateLoad();
  }, [urlHistory, histIdx, simulateLoad]);

  const goBack = () => {
    if (histIdx > 0) {
      const newIdx = histIdx-1;
      setHistIdx(newIdx);
      setUrl(urlHistory[newIdx]);
      setInputUrl(urlHistory[newIdx]);
      simulateLoad();
    }
  };

  const goForward = () => {
    if (histIdx < urlHistory.length-1) {
      const newIdx = histIdx+1;
      setHistIdx(newIdx);
      setUrl(urlHistory[newIdx]);
      setInputUrl(urlHistory[newIdx]);
      simulateLoad();
    }
  };

  const refresh = () => { setUrl(u => u + (u.includes('?') ? '&' : '?') + '_r=' + Date.now()); simulateLoad(); };

  const isSecure = url.startsWith('https://');
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  return (
    <div className="flex flex-col w-full h-full bg-[#1c1b22]">
      {/* Chrome UI */}
      <div className="bg-[#2b2a33] border-b border-black/50 flex-shrink-0">
        {/* Tab bar */}
        <div className="flex items-end px-2 pt-1 gap-0.5">
          <div className="flex items-center bg-[#1c1b22] rounded-t-md px-3 py-1.5 text-sm text-gray-200 max-w-[200px] gap-2 border-t border-x border-black/30">
            <span className="truncate text-xs">{domain}</span>
            <button className="text-gray-500 hover:text-gray-200 text-xs flex-shrink-0">✕</button>
          </div>
          <button className="pb-1.5 px-2 text-gray-500 hover:text-gray-300 text-lg">+</button>
        </div>

        {/* Navigation bar */}
        <div className="flex items-center gap-1.5 px-2 pb-2">
          {/* Nav buttons */}
          <div className="flex gap-0.5">
            <button
              onClick={goBack} disabled={histIdx<=0}
              className={`p-1.5 rounded-full transition-colors ${histIdx>0?'hover:bg-white/10 text-gray-200':'text-gray-600 cursor-default'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={goForward} disabled={histIdx>=urlHistory.length-1}
              className={`p-1.5 rounded-full transition-colors ${histIdx<urlHistory.length-1?'hover:bg-white/10 text-gray-200':'text-gray-600 cursor-default'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
            <button onClick={refresh} className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors">
              <svg className={`w-4 h-4 ${loading?'animate-spin':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>

          {/* URL bar */}
          <form className="flex-1 flex items-center bg-[#42414d] hover:bg-[#4a4952] focus-within:bg-[#1c1b22] rounded-full px-3 py-1 gap-2 transition-colors border border-transparent focus-within:border-[#00ddff]/40"
            onSubmit={e => { e.preventDefault(); navigate(inputUrl); }}>
            <span className={`text-xs flex-shrink-0 ${isSecure ? 'text-green-400' : 'text-gray-500'}`}>
              {isSecure ? '🔒' : '⚠️'}
            </span>
            <input
              type="text"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500 min-w-0"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onFocus={e => e.target.select()}
              placeholder="Search or enter address"
            />
          </form>

          {/* Bookmarks & menu */}
          <div className="flex gap-0.5">
            <button className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>
            <button className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>

        {/* Bookmarks bar */}
        <div className="flex items-center gap-1 px-3 pb-1.5 border-t border-black/20">
          {BOOKMARKS.map(b => (
            <button
              key={b.url}
              onClick={() => navigate(b.url)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors"
            >
              <span>{b.icon}</span>
              <span>{b.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 bg-[#2b2a33] flex-shrink-0">
          <div
            className="h-full bg-[#00ddff] transition-all duration-100"
            style={{ width: `${loadPct}%` }}
          />
        </div>
      )}

      {/* Viewport */}
      <div className="flex-1 bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          key={url}
          src={url}
          className="w-full h-full border-none"
          title="Firefox Browser"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          onLoad={finishLoad}
          onError={finishLoad}
        />
      </div>
    </div>
  );
};

export default Firefox;
