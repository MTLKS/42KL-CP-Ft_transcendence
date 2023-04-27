import React, { useCallback, useEffect, useState } from 'react'
import { BoxSize, Offset } from '../../modal/GameModels';
import { Container, Graphics, PixiComponent, Sprite, useTick, withFilters, } from '@pixi/react';
import * as PIXI from 'pixi.js';
import sleep from '../../functions/sleep';


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
    instance.lineStyle(2, 0xFEF8E2, opacity);
    instance.drawCircle(position.x, position.y, r);
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

let rings: Ring[] = [];

function RippleEffect(props: RippleEffectProps) {
  const { position, size } = props;
  const addRing = useCallback(async () => {

    for (let i = 0; i < 3; i++) {
      rings.push({
        position: {
          x: position.x,
          y: position.y
        },
        r: 10,
        opacity: 0.5
      });
      await sleep(100);
    }

  }, [position]);

  useEffect(() => {


    addRing();
  }, [position]);

  useTick((delta) => {
    if (rings.length === 0) return;
    rings.forEach((item) => {
      if (item.opacity <= 0) {
        rings.shift();
      }
      item.r += 3 * delta;
      item.opacity -= 0.01 * delta;
    });
  });
  const ringComponent = rings.map((item, i) => <Ring key={i} position={item.position} r={item.r} opacity={item.opacity} />);

  return (
    <Container>
      {ringComponent}
    </Container>
  )
}
export default RippleEffect