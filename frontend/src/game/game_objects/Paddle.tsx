import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Container, Graphics, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../model/GameModels';
import * as PIXI from 'pixi.js';
import { GameDataCtx } from '../../GameApp';
import { DropShadowFilter } from 'pixi-filters';
import { PaddleType } from '../gameData';

interface PaddleProps {
  left: boolean;
}

function Paddle(props: PaddleProps) {
  const { left } = props;
  const app = useApp();
  const gameData = useContext(GameDataCtx);
  const rotRef = useRef<number>(0);
  const paddleRef = useRef<PIXI.Sprite>(null);
  const [type, setType] = useState<PaddleType>(PaddleType.Vzzzzzzt);

  const size: BoxSize = useMemo(() => {
    if (type === PaddleType.Ngeeeaat) {
      return { w: 15, h: 150 };
    }
    return { w: 15, h: 100 };
  }, [type]);

  useTick((delta) => {
    if (paddleRef.current == null) return;
    paddleRef.current.rotation = Math.sin(rotRef.current) * 0.05;
    rotRef.current += 0.8 * delta;
  }, false);

  useTick((delta) => {
    if (paddleRef.current == null) return;
    const paddle = paddleRef.current;
    let position: Offset;
    if (left) {
      position = gameData.leftPaddlePosition;
      if (gameData.leftPaddleType !== type) {
        setType(gameData.leftPaddleType);
      }
    } else {
      position = gameData.rightPaddlePosition;
      if (gameData.rightPaddleType !== type) {
        setType(gameData.rightPaddleType);
      }
    }
    paddle.x = position.x + size.w / 2;
    paddle.y = position.y;
  }, true);

  const texture = useMemo(() => {
    const g = new PIXI.Graphics();
    const t1 = new PIXI.Text();
    const t2 = new PIXI.Text();
    g.beginFill(0xFEF8E2);
    g.drawRect(0, 0, size.w, size.h);
    g.endFill();
    switch (type) {
      case PaddleType.Vzzzzzzt:
        break;
      case PaddleType.Piiuuuuu:
        g.beginFill(0xAD6454);
        g.drawRect(0, 0, size.w, 30);
        g.endFill();

        g.beginFill(0x5F928F);
        if (left) g.drawRect(0, size.h - 30, size.w, 30);
        else g.drawRect(0, 0, size.w, 30);
        g.endFill();

        t1.text = "M";
        t1.style = new PIXI.TextStyle({
          fontFamily: "JetBrains Mono",
          fontSize: 13,
          fill: 0xFEF8E2,
        });
        t1.x = 9;
        t1.y = 10;
        t1.rotation = -Math.PI / 2;
        t1.anchor.set(0.5, 0.5);

        t2.text = "S";
        t2.style = new PIXI.TextStyle({
          fontFamily: "JetBrains Mono",
          fontSize: 13,
          fill: 0xFEF8E2,
        });
        t2.x = 9;
        t2.y = size.h - 10;
        t2.rotation = -Math.PI / 2;
        t2.anchor.set(0.5, 0.5);

        g.addChild(t1);
        g.addChild(t2);
        break;
      case PaddleType.Ngeeeaat:
        g.clear();
        g.beginFill(0xFEF8E2);
        g.moveTo(0, 0);
        g.bezierCurveTo(6, size.h / 2, 6, size.h / 2, 0, size.h);
        g.lineTo(size.w, size.h);
        g.bezierCurveTo(size.w - 6, size.h / 2, size.w - 6, size.h / 2, size.w, 0);
        g.closePath();
        g.endFill();
        break;
      case PaddleType.Vrooooom:
        g.beginFill(0xAD6454);
        g.drawRect(10, 0, size.w - 10, size.h);
        g.endFill();
        break;
      default:
        break;
    }
    const texture = app.renderer.generateTexture(g);
    t1.destroy();
    t2.destroy();
    g.destroy();
    return texture;
  }, [type]);

  const filter = useMemo(() => {
    const dropShadowFilter = new DropShadowFilter();
    dropShadowFilter.color = 0xFEF8E2;
    dropShadowFilter.alpha = 0.5;
    dropShadowFilter.blur = 3;
    dropShadowFilter.offset = new PIXI.Point(0, 0);
    dropShadowFilter.padding = 40;
    dropShadowFilter.quality = 4;
    return dropShadowFilter;
  }, []);

  return (
    <Sprite
      ref={paddleRef}
      texture={texture}
      pivot={new PIXI.Point(size.w / 2, size.h / 2)}
      filters={gameData.usePaddleFilter ? [filter] : undefined}
    />
  )
}

export default Paddle