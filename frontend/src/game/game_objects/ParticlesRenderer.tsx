import * as PIXI from 'pixi.js';
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import GameParticle from '../../model/GameParticle';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GameDataCtx } from '../../GameApp';
import { GameBlackhole } from '../../model/GameEntities';
import Worker from '../../workers/gameGraphic.worker?worker'

const gameGraphicWorker = new Worker();

function ParticlesRenderer() {
  const [particles, setParticles] = useState<GameParticle[]>([]);
  const app = useApp();
  const gameData = useContext(GameDataCtx);

  const textures = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2, 0.8);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const white = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0x5F928F, 0.8);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const cyan = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0xC5A1FF, 0.6);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const texture3 = app.renderer.generateTexture(box);

    return [white, cyan, texture3];
  }, []);

  useTick((delta) => {
    gameGraphicWorker.postMessage({ type: 'pongPosition', value: gameData.pongPosition });
    gameGraphicWorker.postMessage({ type: 'pongSpeed', value: gameData.pongSpeed });
    gameGraphicWorker.postMessage({ type: 'gameEntities', value: gameData.gameEntities });
  }, true);

  useEffect(() => {
    gameGraphicWorker.onmessage = (e) => {
      const { type, value } = e.data;
      if (type === 'gameParticles') {
        setParticles(value);
      }
    }
    gameGraphicWorker.postMessage({ type: 'start' });
    return () => gameGraphicWorker.postMessage({ type: 'stop' });
  }, []);

  const trailElements: JSX.Element[] = [];
  const whiteElements: JSX.Element[] = [];
  const cyanElements: JSX.Element[] = [];
  const purpleElements: JSX.Element[] = [];

  particles.forEach((p) => {
    const { id, x, y, w, h, opacity, colorIndex, gravity } = p;
    if (colorIndex === 0 && gravity) {
      whiteElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    } else if (colorIndex === 1) {
      cyanElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    } else if (!gravity) {
      trailElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    } else {
      purpleElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    }
  });

  return (
    <>
      <ParticleContainer properties={{ position: true, scale: true }}>
        {trailElements}
      </ParticleContainer>
      <ParticleContainer properties={{ position: true }}>
        {cyanElements}
      </ParticleContainer>
      <ParticleContainer properties={{ position: true }}>
        {whiteElements}
      </ParticleContainer>
      <ParticleContainer properties={{ position: true }}>
        {purpleElements}
      </ParticleContainer>
    </>
  )
}

export default ParticlesRenderer