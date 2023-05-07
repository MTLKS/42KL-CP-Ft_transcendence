import * as PIXI from 'pixi.js';
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import GameParticle from '../../model/GameParticle';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GameDataCtx } from '../../GameApp';

function ParticlesRenderer() {
  const [particles, setParticles] = useState<GameParticle[]>([]);
  const app = useApp();
  const gameData = useContext(GameDataCtx);

  const textures = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const texture1 = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0x5F928F);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const texture2 = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0x5F928F);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    const texture3 = app.renderer.generateTexture(box);

    return [texture1, texture2, texture3];
  }, []);

  useTick((delta) => {
    const newParticle = [...particles];
    newParticle.forEach((particle) => {
      if (particle.opacity <= 0) {
        newParticle.shift();
        // newParticle.splice(newParticle.indexOf(particle), 1);
      }
      particle.opacity -= 0.02;
      particle.update();
    });
    const currentPongPosition = gameData.pongPosition;
    const currentPongSpeed = gameData.pongSpeed;
    newParticle.push(new GameParticle({
      x: currentPongPosition.x - 5 + 20 * Math.random(),
      y: currentPongPosition.y - 5 + 20 * Math.random(),
      opacity: 1,
      vx: currentPongSpeed.x * (Math.random() - 0.5) * 0.3,
      vy: currentPongSpeed.y * (Math.random() - 0.5) * 0.3,
    }));
    for (let i = 0; i < 2; i++) {
      newParticle.push(new GameParticle({
        x: currentPongPosition.x + 5 - 10 / 2,
        y: currentPongPosition.y + 5 - 10 / 2,
        opacity: 1,
        vx: currentPongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
        vy: currentPongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
      }));
    }
    setParticles(newParticle);
  }, true);

  const particleElements = particles.map((p) => {
    const { id, x, y, w, h, opacity } = p;
    return (
      <Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[0]} />
    )
  });

  return (
    <ParticleContainer properties={{ position: true }}>
      {particleElements}
    </ParticleContainer>
  )
}

export default ParticlesRenderer