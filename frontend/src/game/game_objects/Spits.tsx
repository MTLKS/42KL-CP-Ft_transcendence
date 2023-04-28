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
let texture3: PIXI.Texture;
const speedFactor = 1.5;
let texture: PIXI.Texture;

function Spits(props: SpitsProps) {
  const { position, size, speed, color } = props;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [texture, setTexture] = useState<PIXI.Texture>(texture1);
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
    box.clear();
    box.beginFill(0xAD6454, 0.8);
    box.drawRect(0, 0, 8, 8);
    box.endFill();
    texture3 = app.renderer.generateTexture(box);

  }, []);

  useEffect(() => {
    switch (color) {
      case 0:
        setTexture(texture1);
        break;
      case 1:
        setTexture(texture2);
        break;
      case 2:
        setTexture(texture3);
        break;
      default:
        break;
    }
  }, [color]);

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
      for (let i = 0; i < 2; i++) {
        newParticle.push({
          x: position.x + 5 - size.w / 2,
          y: position.y + 5 - size.h / 2,
          opacity: opacity,
          speed: {
            x: speed.x * speedFactor + (Math.random() - 0.5) * 3,
            y: speed.y * speedFactor + (Math.random() - 0.5) * 3
          },
        });
      }


      return newParticle;
    });
  });



  const particleComponent = particles.map((p, i) => {
    return (
      <Sprite key={i} x={p.x} y={p.y} width={size.w} height={size.h} alpha={p.opacity} texture={texture} />
    )
  });
  return (
    <ParticleContainer properties={{ position: true }}>
      {particleComponent}
    </ParticleContainer>
  )
}

export default Spits