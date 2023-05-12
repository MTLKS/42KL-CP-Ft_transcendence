import * as PIXI from 'pixi.js';
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import GameParticle from '../../model/GameParticle';
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { GameDataCtx } from '../../GameApp';
import { GameBlackhole } from '../../model/GameEntities';
import Worker from '../../workers/gameGraphic.worker?worker'

// const gameGraphicWorker = new Worker();

interface ParticlesRendererProps {
  particles: GameParticle[];
  lightningParticles: GameParticle[][];
}
function ParticlesRenderer(props: ParticlesRendererProps) {
  // const [particles, setParticles] = useState<GameParticle[]>([]);
  const { particles, lightningParticles } = props;
  const app = useApp();

  const textures = useMemo(() => {
    const box = new PIXI.Graphics();
    const container = new PIXI.Container();
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
    const purple = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0xffffff, 0);
    box.drawRect(-5, 0, 10, 30);
    box.endFill();
    box.lineStyle(2, 0x5F928F);
    box.moveTo(-1, 0);
    box.lineTo(2, 10);
    box.lineTo(-4, 15);
    box.lineTo(1, 23);
    box.lineTo(-1, 30);
    box.lineStyle(2, 0x5F928F);
    box.moveTo(1, 0);
    box.lineTo(4, 10);
    box.lineTo(-2, 15);
    box.lineTo(3, 23);
    box.lineTo(1, 30);
    box.lineStyle(2, 0xffffff, 0.7);
    box.moveTo(0, 0);
    box.lineTo(3, 10);
    box.lineTo(-3, 15);
    box.lineTo(2, 23);
    box.lineTo(0, 30);
    const lightning = app.renderer.generateTexture(box);
    box.destroy();
    return [white, cyan, purple, lightning];
  }, []);

  // useTick((delta) => {
  //   gameGraphicWorker.postMessage({ type: 'pongPosition', value: gameData.pongPosition });
  //   gameGraphicWorker.postMessage({ type: 'pongSpeed', value: gameData.pongSpeed });
  //   gameGraphicWorker.postMessage({ type: 'gameEntities', value: gameData.gameEntities });
  // }, true);

  // useEffect(() => {
  //   gameGraphicWorker.onmessage = (e) => {
  //     const { type, value } = e.data;
  //     if (type === 'gameParticles') {
  //       setParticles(value);
  //     }
  //   }
  //   gameGraphicWorker.postMessage({ type: 'start' });
  //   return () => gameGraphicWorker.postMessage({ type: 'stop' });
  // }, []);


  const { trailElements, whiteElements, cyanElements, purpleElements, lightningElements } = useMemo(() => {

    const trailElements: JSX.Element[] = [];
    const whiteElements: JSX.Element[] = [];
    const cyanElements: JSX.Element[] = [];
    const purpleElements: JSX.Element[] = [];
    const lightningElements: JSX.Element[] = [];

    particles.forEach((p) => {
      const { id, x, y, w, h, opacity, colorIndex, gravity } = p;
      if (colorIndex === 0 && gravity) {
        whiteElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
      } else if (colorIndex === 1) {
        cyanElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
      } else if (!gravity) {
        trailElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
      } else {
        purpleElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={1} texture={textures[colorIndex]} />);
      }
    });
    lightningParticles.forEach((lightning) => {
      lightning.forEach((p) => {
        const { id, x, y, w, h, colorIndex, rotRad } = p;
        lightningElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} anchor={new PIXI.Point(0.5, 0)} rotation={rotRad} alpha={1} texture={textures[colorIndex]} />);
      });
    });
    return { trailElements, whiteElements, cyanElements, purpleElements, lightningElements };
  }, [particles]);


  return (
    <>
      <ParticleContainer key={"trailParticles"} properties={{ position: true, scale: true, alpha: true }}>
        {trailElements}
      </ParticleContainer>
      <ParticleContainer key={"cyanParticles"} properties={{ position: true, alpha: true }}>
        {cyanElements}
      </ParticleContainer>
      <ParticleContainer key={"whiteParticles"} properties={{ position: true, alpha: true }}>
        {whiteElements}
      </ParticleContainer>
      <ParticleContainer key={"purpleParticles"} properties={{ position: true, alpha: true }}>
        {purpleElements}
      </ParticleContainer>
      <ParticleContainer key={"lightningParticles"} properties={{ position: true, scale: true, alpha: true, rotation: true }}>
        {lightningElements}
      </ParticleContainer>
    </>
  )
}

export default ParticlesRenderer