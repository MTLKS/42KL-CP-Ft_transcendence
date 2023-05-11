import React, { createContext, useEffect, useMemo, useState } from 'react'
import { GameData } from './game/gameData'
import { AppProvider, Container } from '@pixi/react';
import { Application, ICanvas } from 'pixi.js';
import Game from './game/Game';
import * as PIXI from 'pixi.js';

interface GameAppProps {
  pixiApp: Application<ICanvas>;
  gameData: GameData;
}

export let GameDataCtx = createContext<GameData>(undefined as any);

let mouseLastMoveTime: number = 0;

function GameApp(props: GameAppProps) {
  const [scale, setScale] = useState<number>(1);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const canvas = document.createElement('canvas');

  const { pixiApp, gameData } = props;
  useEffect(() => {
    gameData.setSetShouldRender = setShouldRender;
    gameData.setSetScale = setScale;
    pixiApp.stage.eventMode = "static";
    pixiApp.stage.hitArea = new PIXI.Rectangle(0, 0, 1600, 900);
    pixiApp.stage.on('mousemove', onmousemove);
    return () => {
      gameData.endGame();
      pixiApp.stage.off('mousemove', onmousemove);
    }
  }, []);
  return (
    <AppProvider value={pixiApp}>
      <GameDataCtx.Provider value={gameData}>
        <Game shouldRender={shouldRender} scale={scale} />
      </GameDataCtx.Provider>
    </AppProvider>
  )

  function onmousemove(e: MouseEvent) {
    const currentTime = Date.now();
    if (currentTime - mouseLastMoveTime < 14) return;
    mouseLastMoveTime = currentTime;
    const { top } = canvas.getBoundingClientRect();
    gameData.updatePlayerPosition(e.clientY - top);
  }
}

export default GameApp