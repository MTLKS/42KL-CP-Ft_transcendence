import * as PIXI from 'pixi.js';
import { Container, Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import GameParticle, { GameLightningParticle } from '../../model/GameParticle';
import { Ref, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GameDataCtx } from '../../GameApp';
import { GameBlackhole } from '../../model/GameEntities';
import Worker from '../../workers/gameGraphic.worker?worker'
import { BloomFilter, DropShadowFilter } from 'pixi-filters';
import { filter } from 'lodash';
import { GameGravityArrow } from '../../model/GameGravityArrow';
import GameParticleDelegate from '../../model/GameParticleDelegate';

// const gameGraphicWorker = new Worker();

interface ParticlesRendererProps {
  particles: GameParticle[];
  lightningParticles: GameLightningParticle[];
  gameGravityArrow: GameGravityArrow | null;
}
function ParticlesRenderer(props: ParticlesRendererProps) {
  const { particles, lightningParticles, gameGravityArrow } = props;
  const app = useApp();
  const gameData = useContext(GameDataCtx);

  const textures = useMemo(() => {
    const box = new PIXI.Graphics();
    drawWhiteParticleTexture(box);
    const white = app.renderer.generateTexture(box);
    drawCyanParticleTexture(box);
    const cyan = app.renderer.generateTexture(box);
    drawPurpleParticleTexture(box);
    const purple = app.renderer.generateTexture(box);
    drawLightingParticleTexture(box);
    const lightning = app.renderer.generateTexture(box);
    box.destroy();
    return [white, cyan, purple, lightning];
  }, []);

  const arrowTexture = useMemo(() => {
    if (!gameGravityArrow) return null;
    const box = new PIXI.Graphics();
    drawArrowParticleTexture(box, gameGravityArrow);
    const arrow = app.renderer.generateTexture(box);
    box.destroy();
    return arrow;
  }, [gameGravityArrow]);

  const bloomFilter = useMemo(() => {
    const bloomFilter = new BloomFilter();
    bloomFilter.blur = 3;
    return bloomFilter;
  }, []);

  const gameParticleDelegate = useMemo(() => {
    return new GameParticleDelegate(gameData);
  }, []);


  const trailContainerRef = useRef<PIXI.ParticleContainer>(null);
  const whiteContainerRef = useRef<PIXI.ParticleContainer>(null);
  const cyanContainerRef = useRef<PIXI.ParticleContainer>(null);
  const purpleContainerRef = useRef<PIXI.ParticleContainer>(null);
  const lightningContainerRef = useRef<PIXI.ParticleContainer>(null);
  const arrowContainerRef = useRef<PIXI.ParticleContainer>(null);

  useEffect(() => {
    if (!gameGravityArrow) {
      arrowContainerRef.current?.removeChildren();
    }
  }, [gameGravityArrow]);

  useTick((delta) => {
    gameParticleDelegate.update(addParticle, removeParticle);
    gameGravityArrow?.update(addArrowParticle, removeArrowParticle);
    lightningParticles.forEach((lightningParticle) => {
      lightningParticle.update(addLightningParticle, removeLightningParticle);
    })
  });

  // const trailElementsRef = useRef<JSX.Element[]>([]);
  // const whiteElementsRef = useRef<JSX.Element[]>([]);
  // const cyanElementsRef = useRef<JSX.Element[]>([]);
  // const purpleElementsRef = useRef<JSX.Element[]>([]);
  // const lightningElementsRef = useRef<JSX.Element[]>([]);
  // const arrowElementsRef = useRef<JSX.Element[]>([]);
  // useEffect(() => {
  //   const trailElements: JSX.Element[] = trailElementsRef.current;
  //   const whiteElements: JSX.Element[] = whiteElementsRef.current;
  //   const cyanElements: JSX.Element[] = cyanElementsRef.current;
  //   const purpleElements: JSX.Element[] = purpleElementsRef.current;
  // const lightningElements: JSX.Element[] = lightningElementsRef.current;
  // const arrowElements: JSX.Element[] = arrowElementsRef.current;
  //   trailElements.length = 0;
  //   whiteElements.length = 0;
  //   cyanElements.length = 0;
  //   purpleElements.length = 0;
  // lightningElements.length = 0;
  // arrowElements.length = 0;

  //   particles.forEach((p) => {
  //     const { id, x, y, w, h, opacity, colorIndex, gravity } = p;
  //     if (colorIndex === 0 && gravity) {
  //       whiteElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
  //     } else if (colorIndex === 1) {
  //       cyanElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
  //     } else if (!gravity) {
  //       trailElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
  //     } else {
  //       purpleElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} alpha={opacity} texture={textures[colorIndex]} />);
  //     }
  //   });
  // lightningParticles.forEach((lightning) => {
  //   lightning.particles.forEach((p) => {
  //     const { id, x, y, w, h, colorIndex, rotRad, opacity } = p;
  //     lightningElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} anchor={new PIXI.Point(0.5, 0)} rotation={rotRad} alpha={h > 5 ? opacity : 0} texture={textures[colorIndex]} />);
  //   });
  // });
  // if (!gameGravityArrow || !arrowTexture) return;
  // gameGravityArrow.arrowsParticles.forEach((p) => {
  //   const { id, x, y, w, h, rotRad } = p;
  //   arrowElements.push(<Sprite key={id} x={x} y={y} width={w} height={h} rotation={rotRad} alpha={0.2} texture={arrowTexture} />);
  // });
  // }, [particles, lightningParticles]);

  return (
    <Container
      interactiveChildren={false}
      filterArea={gameData.useParticlesFilter ? new PIXI.Rectangle(0, 0, 1600, 900) : undefined}
      filters={gameData.useParticlesFilter ? [bloomFilter] : null}
    >
      <ParticleContainer ref={arrowContainerRef} key={"arrowParticles"} properties={{ position: true, scale: true, alpha: true }}>
      </ParticleContainer>
      <ParticleContainer ref={trailContainerRef} key={"trailParticles"} properties={{ position: true, scale: true, alpha: true }}>
        {/* {trailElementsRef.current} */}
      </ParticleContainer>
      <ParticleContainer ref={cyanContainerRef} key={"cyanParticles"} properties={{ position: true, alpha: true }}>
        {/* {cyanElementsRef.current} */}
      </ParticleContainer>
      <ParticleContainer ref={whiteContainerRef} key={"whiteParticles"} properties={{ position: true, alpha: true }}>
        {/* {whiteElementsRef.current} */}
      </ParticleContainer>
      <ParticleContainer ref={purpleContainerRef} key={"purpleParticles"} properties={{ position: true, alpha: true }}>
        {/* {purpleElementsRef.current} */}
      </ParticleContainer>
      <ParticleContainer ref={lightningContainerRef} key={"lightningParticles"} properties={{ position: true, scale: true, alpha: true, rotation: true }}>
        {/* {lightningElementsRef.current} */}
      </ParticleContainer>
    </Container>
  )

  function addLightningParticle(particle: GameParticle) {
    const { x, y, w, h, rotRad, colorIndex, opacity } = particle;
    const sprite = new PIXI.Sprite(textures[colorIndex]);
    sprite.x = x;
    sprite.y = y;
    sprite.width = w;
    sprite.height = h;
    sprite.anchor.set(0.5, 0);
    sprite.rotation = rotRad;
    sprite.alpha = opacity;
    lightningContainerRef.current?.addChild(sprite);
    particle.sprite = sprite;
  }

  function removeLightningParticle(particle: GameParticle) {
    const { sprite: ref } = particle;
    if (!ref) return;
    lightningContainerRef.current?.removeChild(ref);
  }

  function addArrowParticle(particle: GameParticle) {
    const { x, y, w, h, rotRad } = particle;
    const sprite = new PIXI.Sprite(arrowTexture!);
    sprite.x = x;
    sprite.y = y;
    sprite.width = w;
    sprite.height = h;
    sprite.alpha = 0.2;
    sprite.rotation = rotRad;
    arrowContainerRef.current?.addChild(sprite);
    particle.sprite = sprite;
  }

  function removeArrowParticle(particle: GameParticle) {
    const { sprite: ref } = particle;
    if (!ref) return;
    arrowContainerRef.current?.removeChild(ref);
  }

  function addParticle(particle: GameParticle) {
    const { x, y, w, h, opacity, colorIndex, affectedByGravity } = particle;
    const sprite = new PIXI.Sprite(textures[colorIndex]);
    sprite.x = x;
    sprite.y = y;
    sprite.width = w;
    sprite.height = h;
    sprite.alpha = opacity;
    particle.sprite = sprite;
    if (colorIndex === 0 && affectedByGravity) {
      whiteContainerRef.current?.addChild(sprite);
    } else if (colorIndex === 1) {
      cyanContainerRef.current?.addChild(sprite);
    } else if (!affectedByGravity) {
      trailContainerRef.current?.addChild(sprite);
    } else {
      purpleContainerRef.current?.addChild(sprite);
    }
  }

  function removeParticle(particle: GameParticle) {
    const { colorIndex, affectedByGravity, sprite: ref } = particle;
    if (!ref) return;
    let sprite: PIXI.Sprite | undefined;
    if (colorIndex === 0 && affectedByGravity && whiteContainerRef.current) {
      sprite = whiteContainerRef.current.removeChildAt(whiteContainerRef.current.getChildIndex(ref));
    } else if (colorIndex === 1 && cyanContainerRef.current) {
      sprite = cyanContainerRef.current.removeChildAt(cyanContainerRef.current.getChildIndex(ref));
    } else if (!affectedByGravity && trailContainerRef.current) {
      sprite = trailContainerRef.current.removeChildAt(trailContainerRef.current.getChildIndex(ref));
    } else if (purpleContainerRef.current) {
      sprite = purpleContainerRef.current.removeChildAt(purpleContainerRef.current.getChildIndex(ref));
    }
    if (sprite) {
      sprite.destroy();
    }
  }
}

export default ParticlesRenderer

function drawWhiteParticleTexture(box: PIXI.Graphics) {
  box.beginFill(0xFEF8E2, 0.8);
  box.drawRect(0, 0, 2, 2);
  box.endFill();
}

function drawPurpleParticleTexture(box: PIXI.Graphics) {
  box.clear();
  box.beginFill(0xC5A1FF, 0.6);
  box.drawRect(0, 0, 2, 2);
  box.endFill();
}

function drawCyanParticleTexture(box: PIXI.Graphics) {
  box.clear();
  box.beginFill(0x5F928F, 0.8);
  box.drawRect(0, 0, 2, 2);
  box.endFill();
}

function drawLightingParticleTexture(box: PIXI.Graphics) {
  box.clear();
  box.lineStyle(6, 0x5F928F);
  box.moveTo(-2, 0);
  box.lineTo(4, 20);
  box.lineTo(-8, 30);
  box.lineTo(2, 46);
  box.lineTo(-2, 60);
  box.lineStyle(6, 0x5F928F);
  box.moveTo(2, 0);
  box.lineTo(8, 20);
  box.lineTo(-4, 30);
  box.lineTo(6, 46);
  box.lineTo(2, 60);
  box.lineStyle(4, 0xffffff, 0.5);
  box.moveTo(0, 0);
  box.lineTo(6, 20);
  box.lineTo(-6, 30);
  box.lineTo(4, 46);
  box.lineTo(0, 60);
}

function drawArrowParticleTexture(box: PIXI.Graphics, gameGravityArrow: GameGravityArrow) {
  box.clear();
  box.lineStyle({ cap: PIXI.LINE_CAP.ROUND, width: 10, color: gameGravityArrow.color, alpha: 1 })
  if (gameGravityArrow.isUp) {
    box.moveTo(0, 0);
    box.lineTo(20, 20);
    box.moveTo(0, 0);
    box.lineTo(-20, 20);
    box.moveTo(0, 0);
    box.lineTo(0, 100);
  } else {
    box.moveTo(0, 0);
    box.lineTo(20, -20);
    box.moveTo(0, 0);
    box.lineTo(-20, -20);
    box.moveTo(0, 0);
    box.lineTo(0, -100);
  }
  box.endFill();
}