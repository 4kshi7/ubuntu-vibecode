import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { createShell } from './shellEngine';

// ── Nano editor helper ────────────────────────────────────────────────────────
function createNanoEditor(term, file, initialContent, onSave, onExit) {
  const lines = initialContent.split('\n');
  if (lines[lines.length-1] === '') lines.pop();
  let curRow = 0, curCol = 0;
  let modified = false;
  const rows = () => term.rows - 3;

  function clamp() {
    curRow = Math.max(0, Math.min(curRow, lines.length));
    if (curRow >= lines.length) lines.push('');
    curCol = Math.max(0, Math.min(curCol, (lines[curRow]||'').length));
  }

  function render() {
    term.write('\x1b[?25l'); // hide cursor
    term.write('\x1b[H\x1b[2J'); // clear
    // header
    const title = ` GNU nano   ${file} ${modified?' (modified)':''}`;
    term.write(`\x1b[7m${title.padEnd(term.cols)}\x1b[0m\r\n`);
    // content
    const startLine = Math.max(0, curRow - Math.floor(rows()/2));
    for (let r=0; r<rows(); r++) {
      const li = startLine + r;
      const lineText = li < lines.length ? (lines[li]||'').slice(0, term.cols-1) : '';
      term.write(lineText.padEnd(term.cols-1) + '\r\n');
    }
    // status bar
    term.write('\x1b[7m' + ` Line ${curRow+1}, Col ${curCol+1}`.padEnd(term.cols) + '\x1b[0m\r\n');
    // help bar
    const help = ' ^G Help  ^O Save  ^X Exit  ^K Cut  ^U Paste  ^W Search';
    term.write('\x1b[7m' + help.padEnd(term.cols) + '\x1b[0m');
    // position cursor
    const screenRow = curRow - startLine + 2; // +2 for header
    term.write(`\x1b[${screenRow};${curCol+1}H`);
    term.write('\x1b[?25h'); // show cursor
  }

  let clipboard = '';
  function handleKey(data) {
    if (data === '\x18') { // Ctrl+X
      if (modified) {
        term.write('\r\n\x1b[7m Save modified buffer? (Y/N) \x1b[0m');
        const waiter = term.onData(d => {
          waiter.dispose();
          if (d.toLowerCase() === 'y') { onSave(lines.join('\n')+'\n'); }
          onExit();
        });
      } else { onExit(); }
      return;
    }
    if (data === '\x0f') { // Ctrl+O
      onSave(lines.join('\n')+'\n');
      modified = false;
      render();
      return;
    }
    if (data === '\x0b') { // Ctrl+K (cut line)
      clipboard = lines.splice(curRow, 1)[0] || '';
      if (!lines.length) lines.push('');
      clamp(); modified = true; render(); return;
    }
    if (data === '\x15') { // Ctrl+U (paste)
      lines.splice(curRow, 0, clipboard);
      modified = true; render(); return;
    }
    if (data === '\r') {
      const before = (lines[curRow]||'').slice(0, curCol);
      const after = (lines[curRow]||'').slice(curCol);
      lines[curRow] = before;
      lines.splice(curRow+1, 0, after);
      curRow++; curCol=0; modified=true; render(); return;
    }
    if (data === '\x7f') { // backspace
      if (curCol > 0) {
        lines[curRow] = (lines[curRow]||'').slice(0,curCol-1)+(lines[curRow]||'').slice(curCol);
        curCol--; modified=true;
      } else if (curRow > 0) {
        const prev = lines[curRow-1]||'';
        curCol = prev.length;
        lines[curRow-1] = prev + (lines[curRow]||'');
        lines.splice(curRow, 1);
        curRow--; modified=true;
      }
      render(); return;
    }
    if (data === '\x1b[A') { curRow = Math.max(0,curRow-1); clamp(); render(); return; }
    if (data === '\x1b[B') { curRow = Math.min(lines.length-1,curRow+1); clamp(); render(); return; }
    if (data === '\x1b[C') { curCol = Math.min((lines[curRow]||'').length, curCol+1); render(); return; }
    if (data === '\x1b[D') { curCol = Math.max(0, curCol-1); render(); return; }
    if (data === '\x1b[H' || data === '\x01') { curCol=0; render(); return; }
    if (data === '\x1b[F' || data === '\x05') { curCol=(lines[curRow]||'').length; render(); return; }
    if (data.charCodeAt(0) >= 32 && data.length === 1) {
      const line = lines[curRow]||'';
      lines[curRow] = line.slice(0,curCol) + data + line.slice(curCol);
      curCol++; modified=true; render(); return;
    }
  }
  render();
  return { handleKey };
}

