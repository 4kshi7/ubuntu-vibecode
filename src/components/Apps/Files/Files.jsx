import React, { useState } from 'react';

const INITIAL_FS = {
  '/home/user': {
    Desktop:   { type:'dir', children:{} },
    Documents: { type:'dir', children:{
      'notes.txt':   { type:'file', size:'1.2 KB', modified:'Mar 10' },
      'project.md':  { type:'file', size:'2.4 KB', modified:'Mar 10' },
    }},
    Downloads: { type:'dir', children:{} },
    Music:     { type:'dir', children:{} },
    Pictures:  { type:'dir', children:{} },
    Videos:    { type:'dir', children:{} },
  }
};

function getDir(path) {
  if (path === '~' || path === '/home/user') return INITIAL_FS['/home/user'];
  const parts = path.replace('~/', '').split('/').filter(Boolean);
  let cur = INITIAL_FS['/home/user'];
  for (const p of parts) {
    if (!cur[p]) return null;
    cur = cur[p].children || {};
  }
  return cur;
}

function getEntries(path) {
  const dir = getDir(path);
  if (!dir) return [];
  return Object.entries(dir).map(([name, entry]) => ({ name, ...entry }));
}

const fileIcons = {
  dir:   { icon: '📁', color: 'text-blue-400' },
  txt:   { icon: '📄', color: 'text-gray-300' },
  md:    { icon: '📝', color: 'text-purple-400' },
  pdf:   { icon: '📕', color: 'text-red-400' },
  image: { icon: '🖼️', color: 'text-green-400' },
  audio: { icon: '🎵', color: 'text-yellow-400' },
  video: { icon: '🎬', color: 'text-orange-400' },
  default: { icon: '📄', color: 'text-gray-400' },
};

function getFileIcon(entry) {
  if (entry.type === 'dir') return fileIcons.dir;
  const ext = entry.name?.split('.').pop()?.toLowerCase();
  const map = { txt:'txt', md:'md', pdf:'pdf', jpg:'image', jpeg:'image', png:'image', gif:'image', svg:'image', mp3:'audio', wav:'audio', flac:'audio', mp4:'video', avi:'video', mkv:'video' };
  return fileIcons[map[ext]] || fileIcons.default;
}

const sidebarItems = [
  { label:'Recent',     icon:'🕐', path:'recent' },
  { label:'Starred',    icon:'⭐', path:'starred' },
  { label:'Home',       icon:'🏠', path:'~'       },
  { label:'Documents',  icon:'📄', path:'~/Documents' },
  { label:'Downloads',  icon:'⬇️', path:'~/Downloads' },
  { label:'Music',      icon:'🎵', path:'~/Music'     },
  { label:'Pictures',   icon:'🖼️', path:'~/Pictures'  },
  { label:'Videos',     icon:'🎬', path:'~/Videos'    },
  { label:'Trash',      icon:'🗑️', path:'trash'      },
];

