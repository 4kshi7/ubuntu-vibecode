<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/ab/ab/Logo-ubuntu_cof-orange-hex.svg" alt="Ubuntu Logo" width="100" />
  <h1>Ubuntu GNOME Web Simulation</h1>
  <p>A pixel-perfect, fully interactive Ubuntu GNOME desktop simulation running entirely in your browser.</p>

  [![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg?logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State%20Management-brown.svg)](#)
</div>

## 🌟 About

**Ubuntu Web Simulation** is an OS recreation project capturing the iconic Ubuntu GNOME desktop experience using modern web technologies. Built with React and styled with Tailwind CSS, this project serves as a highly interactive portfolio piece showcasing advanced window management, system applications, and terminal simulation.

## ✨ Features

- **Dynamic Window Management**: True-to-life interactive windows that can be dragged, freely resized, maximized, and minimized (`react-rnd`).
- **Taskbar & Dock**: A stylish GNOME top bar showing a live clock, alongside a meticulously animated application dock powered by `framer-motion`.
- **System Applications**: 
  - 💻 **Terminal**: Authentic Unix terminal emulator using `xterm.js` that responds to real commands (`ls`, `mkdir`, `echo`, `pwd`, `whoami`, `clear`).
  - 🦊 **Firefox**: A functional built-in iframe browser for web surfing inside the OS sandbox.
  - ⚙️ **Settings**: Easily change background wallpapers, system UI colors, and toggle simulated OS configurations.
  - 📁 **Files**: An interface to browse simulated system files and folder locations.
- **Global State Control**: Robust Z-indexing, focus tracking, and global settings managed by highly-optimized `Zustand` stores.
- **Lock Screen authentication**: Authentic Ubuntu boot-and-login authentication screen.

## 🚀 Tech Stack

- **Core:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Window Behaviors:** [react-rnd](https://github.com/bokuweb/react-rnd)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Terminal Shell:** [Xterm.js](https://xtermjs.org/) + [xterm-addon-fit](https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-fit)

## 🛠️ Local Development

Follow these steps to boot up your own instance locally:

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ubuntu-web-simulation.git
cd ubuntu-web-simulation

# 2. Install all required dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Finally, open the provided localhost URL (e.g., `http://localhost:5173/`) in your browser to experience the desktop.

## 📸 Overview

*(Tip: Swap out these placeholders with your actual application screenshots!)*

| Ubuntu Desktop Interface | Interactive XTerminal |
| :---: | :---: |
| ![Desktop](https://via.placeholder.com/600x350.png?text=Add+Desktop+Screenshot+Here) | ![Terminal](https://via.placeholder.com/600x350.png?text=Add+Terminal+Screenshot+Here) |

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. 
