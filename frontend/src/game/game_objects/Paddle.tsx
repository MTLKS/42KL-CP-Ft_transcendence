import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { Container, Graphics, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../model/GameModels';
import * as PIXI from 'pixi.js';
import { GameDataCtx } from '../../GameApp';
import { DropShadowFilter } from 'pixi-filters';

export enum PaddleType {
  "Vzzzzzzt",
  "Piiuuuuu",
  "Ngeeeaat",
  "Vrooooom",
}

interface PaddleProps {
  left: boolean;
  stageSize: BoxSize;
  size: BoxSize;
  position: Offset;
  type?: PaddleType;
}

function Paddle(props: PaddleProps) {
  const { left, stageSize, size, position, type } = props;
  const [rot, setRot] = React.useState(0);
  const app = useApp();

  useTick((delta) => {
    setRot(rot + 0.8);
  }, false);

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
        g.drawRect(0, size.h - 30, size.w, 30);
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
    dropShadowFilter.quality = 5;
    return dropShadowFilter;
  }, []);

  return (
    <Sprite texture={texture} x={position.x + size.w / 2} y={position.y} pivot={new PIXI.Point(size.w / 2, size.h / 2)} rotation={Math.sin(rot) * 0.05} filters={[filter]} />
  )
}

export default Paddle