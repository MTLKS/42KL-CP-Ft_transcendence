import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Container, Text, Graphics, useTick, withFilters, useApp } from '@pixi/react'
import Paddle from './game_objects/Paddle';
import { BoxSize, Offset } from '../model/GameModels';
import Pong from './game_objects/Pong';
import RippleEffect, { Ring } from './game_objects/RippleEffect';
import * as PIXI from 'pixi.js';
import TimeZone, { TimeZoneType } from './game_objects/TimeZone';
import DashLine from './game_objects/DashLine';
import GameText from './game_objects/GameText';
import { GameDataCtx } from '../GameApp';
import ParticlesRenderer from './game_objects/ParticlesRenderer';
import Entities from './game_objects/Entities';
import GameParticle from '../model/GameParticle';
import * as particles from '@pixi/particle-emitter';
import sleep from '../functions/sleep';

interface GameProps {
  pause: boolean;
  scale: number;
}
const boxSize: BoxSize = { w: 1600, h: 900 };

function Game(props: GameProps) {
  const { scale } = props;
  const gameData = useContext(GameDataCtx);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [position, setPosition] = useState<Offset>({ x: 0, y: 0 });
  const [particles, setParticles] = useState<GameParticle[]>([]);
  const [leftPaddlePosition, setLeftPaddlePosition] = useState<Offset>({ x: 0, y: 0 });
  const [rightPaddlePosition, setRightPaddlePosition] = useState<Offset>({ x: 0, y: 0 });
  const [rings, setRings] = useState<Ring[]>([]);
  const addRing = useCallback(async () => {
    const newRings: Ring[] = [...rings];
    const hitPosition = gameData.pongPosition;
    for (let i = 0; i < 3; i++) {
      newRings.push({
        position: hitPosition,
        r: 10,
        opacity: 0.8
      });
      setRings(newRings);
      await sleep(100);
    }
  }, [gameData.pongPosition]);



  useEffect(() => {
    gameData.setSetShouldRender = setShouldRender;
  }, []);

  useTick((delta) => {
    const newPosition = gameData.pongPosition;
    const newPongSpeed = gameData.pongSpeed;
    const newPartiles: GameParticle[] = [...particles];
    updateParticle(newPartiles, gameData.gameEntities, newPosition, newPongSpeed);
    setParticles(newPartiles);
    setPosition(newPosition);
    setLeftPaddlePosition(gameData.leftPaddlePosition);
    setRightPaddlePosition(gameData.rightPaddlePosition);
    if (newPosition.x <= 0 || newPosition.y <= 0) addRing();
    if (newPosition.x >= 1600 - 10 || newPosition.y >= 900 - 10) addRing();
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
  }, true);

  return (
    shouldRender ?
      <Container key={"gameContainer"} width={1600} height={900} scale={scale}>
        <GameText key={"title"} text='PONG' anchor={0.5} fontSize={250} position={{ x: 800, y: 750 }} opacity={0.1} />
        <GameText key={"player1Score"} text='7' anchor={new PIXI.Point(1.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
        <GameText key={"player2Score"} text='5' anchor={new PIXI.Point(-0.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
        <DashLine key={"Dashline"} start={{ x: 800, y: 0 }} end={{ x: 800, y: 900 }} thinkness={5} color={0xFEF8E2} dash={10} gap={10} />
        <RippleEffect key={"ripple"} rings={rings} />
        <Pong key={"pong"} position={position} size={{ w: 10, h: 10 }} />
        <ParticlesRenderer particles={particles} />
        <Entities key={"entities"} />
        <Paddle key={"leftPaddle"} left={true} stageSize={boxSize} size={{ w: 15, h: 100 }} position={leftPaddlePosition} />
        <Paddle key={"rightPaddle"} left={false} stageSize={boxSize} size={{ w: 15, h: 100 }} position={rightPaddlePosition} />
      </Container> :
      <></>
  )

  function updateParticle(newParticles: GameParticle[], gameEntities: any[], pongPosition: Offset, pongSpeed: Offset) {
    newParticles.forEach((particle) => {
      if (particle.opacity <= 0) {
        newParticles.splice(newParticles.indexOf(particle), 1);
      }
      gameEntities.forEach((entity) => {
        if (entity.type == "blackhole")
          particle.setGravityAccel(entity.x, entity.y, 2);
      });
      particle.update();
    });
    newParticles.push(
      new GameParticle({
        x: pongPosition.x - 5 + 20 * Math.random(),
        y: pongPosition.y - 5 + 20 * Math.random(),
        opacity: 1,
        opacityDecay: 0.02,
        vx: pongSpeed.y * (Math.random() - 0.5) * 0.3,
        vy: pongSpeed.x * (Math.random() - 0.5) * 0.3,
        w: 3,
        h: 3,
      })
    );
    for (let i = 0; i < 2; i++) {
      newParticles.push(
        new GameParticle({
          x: pongPosition.x + 5 - 10 / 2,
          y: pongPosition.y + 5 - 10 / 2,
          opacity: 0.8,
          opacityDecay: 0.02,
          vx: pongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
          vy: pongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
          w: 5,
          h: 5,
          speedDecayFactor: 0.95,
        })
      );
    }
    for (let i = 0; i < 2; i++) {
      newParticles.push(
        new GameParticle({
          x: pongPosition.x + 5 - 10 / 2,
          y: pongPosition.y + 5 - 10 / 2,
          opacity: 1,
          opacityDecay: 0.02,
          vx: pongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
          vy: pongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
          w: 10,
          h: 10,
          speedDecayFactor: 0.95,
          colorIndex: 1,
        })
      );
    }

    gameEntities.forEach((entity) => {
      if (entity.type !== "blackhole") return;
      var x =
        entity.x +
        (Math.random() > 0.2 ? 1 : -1) * 30 +
        30 * (Math.random() - 0.5);
      var y =
        entity.y +
        (Math.random() > 0.5 ? 1 : -1) * 30 +
        30 * (Math.random() - 0.5);
      newParticles.push(
        new GameParticle({
          x: x,
          y: y,
          opacity: 1,
          vx: (entity.x - x) / 10 + 7,
          vy: (y - entity.y) / 10 + (Math.random() > 0.5 ? 1 : -1),
          opacityDecay: 0.005,
          w: 7,
          h: 7,
          colorIndex: 2,
        })
      );
    });

    newParticles.push(
      new GameParticle({
        x: pongPosition.x,
        y: pongPosition.y,
        opacity: 1,
        vx: 0.12,
        vy: 0.12,
        opacityDecay: 0.03,
        sizeDecay: 0.3,
        w: 10,
        h: 10,
        colorIndex: 0,
        gravity: false,
      })
    );
  }
}


export default Game