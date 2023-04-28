import React, { useCallback, useEffect, useState } from 'react'
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';

interface SpitsProps {
  position: Offset
  size: BoxSize;
  speed: Offset;
  color: number;
}

interface Particle {
  x: number;
  y: number;
  opacity: number;
  speed: Offset;
}

const opacity = 1;
let texture1: PIXI.Texture;
let texture2: PIXI.Texture;

function Spits(props: SpitsProps) {
  const { position, size, speed, color } = props;
  const [particles, setParticles] = useState<Particle[]>([]);
  const app = useApp();

  useEffect(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2, 0.8);
    box.drawRect(0, 0, 8, 8);
    box.endFill();
    texture1 = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0x5F928F, 0.8);
    box.drawRect(0, 0, 8, 8);
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
        // p.speed.x -= p.speed.x * 0.5;
        // p.speed.y -= p.speed.y * 0.5;
        p.speed.x *= 0.95;
        p.speed.y *= 0.95;
      });
      for (let i = 0; i < 3; i++) {
        const val = + (Math.random() - 0.5) * 2;
        const speedFactor = 1.5;
        let x: number;
        let y: number;
        if (speed.y < 0 && speed.x < 0) { x = speed.x * speedFactor + val; y = speed.y * speedFactor - val; }
        else if (speed.y > 0 && speed.x > 0) { x = speed.x * speedFactor - val; y = speed.y * speedFactor + val; }
        else { x = speed.x * speedFactor - val; y = speed.y * speedFactor - val; }

        newParticle.push({
          x: position.x + 5,
          y: position.y + 5,
          opacity: opacity,
          speed: {
            x: x,
            y: y
          },
        });
      }


      return newParticle;
    });
  });



  const particleComponent = particles.map((p, i) => {
    return (
      <Sprite key={i} x={p.x} y={p.y} width={size.w} height={size.h} alpha={p.opacity} texture={color === 1 ? texture2 : texture1} />
    )
  });
  return (
    <ParticleContainer properties={{ position: true }}>
      {particleComponent}
    </ParticleContainer>
  )
}

export default Spits