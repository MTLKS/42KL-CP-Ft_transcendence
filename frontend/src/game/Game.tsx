import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
import Trail from './game_objects/Trail';
import Spits from './game_objects/Spits';
import SocketApi from '../api/socketApi';
import { GameTickCtx } from './GameStage';
import Blackhole from './game_objects/Blackhole';
import PaticleEmittor from './game_objects/PaticleEmittor';
import TimeZone, { TimeZoneType } from './game_objects/TimeZone';
import DashLine from './game_objects/DashLine';
import GameText from './game_objects/GameText';
import { GameDTO } from '../modal/GameDTO';
import { GameTick } from './gameTick';


let pongSpeed: Offset = { x: 12, y: 5 };
let pongEnterSpeed: Offset | null = null;

const Filters = withFilters(Container, {
  blur: PIXI.BlurFilter,
  displacement: PIXI.DisplacementFilter,
  // shockwave: filter.ShockwaveFilter,
});

interface GameProps {
  leftPaddlePosition: Offset;
  rightPaddlePosition: Offset;

  pause: boolean;
  scale: number;
}
const boxSize: BoxSize = { w: 1600, h: 900 };
const tick: boolean = false;

let gameTick: GameTick;
function Game(props: GameProps) {
  const { pause, scale } = props;
  const [ripplePosition, setRipplePosition] = useState<Offset>({ y: -100, x: -100 });
  const [pongPosition, setPongPosition] = useState<Offset>({ y: 100, x: 100 });
  const [pongSpeed, setPongSpeed] = useState<Offset>({ y: 0, x: 0 });
  const [leftPaddlePosition, setLeftPaddlePosition] = useState<Offset>({ y: 100, x: 100 });
  const [rightPaddlePosition, setRightPaddlePosition] = useState<Offset>({ y: 100, x: 100 });
  gameTick = useContext(GameTickCtx)!;

  // useEffect(() => {
  //   socketApi.sendMessages("startGame", { ok: "ok" });
  //   socketApi.listen("gameLoop", (data: GameDTO) => {
  //     // console.log("gameLoop", data);
  //     setPongSpeed({
  //       x: data.velX,
  //       y: data.velY
  //     });
  //     setPongPosition({
  //       x: data.ballPosX,
  //       y: data.ballPosY
  //     });
  //     setLeftPaddlePosition({
  //       x: 30,
  //       y: data.leftPaddlePosY
  //     });
  //     setRightPaddlePosition({
  //       x: 1600 - 30,
  //       y: data.rightPaddlePosY
  //     });

  //   });

  //   return () => {
  //     socketApi.removeListener("gameLoop");
  //   }
  // }, []);


  useTick((delta) => {
    let newPosition = { ...pongPosition };
    if (pongPosition.x >= boxSize.w - 10) {
      if (tick)
        pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }
    if (pongPosition.y >= boxSize.h - 10) {
      if (tick)
        pongSpeed.y = -pongSpeed.y;
      setRipplePosition({ ...pongPosition });
    }
    if (pongPosition.x <= 0) {
      if (tick)
        pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }
    if (pongPosition.y <= 0) {
      if (tick)
        pongSpeed.y = -pongSpeed.y;
      setRipplePosition({ ...pongPosition });
    }


    if (pongPosition.x > leftPaddlePosition.x && pongPosition.x < leftPaddlePosition.x + 15
      && pongPosition.y < leftPaddlePosition.y + 50 && pongPosition.y > leftPaddlePosition.y - 50) {
      if (tick)
        pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }

    if (pongPosition.x > rightPaddlePosition.x - 15 && pongPosition.x < rightPaddlePosition.x
      && pongPosition.y < rightPaddlePosition.y + 50 && pongPosition.y > rightPaddlePosition.y - 50) {
      if (tick)
        pongSpeed.x = -pongSpeed.x;
      setRipplePosition({ ...pongPosition });
    }



    if (tick) {
      newPosition.x += pongSpeed.x;
      newPosition.y += pongSpeed.y;
      setPongPosition(newPosition);
    }
  }, !pause);


  return (
    <Container width={1600} height={900} scale={scale}>
      <GameText text='PONG' anchor={0.5} fontSize={250} position={{ x: 800, y: 750 }} opacity={0.1} />
      <GameText text='7' anchor={new PIXI.Point(1.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
      <GameText text='5' anchor={new PIXI.Point(-0.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
      <DashLine start={{ x: 800, y: 0 }} end={{ x: 800, y: 900 }} thinkness={5} color={0xFEF8E2} dash={10} gap={10} />
      <Paddle left={true} stageSize={boxSize} position={leftPaddlePosition} size={{ w: 15, h: 100 }} />
      <Paddle left={false} stageSize={boxSize} position={rightPaddlePosition} size={{ w: 15, h: 100 }} />
      <Spits position={pongPosition} size={{ w: 10, h: 10 }} speed={pongSpeed} color={1} />
      <Spits position={pongPosition} size={{ w: 5, h: 5 }} speed={pongSpeed} color={0} />
      <Pong stageSize={boxSize} size={{ w: 10, h: 10 }} />
      <Filters blur={{ blurX: 1, blurY: 1 }} displacement={{
        construct: [PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/pixi-filters/displacement_map_repeat.jpg')],
        scale: new PIXI.Point(300, 300),
      }}  >
        <RippleEffect key={'ripple'} position={ripplePosition} size={{ w: 100, h: 100 }} />

      </Filters>
      <Paticles position={pongPosition} size={{ w: 3, h: 3 }} speed={pongSpeed} />
      <Trail position={pongPosition} size={{ w: 10, h: 10 }} speed={pongSpeed} />
      {/* <Trail position={pongPosition} size={{ w: 10, h: 10 }} speed={pongSpeed} /> */}
      {/* <PongEffect position={{ x: pongPosition.x + 5, y: pongPosition.y + 5 }} size={{ w: 10, h: 10 }} speed={pongSpeed} mode={Mode.FAST} /> */}
      <Blackhole position={{ x: 1000, y: 300 }} size={{ w: 5, h: 5 }} acceleration={5} />
      {/* <Blackhole position={{ x: 500, y: 600 }} size={{ w: 5, h: 5 }} acceleration={7} /> */}
      {/* <Blackhole position={{ x: 300, y: 100 }} size={{ w: 5, h: 5 }} acceleration={3} /> */}
      <TimeZone size={{ w: 300, h: 300 }} position={{ x: 300, y: 300 }} type={TimeZoneType.SLOWDOWN} />

    </Container>
  )
}

export default Game