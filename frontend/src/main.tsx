import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { AppProvider, createRoot, Text } from '@pixi/react';
import { Application } from 'pixi.js';
import Game from './game/Game';

import { GameTick } from './game/gameTick';
import GameApp from './GameApp';

const reactApp = document.getElementById('root') as HTMLElement
const reactRoot = ReactDOM.createRoot(reactApp)
reactRoot.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
)

export const gameTick = new GameTick();
const pixiApp = new Application({
  width: 1600,
  height: 900,
  sharedTicker: true,
  autoDensity: true,
  backgroundColor: 0x242424,
  view: document.getElementById('pixi') as HTMLCanvasElement,
  antialias: true,
});
window.addEventListener('mousemove', (e) => {
  gameTick.updatePlayerPosition(e.clientY);
});

const pixiRoot = createRoot(pixiApp.stage);
pixiRoot.render(<GameApp pixiApp={pixiApp} gameTick={gameTick} />);
