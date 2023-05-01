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

const Filters = withFilters(Container, {
  blur: PIXI.BlurFilter,
  displacement: PIXI.DisplacementFilter,
});

interface GameProps {
  pause: boolean;
  scale: number;
}
const boxSize: BoxSize = { w: 1600, h: 900 };

function Game(props: GameProps) {
  const { scale } = props;

  return (
    <Container width={1600} height={900} scale={scale}>
      <GameText text='PONG' anchor={0.5} fontSize={250} position={{ x: 800, y: 750 }} opacity={0.1} />
      <GameText text='7' anchor={new PIXI.Point(1.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
      <GameText text='5' anchor={new PIXI.Point(-0.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
      <DashLine start={{ x: 800, y: 0 }} end={{ x: 800, y: 900 }} thinkness={5} color={0xFEF8E2} dash={10} gap={10} />
      <TimeZone size={{ w: 300, h: 300 }} position={{ x: 300, y: 300 }} type={TimeZoneType.SLOWDOWN} />
      <Paddle left={true} stageSize={boxSize} size={{ w: 15, h: 100 }} />
      <Paddle left={false} stageSize={boxSize} size={{ w: 15, h: 100 }} />
      <Spits size={{ w: 10, h: 10 }} color={1} />
      <Spits size={{ w: 5, h: 5 }} color={0} />
      <Pong stageSize={boxSize} size={{ w: 10, h: 10 }} />
      <Filters blur={{ blurX: 1, blurY: 1 }} displacement={{
        construct: [PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/pixi-filters/displacement_map_repeat.jpg')],
        scale: new PIXI.Point(100, 100),
      }}  >
        <RippleEffect key={'ripple'} stageSize={{ w: 1600, h: 900 }} />

      </Filters>
      <Paticles size={{ w: 3, h: 3 }} />
      <Trail size={{ w: 10, h: 10 }} />
      {/* <Trail size={{ w: 10, h: 10 }}  /> */}
      {/* <PongEffect position={{ x: pongPosition.x + 5, y: pongPosition.y + 5 }} size={{ w: 10, h: 10 }} speed={pongSpeed} mode={Mode.FAST} /> */}
      <Blackhole position={{ x: 1000, y: 300 }} size={{ w: 5, h: 5 }} acceleration={5} />
      {/* <Blackhole position={{ x: 500, y: 600 }} size={{ w: 5, h: 5 }} acceleration={7} /> */}
      {/* <Blackhole position={{ x: 300, y: 100 }} size={{ w: 5, h: 5 }} acceleration={3} /> */}

    </Container>
  )
}

export default Game