import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Container, Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';

let texture1: PIXI.Texture;
let texture2: PIXI.Texture;
let texture3: PIXI.Texture;
let blackHoleTexture: PIXI.Texture;

interface Particle {
  x: number;
  y: number;
  opacity: number;
  speed: Offset;
}

interface BlackholeProps {
  position: Offset
  size: BoxSize;
  acceleration: number;
}

function Blackhole(props: BlackholeProps) {
  const { position, size, acceleration } = props;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [texture, setTexture] = useState<PIXI.Texture>(texture1);
  const [blackHole, setBlackHole] = useState<PIXI.Texture>(blackHoleTexture);
  const app = useApp();

  useLayoutEffect(() => {
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
    box.clear();
    box.beginFill(0xFEF8E2, 0.4);
    box.drawCircle(0, 0, 20);
    box.endFill();
    blackHoleTexture = app.renderer.generateTexture(box);
    setTexture(texture1);
    setBlackHole(blackHoleTexture);
  }, []);

  useTick((delta) => {
    setParticles((particles) => {
      const newParticle = [...particles]
      newParticle.forEach((p) => {
        if (p.opacity <= 0) {
          newParticle.shift();
        }
        p.opacity -= 0.005;
        if (p.opacity < 0) {
          p.opacity = 0;
        }
        if (p.x > position.x - 5 && p.x < position.x + 5 && p.y > position.y - 5 && p.y < position.y + 5) {
          p.opacity = 0;
        }

        p.x += p.speed.x;
        p.y += p.speed.y;
        // p.speed.x -= p.speed.x * 0.5;
        // p.speed.y -= p.speed.y * 0.5;
        p.speed.x += (position.x - p.x) * acceleration * 0.001;
        p.speed.y += (position.y - p.y) * acceleration * 0.001;
      });
      for (let i = 0; i < 2; i++) {
        var x = position.x + (Math.random() > 0.5 ? 1 : -1) * 60 + 30 * (Math.random() - 0.5);
        var y = position.y + (Math.random() > 0.5 ? 1 : -1) * 60 + 30 * (Math.random() - 0.5);
        newParticle.push({
          x: x,
          y: y,
          opacity: 1,
          speed: {
            x: (position.x - x) / 10 + 7 * (Math.random() - 0.5),
            y: (y - position.y) / 10 + 7 * (Math.random() - 0.5)
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
    <>
      <ParticleContainer properties={{ position: true }} maxSize={1000}>
        {particleComponent}
      </ParticleContainer>
      {blackHole && <Sprite x={position.x - 25} y={position.y - 25} width={50} height={50} texture={blackHole} />}
    </>

  )
}

export default Blackhole