const Files = () => {
  const [path, setPath] = useState('~');
  const [history, setHistory] = useState(['~']);
  const [histIdx, setHistIdx] = useState(0);
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebar, setActiveSidebar] = useState('~');

  const navigate = (newPath) => {
    if (newPath === 'recent' || newPath === 'starred' || newPath === 'trash') {
      setActiveSidebar(newPath);
      setPath(newPath);
      return;
    }
    const newHistory = history.slice(0, histIdx+1).concat(newPath);
    setHistory(newHistory);
    setHistIdx(newHistory.length-1);
    setPath(newPath);
    setActiveSidebar(newPath);
  };

  const goBack = () => {
    if (histIdx > 0) { setHistIdx(h=>h-1); setPath(history[histIdx-1]); }
  };
  const goForward = () => {
    if (histIdx < history.length-1) { setHistIdx(h=>h+1); setPath(history[histIdx+1]); }
  };
  const goUp = () => {
    if (path === '~') return;
    const parts = path.split('/');
    navigate(parts.slice(0,-1).join('/') || '~');
  };

  const entries = (path === 'recent' || path === 'starred' || path === 'trash')
    ? []
    : getEntries(path);

  const filtered = searchQuery
    ? entries.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries;

  const breadcrumb = () => {
    if (path === 'recent') return ['Recent'];
    if (path === 'starred') return ['Starred'];
    if (path === 'trash') return ['Trash'];
    const normalized = path.replace('~', 'Home');
    return normalized.split('/').filter(Boolean);
  };

  const displayPath = () => {
    if (path === '~') return '/home/user';
    return path.replace('~', '/home/user');
  };

  return (
    <div className="flex w-full h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 flex flex-col bg-[#252525] border-r border-black/40 overflow-y-auto">
        <div className="px-3 pt-3 pb-2">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#333] text-white placeholder-gray-500 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#e95420]"
          />
        </div>
        {sidebarItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2.5 px-4 py-1.5 text-sm text-left transition-colors ${
              activeSidebar===item.path ? 'bg-[#3d3d3d] text-white' : 'text-gray-300 hover:bg-[#2d2d2d]'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <div className="mt-2 px-4 pt-2 pb-1">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Devices</div>
        </div>
        <button className="flex items-center gap-2.5 px-4 py-1.5 text-sm text-gray-300 hover:bg-[#2d2d2d]">
          <span className="text-base w-5 text-center">💿</span>
          <span>64 GB Volume</span>
        </button>
        <button className="flex items-center gap-2.5 px-4 py-1.5 text-sm text-gray-300 hover:bg-[#2d2d2d]">
          <span className="text-base w-5 text-center">🌐</span>
          <span>Network</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 h-11 bg-[#2d2d2d] border-b border-black/40 flex-shrink-0">
          <div className="flex gap-1">
            <button
              onClick={goBack} disabled={histIdx <= 0}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${histIdx<=0?'opacity-30 cursor-default':''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={goForward} disabled={histIdx >= history.length-1}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${histIdx>=history.length-1?'opacity-30 cursor-default':''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
            <button
              onClick={goUp} disabled={path==='~'}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${path==='~'?'opacity-30 cursor-default':''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 flex-1 bg-[#1e1e1e] rounded px-2 py-0.5 text-xs text-gray-300 min-w-0">
            {breadcrumb().map((part, i, arr) => (
              <React.Fragment key={i}>
                <span
                  className={`cursor-pointer hover:text-white truncate ${i===arr.length-1?'text-white':'text-gray-400 hover:underline'}`}
                  onClick={() => {
                    if (i < arr.length-1) {
                      const target = i===0 ? '~' : '~/' + arr.slice(1,i+1).join('/');
                      navigate(target);
                    }
                  }}
                >
                  {part}
                </span>
                {i < arr.length-1 && <span className="text-gray-600">/</span>}
              </React.Fragment>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded transition-colors ${view==='grid'?'bg-white/20':'hover:bg-white/10'}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded transition-colors ${view==='list'?'bg-white/20':'hover:bg-white/10'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* File area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e]">
          {path === 'recent' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-4xl mb-3">🕐</span>
              <span className="text-sm">No recent files</span>
            </div>
          )}
          {path === 'trash' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-4xl mb-3">🗑️</span>
              <span className="text-sm">Trash is empty</span>
            </div>
          )}
          {path === 'starred' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-4xl mb-3">⭐</span>
              <span className="text-sm">No starred files</span>
            </div>
          )}

          {path !== 'recent' && path !== 'trash' && path !== 'starred' && (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <span className="text-4xl mb-3">{searchQuery ? '🔍' : '📂'}</span>
                <span className="text-sm">{searchQuery ? 'No matching files' : 'Folder is empty'}</span>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 content-start">
                {filtered.map(entry => {
                  const { icon, color } = getFileIcon(entry);
                  return (
                    <div
                      key={entry.name}
                      className="flex flex-col items-center p-2 rounded-xl cursor-pointer hover:bg-white/8 group transition-colors"
                      onDoubleClick={() => entry.type === 'dir' && navigate(path === '~' ? `~/${entry.name}` : `${path}/${entry.name}`)}
                    >
                      <span className={`text-4xl mb-1.5 group-hover:scale-110 transition-transform ${color}`}>{icon}</span>
                      <span className="text-xs text-center text-gray-300 group-hover:text-white break-all line-clamp-2 leading-tight">{entry.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-white/5">
                <div className="grid grid-cols-[2fr_1fr_1fr] text-xs text-gray-500 px-4 py-2 bg-[#252525] border-b border-white/5">
                  <span>Name</span><span>Size</span><span>Modified</span>
                </div>
                {filtered.map(entry => {
                  const { icon } = getFileIcon(entry);
                  return (
                    <div
                      key={entry.name}
                      className="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-2 hover:bg-white/5 cursor-pointer text-sm border-b border-white/3 last:border-0"
                      onDoubleClick={() => entry.type === 'dir' && navigate(path === '~' ? `~/${entry.name}` : `${path}/${entry.name}`)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg">{icon}</span>
                        <span className="text-gray-200 truncate">{entry.name}</span>
                      </div>
                      <span className="text-gray-500">{entry.type==='dir'? '--' : (entry.size||'--')}</span>
                      <span className="text-gray-500">{entry.modified||'Mar 10'}</span>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Status bar */}
        <div className="h-6 bg-[#252525] border-t border-black/40 flex items-center px-4 text-xs text-gray-500">
          {filtered.length} item{filtered.length!==1?'s':''} &nbsp;·&nbsp; {displayPath()}
        </div>
      </div>
    </div>
  );
};

export default Files;
