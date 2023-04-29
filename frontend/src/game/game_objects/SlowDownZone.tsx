import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Container, Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';
import { SVG } from 'pixi-svg';
import { FaAccessibleIcon } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server'


interface SlowDownZoneProps {
  position: Offset
  size: BoxSize;
}
function SlowDownZone(props: SlowDownZoneProps) {
  const { position, size } = props;
  const app = useApp();

  const texture = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0x5F928F, 0.1);
    box.lineStyle(8, 0x5F928F, 1);
    box.drawCircle(0, 0, size.w / 2);
    box.endFill();

    return app.renderer.generateTexture(box);
  }, [size]);

  const iconTexture = useMemo(() => {
    const icon = ReactDOMServer.renderToString(<FaAccessibleIcon />)
    const svg = new SVG();
    svg.width = size.w;
    svg.height = size.h;
    svg.beginFill(0x5F928F, 0.1);
    svg.drawSVG(icon);
    svg.lineStyle(8, 0x5F928F, 1);
    svg.endFill();

    return app.renderer.generateTexture(svg);
  }, []);
  return (
    <>
      <Sprite x={position.x} y={position.y} width={size.w} height={size.h} texture={texture} />
      <Sprite x={position.x} y={position.y} width={size.w} height={size.h} texture={iconTexture} />
    </>
  )
}

export default SlowDownZone