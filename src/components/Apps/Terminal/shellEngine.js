// ANSI color helpers
const C = {
  r:  '\x1b[0m',  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
  bRed: '\x1b[91m', bGreen: '\x1b[92m', bYellow: '\x1b[93m',
  bBlue: '\x1b[94m', bMagenta: '\x1b[95m', bCyan: '\x1b[96m', bWhite: '\x1b[97m',
  b: '\x1b[1m', dim: '\x1b[2m',
};

const JAN = '2024-01-15T10:00:00.000Z';
const MAR = '2024-03-10T14:30:00.000Z';

function mkd(owner='root', group='root', mtime=JAN, perms='rwxr-xr-x') {
  return { type:'dir', perms, owner, group, size:4096, mtime };
}
function mkf(content, owner='root', group='root', mtime=JAN, perms='rw-r--r--') {
  return { type:'file', perms, owner, group, size:content.length, mtime, content };
}

function buildInitialFS() {
  return {
    '/': mkd(),
    '/home': mkd(),
    '/home/user': mkd('user','user',MAR),
    '/home/user/Desktop': mkd('user','user',MAR),
    '/home/user/Documents': mkd('user','user',MAR),
    '/home/user/Documents/notes.txt': mkf(
      'Todo list:\n- Update system packages\n- Write documentation\n- Review pull requests\n\nMeeting notes:\n- Team standup at 9am\n- Sprint review on Fridays\n',
      'user','user',MAR
    ),
    '/home/user/Documents/project.md': mkf(
      '# My Project\n\n## Overview\nA web application project.\n\n## Setup\n```bash\nnpm install\nnpm run dev\n```\n\n## Testing\n```bash\nnpm test\n```\n',
      'user','user',MAR
    ),
    '/home/user/Downloads': mkd('user','user',MAR),
    '/home/user/Music': mkd('user','user',MAR),
    '/home/user/Pictures': mkd('user','user',MAR),
    '/home/user/Videos': mkd('user','user',MAR),
    '/home/user/.bashrc': mkf(
      '# ~/.bashrc\nHISTCONTROL=ignoreboth\nHISTSIZE=1000\nHISTFILESIZE=2000\nshopt -s checkwinsize\nalias ls=\'ls --color=auto\'\nalias ll=\'ls -alF\'\nalias la=\'ls -A\'\nalias l=\'ls -CF\'\nPS1=\'\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ \'\n',
      'user','user',JAN,'rw-r--r--'
    ),
    '/home/user/.profile': mkf(
      '# ~/.profile\nif [ -n "$BASH_VERSION" ]; then\n    [ -f "$HOME/.bashrc" ] && . "$HOME/.bashrc"\nfi\n[ -d "$HOME/bin" ] && PATH="$HOME/bin:$PATH"\n',
      'user','user',JAN
    ),
    '/home/user/.bash_history': mkf(
      'ls\npwd\ncd Documents\ncat notes.txt\ngit status\nnpm install\nnpm run dev\nsudo apt update\n',
      'user','user',JAN,'rw-------'
    ),
    '/etc': mkd(),
    '/etc/hostname': mkf('ubuntu-desktop\n'),
    '/etc/hosts': mkf('127.0.0.1\tlocalhost\n127.0.1.1\tubuntu-desktop\n::1\t\tip6-localhost ip6-loopback\nff02::1\t\tip6-allnodes\n'),
    '/etc/os-release': mkf(
      'PRETTY_NAME="Ubuntu 22.04.3 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nID=ubuntu\nID_LIKE=debian\nHOME_URL="https://www.ubuntu.com/"\n'
    ),
    '/etc/fstab': mkf('# /etc/fstab\nUUID=a1b2c3d4 /  ext4  errors=remount-ro 0 1\ntmpfs /tmp tmpfs defaults 0 0\n'),
    '/etc/passwd': mkf(
      'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nuser:x:1000:1000:Ubuntu User,,,:/home/user:/bin/bash\n'
    ),
    '/etc/group': mkf('root:x:0:\ndaemon:x:1:\nsudo:x:27:user\nuser:x:1000:\n'),
    '/usr': mkd(), '/usr/bin': mkd(), '/usr/local': mkd(), '/usr/local/bin': mkd(),
    '/var': mkd(),
    '/var/log': { type:'dir', perms:'rwxr-x---', owner:'root', group:'adm', size:4096, mtime:JAN },
    '/var/log/syslog': mkf(
      'Apr 10 09:00:01 ubuntu-desktop systemd[1]: Started Daily apt download.\nApr 10 09:05:33 ubuntu-desktop NetworkManager[987]: device (wlp3s0): Activation: successful\nApr 10 09:10:12 ubuntu-desktop kernel: [12345.678] EXT4-fs (sda1): re-mounted\n',
      'root','adm'
    ),
    '/var/log/auth.log': mkf(
      'Apr 10 09:00:00 ubuntu-desktop login[1234]: pam_unix(login:session): session opened for user user\nApr 10 09:00:00 ubuntu-desktop systemd-logind[456]: New session 1 of user user.\n',
      'root','adm'
    ),
    '/tmp': { type:'dir', perms:'rwxrwxrwt', owner:'root', group:'root', size:4096, mtime:JAN },
    '/dev': mkd(),
    '/dev/null': mkf('','root','root',JAN,'rw-rw-rw-'),
    '/proc': mkd(),
    '/proc/version': mkf('Linux version 5.15.0-91-generic (gcc 11.4.0) #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023\n'),
    '/proc/cpuinfo': mkf(
      'processor\t: 0\nvendor_id\t: AuthenticAMD\nmodel name\t: AMD Ryzen 7 5800X 8-Core Processor\ncpu MHz\t\t: 3793.000\ncache size\t: 512 KB\nbogomips\t: 7586.0\n'
    ),
    '/proc/meminfo': mkf(
      'MemTotal:\t\t8192000 kB\nMemFree:\t\t3421568 kB\nMemAvailable:\t5242880 kB\nBuffers:\t\t204800 kB\nCached:\t\t\t1638400 kB\nSwapTotal:\t\t2097152 kB\nSwapFree:\t\t2097152 kB\n'
    ),
  };
}

// ─── helpers ────────────────────────────────────────────────────────────────

function normPath(path) {
  const parts = path.split('/').filter(Boolean);
  const out = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') { out.pop(); continue; }
    out.push(p);
  }
  return '/' + out.join('/');
}

function humanSize(n) {
  if (n < 1024) return n + 'B';
  if (n < 1024**2) return (n/1024).toFixed(1) + 'K';
  if (n < 1024**3) return (n/1024**2).toFixed(1) + 'M';
  return (n/1024**3).toFixed(1) + 'G';
}

function fmtDate(iso) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  const day = String(d.getDate()).padStart(2,' ');
  const time = sameYear
    ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    : String(d.getFullYear());
  return `${months[d.getMonth()]} ${day} ${time}`;
}

function colorEntry(name, entry) {
  if (!entry) return name;
  if (entry.type === 'dir') return `${C.b}${C.bBlue}${name}${C.r}`;
  if (entry.perms && entry.perms.includes('x')) return `${C.b}${C.bGreen}${name}${C.r}`;
  if (name.endsWith('.tar.gz') || name.endsWith('.zip') || name.endsWith('.tar')) return `${C.bRed}${name}${C.r}`;
  if (name.endsWith('.md') || name.endsWith('.txt')) return name;
  if (name.endsWith('.sh')) return `${C.bGreen}${name}${C.r}`;
  return name;
}

const ALL_COMMANDS = [
  'ls','cd','pwd','mkdir','touch','rm','rmdir','cp','mv','cat','echo','printf',
  'head','tail','grep','find','wc','sort','uniq','tee','cut','tr',
  'chmod','chown','stat','file','ln',
  'uname','hostname','whoami','id','date','cal','uptime','df','du','free',
  'ps','top','kill','env','export','unset','which','type','man','help','history',
  'clear','reset','alias','unalias','source',
  'ping','curl','wget','ifconfig','ip','nslookup','netstat','ss',
  'apt','apt-get','dpkg','sudo','su',
  'git','python3','python','node','npm','npx',
  'tar','zip','unzip','gzip','gunzip',
  'bc','base64','md5sum','sha256sum','sha1sum',
  'seq','yes','true','false','sleep','xargs','tee',
  'diff','patch','awk','sed','read','test','expr','basename','dirname',
  'nano','vim','vi','less','more',
];

// ─── shell factory ───────────────────────────────────────────────────────────

