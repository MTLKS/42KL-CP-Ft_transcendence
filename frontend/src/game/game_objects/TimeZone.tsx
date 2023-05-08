import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Container, Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../model/GameModels';
import * as PIXI from 'pixi.js';


export enum TimeZoneType {
  SPEEDUP,
  SLOWDOWN,
}

interface TimeZoneProps {
  position: Offset
  size: BoxSize;
  type: TimeZoneType;
}

function TimeZone(props: TimeZoneProps) {
  const { position, size, type } = props;
  const app = useApp();

  const color = useMemo(() => {
    switch (type) {
      case TimeZoneType.SPEEDUP:
        return 0x5F928F;
      case TimeZoneType.SLOWDOWN:
        return 0xAD6454;
      default:
        return 0x5F928F;
    }
  }, [type]);

  const texture = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(color, 0.1);
    box.lineStyle(8, color, 1);
    box.drawCircle(0, 0, size.w / 2);
    box.endFill();

    return app.renderer.generateTexture(box);
  }, [size, type]);

  const iconTexture = useMemo(() => {

    // const svg = new SVG();

    // svg.width = size.w;
    // svg.height = size.h;
    // // svg.lineStyle(8, color, 1);
    // svg.beginFill(color, 0.1);
    // console.log(svg.fill);
    // svg.drawSVG(icon);
    // console.log(svg.fill);
    // svg.endFill();

    // return app.renderer.generateTexture(svg);

    switch (type) {
      case TimeZoneType.SPEEDUP:
        return PIXI.Texture.from("../../../assets/icons/wheelchair-move-solid.svg");
      case TimeZoneType.SLOWDOWN:
        return PIXI.Texture.from("../../../assets/icons/wheelchair-solid.svg");
      default:
        return PIXI.Texture.from("../../../assets/icons/wheelchair-move-solid.svg");
    }
  }, [, type]);
  return (
    <>
      <Sprite x={position.x} y={position.y} width={size.w} height={size.h} texture={texture} />
      <Sprite x={position.x + 75} y={position.y + 75} width={size.w - 150} height={size.h - 150} texture={iconTexture} />
    </>
  )
}

export default TimeZone