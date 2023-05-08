import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../model/GameModels';
import * as PIXI from 'pixi.js';
import { GameDataCtx } from '../../GameApp';

interface SpitsProps {
  size: BoxSize;
  color: number;
}

interface Particle {
  x: number;
  y: number;
  opacity: number;
  speed: Offset;
}

const opacity = 1;

const speedFactor = 1.5;

function Spits(props: SpitsProps) {
  const { size, color } = props;
  const app = useApp();
  const { texture1, texture2, texture3 } = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2, 0.8);
    box.drawRect(0, 0, 8, 8);
    box.endFill();
    const texture1 = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0x5F928F, 0.8);
    box.drawRect(0, 0, 8, 8);
    box.endFill();
    const texture2 = app.renderer.generateTexture(box);
    box.clear();
    box.beginFill(0xAD6454, 0.8);
    box.drawRect(0, 0, 8, 8);
    box.endFill();
    const texture3 = app.renderer.generateTexture(box);
    return { texture1, texture2, texture3 }
  }, []);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [texture, setTexture] = useState<PIXI.Texture>(texture1);
  const gameTick = useContext(GameDataCtx);



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
      const currentPongPosition = gameTick.pongPosition;
      const currentPongSpeed = gameTick.pongSpeed;
      for (let i = 0; i < 2; i++) {
        newParticle.push({
          x: currentPongPosition.x + 5 - size.w / 2,
          y: currentPongPosition.y + 5 - size.h / 2,
          opacity: opacity,
          speed: {
            x: currentPongSpeed.x * speedFactor + (Math.random() - 0.5) * 3,
            y: currentPongSpeed.y * speedFactor + (Math.random() - 0.5) * 3
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