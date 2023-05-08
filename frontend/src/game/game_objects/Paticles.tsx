import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../model/GameModels';
import * as PIXI from 'pixi.js';
import { GameDataCtx } from '../../GameApp';

interface PaticlesProps {
  size: BoxSize;
}

interface Particle {
  x: number;
  y: number;
  opacity: number;
  speed: Offset;
  color: number;
}

const opacity = 1;
let texture1: PIXI.Texture;
let texture2: PIXI.Texture;
let texture3: PIXI.Texture;

function Paticles(props: PaticlesProps) {
  const { size } = props;
  const [particles, setParticles] = useState<Particle[]>([]);
  const app = useApp();
  const gameTick = useContext(GameDataCtx);

  useEffect(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    texture1 = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0x5F928F);
    box.drawRect(0, 0, 2, 2);
    box.endFill();
    texture2 = app.renderer.generateTexture(box);
  }, []);

  useTick((delta) => {
    setParticles((particles) => {
      const newParticle = [...particles]
      newParticle.forEach((p) => {
        if (p.opacity <= 0) {
          newParticle.shift();
        }
        p.opacity -= 0.02;
        if (p.opacity < 0) {
          p.opacity = 0;
        }
        p.x += p.speed.x;
        p.y += p.speed.y;
      });
      const currentPongPosition = gameTick.pongPosition;
      const currentPongSpeed = gameTick.pongSpeed;
      newParticle.push({
        x: currentPongPosition.x - 5 + 20 * Math.random(),
        y: currentPongPosition.y - 5 + 20 * Math.random(),
        opacity: opacity,
        speed: {
          x: currentPongSpeed.y * (Math.random() - 0.5) * 0.3,
          y: currentPongSpeed.x * (Math.random() - 0.5) * 0.3
        },
        color: Math.random() > 0.5 ? 1 : 2
      });


      return newParticle;
    });
  });



  const particleComponent = particles.map((p, i) => {
    return (
      <Sprite key={i} x={p.x} y={p.y} width={size.w} height={size.h} alpha={p.opacity} texture={texture1} />
    )
  });
  return (
    <ParticleContainer properties={{ position: true }}>
      {particleComponent}
    </ParticleContainer>
  )
}

export default Paticles