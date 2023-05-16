import * as PIXI from 'pixi.js';
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import GameParticle, { GameLightningParticle } from '../../model/GameParticle';
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GameDataCtx } from '../../GameApp';
import { GameBlackhole } from '../../model/GameEntities';
import Worker from '../../workers/gameGraphic.worker?worker'

// const gameGraphicWorker = new Worker();

interface ParticlesRendererProps {
  particles: GameParticle[];
  lightningParticles: GameLightningParticle[];
}
function ParticlesRenderer(props: ParticlesRendererProps) {
  // const [particles, setParticles] = useState<GameParticle[]>([]);
  const { particles, lightningParticles } = props;
  const app = useApp();

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
    const purple = app.renderer.generateTexture(box);
    box.clear();
    box.lineStyle(6, 0x5F928F);
    box.moveTo(-2, 0);
    box.lineTo(4, 20);
    box.lineTo(-8, 30);
    box.lineTo(2, 46);
    box.lineTo(-2, 60);
    box.lineStyle(6, 0x5F928F);
    box.moveTo(2, 0);
    box.lineTo(8, 20);
    box.lineTo(-4, 30);
    box.lineTo(6, 46);
    box.lineTo(2, 60);
    box.lineStyle(4, 0xffffff, 0.5);
    box.moveTo(0, 0);
    box.lineTo(6, 20);
    box.lineTo(-6, 30);
    box.lineTo(4, 46);
    box.lineTo(0, 60);
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

  const trailElementsRef = useRef<JSX.Element[]>([]);
  const whiteElementsRef = useRef<JSX.Element[]>([]);
  const cyanElementsRef = useRef<JSX.Element[]>([]);
  const purpleElementsRef = useRef<JSX.Element[]>([]);
  const lightningElementsRef = useRef<JSX.Element[]>([]);
  useEffect(() => {
    const trailElements: JSX.Element[] = trailElementsRef.current;
    const whiteElements: JSX.Element[] = whiteElementsRef.current;
    const cyanElements: JSX.Element[] = cyanElementsRef.current;
    const purpleElements: JSX.Element[] = purpleElementsRef.current;
    const lightningElements: JSX.Element[] = lightningElementsRef.current;
    trailElements.length = 0;
    whiteElements.length = 0;
    cyanElements.length = 0;
    purpleElements.length = 0;
    lightningElements.length = 0;

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
    lightningParticles.forEach((lightning) => {
      lightning.particles.forEach((p) => {
        const { id, x, y, w, h, colorIndex, rotRad, opacity } = p;
        lightningElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} anchor={new PIXI.Point(0.5, 0)} rotation={rotRad} alpha={opacity} texture={textures[colorIndex]} />);
      });
    });
  }, [particles, lightningParticles]);




  return (
    <>
      <ParticleContainer key={"trailParticles"} properties={{ position: true, scale: true, alpha: true }}>
        {trailElementsRef.current}
      </ParticleContainer>
      <ParticleContainer key={"cyanParticles"} properties={{ position: true, alpha: true }}>
        {cyanElementsRef.current}
      </ParticleContainer>
      <ParticleContainer key={"whiteParticles"} properties={{ position: true, alpha: true }}>
        {whiteElementsRef.current}
      </ParticleContainer>
      <ParticleContainer key={"purpleParticles"} properties={{ position: true, alpha: true }}>
        {purpleElementsRef.current}
      </ParticleContainer>
      <ParticleContainer key={"lightningParticles"} properties={{ position: true, scale: true, alpha: true, rotation: true }}>
        {lightningElementsRef.current}
      </ParticleContainer>
    </>
  )
}

export default ParticlesRenderer