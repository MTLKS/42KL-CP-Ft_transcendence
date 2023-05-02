import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { AppProvider, createRoot, Text } from '@pixi/react';
import { Application } from 'pixi.js';
import GameStage, { GameTickCtx } from './game/GameStage';
import Game from './game/Game';

import { GameTick } from './game/gameTick';

const reactApp = document.getElementById('root') as HTMLElement
const reactRoot = ReactDOM.createRoot(reactApp)
reactRoot.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
)


const gameTick = new GameTick();

const pixiApp = new Application({
  width: 1600,
  height: 900,
  backgroundColor: 0x242424,
  view: document.getElementById('pixi') as HTMLCanvasElement,
});
window.addEventListener('mousemove', (e) => {
  gameTick.updatePlayerPosition(e.clientY);
});

const pixiRoot = createRoot(pixiApp.stage);
pixiRoot.render(
  <AppProvider value={pixiApp}>
    <GameTickCtx.Provider value={gameTick}>
      <Game pause={false} scale={1} />
    </GameTickCtx.Provider>
  </AppProvider>
);
