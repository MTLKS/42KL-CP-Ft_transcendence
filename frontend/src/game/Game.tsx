import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Stage, Container, Text, Graphics, useTick, withFilters } from '@pixi/react'
import Paddle from './game_objects/Paddle';
import { render } from 'react-dom';
import { BoxSize, Offset } from '../modal/GameModels';
import Pong from './game_objects/Pong';
import Paticles from './game_objects/Paticles';
import RippleEffect from './game_objects/RippleEffect';
import * as PIXI from 'pixi.js';
import filter from 'pixi-filters';
import PongEffect, { Mode } from './game_objects/PongEffect';


let pongSpeed: Offset = { x: 7, y: 7 };
let pongEnterSpeed: Offset | null = null;

const Filters = withFilters(Container, {
  blur: PIXI.BlurFilter,
  displacement: PIXI.DisplacementFilter,
  // shockwave: filter.ShockwaveFilter,
});

interface GameProps {
  leftPaddlePosition: Offset;
  rightPaddlePosition: Offset;
  boxSize: BoxSize;
  pause: boolean;
}

function Game(props: GameProps) {
  const { leftPaddlePosition, rightPaddlePosition, boxSize, pause } = props;
  const [ripplePosition, setRipplePosition] = useState<Offset>({ y: -100, x: -100 });
  const [pongPosition, setPongPosition] = useState<Offset>({ y: 100, x: 100 });


  useTick((delta) => {
    let newPosition = { ...pongPosition };
    if (pongPosition.x > boxSize.w) {
      pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }
    if (pongPosition.y > boxSize.h) {
      pongSpeed.y = -pongSpeed.y;
      setRipplePosition({ ...pongPosition });
    }
    if (pongPosition.x < 0) {
      pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }
    if (pongPosition.y < 0) {
      pongSpeed.y = -pongSpeed.y;
      setRipplePosition({ ...pongPosition });
    }


    if (pongPosition.x > leftPaddlePosition.x && pongPosition.x < leftPaddlePosition.x + 15
      && pongPosition.y < leftPaddlePosition.y + 50 && pongPosition.y > leftPaddlePosition.y - 50) {
      pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }

    if (pongPosition.x > rightPaddlePosition.x - 15 && pongPosition.x < rightPaddlePosition.x
      && pongPosition.y < rightPaddlePosition.y + 50 && pongPosition.y > rightPaddlePosition.y - 50) {
      pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }



    newPosition.x += pongSpeed.x;
    newPosition.y += pongSpeed.y;
    setPongPosition(newPosition);
  }, !pause);


  return (
    <Container  >
      <Paddle left={true} stageSize={boxSize} position={leftPaddlePosition} size={{ w: 15, h: 100 }} />
      <Paddle left={false} stageSize={boxSize} position={rightPaddlePosition} size={{ w: 15, h: 100 }} />
      <Pong stageSize={boxSize} position={pongPosition} size={{ w: 10, h: 10 }} />
      <Filters blur={{ blurX: 1, blurY: 1 }} displacement={{
        construct: [PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/pixi-filters/displacement_map_repeat.jpg')],
        scale: new PIXI.Point(300, 300),
      }}  >
        <RippleEffect key={'ripple'} position={ripplePosition} size={{ w: 100, h: 100 }} />

      </Filters>
      <Paticles position={pongPosition} size={{ w: 2, h: 2 }} speed={pongSpeed} />

      <PongEffect position={{ x: pongPosition.x + 5, y: pongPosition.y + 5 }} size={{ w: 10, h: 10 }} speed={pongSpeed} mode={Mode.FAST} />


    </Container>
  )
}

export default Game