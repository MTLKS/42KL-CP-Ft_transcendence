import * as PIXI from 'pixi.js';
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import GameParticle from '../../model/GameParticle';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GameDataCtx } from '../../GameApp';

const position = { x: 800, y: 450 }

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
    box.beginFill(0x5F928F, 0.8);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const texture3 = app.renderer.generateTexture(box);

    return [white, cyan, texture3];
  }, []);

  useTick((delta) => {
    const newParticle = [...particles];
    newParticle.forEach((particle) => {
      if (particle.opacity <= 0) {
        // newParticle.shift();
        newParticle.splice(newParticle.indexOf(particle), 1);
      }
      particle.setGravityAccel(position.x, position.y, 2)
      particle.update();
    });
    const currentPongPosition = gameData.pongPosition;
    const currentPongSpeed = gameData.pongSpeed;
    newParticle.push(new GameParticle({
      x: currentPongPosition.x - 5 + 20 * Math.random(),
      y: currentPongPosition.y - 5 + 20 * Math.random(),
      opacity: 1,
      opacityDecay: 0.02,
      vx: currentPongSpeed.y * (Math.random() - 0.5) * 0.3,
      vy: currentPongSpeed.x * (Math.random() - 0.5) * 0.3,
      w: 3,
      h: 3,
    }));
    for (let i = 0; i < 2; i++) {
      newParticle.push(new GameParticle({
        x: currentPongPosition.x + 5 - 10 / 2,
        y: currentPongPosition.y + 5 - 10 / 2,
        opacity: 0.8,
        opacityDecay: 0.02,
        vx: currentPongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
        vy: currentPongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
        w: 5,
        h: 5,
        speedDecayFactor: 0.95,
      }));
    }
    for (let i = 0; i < 2; i++) {
      newParticle.push(new GameParticle({
        x: currentPongPosition.x + 5 - 10 / 2,
        y: currentPongPosition.y + 5 - 10 / 2,
        opacity: 1,
        opacityDecay: 0.02,
        vx: currentPongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
        vy: currentPongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
        w: 10,
        h: 10,
        speedDecayFactor: 0.95,
        colorIndex: 1,
      }));
    }


    var x = position.x + (Math.random() > 0.2 ? 1 : -1) * 30 + 30 * (Math.random() - 0.5);
    var y = position.y + (Math.random() > 0.5 ? 1 : -1) * 30 + 30 * (Math.random() - 0.5);
    newParticle.push(new GameParticle({
      x: x,
      y: y,
      opacity: 1,
      vx: (position.x - x) / 10 + 7,
      vy: (y - position.y) / 10 + (Math.random() > 0.5 ? 1 : -1),
      opacityDecay: 0.005
    }))

    setParticles(newParticle);
  }, true);

  const whiteElements: JSX.Element[] = [];
  const cyanElements: JSX.Element[] = [];
  const purpleElements: JSX.Element[] = [];

  particles.forEach((p) => {
    const { id, x, y, w, h, opacity, colorIndex } = p;
    if (colorIndex === 0) {
      whiteElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    } else if (colorIndex === 1) {
      cyanElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    } else {
      purpleElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
    }
  });

  return (
    <>
      <ParticleContainer properties={{ position: true, }}>
        {cyanElements}
      </ParticleContainer>
      <ParticleContainer properties={{ position: true, }}>
        {whiteElements}
      </ParticleContainer>
      <ParticleContainer properties={{ position: true, }}>
        {purpleElements}
      </ParticleContainer>
    </>
  )
}

export default ParticlesRenderer