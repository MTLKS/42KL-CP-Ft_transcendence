import React, { useCallback, useEffect, useState } from 'react'
import { BoxSize, Offset } from '../../modal/GameModels';
import { Container, Graphics, PixiComponent, Sprite, useTick, withFilters, } from '@pixi/react';
import * as PIXI from 'pixi.js';


interface RingProps {
  position: Offset
  r: number;
  opacity: number;
}

const Ring = PixiComponent<RingProps, PIXI.Graphics>('RippleEffect', {
  create: (props) => {
    return new PIXI.Graphics();
  },
  applyProps: (instance, _, props) => {
    const { position, r, opacity } = props;

    instance.clear();
    instance.beginFill(0xFEF8E2, opacity);
    instance.drawCircle(position.x, position.y, r);
    instance.endFill();
    instance.beginHole();
    instance.drawCircle(position.x, position.y, r - 3);
    instance.endHole();


  },
});

interface Ring {
  position: Offset
  r: number;
  opacity: number;
}

interface RippleEffectProps {
  position: Offset
  size: BoxSize;
}

function RippleEffect(props: RippleEffectProps) {
  const { position, size } = props;
  const [rings, setRings] = useState<Ring[]>([]);
  useEffect(() => {
    const newRings = [];
    for (let i = 0; i < 3; i++) {
      newRings.push({
        position: {
          x: position.x,
          y: position.y
        },
        r: 10,
        opacity: 1
      });
    }
    setRings(newRings);
  }, []);

  useTick((delta) => {
    setRings((rings) => {
      const newRings = [...rings];
      newRings.forEach((item) => {
        if (item.opacity <= 0) {
          newRings.shift();
        }
        item.r += 3 * delta;
        item.opacity -= 0.05 * delta;
      });

      return newRings;
    });
  });
  const ringComponent = rings.map((item, i) => {

    return (
      <Ring key={i} position={item.position} r={item.r} opacity={item.opacity} />
    )
  });

  return (
    <Container>
      {ringComponent}
    </Container>
  )
}
export default RippleEffect