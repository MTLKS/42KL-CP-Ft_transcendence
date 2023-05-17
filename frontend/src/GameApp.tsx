import React, { createContext, useEffect, useMemo, useState } from 'react'
import { GameData } from './game/gameData'
import { AppProvider, Container } from '@pixi/react';
import { Application, ICanvas } from 'pixi.js';
import Game from './game/Game';
import * as PIXI from 'pixi.js';
import { clamp } from 'lodash';

interface GameAppProps {
  pixiApp: Application<ICanvas>;
  gameData: GameData;
}

export let GameDataCtx = createContext<GameData>(undefined as any);

let mouseLastMoveTime: number = 0;

function GameApp(props: GameAppProps) {
  const [scale, setScale] = useState<number>(1);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [usingTicker, setUsingTicker] = useState<boolean>(true);
  const canvas = document.createElement('canvas');

  const { pixiApp, gameData } = props;
  useEffect(() => {
    gameData.setSetShouldRender = setShouldRender;
    gameData.setSetScale = setScale;
    gameData.setSetUsingTicker = setUsingTicker;
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
        <Game shouldRender={shouldRender} scale={scale} usingTicker={usingTicker} />
      </GameDataCtx.Provider>
    </AppProvider>
  )

  function onmousemove(e: MouseEvent) {
    const currentTime = Date.now();
    if (currentTime - mouseLastMoveTime < 14) return;
    mouseLastMoveTime = currentTime;
    const aspectRatio = 16 / 9;
    const clampedWidth = clamp(window.innerWidth, 0, 1600);
    const clampedHeight = clamp(window.innerHeight, 0, 900);
    const newHeight = Math.min(clampedHeight, clampedWidth / aspectRatio);
    const top = (window.innerHeight - newHeight) / 2;
    gameData.updatePlayerPosition(e.clientY - top);
  }
}

export default GameApp