export function createShell() {
  let fs = buildInitialFS();
  let cwd = '/home/user';
  let history = [];
  const HOME = '/home/user';
  let env = {
    HOME, USER:'user', LOGNAME:'user', SHELL:'/bin/bash',
    PATH:'/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    TERM:'xterm-256color', LANG:'en_US.UTF-8',
    HOSTNAME:'ubuntu-desktop', PWD:cwd,
  };
  let aliases = { ll:'ls -alF', la:'ls -A', l:'ls -CF' };
  let lastExitCode = 0;

  // ── fs helpers ──
  function resolve(p) {
    if (!p || p === '~') return HOME;
    if (p.startsWith('~/')) return normPath(HOME + '/' + p.slice(2));
    if (!p.startsWith('/')) return normPath(cwd + '/' + p);
    return normPath(p);
  }

  function children(dir) {
    const prefix = dir === '/' ? '/' : dir + '/';
    return Object.keys(fs).filter(k => {
      if (!k.startsWith(prefix)) return false;
      const rest = k.slice(prefix.length);
      return rest.length > 0 && !rest.includes('/');
    }).map(k => ({ path: k, name: k.slice(prefix.length), ...fs[k] }));
  }

  function expandGlob(pattern) {
    const abs = resolve(pattern);
    if (fs[abs]) return [abs];
    const dir = abs.includes('/') ? abs.split('/').slice(0,-1).join('/') || '/' : '/';
    const base = abs.split('/').pop();
    if (!base.includes('*') && !base.includes('?')) return [abs];
    const re = new RegExp('^' + base.replace(/\./g,'[.]').replace(/\*/g,'.*').replace(/\?/g,'.') + '$');
    return children(dir).filter(c => re.test(c.name)).map(c => c.path);
  }

  // ── commands ──
  const cmds = {
    pwd() { return { out: [cwd] }; },

    cd(args) {
      const target = args[0] ? resolve(args[0]) : HOME;
      if (!fs[target]) return { out: [`bash: cd: ${args[0] || HOME}: No such file or directory`], exit:1 };
      if (fs[target].type !== 'dir') return { out: [`bash: cd: ${args[0]}: Not a directory`], exit:1 };
      cwd = target;
      env.PWD = cwd;
      return { out: [] };
    },

    ls(args) {
      let showAll=false, longFmt=false, humanR=false, recursive=false, reverse=false;
      const paths = [];
      for (const a of args) {
        if (a.startsWith('-') && !a.startsWith('--')) {
          if (a.includes('a')) showAll = true;
          if (a.includes('l')) longFmt = true;
          if (a.includes('h')) humanR = true;
          if (a.includes('R')) recursive = true;
          if (a.includes('r')) reverse = true;
        } else { paths.push(a); }
      }
      if (!paths.length) paths.push('.');
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        const entry = fs[abs];
        if (!entry) { out.push(`ls: cannot access '${p}': No such file or directory`); continue; }
        if (entry.type === 'file') {
          if (longFmt) {
            const sz = humanR ? humanSize(entry.size) : String(entry.size).padStart(8);
            out.push(`-${entry.perms} 1 ${entry.owner} ${entry.group} ${sz} ${fmtDate(entry.mtime)} ${colorEntry(abs.split('/').pop(), entry)}`);
          } else {
            out.push(colorEntry(abs.split('/').pop(), entry));
          }
          continue;
        }
        let items = children(abs);
        if (!showAll) items = items.filter(i => !i.name.startsWith('.'));
        if (reverse) items = items.reverse();
        if (longFmt) {
          const total = items.reduce((s,i) => s + Math.ceil(i.size/512), 0);
          if (showAll) {
            const sz = humanR ? humanSize(entry.size) : String(entry.size).padStart(8);
            items = [
              {name:'.',  type:'dir', perms:entry.perms, owner:entry.owner, group:entry.group, size:entry.size, mtime:entry.mtime},
              {name:'..', type:'dir', perms:entry.perms, owner:entry.owner, group:entry.group, size:entry.size, mtime:entry.mtime},
              ...items,
            ];
            void sz;
          }
          out.push(`total ${total}`);
          for (const i of items) {
            const sz = humanR ? humanSize(i.size) : String(i.size).padStart(8);
            const t = i.type==='dir' ? 'd' : '-';
            out.push(`${t}${i.perms} 1 ${i.owner} ${i.group} ${sz} ${fmtDate(i.mtime)} ${colorEntry(i.name, i)}`);
          }
        } else {
          if (!items.length) continue;
          out.push(items.map(i => colorEntry(i.name, i)).join('  '));
        }
        if (recursive) {
          for (const i of items.filter(i => i.type==='dir')) {
            out.push('');
            out.push(`${abs}/${i.name}:`);
            const sub = cmds.ls([longFmt?'-la':'-a', `${abs}/${i.name}`]);
            out.push(...sub.out);
          }
        }
      }
      return { out };
    },

    mkdir(args) {
      let parents = false;
      const dirs = [];
      for (const a of args) {
        if (a === '-p' || a === '--parents') parents = true;
        else dirs.push(a);
      }
      const out = [];
      for (const d of dirs) {
        const abs = resolve(d);
        if (fs[abs] && !parents) { out.push(`mkdir: cannot create directory '${d}': File exists`); continue; }
        if (parents) {
          const parts = abs.split('/').filter(Boolean);
          let cur = '';
          for (const p of parts) {
            cur += '/' + p;
            if (!fs[cur]) fs[cur] = mkd('user','user',new Date().toISOString());
          }
        } else {
          const parent = abs.split('/').slice(0,-1).join('/') || '/';
          if (!fs[parent]) { out.push(`mkdir: cannot create directory '${d}': No such file or directory`); continue; }
          fs[abs] = mkd('user','user',new Date().toISOString());
        }
      }
      return { out };
    },

    touch(args) {
      const out = [];
      for (const a of args) {
        if (a.startsWith('-')) continue;
        const abs = resolve(a);
        if (fs[abs]) {
          fs[abs] = { ...fs[abs], mtime: new Date().toISOString() };
        } else {
          const parent = abs.split('/').slice(0,-1).join('/') || '/';
          if (!fs[parent]) { out.push(`touch: cannot touch '${a}': No such file or directory`); continue; }
          fs[abs] = mkf('','user','user',new Date().toISOString(),'rw-r--r--');
        }
      }
      return { out };
    },

    rm(args) {
      let recursive=false, force=false;
      const paths = [];
      for (const a of args) {
        if (a.startsWith('-')) {
          if (a.includes('r') || a.includes('R')) recursive = true;
          if (a.includes('f')) force = true;
        } else { paths.push(a); }
      }
      const out = [];
      for (const p of paths) {
        const matches = expandGlob(p);
        if (!matches.length && !force) { out.push(`rm: cannot remove '${p}': No such file or directory`); continue; }
        for (const abs of matches) {
          if (!fs[abs]) { if (!force) out.push(`rm: cannot remove '${p}': No such file or directory`); continue; }
          if (fs[abs].type === 'dir') {
            if (!recursive) { out.push(`rm: cannot remove '${abs}': Is a directory`); continue; }
            Object.keys(fs).filter(k => k === abs || k.startsWith(abs+'/')).forEach(k => delete fs[k]);
          } else {
            delete fs[abs];
          }
        }
      }
      return { out };
    },

    rmdir(args) {
      const out = [];
      for (const a of args) {
        if (a.startsWith('-')) continue;
        const abs = resolve(a);
        if (!fs[abs]) { out.push(`rmdir: failed to remove '${a}': No such file or directory`); continue; }
        if (fs[abs].type !== 'dir') { out.push(`rmdir: failed to remove '${a}': Not a directory`); continue; }
        if (children(abs).length > 0) { out.push(`rmdir: failed to remove '${a}': Directory not empty`); continue; }
        delete fs[abs];
      }
      return { out };
    },

    cp(args) {
      let recursive=false;
      const paths = [];
      for (const a of args) {
        if (a === '-r' || a === '-R' || a === '--recursive') recursive = true;
        else paths.push(a);
      }
      if (paths.length < 2) return { out: ['cp: missing destination file operand'], exit:1 };
      const dst = resolve(paths[paths.length - 1]);
      const srcs = paths.slice(0,-1).map(resolve);
      const out = [];
      for (const src of srcs) {
        if (!fs[src]) { out.push(`cp: cannot stat '${src}': No such file or directory`); continue; }
        if (fs[src].type === 'dir' && !recursive) { out.push(`cp: -r not specified; omitting directory '${src}'`); continue; }
        const dstIsDir = fs[dst] && fs[dst].type === 'dir';
        const target = dstIsDir ? dst + '/' + src.split('/').pop() : dst;
        if (fs[src].type === 'file') {
          fs[target] = { ...fs[src], mtime: new Date().toISOString() };
        } else {
          const srcKeys = Object.keys(fs).filter(k => k === src || k.startsWith(src+'/'));
          for (const k of srcKeys) {
            fs[target + k.slice(src.length)] = { ...fs[k], mtime: new Date().toISOString() };
          }
        }
      }
      return { out };
    },

    mv(args) {
      if (args.length < 2) return { out: ['mv: missing destination file operand'], exit:1 };
      const src = resolve(args[0]);
      const dst = resolve(args[1]);
      if (!fs[src]) return { out: [`mv: cannot stat '${args[0]}': No such file or directory`], exit:1 };
      const dstIsDir = fs[dst] && fs[dst].type === 'dir';
      const target = dstIsDir ? dst + '/' + src.split('/').pop() : dst;
      const srcKeys = Object.keys(fs).filter(k => k === src || k.startsWith(src+'/'));
      for (const k of srcKeys) {
        fs[target + k.slice(src.length)] = fs[k];
        delete fs[k];
      }
      return { out: [] };
    },

    cat(args) {
      if (!args.length) return { out: [] };
      const out = [];
      let numberLines = false;
      const paths = [];
      for (const a of args) {
        if (a === '-n') numberLines = true;
        else paths.push(a);
      }
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`cat: ${p}: No such file or directory`); continue; }
        if (fs[abs].type === 'dir') { out.push(`cat: ${p}: Is a directory`); continue; }
        const lines = (fs[abs].content || '').split('\n');
        if (lines[lines.length-1] === '') lines.pop();
        lines.forEach((l,i) => out.push(numberLines ? `${String(i+1).padStart(6)}\t${l}` : l));
      }
      return { out };
    },

    echo(args, opts={}) {
      let noNewline = false;
      let interpretEsc = false;
      const parts = [];
      for (const a of args) {
        if (a === '-n') { noNewline = true; continue; }
        if (a === '-e') { interpretEsc = true; continue; }
        parts.push(a);
      }
      let text = parts.join(' ');
      if (interpretEsc) text = text.replace(/\\n/g,'\n').replace(/\\t/g,'\t');
      return { out: [text], noNewline };
    },

    head(args) {
      let n = 10;
      const paths = [];
      for (let i=0; i<args.length; i++) {
        if (args[i] === '-n' && args[i+1]) { n = parseInt(args[i+1]); i++; }
        else if (args[i].match(/^-\d+$/)) n = parseInt(args[i].slice(1));
        else paths.push(args[i]);
      }
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`head: cannot open '${p}' for reading: No such file or directory`); continue; }
        const lines = (fs[abs].content || '').split('\n');
        out.push(...lines.slice(0,n));
      }
      return { out };
    },

    tail(args) {
      let n = 10;
      const paths = [];
      for (let i=0; i<args.length; i++) {
        if (args[i] === '-n' && args[i+1]) { n = parseInt(args[i+1]); i++; }
        else if (args[i].match(/^-\d+$/)) n = parseInt(args[i].slice(1));
        else paths.push(args[i]);
      }
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`tail: cannot open '${p}' for reading: No such file or directory`); continue; }
        const lines = (fs[abs].content || '').split('\n').filter((_,i,a)=>i<a.length-1||a[i]);
        out.push(...lines.slice(-n));
      }
      return { out };
    },

    wc(args) {
      let countLines=false, countWords=false, countBytes=false;
      const paths = [];
      let hasFlags = false;
      for (const a of args) {
        if (a.startsWith('-')) {
          hasFlags = true;
          if (a.includes('l')) countLines = true;
          if (a.includes('w')) countWords = true;
          if (a.includes('c')) countBytes = true;
        } else paths.push(a);
      }
      if (!hasFlags) { countLines=countWords=countBytes=true; }
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`wc: ${p}: No such file or directory`); continue; }
        const content = fs[abs].content || '';
        const lines = content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        const bytes = content.length;
        let line = '';
        if (countLines) line += String(lines).padStart(8);
        if (countWords) line += String(words).padStart(8);
        if (countBytes) line += String(bytes).padStart(8);
        out.push(line + ' ' + p);
      }
      return { out };
    },

    grep(args, stdin) {
      let caseInsensitive=false, recursive=false, lineNum=false, invertMatch=false, count=false, silent=false;
      const rest = [];
      for (const a of args) {
        if (a.startsWith('-') && !a.startsWith('--')) {
          if (a.includes('i')) caseInsensitive = true;
          if (a.includes('r') || a.includes('R')) recursive = true;
          if (a.includes('n')) lineNum = true;
          if (a.includes('v')) invertMatch = true;
          if (a.includes('c')) count = true;
          if (a.includes('l')) silent = true;
        } else rest.push(a);
      }
      if (!rest.length) return { out:['grep: no pattern provided'], exit:1 };
      const pattern = rest[0];
      const paths = rest.slice(1);
      const re = new RegExp(pattern, caseInsensitive ? 'i' : '');
      const out = [];
      const searchFile = (abs, label) => {
        if (!fs[abs] || fs[abs].type !== 'file') return;
        const lines = (fs[abs].content || '').split('\n');
        let matchCount = 0;
        for (let i=0; i<lines.length; i++) {
          const matches = re.test(lines[i]);
          if (invertMatch ? !matches : matches) {
            matchCount++;
            if (!count && !silent) {
              let line = lines[i].replace(re, m => `${C.bRed}${m}${C.r}`);
              const prefix = label ? `${C.bMagenta}${label}${C.r}:` : '';
              const ln = lineNum ? `${C.bGreen}${i+1}${C.r}:` : '';
              out.push(prefix + ln + line);
            }
          }
        }
        if (count) out.push((label ? label+':' : '') + matchCount);
        if (silent && matchCount > 0) out.push(label || abs);
      };
      if (!paths.length && stdin) {
        stdin.split('\n').forEach((l,i) => {
          const matches = re.test(l);
          if (invertMatch ? !matches : matches) {
            out.push(lineNum ? `${i+1}:${l.replace(re, m => `${C.bRed}${m}${C.r}`)}` : l.replace(re, m => `${C.bRed}${m}${C.r}`));
          }
        });
      }
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`grep: ${p}: No such file or directory`); continue; }
        if (fs[abs].type === 'dir') {
          if (recursive) {
            const files = Object.keys(fs).filter(k => (k.startsWith(abs+'/') || k===abs) && fs[k].type==='file');
            files.forEach(f => searchFile(f, paths.length>1 || recursive ? f : ''));
          } else {
            out.push(`grep: ${p}: Is a directory`);
          }
        } else {
          searchFile(abs, paths.length>1 ? p : '');
        }
      }
      return { out, exit: out.length ? 0 : 1 };
    },

    find(args) {
      let startPath = '.';
      let namePattern = null, typeFilter = null, maxDepth = Infinity;
      for (let i=0; i<args.length; i++) {
        if (args[i] === '-name' && args[i+1]) { namePattern = args[++i]; }
        else if (args[i] === '-type' && args[i+1]) { typeFilter = args[++i]; }
        else if (args[i] === '-maxdepth' && args[i+1]) { maxDepth = parseInt(args[++i]); }
        else if (!args[i].startsWith('-')) startPath = args[i];
      }
      const abs = resolve(startPath);
      const re = namePattern
        ? new RegExp('^' + namePattern.replace(/\./g,'[.]').replace(/\*/g,'.*').replace(/\?/g,'.') + '$')
        : null;
      const out = [];
      const startDepth = abs.split('/').filter(Boolean).length;
      for (const k of Object.keys(fs)) {
        if (k !== abs && !k.startsWith(abs === '/' ? '/' : abs+'/')) continue;
        const depth = k.split('/').filter(Boolean).length - startDepth;
        if (depth > maxDepth) continue;
        const name = k.split('/').pop();
        if (re && !re.test(name)) continue;
        if (typeFilter === 'f' && fs[k].type !== 'file') continue;
        if (typeFilter === 'd' && fs[k].type !== 'dir') continue;
        out.push(k === abs ? startPath : startPath.replace(/\/?$/,'/') + k.slice(abs.length+1));
      }
      return { out };
    },

    sort(args, stdin) {
      let reverse=false, unique=false, numeric=false;
      const paths = [];
      for (const a of args) {
        if (a.startsWith('-')) {
          if (a.includes('r')) reverse = true;
          if (a.includes('u')) unique = true;
          if (a.includes('n')) numeric = true;
        } else paths.push(a);
      }
      let lines = [];
      if (paths.length) {
        for (const p of paths) {
          const abs = resolve(p);
          if (fs[abs]) lines.push(...(fs[abs].content||'').split('\n').filter(l=>l));
          else lines.push(`sort: ${p}: No such file or directory`);
        }
      } else if (stdin) {
        lines = stdin.split('\n').filter(l=>l);
      }
      lines.sort(numeric ? (a,b) => parseFloat(a)-parseFloat(b) : (a,b) => a.localeCompare(b));
      if (reverse) lines.reverse();
      if (unique) lines = [...new Set(lines)];
      return { out: lines };
    },

    uniq(args, stdin) {
      const paths = args.filter(a => !a.startsWith('-'));
      let lines = [];
      if (paths.length) {
        const abs = resolve(paths[0]);
        if (fs[abs]) lines = (fs[abs].content||'').split('\n').filter(l=>l);
      } else if (stdin) {
        lines = stdin.split('\n').filter(l=>l);
      }
      const out = [];
      for (let i=0; i<lines.length; i++) {
        if (i===0 || lines[i] !== lines[i-1]) out.push(lines[i]);
      }
      return { out };
    },

    stat(args) {
      const out = [];
      for (const p of args) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`stat: cannot statx '${p}': No such file or directory`); continue; }
        const e = fs[abs];
        const t = e.type === 'dir' ? 'directory' : 'regular file';
        out.push(`  File: ${p}`);
        out.push(`  Size: ${e.size}\t\tBlocks: ${Math.ceil(e.size/512)}\t IO Block: 4096   ${t}`);
        out.push(`Device: fd01h/64769d\tInode: ${Math.floor(Math.random()*9999999+1000000)}    Links: 1`);
        out.push(`Access: (${e.type==='dir'?'0755':'0644'}/${e.type==='dir'?'d':'–'}${e.perms})\t Uid: ( 1000/    ${e.owner})\t Gid: ( 1000/    ${e.group})`);
        out.push(`Modify: ${new Date(e.mtime).toLocaleString()}`);
      }
      return { out };
    },

    chmod(args) {
      if (args.length < 2) return { out:['chmod: missing operand'], exit:1 };
      const permsArg = args[0];
      const paths = args.slice(1);
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`chmod: cannot access '${p}': No such file or directory`); continue; }
        fs[abs] = { ...fs[abs], perms: permsArg.length === 3 ? permsArg+permsArg+permsArg : fs[abs].perms };
      }
      return { out };
    },

    chown(args) {
      if (args.length < 2) return { out:['chown: missing operand'], exit:1 };
      const [ownerArg, ...paths] = args;
      const [newOwner, newGroup] = ownerArg.split(':');
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`chown: cannot access '${p}': No such file or directory`); continue; }
        fs[abs] = { ...fs[abs], owner: newOwner, ...(newGroup ? { group: newGroup } : {}) };
      }
      return { out };
    },

    uname(args) {
      const all = args.includes('-a');
      if (all || args.includes('-r')) {
        if (all) return { out:['Linux ubuntu-desktop 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux'] };
        return { out:['5.15.0-91-generic'] };
      }
      if (args.includes('-n')) return { out:['ubuntu-desktop'] };
      if (args.includes('-m')) return { out:['x86_64'] };
      return { out:['Linux'] };
    },

    hostname() { return { out:['ubuntu-desktop'] }; },
    whoami() { return { out:[env.USER] }; },

    id(args) {
      const who = args[0] || env.USER;
      return { out:[`uid=1000(${who}) gid=1000(${who}) groups=1000(${who}),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),122(lpadmin),135(lxd),136(sambashare)`] };
    },

    date(args) {
      const now = new Date();
      const fmt = args.find(a => a.startsWith('+'));
      if (fmt) {
        const f = fmt.slice(1);
        const pad = (n,l=2) => String(n).padStart(l,'0');
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const smonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return { out: [f
          .replace('%Y', now.getFullYear())
          .replace('%m', pad(now.getMonth()+1))
          .replace('%d', pad(now.getDate()))
          .replace('%H', pad(now.getHours()))
          .replace('%M', pad(now.getMinutes()))
          .replace('%S', pad(now.getSeconds()))
          .replace('%A', days[now.getDay()])
          .replace('%B', months[now.getMonth()])
          .replace('%b', smonths[now.getMonth()])
          .replace('%T', `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
          .replace('%D', `${pad(now.getMonth()+1)}/${pad(now.getDate())}/${String(now.getFullYear()).slice(-2)}`)
          .replace('%F', `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`)
        ]};
      }
      return { out:[now.toString()] };
    },

    cal() {
      const now = new Date();
      const y = now.getFullYear(), m = now.getMonth();
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const header = `   ${months[m]} ${y}`;
      const lines = [header.padStart(20), 'Su Mo Tu We Th Fr Sa'];
      const first = new Date(y, m, 1).getDay();
      const days = new Date(y, m+1, 0).getDate();
      let line = '   '.repeat(first);
      for (let d=1; d<=days; d++) {
        const isToday = d === now.getDate();
        const ds = isToday ? `\x1b[7m${String(d).padStart(2)}\x1b[0m` : String(d).padStart(2);
        line += ds + ' ';
        if ((first + d) % 7 === 0) { lines.push(line.trimEnd()); line = ''; }
      }
      if (line.trim()) lines.push(line.trimEnd());
      return { out: lines };
    },

    uptime() {
      const upSec = Math.floor(performance.now()/1000);
      const h = Math.floor(upSec/3600), mi = Math.floor((upSec%3600)/60);
      return { out:[` ${new Date().toTimeString().split(' ')[0]} up ${h}:${String(mi).padStart(2,'0')},  1 user,  load average: 0.42, 0.38, 0.35`] };
    },

    df(args) {
      const human = args.includes('-h');
      const fmt = human ? s => humanSize(s*1024) : s => String(s);
      const out = [
        'Filesystem'.padEnd(20) + (human?'Size ':'1K-blocks ') + 'Used'.padStart(8) + ' Avail'.padStart(8) + ' Use%'.padStart(5) + ' Mounted on',
        '/dev/sda1'.padEnd(20) + fmt(51200000).padStart(human?6:12) + fmt(12345678).padStart(8) + fmt(38854322).padStart(8) + ' 25%'.padStart(5) + ' /',
        'tmpfs'.padEnd(20) + fmt(4096000).padStart(human?6:12) + fmt(1024).padStart(8) + fmt(4094976).padStart(8) + '  1%'.padStart(5) + ' /run',
      ];
      return { out };
    },

    du(args) {
      let human=false, summary=false;
      const paths = [];
      for (const a of args) {
        if (a === '-h') human = true;
        else if (a === '-s') summary = true;
        else if (a === '-sh' || a === '-hs') { human=true; summary=true; }
        else if (!a.startsWith('-')) paths.push(a);
      }
      if (!paths.length) paths.push('.');
      const out = [];
      for (const p of paths) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`du: cannot access '${p}': No such file or directory`); continue; }
        const totalBytes = Object.keys(fs).filter(k=>k===abs||k.startsWith(abs+'/'))
          .reduce((s,k)=>s+(fs[k].size||0),0);
        const blocks = Math.ceil(totalBytes/1024);
        const sz = human ? humanSize(totalBytes) : String(blocks);
        if (summary) {
          out.push(`${sz}\t${p}`);
        } else {
          Object.keys(fs).filter(k=>k===abs||k.startsWith(abs+'/')).forEach(k=>{
            const s = human ? humanSize(fs[k].size||0) : String(Math.ceil((fs[k].size||0)/1024));
            out.push(`${s}\t${k.startsWith(abs) ? p + k.slice(abs.length) : k}`);
          });
        }
      }
      return { out };
    },

    free(args) {
      const human = args.includes('-h');
      const fmt = human ? humanSize : n => String(n);
      const total=8388608, used=3276800, free=5111808, shared=40960, buff=204800;
      const out = [
        '              total        used        free      shared  buff/cache   available',
        `Mem:   ${fmt(total).padStart(12)} ${fmt(used).padStart(12)} ${fmt(free).padStart(12)} ${fmt(shared).padStart(12)} ${fmt(buff).padStart(12)} ${fmt(free+buff).padStart(12)}`,
        `Swap:  ${fmt(2097152).padStart(12)} ${fmt(0).padStart(12)} ${fmt(2097152).padStart(12)}`,
      ];
      return { out };
    },

    ps(args) {
      const aux = args.includes('aux') || args.includes('-aux') || args.includes('-e') || args.some(a=>a.includes('a'));
      const procs = [
        {pid:1,   user:'root', cpu:'0.0', mem:'0.1', stat:'Ss', cmd:'/sbin/init'},
        {pid:234, user:'root', cpu:'0.0', mem:'0.0', stat:'Ss', cmd:'/usr/sbin/sshd'},
        {pid:456, user:'root', cpu:'0.0', mem:'0.2', stat:'Ss', cmd:'/usr/lib/systemd/systemd-journald'},
        {pid:987, user:'root', cpu:'0.0', mem:'0.3', stat:'Ss', cmd:'/usr/sbin/NetworkManager'},
        {pid:1234,user:'user', cpu:'0.1', mem:'1.2', stat:'Ss', cmd:'/usr/bin/gnome-shell'},
        {pid:1337,user:'user', cpu:'0.0', mem:'0.5', stat:'S',  cmd:'bash'},
        {pid:2048,user:'user', cpu:'0.2', mem:'2.1', stat:'Sl', cmd:'/usr/bin/code'},
        {pid:2100,user:'user', cpu:'0.0', mem:'0.1', stat:'R+', cmd:'ps aux'},
      ];
      const out = aux
        ? ['USER'.padEnd(10)+'PID'.padStart(6)+'  %CPU'.padStart(6)+'  %MEM'.padStart(6)+' STAT COMMAND',
           ...procs.map(p=>`${p.user.padEnd(10)}${String(p.pid).padStart(6)}  ${p.cpu.padStart(4)}  ${p.mem.padStart(4)} ${p.stat.padEnd(4)} ${p.cmd}`)]
        : ['  PID TTY          TIME CMD',
           ...procs.filter(p=>p.user==='user').map(p=>`${String(p.pid).padStart(5)} pts/0    00:00:00 ${p.cmd.split('/').pop()}`)];
      return { out };
    },

    kill(args) {
      const sig = args.find(a=>a.startsWith('-')) || '-15';
      const pids = args.filter(a=>!a.startsWith('-'));
      if (!pids.length) return { out:['kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]'], exit:1 };
      return { out: [] };
    },

    top() {
      const now = new Date();
      const lines = [
        `top - ${now.toTimeString().split(' ')[0]} up 2:34,  1 user,  load average: 0.42, 0.38, 0.35`,
        'Tasks:  98 total,   1 running,  97 sleeping,   0 stopped,   0 zombie',
        `%Cpu(s):  2.3 us,  0.5 sy,  0.0 ni, 97.0 id,  0.1 wa,  0.0 hi,  0.1 si,  0.0 st`,
        `MiB Mem :   8000.0 total,   4985.4 free,   2034.9 used,    979.7 buff/cache`,
        `MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5756.1 avail Mem`,
        '',
        '    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        '   1234 user      20   0  450000  96000  32000 S   1.3   1.2   0:23.45 gnome-shell',
        '   2048 user      20   0  650000 168000  45000 S   0.7   2.1   1:02.33 code',
        '    987 root      20   0   45000  12000   8000 S   0.3   0.1   0:12.10 NetworkManager',
        '   1337 user      20   0   20000   4000   3000 R   0.3   0.0   0:00.01 bash',
        '      1 root      20   0  168000   9000   6000 S   0.0   0.1   0:02.12 systemd',
      ];
      return { out: lines };
    },

    env(args) {
      const out = Object.entries(env).map(([k,v]) => `${k}=${v}`);
      return { out };
    },

    export(args) {
      for (const a of args) {
        const eq = a.indexOf('=');
        if (eq === -1) { if (!(a in env)) env[a]=''; }
        else { env[a.slice(0,eq)] = a.slice(eq+1); }
      }
      return { out:[] };
    },

    unset(args) {
      for (const a of args) delete env[a];
      return { out:[] };
    },

    which(args) {
      const out = [];
      for (const cmd of args) {
        if (ALL_COMMANDS.includes(cmd)) out.push(`/usr/bin/${cmd}`);
        else out.push(`${cmd} not found`);
      }
      return { out };
    },

    type(args) {
      const out = [];
      for (const cmd of args) {
        if (cmd in aliases) out.push(`${cmd} is aliased to \`${aliases[cmd]}'`);
        else if (ALL_COMMANDS.includes(cmd)) out.push(`${cmd} is /usr/bin/${cmd}`);
        else out.push(`${cmd}: not found`);
      }
      return { out };
    },

    alias(args) {
      if (!args.length) return { out: Object.entries(aliases).map(([k,v])=>`alias ${k}='${v}'`) };
      const out = [];
      for (const a of args) {
        const eq = a.indexOf('=');
        if (eq === -1) {
          if (aliases[a]) out.push(`alias ${a}='${aliases[a]}'`);
          else out.push(`bash: alias: ${a}: not found`);
        } else {
          aliases[a.slice(0,eq)] = a.slice(eq+1).replace(/^['"]|['"]$/g,'');
        }
      }
      return { out };
    },

    unalias(args) {
      for (const a of args) delete aliases[a];
      return { out:[] };
    },

    history(args, stdin, shellHistory) {
      return { out: shellHistory.map((h,i)=>`  ${String(i+1).padStart(4)}  ${h}`) };
    },

    man(args) {
      const manPages = {
        ls:'LS(1)\n\nNAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nDESCRIPTION\n    -a    do not ignore entries starting with .\n    -l    use a long listing format\n    -h    with -l, print human readable sizes\n    -r    reverse order while sorting\n    -R    list subdirectories recursively',
        cd:'CD(1)\n\nNAME\n    cd - change the shell working directory\n\nSYNOPSIS\n    cd [dir]\n\nDESCRIPTION\n    Change the current directory to DIR. The default DIR is the value of HOME.',
        grep:'GREP(1)\n\nNAME\n    grep - print lines that match patterns\n\nSYNOPSIS\n    grep [OPTION]... PATTERN [FILE]...\n\nDESCRIPTION\n    -i    ignore case distinctions in patterns and data\n    -r    read all files under each directory, recursively\n    -n    prefix each line of output with its line number\n    -v    select non-matching lines',
        find:'FIND(1)\n\nNAME\n    find - search for files in a directory hierarchy\n\nSYNOPSIS\n    find [path] [expression]\n\nDESCRIPTION\n    -name pattern   base of file name matches shell pattern\n    -type f|d       file is of type f(ile) or d(irectory)\n    -maxdepth N     descend at most N directory levels',
      };
      const cmd = args[0];
      if (!cmd) return { out:['What manual page do you want?'] };
      if (manPages[cmd]) return { out: manPages[cmd].split('\n') };
      return { out:[`No manual entry for ${cmd}`], exit:1 };
    },

    help() {
      return { out:[
        `${C.b}GNU bash, version 5.1.16${C.r}`,
        'Built-in commands:',
        ' alias  bg     cd      clear   cp    curl    date   df    diff  du',
        ' echo   env    export  find    free  git     grep   head  help  history',
        ' hostname      id      kill    ls    man     mkdir  mv    nano  node',
        ' npm    ping   ps      pwd     python3       rm    rmdir sort  stat',
        ' tail   tar    top     touch   type  uname   uniq  unset uptime  vim',
        ' wc     wget   which   whoami  zip',
        '',
        'Type `man <command>\' for help on individual commands.',
      ]};
    },

    ping(args) {
      let count = 4;
      const hosts = [];
      for (let i=0; i<args.length; i++) {
        if ((args[i]==='-c'||args[i]==='--count') && args[i+1]) { count=parseInt(args[++i]); }
        else if (args[i].match(/^-c\d+$/)) { count=parseInt(args[i].slice(2)); }
        else if (!args[i].startsWith('-')) hosts.push(args[i]);
      }
      if (!hosts.length) return { out:['ping: usage: ping [-c count] destination'], exit:1 };
      const host = hosts[0];
      const ip = `${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}`;
      return {
        out: [`PING ${host} (${ip}) 56(84) bytes of data.`],
        async: true,
        asyncFn: (writeLine, done) => {
          let seq = 0;
          const iv = setInterval(() => {
            seq++;
            const ms = (Math.random()*15+5).toFixed(3);
            writeLine(`64 bytes from ${ip}: icmp_seq=${seq} ttl=117 time=${ms} ms`);
            if (seq >= count) {
              clearInterval(iv);
              writeLine('');
              writeLine(`--- ${host} ping statistics ---`);
              writeLine(`${count} packets transmitted, ${count} received, 0% packet loss`);
              done();
            }
          }, 1000);
          return () => clearInterval(iv);
        }
      };
    },

    curl(args) {
      const url = args.find(a => !a.startsWith('-'));
      if (!url) return { out:['curl: no URL specified!'], exit:1 };
      return {
        out: [],
        async: true,
        asyncFn: (writeLine, done) => {
          writeLine(`  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current`);
          writeLine(`                                 Dload  Upload   Total   Spent    Left  Speed`);
          let pct = 0;
          const iv = setInterval(() => {
            pct = Math.min(pct + Math.floor(Math.random()*20+10), 100);
            writeLine(`  ${pct}  ${Math.floor(pct*1024)}    ${pct}  ${Math.floor(pct*1024)}     0      0  ${Math.floor(Math.random()*9000+1000)}      0 --:--:-- --:--:-- --:--:-- ${Math.floor(Math.random()*9000+1000)}`);
            if (pct >= 100) {
              clearInterval(iv);
              writeLine(`curl: (0) Connection established to ${url}`);
              done();
            }
          }, 300);
          return () => clearInterval(iv);
        }
      };
    },

    wget(args) {
      const url = args.find(a => !a.startsWith('-'));
      if (!url) return { out:['wget: missing URL'], exit:1 };
      const file = url.split('/').pop() || 'index.html';
      return {
        out: [
          `--${new Date().toISOString()}--  ${url}`,
          `Resolving ${url.split('/')[2]}... ${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}`,
          `Connecting to ${url.split('/')[2]}... connected.`,
          `HTTP request sent, awaiting response... 200 OK`,
        ],
        async: true,
        asyncFn: (writeLine, done) => {
          const size = Math.floor(Math.random()*500+100);
          let pct = 0;
          const iv = setInterval(() => {
            pct = Math.min(pct+20, 100);
            writeLine(`${file}: ${pct}%[=====>         ] ${Math.floor(size*pct/100)}K  ${Math.floor(Math.random()*500+200)}K/s`);
            if (pct >= 100) {
              clearInterval(iv);
              writeLine(`'${file}' saved [${size*1024}/${size*1024}]`);
              const abs = resolve(file);
              fs[abs] = mkf('(downloaded content)', 'user', 'user', new Date().toISOString());
              done();
            }
          }, 400);
          return () => clearInterval(iv);
        }
      };
    },

    ifconfig() {
      return { out:[
        `enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500`,
        `        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255`,
        `        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>`,
        `        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)`,
        `        RX packets 12543  bytes 9842312 (9.8 MB)`,
        `        TX packets 8321  bytes 1234567 (1.2 MB)`,
        ``,
        `lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536`,
        `        inet 127.0.0.1  netmask 255.0.0.0`,
        `        inet6 ::1  prefixlen 128  scopeid 0x10<host>`,
        `        loop  txqueuelen 1000  (Local Loopback)`,
      ]};
    },

    ip(args) {
      if (args[0] === 'addr' || args[0] === 'a') return cmds.ifconfig([]);
      if (args[0] === 'route' || args[0] === 'r') return { out:[
        'default via 192.168.1.1 dev enp0s3 proto dhcp metric 100',
        '192.168.1.0/24 dev enp0s3 proto kernel scope link src 192.168.1.100',
      ]};
      return cmds.ifconfig([]);
    },

    nslookup(args) {
      const host = args[0];
      if (!host) return { out:['nslookup: missing host argument'], exit:1 };
      const ip = `${Math.floor(Math.random()*200+1)}.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}`;
      return { out:[
        `Server:\t\t8.8.8.8`,
        `Address:\t8.8.8.8#53`,
        ``,
        `Non-authoritative answer:`,
        `Name:\t${host}`,
        `Address: ${ip}`,
      ]};
    },

    apt(args) {
      const sub = args[0];
      if (sub === 'update') return {
        out: [],
        async: true,
        asyncFn: (writeLine, done) => {
          const sources = ['Hit:1 http://archive.ubuntu.com jammy InRelease','Hit:2 http://security.ubuntu.com jammy-security InRelease','Get:3 http://archive.ubuntu.com jammy-updates InRelease [119 kB]','Fetched 119 kB in 2s (59.5 kB/s)','Reading package lists... Done'];
          let i=0;
          const iv = setInterval(() => {
            writeLine(sources[i++]);
            if (i >= sources.length) { clearInterval(iv); done(); }
          }, 400);
          return () => clearInterval(iv);
        }
      };
      if (sub === 'install') {
        const pkg = args.slice(1).filter(a=>!a.startsWith('-')).join(' ');
        if (!pkg) return { out:['E: No packages specified'], exit:1 };
        return {
          out: [`Reading package lists... Done`, `Building dependency tree... Done`, `The following NEW packages will be installed:\n  ${pkg}`, `0 upgraded, 1 newly installed.`],
          async: true,
          asyncFn: (writeLine, done) => {
            let pct=0;
            writeLine(`Get:1 http://archive.ubuntu.com jammy ${pkg} amd64 [${Math.floor(Math.random()*500+100)} kB]`);
            const iv = setInterval(() => {
              pct=Math.min(pct+25,100);
              writeLine(`${pct}% [Working]`);
              if (pct>=100) { clearInterval(iv); writeLine(`Setting up ${pkg} ... done`); done(); }
            }, 500);
            return () => clearInterval(iv);
          }
        };
      }
      if (sub === 'remove') {
        const pkg = args.slice(1).filter(a=>!a.startsWith('-')).join(' ');
        return { out:[`Reading package lists... Done`,`The following packages will be REMOVED:\n  ${pkg}`,`0 upgraded, 0 newly installed, 1 to remove.`,`Removing ${pkg} ...`,`Processing triggers for man-db ...`] };
      }
      if (sub === 'list') return { out:['Listing... Done','bash/jammy,now 5.1-6ubuntu1 amd64 [installed]','coreutils/jammy,now 8.32-4.1ubuntu1 amd64 [installed]','git/jammy,now 1:2.34.1-1ubuntu1.10 amd64 [installed]','python3/jammy,now 3.10.6-1~22.04 amd64 [installed]','vim/jammy,now 2:8.2.3995-1ubuntu2.15 amd64 [installed]'] };
      return { out:[`E: Invalid operation ${sub||''}`], exit:1 };
    },

    sudo(args, stdin, hist) {
      if (!args.length) return { out:['usage: sudo command'], exit:1 };
      const [subcmd, ...subargs] = args;
      if (subcmd === 'apt' || subcmd === 'apt-get') return cmds.apt(subargs, stdin, hist);
      return cmds[subcmd] ? cmds[subcmd](subargs, stdin, hist) : { out:[`sudo: ${subcmd}: command not found`], exit:1 };
    },

    git(args) {
      const sub = args[0];
      if (!sub) return { out:['usage: git [--version] [--help] <command> [<args>]'] };
      if (sub === 'status') return { out:['On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean'] };
      if (sub === 'log') return { out:[
        `${C.yellow}commit a3f1b2c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9${C.r}`,
        'Author: Ubuntu User <user@ubuntu-desktop>',
        'Date:   ' + new Date(Date.now()-86400000).toDateString(),
        '\n    Initial commit\n',
        `${C.yellow}commit b4c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0${C.r}`,
        'Author: Ubuntu User <user@ubuntu-desktop>',
        'Date:   ' + new Date(Date.now()-172800000).toDateString(),
        '\n    Add project files',
      ]};
      if (sub === 'init') return { out:['Initialized empty Git repository in ' + cwd + '/.git/'] };
      if (sub === 'add') return { out:[] };
      if (sub === 'commit') {
        const m = args.findIndex(a=>a==='-m');
        const msg = m>=0 ? (args[m+1]||'(no message)') : 'Update';
        return { out:[`[main ${Math.random().toString(16).slice(2,9)}] ${msg}`, ` 1 file changed, 1 insertion(+)`,] };
      }
      if (sub === 'diff') return { out:['(working tree clean)'] };
      if (sub === 'branch') return { out:['* main', '  dev'] };
      if (sub === 'checkout') return { out:[`Switched to branch '${args[1]||'main'}'`] };
      if (sub === 'clone') {
        const repo = args.find(a=>!a.startsWith('-'))||'repo';
        return { out:[`Cloning into '${repo.split('/').pop().replace('.git','')}'...`, 'remote: Counting objects: 42', 'Receiving objects: 100% (42/42)'] };
      }
      if (sub === 'pull') return { out:['Already up to date.'] };
      if (sub === 'push') return { out:["Enumerating objects: 5, done.","Counting objects: 100% (5/5)","Writing objects: 100% (5/5), 523 bytes","To github.com:user/repo.git\n   a3f1b2c..b4c2d3e  main -> main"] };
      return { out:[`git: '${sub}' is not a git command. See 'git --help'.`], exit:1 };
    },

    python3(args) {
      const c = args.findIndex(a=>a==='-c');
      if (c >= 0 && args[c+1]) {
        const code = args[c+1];
        try {
          const out = [];
          // safe eval
          if (code.startsWith('print(')) {
            const inner = code.slice(6,-1);
            out.push(String(eval(inner)));
          } else {
            out.push(String(eval(code)));
          }
          return { out };
        } catch(e) { return { out: [`SyntaxError: ${e.message}`], exit:1 }; }
      }
      if (args.length) {
        const f = resolve(args[0]);
        if (!fs[f]) return { out:[`python3: can't open file '${args[0]}': [Errno 2] No such file or directory`], exit:2 };
        return { out:[`python3: ${args[0]}: execution simulated`] };
      }
      return { out:['Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0] on linux','Type "help", "copyright", "credits" or "license" for more information.','>>> (interactive mode not supported in this terminal - use python3 -c "code")'] };
    },

    node(args) {
      const e = args.findIndex(a=>a==='-e');
      if (e >= 0 && args[e+1]) {
        try {
          const result = eval(args[e+1]);
          return { out: result !== undefined ? [String(result)] : [] };
        } catch(err) { return { out:[`${err.name}: ${err.message}`], exit:1 }; }
      }
      if (args.length) {
        const f = resolve(args[0]);
        if (!fs[f]) return { out:[`Error: Cannot find module '${args[0]}'`], exit:1 };
        return { out:[`[running ${args[0]}...]`] };
      }
      return { out:['Welcome to Node.js v18.17.0.','Type ".help" for more information.',"> (REPL not supported - use node -e 'code')"] };
    },

    npm(args) {
      const sub = args[0];
      if (sub === 'install' || sub === 'i') return { out:['added 142 packages, and audited 143 packages in 3s\n\nfound 0 vulnerabilities'] };
      if (sub === 'start') return { out:['> project@0.0.1 start\n> vite\n\n  VITE v5.0.0  ready in 342 ms\n\n  ➜  Local:   http://localhost:5173/'] };
      if (sub === 'run') return { out:[`> project@0.0.1 ${args[1]||''}`, `Running ${args[1]||''}...`] };
      if (sub === 'test') return { out:['> project@0.0.1 test\nTest suite: PASS (12 tests)'] };
      if (sub === 'list' || sub === 'ls') return { out:['project@0.0.1 /home/user/project\n├── react@18.3.1\n├── vite@5.3.1\n└── zustand@4.5.2'] };
      return { out:[`npm: unknown command '${sub}'`], exit:1 };
    },

    tar(args) {
      const create = args.some(a=>a.includes('c'));
      const extract = args.some(a=>a.includes('x'));
      const list = args.some(a=>a.includes('t'));
      const verbose = args.some(a=>a.includes('v'));
      const file = args.find(a=>a.endsWith('.tar')||a.endsWith('.tar.gz')||a.endsWith('.tgz')) || 'archive.tar';
      const paths = args.filter(a=>!a.startsWith('-')&&a!==file);
      if (create) {
        if (verbose) return { out: paths.map(p=>`a ${p}`) };
        return { out:[] };
      }
      if (extract) return { out: verbose ? ['x archive', 'x archive/file1.txt', 'x archive/file2.txt'] : [] };
      if (list) return { out: ['archive/', 'archive/file1.txt', 'archive/file2.txt'] };
      return { out:['tar: must specify -c, -x, or -t'], exit:1 };
    },

    bc(args, stdin) {
      const input = args[0] || stdin;
      if (!input) return { out:['bc 1.07.1\nCopyright 1991-1994, 1997, 1998, 2000, 2004, 2006 Free Software Foundation, Inc.','(calculator mode, type expressions like 2+2)'] };
      try {
        const result = eval(input.replace(/\^/g,'**'));
        return { out: [String(result)] };
      } catch(e) { return { out:[`(standard_in) 1: syntax error`], exit:1 }; }
    },

    base64(args, stdin) {
      const decode = args.includes('-d') || args.includes('--decode');
      const input = args.find(a=>!a.startsWith('-')) || stdin || '';
      const content = input.startsWith('/') ? (fs[resolve(input)]?.content || '') : input;
      try {
        if (decode) return { out: [atob(content.trim())] };
        return { out: [btoa(content)] };
      } catch(e) { return { out:['base64: invalid input'], exit:1 }; }
    },

    md5sum(args) {
      const out = [];
      for (const p of args) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`md5sum: ${p}: No such file or directory`); continue; }
        const hash = Array.from({length:32},()=>'0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
        out.push(`${hash}  ${p}`);
      }
      return { out };
    },

    sha256sum(args) {
      const out = [];
      for (const p of args) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`sha256sum: ${p}: No such file or directory`); continue; }
        const hash = Array.from({length:64},()=>'0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
        out.push(`${hash}  ${p}`);
      }
      return { out };
    },

    seq(args) {
      let first=1, step=1, last=1;
      if (args.length===1) { last=parseInt(args[0]); }
      else if (args.length===2) { first=parseInt(args[0]); last=parseInt(args[1]); }
      else { first=parseInt(args[0]); step=parseInt(args[1]); last=parseInt(args[2]); }
      const out = [];
      for (let i=first; step>0?i<=last:i>=last; i+=step) out.push(String(i));
      return { out };
    },

    yes(args) {
      const word = args[0] || 'y';
      return { out: Array(20).fill(word) };
    },

    sleep(args) {
      const n = parseFloat(args[0]) || 1;
      return {
        out: [],
        async: true,
        asyncFn: (writeLine, done) => {
          const t = setTimeout(done, n*1000);
          return () => clearTimeout(t);
        }
      };
    },

    diff(args) {
      const paths = args.filter(a=>!a.startsWith('-'));
      if (paths.length < 2) return { out:['diff: missing operand'], exit:1 };
      const [a,b] = paths.map(p=>{ const abs=resolve(p); return {path:p,content:fs[abs]?.content||null}; });
      if (!a.content) return { out:[`diff: ${a.path}: No such file or directory`], exit:2 };
      if (!b.content) return { out:[`diff: ${b.path}: No such file or directory`], exit:2 };
      const la = a.content.split('\n'), lb = b.content.split('\n');
      const out = [];
      const maxL = Math.max(la.length, lb.length);
      for (let i=0; i<maxL; i++) {
        if (la[i]!==lb[i]) {
          if (la[i]!==undefined) out.push(`< ${la[i]}`);
          if (lb[i]!==undefined) out.push(`> ${lb[i]}`);
        }
      }
      if (!out.length) return { out:[] };
      return { out: [`--- ${a.path}`, `+++ ${b.path}`, ...out], exit:1 };
    },

    clear() { return { out:[], clear:true }; },
    reset() { return { out:[], clear:true }; },

    true() { return { out:[], exit:0 }; },
    false() { return { out:[], exit:1 }; },

    expr(args) {
      try {
        const expr = args.join(' ').replace(/\\\*/g,'*');
        return { out: [String(eval(expr))] };
      } catch(e) { return { out:['0'], exit:1 }; }
    },

    basename(args) {
      if (!args.length) return { out:['basename: missing operand'], exit:1 };
      const p = args[0], suffix = args[1] || '';
      let name = p.split('/').pop();
      if (suffix && name.endsWith(suffix)) name = name.slice(0, -suffix.length);
      return { out: [name] };
    },

    dirname(args) {
      if (!args.length) return { out:['dirname: missing operand'], exit:1 };
      const p = args[0];
      return { out: [p.includes('/') ? p.split('/').slice(0,-1).join('/') || '/' : '.'] };
    },

    nano(args) {
      const file = args.find(a=>!a.startsWith('-')) || '';
      const abs = file ? resolve(file) : null;
      const content = abs && fs[abs] ? fs[abs].content || '' : '';
      return { type:'nano', file: abs||file, content };
    },

    vim(args) {
      const file = args.find(a=>!a.startsWith('-')) || '';
      const abs = file ? resolve(file) : null;
      const content = abs && fs[abs] ? fs[abs].content || '' : '';
      return { type:'vim', file: abs||file, content };
    },

    vi(args) { return cmds.vim(args); },

    less(args) {
      const file = args.find(a=>!a.startsWith('-'));
      if (!file) return { out:[] };
      const abs = resolve(file);
      if (!fs[abs]) return { out:[`${file}: No such file or directory`], exit:1 };
      return { type:'less', file:abs, content: fs[abs].content||'' };
    },

    more(args) { return cmds.less(args); },

    ssh(args) {
      const target = args.find(a=>!a.startsWith('-'));
      if (!target) return { out:['usage: ssh [options] user@host'], exit:1 };
      return { out:[`ssh: connect to host ${target.includes('@')?target.split('@')[1]:target} port 22: Network is unreachable`], exit:255 };
    },

    file(args) {
      const out = [];
      for (const p of args) {
        const abs = resolve(p);
        if (!fs[abs]) { out.push(`${p}: ERROR: No such file or directory`); continue; }
        if (fs[abs].type === 'dir') { out.push(`${p}: directory`); continue; }
        const content = fs[abs].content || '';
        let type = 'ASCII text';
        if (content.startsWith('#!')) type = 'POSIX shell script, ASCII text executable';
        else if (p.endsWith('.md')) type = 'ASCII text (Markdown)';
        else if (p.endsWith('.json')) type = 'JSON data';
        else if (p.endsWith('.sh')) type = 'POSIX shell script, ASCII text executable';
        out.push(`${p}: ${type}`);
      }
      return { out };
    },

    ln(args) {
      const symbolic = args.includes('-s');
      const paths = args.filter(a=>!a.startsWith('-'));
      if (paths.length < 2) return { out:['ln: missing destination'], exit:1 };
      const src = resolve(paths[0]), dst = resolve(paths[1]);
      if (!fs[src]) return { out:[`ln: failed to access '${paths[0]}': No such file or directory`], exit:1 };
      fs[dst] = { ...fs[src], mtime: new Date().toISOString(), symlink: symbolic ? src : undefined };
      return { out:[] };
    },

    tee(args, stdin) {
      const append = args.includes('-a');
      const files = args.filter(a=>!a.startsWith('-'));
      for (const f of files) {
        const abs = resolve(f);
        fs[abs] = mkf((append && fs[abs] ? fs[abs].content||'' : '') + (stdin||''), 'user','user',new Date().toISOString());
      }
      return { out: (stdin||'').split('\n').filter(l=>l) };
    },

    xargs(args, stdin) {
      const [subcmd, ...subargs] = args;
      if (!subcmd || !stdin) return { out:[] };
      const items = stdin.trim().split(/\s+/);
      return cmds[subcmd] ? cmds[subcmd]([...subargs, ...items]) : { out:[`xargs: ${subcmd}: command not found`], exit:1 };
    },

    netstat() {
      return { out:[
        'Active Internet connections (only servers)',
        'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
        'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN',
        'tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN',
        'tcp6       0      0 :::80                   :::*                    LISTEN',
      ]};
    },

    ss() { return cmds.netstat([]); },
    dpkg(args) { return cmds.apt(['list', ...args.slice(1)]); },
    'apt-get'(args) { return cmds.apt(args); },
    su(args) { return { out:[`su: Authentication failure`], exit:1 }; },
  };

  // ── parser ──
  function expandVars(s) {
    return s.replace(/\$\{?(\w+)\}?/g, (_, k) => k === '?' ? String(lastExitCode) : (env[k] ?? ''));
  }

  function tokenize(line) {
    const tokens = [];
    let cur = '', inSingle=false, inDouble=false;
    for (let i=0; i<line.length; i++) {
      const ch = line[i];
      if (ch === "'" && !inDouble) { inSingle=!inSingle; continue; }
      if (ch === '"' && !inSingle) { inDouble=!inDouble; continue; }
      if (inSingle) { cur+=ch; continue; }
      if (inDouble) { cur += ch==='\\'&&line[i+1]==='$' ? (i++,line[i]) : ch; continue; }
      if (ch === ' ' || ch === '\t') { if (cur) { tokens.push(cur); cur=''; } continue; }
      cur += ch;
    }
    if (cur) tokens.push(cur);
    return tokens;
  }

  function parsePipeline(line) {
    // Split on | (not inside quotes)
    const segments = [];
    let cur = '', inS=false, inD=false;
    for (let i=0; i<line.length; i++) {
      if (line[i]==="'" && !inD) { inS=!inS; cur+=line[i]; continue; }
      if (line[i]==='"' && !inS) { inD=!inD; cur+=line[i]; continue; }
      if (!inS && !inD && line[i]==='|' && line[i+1]!=='|') { segments.push(cur); cur=''; continue; }
      cur += line[i];
    }
    segments.push(cur);
    return segments.map(s=>s.trim());
  }

  function parseRedirects(segment) {
    let cmd = segment, outFile=null, appendFile=null, inFile=null;
    const rOut = segment.match(/^(.*?)\s*>(?!>)\s*(.+)$/);
    const rApp = segment.match(/^(.*?)\s*>>\s*(.+)$/);
    const rIn = segment.match(/^(.*?)\s*<\s*(.+)$/);
    if (rApp) { cmd=rApp[1]; appendFile=rApp[2].trim(); }
    else if (rOut) { cmd=rOut[1]; outFile=rOut[2].trim(); }
    if (rIn) { cmd=rIn[1]; inFile=rIn[2].trim(); }
    return { cmd: cmd.trim(), outFile, appendFile, inFile };
  }

  function runSegment(segment, stdin, shellHistory) {
    const { cmd, outFile, appendFile, inFile } = parseRedirects(segment);
    let actualStdin = stdin;
    if (inFile) {
      const abs = resolve(inFile);
      actualStdin = fs[abs]?.content ?? '';
    }
    const rawTokens = tokenize(cmd);
    if (!rawTokens.length) return { out:[] };
    const tokens = rawTokens.map(t => expandVars(t));

    // Expand aliases (one level)
    const [name, ...rest] = tokens;
    let actualName = name, actualArgs = rest;
    if (aliases[name]) {
      const expanded = tokenize(aliases[name]);
      actualName = expanded[0];
      actualArgs = [...expanded.slice(1), ...rest];
    }

    const fn = cmds[actualName];
    if (!fn) return { out:[`${C.bRed}${actualName}: command not found${C.r}`], exit:127 };

    let result;
    try {
      result = fn(actualArgs, actualStdin, shellHistory);
    } catch(e) {
      result = { out:[`${actualName}: error: ${e.message}`], exit:1 };
    }

    if (result.type === 'nano' || result.type === 'vim' || result.type === 'less') return result;

    lastExitCode = result.exit ?? 0;

    if (outFile || appendFile) {
      const abs = resolve(outFile || appendFile);
      const existing = appendFile && fs[abs] ? fs[abs].content||'' : '';
      const content = existing + result.out.join('\n') + (result.out.length ? '\n' : '');
      fs[abs] = mkf(content, 'user','user',new Date().toISOString());
      return { out:[], exit:lastExitCode };
    }

    return result;
  }

  function execute(line, shellHistory) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return { out:[] };

    // Handle ;
    if (trimmed.includes(';')) {
      const parts = trimmed.split(';').map(p=>p.trim()).filter(Boolean);
      const outs = [];
      for (const p of parts) {
        const r = execute(p, shellHistory);
        if (r.type) return r;
        if (r.async) return r;
        outs.push(...(r.out||[]));
      }
      return { out: outs };
    }

    // Handle &&
    if (trimmed.includes('&&')) {
      const parts = trimmed.split('&&').map(p=>p.trim());
      const outs = [];
      for (const p of parts) {
        const r = execute(p, shellHistory);
        if (r.type) return r;
        if (r.async) return r;
        outs.push(...(r.out||[]));
        if ((r.exit||0) !== 0) break;
      }
      return { out: outs };
    }

    // Handle ||
    if (trimmed.includes('||')) {
      const parts = trimmed.split('||').map(p=>p.trim());
      const outs = [];
      for (const p of parts) {
        const r = execute(p, shellHistory);
        if (r.type) return r;
        if (r.async) return r;
        outs.push(...(r.out||[]));
        if ((r.exit||0) === 0) break;
      }
      return { out: outs };
    }

    const pipeline = parsePipeline(trimmed);
    if (pipeline.length === 1) return runSegment(pipeline[0], null, shellHistory);

    // Run pipeline: output of each becomes stdin of next
    let stdin = null;
    let result = { out: [] };
    for (let i=0; i<pipeline.length; i++) {
      const seg = pipeline[i];
      const last = i === pipeline.length-1;
      // If not last, we need sync result for piping
      if (last) {
        result = runSegment(seg, stdin, shellHistory);
      } else {
        const r = runSegment(seg, stdin, shellHistory);
        if (r.type || r.async) return r;
        stdin = r.out.join('\n');
      }
    }
    return result;
  }

  function tabComplete(input) {
    const tokens = input.split(' ');
    const last = tokens[tokens.length - 1];
    const isFirstToken = tokens.length <= 1 || (tokens.length === 2 && tokens[0] === 'sudo');

    if (isFirstToken) {
      const prefix = tokens[tokens.length-1];
      return ALL_COMMANDS.filter(c=>c.startsWith(prefix)).sort();
    }

    // Complete file paths
    const partial = last;
    let dir, prefix;
    if (partial.includes('/')) {
      const lastSlash = partial.lastIndexOf('/');
      dir = resolve(partial.slice(0, lastSlash) || '/');
      prefix = partial.slice(lastSlash+1);
    } else {
      dir = cwd;
      prefix = partial;
    }

    const items = children(dir).filter(c=>c.name.startsWith(prefix));
    return items.map(c=>{
      const displayed = partial.includes('/')
        ? partial.slice(0, partial.lastIndexOf('/')+1) + c.name + (c.type==='dir'?'/':'')
        : c.name + (c.type==='dir'?'/':'');
      return displayed;
    }).sort();
  }

  function getPrompt() {
    const display = cwd.startsWith(HOME) ? '~' + cwd.slice(HOME.length) : cwd;
    return `\x1b[1;32muser@ubuntu\x1b[0m:\x1b[1;34m${display}\x1b[0m$ `;
  }

  function saveFile(path, content) {
    const abs = path.startsWith('/') ? path : resolve(path);
    if (fs[abs]) {
      fs[abs] = { ...fs[abs], content, size: content.length, mtime: new Date().toISOString() };
    } else {
      fs[abs] = mkf(content, 'user','user',new Date().toISOString());
    }
  }

  function readFile(path) {
    const abs = path.startsWith('/') ? path : resolve(path);
    return fs[abs]?.content ?? null;
  }

  return { execute, tabComplete, getPrompt, saveFile, readFile };
}