// ── Terminal Component ────────────────────────────────────────────────────────
const Terminal = () => {
  const termRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    if (xtermRef.current || !termRef.current) return;

    const term = new XTerminal({
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 13,
      lineHeight: 1.2,
      theme: {
        background: '#300a24',
        foreground: '#ffffff',
        cursor: '#ffffff',
        cursorAccent: '#300a24',
        selectionBackground: 'rgba(255,255,255,0.3)',
        black: '#2e3436', red: '#cc0000', green: '#4e9a06', yellow: '#c4a000',
        blue: '#3465a4', magenta: '#75507b', cyan: '#06989a', white: '#d3d7cf',
        brightBlack: '#555753', brightRed: '#ef2929', brightGreen: '#8ae234',
        brightYellow: '#fce94f', brightBlue: '#729fcf', brightMagenta: '#ad7fa8',
        brightCyan: '#34e2e2', brightWhite: '#eeeeec',
      },
      cursorBlink: true,
      scrollback: 5000,
      convertEol: false,
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);
    fitAddon.fit();

    const shell = createShell();
    const cmdHistory = [];
    let histIdx = -1;
    let savedInput = '';
    let inputBuf = '';
    let cursorPos = 0;
    let asyncCancel = null;
    let editorHandler = null;

    // MOTD
    term.writeln('\x1b[1;31mUbuntu\x1b[0m 22.04.3 LTS  GNU/Linux 5.15.0-91-generic x86_64');
    term.writeln('');
    term.writeln(' * Documentation:  https://help.ubuntu.com');
    term.writeln(' * Management:     https://landscape.canonical.com');
    term.writeln(' * Support:        https://ubuntu.com/advantage');
    term.writeln('');
    term.writeln('Last login: ' + new Date(Date.now()-3600000).toString());
    term.writeln('');

    const promptStr = () => shell.getPrompt();
    const promptLen = () => promptStr().replace(/\x1b\[[0-9;]*m/g,'').length;

    function writePrompt() {
      term.write(promptStr());
    }

    function redraw() {
      term.write('\r' + promptStr() + inputBuf + '\x1b[K');
      const moves = inputBuf.length - cursorPos;
      if (moves > 0) term.write(`\x1b[${moves}D`);
    }

    function enterEditor(result) {
      const mode = result.type; // 'nano' | 'vim' | 'less'
      if (mode === 'less' || mode === 'more') {
        // Pager
        const lines = result.content.split('\n');
        let offset = 0;
        const pageSize = term.rows - 2;
        function renderPage() {
          term.write('\x1b[H\x1b[2J');
          const slice = lines.slice(offset, offset+pageSize);
          slice.forEach(l => term.writeln(l));
          term.write(`\x1b[7m (END) Press q to quit, space for next page \x1b[0m`);
        }
        renderPage();
        editorHandler = (data) => {
          if (data === 'q' || data === 'Q' || data === '\x1b') { editorHandler=null; term.write('\x1b[H\x1b[2J'); term.write('\r\n'); writePrompt(); return; }
          if (data === ' ' || data === '\x06') { offset=Math.min(offset+pageSize, Math.max(0,lines.length-pageSize)); renderPage(); }
          if (data === 'b' || data === '\x02') { offset=Math.max(0,offset-pageSize); renderPage(); }
        };
        return;
      }
      if (mode === 'nano') {
        const editor = createNanoEditor(
          term, result.file, result.content,
          (content) => { shell.saveFile(result.file, content); },
          () => {
            editorHandler = null;
            term.write('\x1b[H\x1b[2J');
            term.write('\r\n');
            writePrompt();
          }
        );
        editorHandler = editor.handleKey;
        return;
      }
      if (mode === 'vim') {
        // Basic vim
        let vimLines = result.content.split('\n');
        if (vimLines[vimLines.length-1]==='') vimLines.pop();
        let vimRow=0, vimCol=0, vimMode='normal', vimCmd='', modified=false;
        function renderVim() {
          term.write('\x1b[H\x1b[2J');
          const pageSize = term.rows-2;
          for (let r=0; r<pageSize; r++) {
            const li = r;
            if (li < vimLines.length) term.write(vimLines[li].slice(0,term.cols-1).padEnd(term.cols-1)+'\r\n');
            else term.write(`\x1b[34m~\x1b[0m`.padEnd(term.cols-1)+'\r\n');
          }
          const status = vimMode==='insert' ? `\x1b[1m-- INSERT --\x1b[0m` : `\x1b[7m "${result.file}" ${modified?'[Modified] ':''}\x1b[0m`;
          term.write(status.padEnd(term.cols));
          term.write(`\x1b[${vimRow+1};${vimCol+1}H`);
        }
        renderVim();
        editorHandler = (data) => {
          if (vimMode === 'command') {
            if (data === '\r') {
              if (vimCmd === 'q' || vimCmd === 'q!') { editorHandler=null; term.write('\x1b[H\x1b[2J'); term.write('\r\n'); writePrompt(); return; }
              if (vimCmd === 'w' || vimCmd === 'wq' || vimCmd === 'x') {
                shell.saveFile(result.file, vimLines.join('\n')+'\n'); modified=false;
                if (vimCmd !== 'w') { editorHandler=null; term.write('\x1b[H\x1b[2J'); term.write('\r\n'); writePrompt(); return; }
              }
              vimMode='normal'; vimCmd=''; renderVim(); return;
            }
            if (data === '\x1b') { vimMode='normal'; vimCmd=''; renderVim(); return; }
            if (data === '\x7f') { vimCmd=vimCmd.slice(0,-1); renderVim(); return; }
            vimCmd+=data; renderVim(); return;
          }
          if (vimMode === 'insert') {
            if (data === '\x1b') { vimMode='normal'; vimCol=Math.max(0,vimCol-1); renderVim(); return; }
            if (data === '\r') { const before=(vimLines[vimRow]||'').slice(0,vimCol), after=(vimLines[vimRow]||'').slice(vimCol); vimLines[vimRow]=before; vimLines.splice(vimRow+1,0,after); vimRow++; vimCol=0; modified=true; renderVim(); return; }
            if (data==='\x7f'){ if(vimCol>0){vimLines[vimRow]=(vimLines[vimRow]||'').slice(0,vimCol-1)+(vimLines[vimRow]||'').slice(vimCol);vimCol--;modified=true;}renderVim();return;}
            if (data==='\x1b[A'){ vimRow=Math.max(0,vimRow-1);renderVim();return; }
            if (data==='\x1b[B'){ vimRow=Math.min(vimLines.length-1,vimRow+1);renderVim();return; }
            if (data==='\x1b[C'){ vimCol=Math.min((vimLines[vimRow]||'').length,vimCol+1);renderVim();return; }
            if (data==='\x1b[D'){ vimCol=Math.max(0,vimCol-1);renderVim();return; }
            if (data.charCodeAt(0)>=32&&data.length===1){ const l=vimLines[vimRow]||''; vimLines[vimRow]=l.slice(0,vimCol)+data+l.slice(vimCol); vimCol++; modified=true; renderVim(); }
            return;
          }
          // normal mode
          if (data==='i'){ vimMode='insert'; renderVim(); return; }
          if (data==='a'){ vimMode='insert'; vimCol=Math.min((vimLines[vimRow]||'').length,vimCol+1); renderVim(); return; }
          if (data===':'){ vimMode='command'; vimCmd=''; renderVim(); return; }
          if (data==='h'||data==='\x1b[D'){ vimCol=Math.max(0,vimCol-1); renderVim(); return; }
          if (data==='l'||data==='\x1b[C'){ vimCol=Math.min((vimLines[vimRow]||'').length-1,vimCol+1); renderVim(); return; }
          if (data==='k'||data==='\x1b[A'){ vimRow=Math.max(0,vimRow-1); renderVim(); return; }
          if (data==='j'||data==='\x1b[B'){ vimRow=Math.min(vimLines.length-1,vimRow+1); renderVim(); return; }
          if (data==='0'){ vimCol=0; renderVim(); return; }
          if (data==='$'){ vimCol=(vimLines[vimRow]||'').length-1; renderVim(); return; }
          if (data==='G'){ vimRow=vimLines.length-1; renderVim(); return; }
          if (data==='x'){ const l=vimLines[vimRow]||''; vimLines[vimRow]=l.slice(0,vimCol)+l.slice(vimCol+1); modified=true; renderVim(); return; }
          if (data==='dd'){ vimLines.splice(vimRow,1); if(!vimLines.length)vimLines.push(''); vimRow=Math.min(vimRow,vimLines.length-1); modified=true; renderVim(); return; }
        };
      }
    }

    term.onData((data) => {
      // Editor mode
      if (editorHandler) { editorHandler(data); return; }
      // Async running (only Ctrl+C works)
      if (asyncCancel) {
        if (data === '\x03') { asyncCancel(); asyncCancel=null; term.write('^C\r\n'); writePrompt(); }
        return;
      }

      // ── Special keys ──
      if (data === '\r') {
        term.write('\r\n');
        const cmd = inputBuf.trim();
        if (cmd) {
          cmdHistory.push(cmd);
          histIdx = -1; savedInput = '';
          const result = shell.execute(cmd, cmdHistory);
          if (result.type) {
            enterEditor(result);
            inputBuf = ''; cursorPos = 0;
            return;
          }
          if (result.clear) { term.clear(); inputBuf=''; cursorPos=0; writePrompt(); return; }
          if (result.async) {
            // Print any initial lines
            (result.out||[]).forEach(l => term.writeln(l));
            asyncCancel = result.asyncFn(
              (line) => term.writeln(line),
              () => { asyncCancel=null; term.write('\r\n'); writePrompt(); }
            );
          } else {
            (result.out||[]).forEach(l => term.writeln(l));
            writePrompt();
          }
        } else {
          writePrompt();
        }
        inputBuf = ''; cursorPos = 0;
        return;
      }

      if (data === '\x7f') { // Backspace
        if (cursorPos > 0) {
          inputBuf = inputBuf.slice(0,cursorPos-1) + inputBuf.slice(cursorPos);
          cursorPos--;
          redraw();
        }
        return;
      }

      if (data === '\x1b[A') { // Up arrow
        if (histIdx === -1) savedInput = inputBuf;
        if (histIdx < cmdHistory.length-1) {
          histIdx++;
          inputBuf = cmdHistory[cmdHistory.length-1-histIdx];
          cursorPos = inputBuf.length;
          redraw();
        }
        return;
      }

      if (data === '\x1b[B') { // Down arrow
        if (histIdx > 0) {
          histIdx--;
          inputBuf = cmdHistory[cmdHistory.length-1-histIdx];
          cursorPos = inputBuf.length;
          redraw();
        } else if (histIdx === 0) {
          histIdx = -1;
          inputBuf = savedInput;
          cursorPos = inputBuf.length;
          redraw();
        }
        return;
      }

      if (data === '\x1b[D') { // Left
        if (cursorPos > 0) { cursorPos--; term.write('\x1b[D'); }
        return;
      }

      if (data === '\x1b[C') { // Right
        if (cursorPos < inputBuf.length) { cursorPos++; term.write('\x1b[C'); }
        return;
      }

      if (data === '\x1b[H' || data === '\x01') { // Home / Ctrl+A
        const moves = cursorPos; cursorPos=0;
        if (moves>0) term.write(`\x1b[${moves}D`);
        return;
      }

      if (data === '\x1b[F' || data === '\x05') { // End / Ctrl+E
        const moves = inputBuf.length - cursorPos; cursorPos=inputBuf.length;
        if (moves>0) term.write(`\x1b[${moves}C`);
        return;
      }

      if (data === '\x15') { // Ctrl+U - clear to start
        inputBuf = inputBuf.slice(cursorPos); cursorPos=0; redraw(); return;
      }

      if (data === '\x0b') { // Ctrl+K - clear to end
        inputBuf = inputBuf.slice(0, cursorPos); redraw(); return;
      }

      if (data === '\x17') { // Ctrl+W - delete word
        let pos = cursorPos;
        while (pos>0 && inputBuf[pos-1]===' ') pos--;
        while (pos>0 && inputBuf[pos-1]!==' ') pos--;
        inputBuf = inputBuf.slice(0,pos) + inputBuf.slice(cursorPos);
        cursorPos = pos; redraw(); return;
      }

      if (data === '\x03') { // Ctrl+C
        term.write('^C\r\n'); inputBuf=''; cursorPos=0; histIdx=-1; writePrompt(); return;
      }

      if (data === '\x0c') { // Ctrl+L
        term.clear(); term.write(promptStr()+inputBuf);
        const moves = inputBuf.length-cursorPos;
        if (moves>0) term.write(`\x1b[${moves}D`);
        return;
      }

      if (data === '\t') { // Tab completion
        const completions = shell.tabComplete(inputBuf.slice(0,cursorPos));
        if (completions.length===0) return;
        if (completions.length===1) {
          const words = inputBuf.slice(0,cursorPos).split(' ');
          const partial = words[words.length-1];
          const completion = completions[0];
          const suffix = completion.endsWith('/') ? '' : ' ';
          const newInput = inputBuf.slice(0,cursorPos-partial.length) + completion + suffix + inputBuf.slice(cursorPos);
          inputBuf = newInput;
          cursorPos = cursorPos - partial.length + completion.length + suffix.length;
          redraw();
        } else {
          // Show all completions
          const words = inputBuf.slice(0,cursorPos).split(' ');
          const partial = words[words.length-1];
          // Find common prefix
          const common = completions.reduce((acc,c) => {
            let i=0; while(i<acc.length && i<c.length && acc[i]===c[i]) i++;
            return acc.slice(0,i);
          });
          if (common.length > partial.length) {
            const suffix = common.endsWith('/') ? '' : '';
            inputBuf = inputBuf.slice(0,cursorPos-partial.length) + common + inputBuf.slice(cursorPos);
            cursorPos = cursorPos - partial.length + common.length;
          }
          term.write('\r\n');
          // Format completions in columns
          const maxLen = Math.max(...completions.map(c=>c.length)) + 2;
          const cols = Math.max(1, Math.floor(term.cols / maxLen));
          for (let i=0; i<completions.length; i+=cols) {
            term.writeln(completions.slice(i,i+cols).map(c=>c.padEnd(maxLen)).join(''));
          }
          term.write(promptStr()+inputBuf);
          const moves = inputBuf.length-cursorPos;
          if (moves>0) term.write(`\x1b[${moves}D`);
        }
        return;
      }

      // ── Printable characters & paste ──
      if (data.length >= 1 && data.charCodeAt(0) >= 32) {
        inputBuf = inputBuf.slice(0,cursorPos) + data + inputBuf.slice(cursorPos);
        cursorPos += data.length;
        if (cursorPos === inputBuf.length) {
          term.write(data);
        } else {
          redraw();
        }
      }
    });

    writePrompt();
    xtermRef.current = { term, fitAddon };

    const ro = new ResizeObserver(() => {
      try { fitAddon.fit(); } catch(_) {}
    });
    ro.observe(termRef.current);

    return () => {
      ro.disconnect();
      term.dispose();
      xtermRef.current = null;
    };
  }, []);

  return <div className="w-full h-full bg-[#300a24] overflow-hidden" ref={termRef} />;
};

export default Terminal;
