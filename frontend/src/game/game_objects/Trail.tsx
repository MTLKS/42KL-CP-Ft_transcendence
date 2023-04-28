import React, { useCallback, useEffect, useState } from 'react'
import { Graphics, ParticleContainer, PixiComponent, Sprite, render, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';
interface TrailProps {
  position: Offset
  size: BoxSize;
  speed: Offset;
}

interface Particle {
  position: Offset;
  opacity: number;
  speed: Offset;
  size: BoxSize;
}

const opacity = 1;
let texture: PIXI.Texture;
let tickCount = 0;

function Trail(props: TrailProps) {
  const { position, size, speed } = props;
  const [particles, setParticles] = useState<Particle[]>([]);
  const app = useApp();

  useEffect(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2, 0.5);
    // box.beginFill(0x5F928F, 0.5);
    box.drawRect(0, 0, 15, 15);
    box.endFill();
    texture = app.renderer.generateTexture(box);
  }, []);

  useTick((delta) => {
    setParticles((particles) => {
      const newParticle = [...particles]
      newParticle.forEach((p) => {
        if (p.opacity <= 0) {
          newParticle.shift();
        }
        p.opacity -= 0.03;
        p.size.w -= 0.3;
        p.size.h -= 0.3;
        p.position.x += 0.12;
        p.position.y += 0.12;
        if (p.opacity < 0) {
          p.opacity = 0;
        }
        p.position.x += p.speed.x;
        p.position.y += p.speed.y;
      });

      newParticle.push({
        position: {
          x: position.x,
          y: position.y,
        },
        opacity: opacity,
        speed: {
          x: 0,
          y: 0
        },
        size: {
          w: size.w,
          h: size.h
        }
      });


      return newParticle;
    });
  });

  const particleComponent = particles.map((p, i) => {
    return (
      <Sprite key={i} x={p.position.x} y={p.position.y} width={p.size.w} height={p.size.h} alpha={p.opacity} texture={texture} />
    )
  });
  return (
    <ParticleContainer properties={{ position: true, scale: true }} >
      {particleComponent}
    </ParticleContainer>
  )
}

export default Trail