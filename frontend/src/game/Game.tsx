import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Container, Text, Graphics, useTick, withFilters, useApp, ParticleContainer, Sprite } from '@pixi/react'
import Paddle, { PaddleType } from './game_objects/Paddle';
import { BoxSize, Offset } from '../model/GameModels';
import Pong from './game_objects/Pong';
import RippleEffect, { Ring } from './game_objects/RippleEffect';
import * as PIXI from 'pixi.js';
import DashLine from './game_objects/DashLine';
import GameText from './game_objects/GameText';
import { GameDataCtx } from '../GameApp';
import ParticlesRenderer from './game_objects/ParticlesRenderer';
import Entities from './game_objects/Entities';
import GameEntity, { GameBlackhole, GameBlock, GameTimeZone } from '../model/GameEntities';
import GameParticle, { GameLightningParticle } from '../model/GameParticle';
import sleep from '../functions/sleep';
import { GameData } from './gameData';
import { GameGravityArrow, GameGravityArrowDiraction } from '../model/GameGravityArrow';
import ColorTween from './functions/colorInterpolation';
import { RGBSplitFilter, ShockwaveFilter } from 'pixi-filters';

interface GameProps {
  scale: number;
  shouldRender: boolean;
  usingTicker?: boolean;
}
const boxSize: BoxSize = { w: 1600, h: 900 };

