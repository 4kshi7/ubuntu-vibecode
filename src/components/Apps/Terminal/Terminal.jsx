import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);

  useEffect(() => {
    if (!termInstance.current && terminalRef.current) {
      const term = new XTerminal({
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 14,
        theme: {
          background: '#300a24',
          foreground: '#ffffff',
          cursor: '#ffffff',
        },
        cursorBlink: true,
        scrollback: 1000,
      });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln('Welcome to Ubuntu 22.04 LTS (GNU/Linux 5.15.0-91-generic x86_64)');
      term.writeln('');
      term.writeln(' * Documentation:  https://help.ubuntu.com');
      term.writeln(' * Management:     https://landscape.canonical.com');
      term.writeln(' * Support:        https://ubuntu.com/advantage');
      term.writeln('');
      
      const prompt = () => {
        term.write('\r\n\x1b[1;32muser@ubuntu\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
        term.scrollToBottom();
      };
      
      prompt();

      let input = '';
      term.onData(e => {
        switch (e) {
          case '\r': // Enter
            term.writeln('');
            const cmd = input.trim();
            if (cmd === 'clear') {
              term.clear();
            } else if (cmd === 'ls') {
              term.writeln('\x1b[1;34mDocuments  Downloads  Music  Pictures  Videos  Desktop\x1b[0m');
            } else if (cmd.startsWith('ls ') && cmd.includes('-l')) {
              term.writeln('total 24K');
              term.writeln('drwxr-xr-x 2 user user 4.0K Mar 28 10:00 \x1b[1;34mDesktop\x1b[0m');
              term.writeln('drwxr-xr-x 2 user user 4.0K Mar 28 10:00 \x1b[1;34mDocuments\x1b[0m');
              term.writeln('drwxr-xr-x 2 user user 4.0K Mar 28 10:00 \x1b[1;34mDownloads\x1b[0m');
              term.writeln('drwxr-xr-x 2 user user 4.0K Mar 28 10:00 \x1b[1;34mMusic\x1b[0m');
              term.writeln('drwxr-xr-x 2 user user 4.0K Mar 28 10:00 \x1b[1;34mPictures\x1b[0m');
              term.writeln('drwxr-xr-x 2 user user 4.0K Mar 28 10:00 \x1b[1;34mVideos\x1b[0m');
            } else if (cmd.startsWith('ping ')) {
              term.scrollToBottom();
              const target = cmd.split(' ')[1] || 'google.com';
              term.writeln(`PING ${target} (${target}) 56(84) bytes of data.`);
              let count = 0;
              const interval = setInterval(() => {
                count++;
                term.writeln(`64 bytes from ${target}: icmp_seq=${count} ttl=117 time=${(Math.random() * 20 + 10).toFixed(1)} ms`);
                term.scrollToBottom();
                if (count >= 4) {
                  clearInterval(interval);
                  prompt();
                }
              }, 1000);
              input = '';
              return; // return to prevent prompt from firing immediately
            } else if (cmd.startsWith('pwd')) {
              term.writeln('/home/user');
            } else if (cmd.startsWith('whoami')) {
              term.writeln('user');
            } else if (cmd.startsWith('date')) {
              term.writeln(new Date().toString());
            } else if (cmd.startsWith('mkdir ')) {
              const dirName = cmd.substring(6).trim();
              if(dirName) {
                term.writeln('');
                // Note: FileSystem interaction simulation, you can store it in a state
              } else {
                term.writeln('mkdir: missing operand');
              }
            } else if (cmd.startsWith('echo ')) {
              term.writeln(cmd.substring(5));
            } else if (cmd.trim().length > 0) {
              term.writeln(`${cmd}: command not found`);
            }
            input = '';
            prompt();
            break;
          case '\u007F': // Backspace
            if (input.length > 0) {
              input = input.substr(0, input.length - 1);
              term.write('\b \b');
            }
            break;
          default:
            if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
              input += e;
              term.write(e);
              term.scrollToBottom();
            }
        }
      });

      termInstance.current = { term, fitAddon };

      // Handle Resize
      const resizeObserver = new ResizeObserver(() => {
        try {
          fitAddon.fit();
        } catch (e) {}
      });
      resizeObserver.observe(terminalRef.current);

      return () => {
        resizeObserver.disconnect();
        term.dispose();
        termInstance.current = null;
      };
    }
  }, []);

  return (
    <div className="w-full h-full bg-[#300a24] p-1 overflow-hidden" ref={terminalRef}></div>
  );
};

export default Terminal;
