import React, { useCallback, useEffect, useState } from 'react'
import { Graphics, ParticleContainer, PixiComponent, Sprite, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';

interface PaticlesProps {
  position: Offset
  size: BoxSize;
  speed: Offset;
}

interface Particle {
  x: number;
  y: number;
  opacity: number;
  speed: Offset;
}

let opacity = 1;


function Paticles(props: PaticlesProps) {
  const { position, size, speed } = props;
  const [particles, setParticles] = useState<Particle[]>([]);

  useTick((delta) => {
    setParticles((particles) => {
      const newParticle = [...particles]
      newParticle.forEach((p) => {
        if (p.opacity <= 0) {
          newParticle.shift();
        }
        p.opacity -= 0.001;
        if (p.opacity < 0) {
          p.opacity = 0;
        }
        p.x += p.speed.x;
        p.y += p.speed.y;
      });
      newParticle.push({
        x: position.x - 5 + 20 * Math.random(),
        y: position.y - 5 + 20 * Math.random(),
        opacity: opacity,
        speed: {
          x: speed.y * (Math.random() - 0.5) * 0.3,
          y: speed.x * (Math.random() - 0.5) * 0.3
        }
      });


      return newParticle;
    });
  });



  const particleComponent = particles.map((p, i) => {
    return (
      <Sprite key={i} x={p.x} y={p.y} width={size.w} height={size.h} alpha={p.opacity} texture={PIXI.Texture.WHITE} />
    )
  });
  return (
    <ParticleContainer properties={{ position: true }}>
      {particleComponent}
    </ParticleContainer>
  )
}

export default Paticles