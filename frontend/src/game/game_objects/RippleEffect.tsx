import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BoxSize, Offset } from '../../modal/GameModels';
import { Container, Graphics, PixiComponent, Sprite, useTick, withFilters, } from '@pixi/react';
import * as PIXI from 'pixi.js';
import sleep from '../../functions/sleep';
import { GameTickCtx } from '../GameStage';


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
  stageSize: BoxSize;

}

const blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter(2);
const displacementFilter: PIXI.DisplacementFilter = new PIXI.DisplacementFilter(
  PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/pixi-filters/displacement_map_repeat.jpg'),
  100,
);

function RippleEffect(props: RippleEffectProps) {
  const { stageSize } = props;
  const [rings, setRings] = useState<Ring[]>([]);
  const gameTick = useContext(GameTickCtx);
  const addRing = useCallback(async () => {
    const newRings: Ring[] = [...rings];
    const hitPosition = gameTick.pongPosition;
    for (let i = 0; i < 3; i++) {
      newRings.push({
        position: hitPosition,
        r: 10,
        opacity: 0.8
      });
      setRings(newRings);
      await sleep(100);
    }
  }, [gameTick.pongPosition]);

  useTick((delta) => {
    if (gameTick.pongPosition.x <= 0 || gameTick.pongPosition.y <= 0) addRing();
    if (gameTick.pongPosition.x >= stageSize.w - 10 || gameTick.pongPosition.y >= stageSize.h - 10) addRing();
    if (rings.length === 0) return;
    setRings((rings) => {
      const newRings = [...rings];
      newRings.forEach((item) => {
        if (item.opacity <= 0) {
          newRings.shift();
        }
        item.r += 3 * delta;
        item.opacity -= 0.01 * delta;
      });
      return newRings;
    });
  });
  const ringComponent = rings.map((item, i) => <Ring key={i} position={item.position} r={item.r} opacity={item.opacity} />);

  return (
    <Container filters={[blurFilter, displacementFilter]}>
      {ringComponent}
    </Container>
  )
}
export default RippleEffect