function Game(props: GameProps) {
  const { scale, shouldRender, usingTicker } = props;
  const gameData = useContext(GameDataCtx);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Offset>({ x: 0, y: 0 });
  const [particles, setParticles] = useState<GameParticle[]>([]);
  const [gameGravityArrow, setGameGravityArrow] = useState<GameGravityArrow | null>(null);
  const [lightningParticles, setLightningParticles] = useState<GameLightningParticle[]>([
    new GameLightningParticle({
      centerX: 400,
      centerY: 400,
      paddingX: 15,
      paddingY: 60,
    }),
  ]);
  const [leftPaddlePosition, setLeftPaddlePosition] = useState<Offset>({ x: 0, y: 0 });
  const [rightPaddlePosition, setRightPaddlePosition] = useState<Offset>({ x: 0, y: 0 });
  const [rings, setRings] = useState<Ring[]>([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [bgColor, setBgColor] = useState(0x242424);
  const [bgColorTween, setBgColorTween] = useState<ColorTween | undefined>(undefined);
  const app = useApp();

  const ballhit = useCallback(async (gameData: GameData) => {
    const hitPosition = gameData.pongPosition;
    const shorkwaveFilter = new ShockwaveFilter();
    shorkwaveFilter.center = [hitPosition.x, hitPosition.y];
    shorkwaveFilter.time = 0;
    shorkwaveFilter.amplitude = 100;
    shorkwaveFilter.wavelength = 5;
    shorkwaveFilter.radius = 1900;
    const rgbSplitFilter = new RGBSplitFilter();
    rgbSplitFilter.red = [5, 0];
    rgbSplitFilter.green = [3, -2];
    rgbSplitFilter.blue = [0, 0];

    const ticker = new PIXI.Ticker();
    const tickerCallback = (delta: number) => {
      shorkwaveFilter.time += 0.01;
      shorkwaveFilter.wavelength += 2;
      shorkwaveFilter.amplitude *= 0.95;
      // rgbSplitFilter.red = [(rgbSplitFilter.red as PIXI.Point).x - 1, (rgbSplitFilter.red as PIXI.Point).y];
      // rgbSplitFilter.green = [(rgbSplitFilter.green as PIXI.Point).x - 1, (rgbSplitFilter.green as PIXI.Point).y + 1];
      // rgbSplitFilter.blue = [(rgbSplitFilter.blue as PIXI.Point).x * -1, (rgbSplitFilter.blue as PIXI.Point).y - 1];
      if (shorkwaveFilter.time >= 1) {
        ticker.remove(tickerCallback);
        ticker.stop();
        app.stage.filters = app.stage.filters ? app.stage.filters.filter((filter) => filter !== shorkwaveFilter || filter !== rgbSplitFilter) : null;
      }
    };
    ticker.add(tickerCallback);
    ticker.start();
    app.stage.filters = app.stage.filters ? app.stage.filters.concat(shorkwaveFilter) : [shorkwaveFilter, rgbSplitFilter];
    // for (let i = 0; i < 3; i++) {
    //   newRings.push({
    //     position: hitPosition,
    //     r: 10,
    //     opacity: 0.8
    //   });
    //   setRings(newRings);
    //   await sleep(100);
    // }
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useTick((delta) => {
    if (!gameData.displayGame || !mounted) return;
    const newPosition = gameData.pongPosition;
    const newPongSpeed = gameData.pongSpeed;
    const pongSpeedMagnitude = Math.sqrt(newPongSpeed.x ** 2 + newPongSpeed.y ** 2);
    const newParticles: GameParticle[] = updateParticles(particles, gameData, newPosition, newPongSpeed, pongSpeedMagnitude);
    let newGameGravityArrow = gameGravityArrow;

    if (gameData.globalGravityY !== 0) {
      gameData.globalGravityY = Math.sign(gameData.globalGravityY) * 2 / pongSpeedMagnitude
      if (!bgColorTween && bgColor !== (gameData.globalGravityY > 0 ? 0xc5a1ff : 0xd2b24f)) {
        setBgColorTween(new ColorTween({ start: bgColor, end: gameData.globalGravityY > 0 ? 0xc5a1ff : 0xff0000 }));
      }
      if (!gameGravityArrow) {
        console.log("new gameGravityArrow")
        newGameGravityArrow = new GameGravityArrow({ arrowsParticles: [], diraction: gameData.globalGravityY > 0 ? GameGravityArrowDiraction.DOWN : GameGravityArrowDiraction.UP });
      }
    }
    else if (bgColor !== 0x242424 && !bgColorTween) {
      setBgColorTween(new ColorTween({ start: bgColor, end: 0x242424 }));
      newGameGravityArrow = null;
    }
    const newLightningParticles: GameLightningParticle[] = [
      ...lightningParticles,
    ];
    newLightningParticles.forEach((lightning) => {
      lightning.centerX = leftPaddlePosition.x + 7.5;
      lightning.centerY = leftPaddlePosition.y;
      lightning.update();
    });
    gameGravityArrow?.update();
    if (bgColorTween) {
      if (bgColorTween.done) setBgColorTween(undefined);
      bgColorTween.update(0.05 * delta)
      setBgColor(bgColorTween.colorSlerp);
    }
    setGameGravityArrow(newGameGravityArrow);
    setParticles(newParticles);
    setLightningParticles(newLightningParticles);
    setPosition(newPosition);
    setLeftPaddlePosition(gameData.leftPaddlePosition);
    setRightPaddlePosition(gameData.rightPaddlePosition);
    setPlayer1Score(gameData.player1Score);
    setPlayer2Score(gameData.player2Score);
    if (newPosition.x <= 0 || newPosition.x >= 1600 - 10) ballhit(gameData);
    if (newPosition.y <= 0 || newPosition.y >= 900 - 10) ballhit(gameData);
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
  }, usingTicker ?? true);

  const backgoundTexture = useMemo(() => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(bgColor, 0.1);
    graphics.drawRect(0, 0, 16, 9);
    graphics.endFill();
    return app.renderer.generateTexture(graphics);
  }, [bgColor]);

  // const filters = useMemo(() => {
  //   const bevelFilter = new BevelFilter();
  //   bevelFilter.thickness = 4;
  //   return [bevelFilter];
  // }, []);

  if (!shouldRender) return <></>;
  return (
    <Container width={1600} height={900} scale={scale} eventMode='auto'>
      <Sprite width={1600} height={900} texture={backgoundTexture} />
      <GameText text='PONG' anchor={0.5} fontSize={250} position={{ x: 800, y: 750 }} opacity={0.1} />
      <GameText text={player1Score.toString()} anchor={new PIXI.Point(1.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
      <GameText text={player2Score.toString()} anchor={new PIXI.Point(-0.5, -0.1)} fontSize={200} position={{ x: 800, y: 0 }} opacity={0.3} />
      {/* <DashLine start={{ x: 800, y: 0 }} end={{ x: 800, y: 900 }} thinkness={5} color={0xFEF8E2} dash={10} gap={10} /> */}
      <RippleEffect rings={rings} />
      <Pong position={position} size={{ w: 10, h: 10 }} />
      <Entities />
      <ParticlesRenderer key={"particle renderer"} particles={particles} lightningParticles={lightningParticles} gameGravityArrow={gameGravityArrow} />
      <Paddle left={true} stageSize={boxSize} size={{ w: 15, h: 100 }} position={leftPaddlePosition} type={PaddleType.Piiuuuuu} />
      <Paddle left={false} stageSize={boxSize} size={{ w: 15, h: 100 }} position={rightPaddlePosition} />
    </Container>
  )
}

export default Game

function updateParticles(particles: GameParticle[], gameData: GameData, newPosition: Offset, newPongSpeed: Offset, pongSpeedMagnitude: number) {
  const newParticles = [...particles];
  newParticles.forEach((particle) => {
    if (particle.opacity <= 0.01) {
      newParticles.splice(newParticles.indexOf(particle), 1);
    }
    let finalTimeFactor = 1;
    gameData.gameEntities.forEach((entity) => {
      if (entity instanceof GameBlackhole) {
        if (!particle.affectedByGravity) return;
        const distance = Math.sqrt(
          Math.pow(particle.x - entity.x, 2) + Math.pow(particle.y - entity.y, 2)
        );
        if (distance < 1 || distance > 300) return;
        if (distance < 10) particle.opacity = 0;
        particle.setGravityAccel(entity.x, entity.y, entity.magnitude);
      }
      if (entity instanceof GameTimeZone) {
        const distance = Math.sqrt(
          Math.pow(particle.x - entity.x, 2) + Math.pow(particle.y - entity.y, 2)
        );
        if (distance < 1 || distance > entity.w / 2) return;
        finalTimeFactor *= entity.timeFactor;
      }
    });
    gameData.applGlobalEffectToParticle(particle);
    particle.update(finalTimeFactor, gameData.globalGravityX, gameData.globalGravityY);
  });
  // add particles functions
  trailingSpit(newParticles, newPosition, newPongSpeed);
  if (pongSpeedMagnitude > 1) {
    spit1(newParticles, newPosition, newPongSpeed);
    spit2(newParticles, newPosition, newPongSpeed);
  }
  trailParticles(newParticles, newPosition);

  blackholeParticle(gameData, newParticles);

  return newParticles;
}

function trailParticles(newParticles: GameParticle[], newPosition: Offset) {
  newParticles.push(
    new GameParticle({
      x: newPosition.x,
      y: newPosition.y,
      opacity: 1,
      vx: 0.12,
      vy: 0.12,
      opacityDecay: 0.03,
      sizeDecay: 0.3,
      w: 10,
      h: 10,
      colorIndex: 0,
      affectedByGravity: false,
    })
  );
}

function blackholeParticle(gameData: GameData, newParticles: GameParticle[]) {
  gameData.gameEntities.forEach((entity) => {
    if (entity.type !== "blackhole") return;
    const x = entity.x +
      (Math.random() > 0.2 ? 1 : -1) * 30 +
      30 * (Math.random() - 0.5);
    const y = entity.y +
      (Math.random() > 0.5 ? -1 : -1) * 30 +
      30 * (Math.random() - 0.5);
    const size = 2 + 8 * Math.random();
    newParticles.push(
      new GameParticle({
        x: x,
        y: y,
        opacity: 1,
        vx: (entity.x - x) / 10 + 7 + 2,
        vy: (y - entity.y) / 10 + (Math.random() > 0.5 ? 1 : -1) + 5,
        opacityDecay: 0.005,
        w: size,
        h: size,
        colorIndex: 2,
      })
    );
  });
}

function spit2(newParticles: GameParticle[], newPosition: Offset, newPongSpeed: Offset) {
  for (let i = 0; i < 2; i++) {
    const size = 6 + 4 * Math.random();
    newParticles.push(
      new GameParticle({
        x: newPosition.x + 5 - 10 / 2,
        y: newPosition.y + 5 - 10 / 2,
        opacity: 1,
        opacityDecay: 0.02,
        vx: newPongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
        vy: newPongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
        w: size,
        h: size,
        speedDecayFactor: 0.95,
        colorIndex: 1,
        affectedByTimeZone: false,
      })
    );
  }
}

function spit1(newParticles: GameParticle[], newPosition: Offset, newPongSpeed: Offset) {
  for (let i = 0; i < 2; i++) {
    const size = 2 + 3 * Math.random();
    newParticles.push(
      new GameParticle({
        x: newPosition.x + 5 - 10 / 2,
        y: newPosition.y + 5 - 10 / 2,
        opacity: 0.8,
        opacityDecay: 0.02,
        vx: newPongSpeed.x * 1.5 + (Math.random() - 0.5) * 3,
        vy: newPongSpeed.y * 1.5 + (Math.random() - 0.5) * 3,
        w: size,
        h: size,
        speedDecayFactor: 0.95,
        affectedByTimeZone: false,
      })
    );
  }
}

function trailingSpit(newParticles: GameParticle[], newPosition: Offset, newPongSpeed: Offset) {
  newParticles.push(
    new GameParticle({
      x: newPosition.x - 5 + 20 * Math.random(),
      y: newPosition.y - 5 + 20 * Math.random(),
      opacity: 1,
      opacityDecay: 0.02,
      vx: newPongSpeed.y * (Math.random() - 0.5) * 0.3,
      vy: newPongSpeed.x * (Math.random() - 0.5) * 0.3,
      w: 3,
      h: 3,
    })
  );
}